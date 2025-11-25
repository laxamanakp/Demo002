# MyHubCares - Database Structure Changes

## 📋 Overview

This document details all **NEW** tables and **CHANGES** to existing database structures based on the recent system implementation. These changes support the new features: Doctor Availability Management, Enhanced Refill Workflow, and Appointment Scheduling Rules.

**Last Updated:** December 2024  
**Status:** ✅ Implementation Complete

---

## 🆕 NEW TABLES

### 1. **doctor_assignments**
**Purpose:** Stores admin-assigned doctor schedules for specific days with lock protection.

| Column Name | Data Type | Constraints | Required | Description |
|------------|-----------|-------------|----------|-------------|
| assignment_id | UUID | PRIMARY KEY | Yes | Unique assignment identifier |
| doctor_id | UUID | FOREIGN KEY → users(user_id), NOT NULL | Yes | Physician reference |
| facility_id | UUID | FOREIGN KEY → facilities(facility_id), NOT NULL | Yes | Facility reference |
| assignment_date | DATE | NOT NULL | Yes | Date of assignment |
| start_time | TIME | NOT NULL | Yes | Start time (e.g., '08:00:00') |
| end_time | TIME | NOT NULL | Yes | End time (e.g., '17:00:00') |
| max_patients | INTEGER | DEFAULT 8 | Yes | Maximum patients for this assignment |
| notes | TEXT | | No | Assignment notes |
| is_locked | BOOLEAN | DEFAULT false | Yes | Lock status (prevents edits) |
| locked_at | TIMESTAMPTZ | | No | When schedule was locked |
| locked_by | UUID | FOREIGN KEY → users(user_id) | No | Admin who locked the schedule |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Yes | Creation timestamp |
| created_by | UUID | FOREIGN KEY → users(user_id), NOT NULL | Yes | Admin who created assignment |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Yes | Last update timestamp |

**Indexes:**
- `idx_doctor_assignments_doctor_id`
- `idx_doctor_assignments_facility_id`
- `idx_doctor_assignments_date`
- `idx_doctor_assignments_is_locked`

**Unique Constraint:** `UNIQUE(doctor_id, assignment_date)` - One assignment per doctor per day

**Notes:**
- Admin-only table (only admins can create/edit)
- When `is_locked = true`, only admin can unlock
- Used to generate `availability_slots` automatically

---

### 2. **doctor_conflicts**
**Purpose:** Records doctor unavailability (leave, meetings, training, etc.) that blocks scheduling.

| Column Name | Data Type | Constraints | Required | Description |
|------------|-----------|-------------|----------|-------------|
| conflict_id | UUID | PRIMARY KEY | Yes | Unique conflict identifier |
| doctor_id | UUID | FOREIGN KEY → users(user_id), NOT NULL | Yes | Physician reference |
| facility_id | UUID | FOREIGN KEY → facilities(facility_id) | No | Facility (NULL if all facilities) |
| conflict_date | DATE | NOT NULL | Yes | Date of conflict |
| conflict_type | ENUM('leave', 'meeting', 'training', 'emergency', 'other') | NOT NULL | Yes | Type of conflict |
| reason | TEXT | NOT NULL | Yes | Conflict reason/description |
| start_time | TIME | | No | Start time (if partial day) |
| end_time | TIME | | No | End time (if partial day) |
| is_all_day | BOOLEAN | DEFAULT true | Yes | Full day conflict flag |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Yes | Creation timestamp |
| created_by | UUID | FOREIGN KEY → users(user_id), NOT NULL | Yes | Admin who created conflict |

**Indexes:**
- `idx_doctor_conflicts_doctor_id`
- `idx_doctor_conflicts_date`
- `idx_doctor_conflicts_type`

**Notes:**
- Conflicts prevent doctor assignment for that date
- Can be full-day or partial-day conflicts
- Admin-only management

---

### 3. **appointment_requests**
**Purpose:** Stores patient appointment requests pending Case Manager approval.

| Column Name | Data Type | Constraints | Required | Description |
|------------|-----------|-------------|----------|-------------|
| request_id | UUID | PRIMARY KEY | Yes | Unique request identifier |
| patient_id | UUID | FOREIGN KEY → patients(patient_id), NOT NULL | Yes | Patient reference |
| facility_id | UUID | FOREIGN KEY → facilities(facility_id), NOT NULL | Yes | Facility reference |
| provider_id | UUID | FOREIGN KEY → users(user_id) | No | Requested provider (optional) |
| requested_date | DATE | NOT NULL | Yes | Requested appointment date (future only) |
| requested_time | TIME | NOT NULL | Yes | Requested time (hourly only, e.g., '09:00:00') |
| appointment_type | ENUM('follow_up', 'art_pickup', 'lab_test', 'counseling', 'general', 'initial') | NOT NULL | Yes | Appointment type |
| patient_notes | TEXT | | No | Patient's notes/reason |
| status | ENUM('pending', 'approved', 'declined', 'cancelled') | DEFAULT 'pending' | Yes | Request status |
| reviewed_by | UUID | FOREIGN KEY → users(user_id) | No | Case Manager who reviewed |
| reviewed_at | TIMESTAMPTZ | | No | Review timestamp |
| review_notes | TEXT | | No | Case Manager review notes |
| decline_reason | TEXT | | No | Reason if declined |
| appointment_id | UUID | FOREIGN KEY → appointments(appointment_id) | No | Created appointment (if approved) |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Yes | Request creation timestamp |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Yes | Last update timestamp |
| created_by | UUID | FOREIGN KEY → users(user_id), NOT NULL | Yes | Patient who created request |

**Indexes:**
- `idx_appointment_requests_patient_id`
- `idx_appointment_requests_facility_id`
- `idx_appointment_requests_provider_id`
- `idx_appointment_requests_status`
- `idx_appointment_requests_requested_date`
- `idx_appointment_requests_reviewed_by`

**Notes:**
- Patients can only request future dates (no same-day booking)
- Time slots are hourly only (no 30-minute intervals)
- When approved, creates an `appointment` record
- Case Manager (Treatment Partner) reviews and approves/declines

---

### 4. **refill_requests** (Enhanced)
**Purpose:** Stores medication refill requests with pill count tracking and eligibility validation.

**Note:** If this table already exists, add the new columns listed below. If it doesn't exist, create the full table.

| Column Name | Data Type | Constraints | Required | Description |
|------------|-----------|-------------|----------|-------------|
| request_id | UUID | PRIMARY KEY | Yes | Unique request identifier |
| patient_id | UUID | FOREIGN KEY → patients(patient_id), NOT NULL | Yes | Patient reference |
| prescription_id | UUID | FOREIGN KEY → prescriptions(prescription_id) | No | Prescription reference |
| regimen_id | UUID | FOREIGN KEY → art_regimens(regimen_id) | No | ART regimen reference |
| medication_name | VARCHAR(200) | NOT NULL | Yes | Medication name |
| quantity_requested | INTEGER | NOT NULL | Yes | Quantity requested |
| unit | VARCHAR(20) | DEFAULT 'tablets' | Yes | Unit of measure |
| preferred_pickup_date | DATE | NOT NULL | Yes | Preferred pickup date (future only) |
| preferred_pickup_time | TIME | NOT NULL | Yes | Preferred pickup time (hourly only) |
| pickup_facility_id | UUID | FOREIGN KEY → facilities(facility_id), NOT NULL | Yes | Pickup location |
| patient_notes | TEXT | | No | Patient notes |
| **🆕 remaining_pill_count** | INTEGER | | No | **NEW** - Current pills remaining (required) |
| **🆕 pill_status** | ENUM('kulang', 'sakto', 'sobra') | | No | **NEW** - Calculated pill status |
| **🆕 kulang_explanation** | TEXT | | No | **NEW** - Required if pill_status = 'kulang' |
| **🆕 is_eligible_for_refill** | BOOLEAN | DEFAULT false | Yes | **NEW** - Eligibility (≤10 pills) |
| **🆕 pills_per_day** | INTEGER | DEFAULT 1 | Yes | **NEW** - Pills per day for calculation |
| status | ENUM('pending', 'approved', 'declined', 'cancelled', 'ready', 'dispensed') | DEFAULT 'pending' | Yes | Request status |
| reviewed_by | UUID | FOREIGN KEY → users(user_id) | No | Case Manager who reviewed |
| reviewed_at | TIMESTAMPTZ | | No | Review timestamp |
| review_notes | TEXT | | No | Case Manager review notes |
| decline_reason | TEXT | | No | Reason if declined |
| approved_quantity | INTEGER | | No | Quantity approved (may differ) |
| ready_for_pickup_date | DATE | | No | Actual pickup date |
| dispensed_by | UUID | FOREIGN KEY → users(user_id) | No | User who dispensed |
| dispensed_at | TIMESTAMPTZ | | No | Dispensing timestamp |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Yes | Creation timestamp |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Yes | Last update timestamp |
| created_by | UUID | FOREIGN KEY → users(user_id), NOT NULL | Yes | Patient who created request |

**Indexes:**
- `idx_refill_requests_patient_id`
- `idx_refill_requests_prescription_id`
- `idx_refill_requests_status`
- `idx_refill_requests_pill_status` **🆕**
- `idx_refill_requests_is_eligible` **🆕**

**Notes:**
- **NEW FIELDS:** `remaining_pill_count`, `pill_status`, `kulang_explanation`, `is_eligible_for_refill`, `pills_per_day`
- `pill_status` is calculated: compares reported pills vs. expected pills
- `kulang_explanation` is required when `pill_status = 'kulang'`
- `is_eligible_for_refill = true` when `remaining_pill_count <= 10`
- No doctor selection in refill requests (processed by Case Manager only)

---

## 🔄 CHANGES TO EXISTING TABLES

### 1. **appointments** (Module 6.1)
**Changes:** Enforce no same-day booking and hourly intervals.

| Column Name | Change Type | Description |
|------------|-------------|-------------|
| `scheduled_start` | **Validation** | Must be future date (tomorrow minimum) |
| `scheduled_end` | **Validation** | Must align with hourly intervals |
| `duration_minutes` | **Default Change** | Default changed from 30 to **60** (hourly only) |

**New Constraints:**
- `CHECK (scheduled_start >= CURRENT_DATE + INTERVAL '1 day')` - No same-day booking
- `CHECK (EXTRACT(MINUTE FROM scheduled_start) = 0)` - Hourly intervals only
- `CHECK (duration_minutes = 60)` - Enforce 60-minute slots

**Indexes (New):**
- `idx_appointments_scheduled_start_desc` - For sorting newest first

**Notes:**
- Appointments sorted: **newest on top, oldest at bottom**
- Validation enforced at application level and database level

---

### 2. **availability_slots** (Module 6.2)
**Changes:** Add lock status and align with doctor assignments.

| Column Name | Change Type | Description |
|------------|-------------|-------------|
| `slot_status` | **ENUM Update** | Add 'locked' to ENUM: `('available', 'booked', 'blocked', 'unavailable', 'locked')` |
| `assignment_id` | **🆕 NEW** | FOREIGN KEY → doctor_assignments(assignment_id) | No | Link to doctor assignment |
| `lock_status` | **🆕 NEW** | BOOLEAN | DEFAULT false | Lock status (inherited from assignment) |

**New Indexes:**
- `idx_availability_slots_assignment_id`
- `idx_availability_slots_lock_status`

**Notes:**
- Slots can be locked if parent `doctor_assignment.is_locked = true`
- Locked slots cannot be booked or modified

---

### 3. **system_settings** (Module 9.2)
**Changes:** Add new scheduling configuration settings.

**New Settings to Add:**

| setting_key | setting_value (JSONB) | Description |
|------------|----------------------|-------------|
| `scheduling.max_patients_per_day` | `20` | Maximum patients per day across all doctors |
| `scheduling.max_slots_per_doctor` | `8` | Maximum appointments per doctor per day |
| `scheduling.slot_duration_minutes` | `60` | Appointment slot duration (hourly only) |
| `scheduling.min_advance_days` | `1` | Minimum days in advance (no same-day) |
| `scheduling.allow_same_day_booking` | `false` | Always false per requirements |

**Example INSERT:**
```sql
INSERT INTO system_settings (setting_key, setting_value, description, updated_by) VALUES
('scheduling.max_patients_per_day', '20', 'Maximum patients per day', 'admin_user_id'),
('scheduling.max_slots_per_doctor', '8', 'Maximum slots per doctor per day', 'admin_user_id'),
('scheduling.slot_duration_minutes', '60', 'Appointment slot duration in minutes', 'admin_user_id'),
('scheduling.min_advance_days', '1', 'Minimum days in advance for booking', 'admin_user_id'),
('scheduling.allow_same_day_booking', 'false', 'Allow same-day booking (always false)', 'admin_user_id');
```

---

## 📊 DATA FLOW UPDATES

### Appointment Request Flow
```
1. Patient → Creates appointment_request (future date, hourly time)
2. Case Manager → Reviews appointment_request
3. If approved → Creates appointment record
4. Updates appointment_request.appointment_id
5. Generates availability_slot (if needed)
```

### Refill Request Flow
```
1. Patient → Creates refill_request with:
   - remaining_pill_count (required)
   - Calculates pill_status (kulang/sakto/sobra)
   - If kulang → Requires kulang_explanation
   - Checks is_eligible_for_refill (≤10 pills)
2. Case Manager → Reviews refill_request
3. If approved → Sets ready_for_pickup_date
4. When dispensed → Updates dispensed_by, dispensed_at
```

### Doctor Availability Flow
```
1. Admin → Creates doctor_assignment
2. System → Generates availability_slots automatically
3. If assignment.is_locked = true → Slots inherit lock_status
4. Admin → Can add doctor_conflicts (blocks scheduling)
5. When booking → Checks assignments and conflicts
```

---

## 🔍 MIGRATION NOTES

### For Existing Systems

1. **If `refill_requests` table exists:**
   ```sql
   ALTER TABLE refill_requests
   ADD COLUMN remaining_pill_count INTEGER,
   ADD COLUMN pill_status ENUM('kulang', 'sakto', 'sobra'),
   ADD COLUMN kulang_explanation TEXT,
   ADD COLUMN is_eligible_for_refill BOOLEAN DEFAULT false,
   ADD COLUMN pills_per_day INTEGER DEFAULT 1,
   ADD COLUMN preferred_pickup_time TIME;
   
   CREATE INDEX idx_refill_requests_pill_status ON refill_requests(pill_status);
   CREATE INDEX idx_refill_requests_is_eligible ON refill_requests(is_eligible_for_refill);
   ```

2. **Update `appointments` table:**
   ```sql
   ALTER TABLE appointments
   ALTER COLUMN duration_minutes SET DEFAULT 60;
   
   -- Add constraint for no same-day booking
   ALTER TABLE appointments
   ADD CONSTRAINT chk_no_same_day 
   CHECK (DATE(scheduled_start) >= CURRENT_DATE + INTERVAL '1 day');
   
   -- Add constraint for hourly intervals
   ALTER TABLE appointments
   ADD CONSTRAINT chk_hourly_intervals
   CHECK (EXTRACT(MINUTE FROM scheduled_start) = 0);
   ```

3. **Update `availability_slots` table:**
   ```sql
   ALTER TABLE availability_slots
   MODIFY COLUMN slot_status ENUM('available', 'booked', 'blocked', 'unavailable', 'locked'),
   ADD COLUMN assignment_id UUID,
   ADD COLUMN lock_status BOOLEAN DEFAULT false,
   ADD FOREIGN KEY (assignment_id) REFERENCES doctor_assignments(assignment_id);
   
   CREATE INDEX idx_availability_slots_assignment_id ON availability_slots(assignment_id);
   CREATE INDEX idx_availability_slots_lock_status ON availability_slots(lock_status);
   ```

4. **Create new tables:**
   - Run CREATE TABLE statements for `doctor_assignments`, `doctor_conflicts`, `appointment_requests`
   - Add system settings for scheduling configuration

---

## ✅ VALIDATION RULES

### Appointment Scheduling
- ✅ No same-day booking: `requested_date >= CURRENT_DATE + 1 day`
- ✅ Hourly intervals only: `EXTRACT(MINUTE FROM requested_time) = 0`
- ✅ Daily capacity: Count appointments per day <= `max_patients_per_day`
- ✅ Doctor max slots: Count appointments per doctor per day <= `max_slots_per_doctor`

### Refill Requests
- ✅ `remaining_pill_count` is required
- ✅ If `pill_status = 'kulang'`, then `kulang_explanation` is required
- ✅ `is_eligible_for_refill = true` when `remaining_pill_count <= 10`
- ✅ `preferred_pickup_date >= CURRENT_DATE + 1 day` (no same-day)
- ✅ `preferred_pickup_time` must be hourly (no 30-minute intervals)

### Doctor Availability
- ✅ One assignment per doctor per day: `UNIQUE(doctor_id, assignment_date)`
- ✅ Cannot assign if conflict exists for same doctor/date
- ✅ Locked assignments cannot be edited (except by admin unlock)

---

## 📝 SUMMARY

### New Tables (4)
1. ✅ `doctor_assignments` - Admin doctor scheduling
2. ✅ `doctor_conflicts` - Doctor unavailability
3. ✅ `appointment_requests` - Patient appointment requests
4. ✅ `refill_requests` - Enhanced with pill count tracking

### Modified Tables (3)
1. ✅ `appointments` - No same-day, hourly intervals, sorting
2. ✅ `availability_slots` - Lock status, assignment linking
3. ✅ `system_settings` - New scheduling configuration

### New Fields Added
- `refill_requests`: 5 new fields (remaining_pill_count, pill_status, kulang_explanation, is_eligible_for_refill, pills_per_day)
- `availability_slots`: 2 new fields (assignment_id, lock_status)
- `system_settings`: 5 new setting keys

### Key Features
- ✅ Admin-only doctor availability management
- ✅ Lock protection for doctor schedules
- ✅ Pill count validation (kulang/sakto/sobra)
- ✅ 10-pill eligibility rule
- ✅ No same-day booking enforcement
- ✅ Hourly intervals only
- ✅ Appointment list sorting (newest first)

---

*Document Version: 1.0*  
*Last Updated: December 2024*  
*Status: ✅ Complete - Ready for Database Migration*

