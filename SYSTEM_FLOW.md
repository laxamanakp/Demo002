# MyHubCares - System Flow Documentation

**"It's my hub, and it's yours"** - Your Partner in Sexual Health and Wellness  
**Website**: [www.myhubcares.com](https://www.myhubcares.com/)

This document provides a comprehensive overview of how data and processes flow through the MyHubCares Healthcare Management System.

---

## 📊 Table of Contents

1. [System Overview](#system-overview)
2. [High-Level Architecture](#high-level-architecture)
3. [User Journey Flows](#user-journey-flows)
4. [Module Data Flows](#module-data-flows)
5. [Key Workflows](#key-workflows)
6. [Data Flow Patterns](#data-flow-patterns)
7. [System Processes](#system-processes)

---

## 🏗️ System Overview

### Core Components

The MyHubCares system consists of **15 major functional modules** (P1-P15) that work together to manage healthcare operations:

1. **P1: User Authentication & Authorization** - Login, roles, permissions, MFA, sessions
2. **P2: Patient Management** - Registration, profiles, demographics, UIC generation, ARPA
3. **P3: Clinical Care** - Visits, vital signs, diagnoses, procedures, WHO staging
4. **P4: Medication Management** - Prescriptions, medication catalog, reminders, adherence
5. **P5: Lab Test Management** - Orders, results, critical alerts, file attachments
6. **P6: Appointment Scheduling** - Booking, calendar, availability slots, reminders
7. **P7: Care Coordination** - Referrals, counseling, HTS sessions, care tasks
8. **P8: Reporting & Analytics** - Reports, dashboards, metrics, report generation
9. **P9: System Administration** - Users, facilities, regions, system settings
10. **P10: Vaccination Program** - Vaccine catalog, vaccination records, dose tracking
11. **P11: Patient Feedback & Surveys** - Survey responses, satisfaction metrics, analytics
12. **P12: Community Forum & Education** - Learning modules, FAQs, forum posts/replies
13. **P14: Inventory Management** - Stock tracking, transactions, suppliers, orders, alerts
14. **P15: ART Regimen Management** - Regimen lifecycle, drug tracking, adherence, history

### Data Stores

The system maintains **15 primary data stores**:

- **D1: Users Database** - User accounts, roles, permissions, sessions, MFA tokens
- **D2: Patients Database** - Patient records, demographics, UIC, risk scores, identifiers, documents
- **D3: Clinical Records** - Clinical visits, vital signs, diagnoses, procedures
- **D4: Medications & Inventory** - Prescriptions, medication catalog, inventory, reminders, adherence, ART regimens
- **D5: Lab Results** - Lab orders, test results, files
- **D6: Appointments Calendar** - Appointments, availability slots, reminders
- **D7: Referrals & Counseling** - Referrals, counseling sessions, HTS sessions, care tasks
- **D8: Audit Log** - All system activity logs, report runs, dashboard cache
- **D9: System Administration** - Facilities, regions, client types, system settings, user-facility assignments
- **D10: Vaccination Records** - Vaccine catalog, vaccination records, dose tracking
- **D11: Survey Responses** - Survey responses, survey metrics, patient feedback
- **D12: Education & Forum** - Learning modules, FAQs, forum categories, posts, replies
- **D14: Inventory Management** - Inventory transactions, alerts, suppliers, orders, order items

---

## 🎯 High-Level Architecture

### System Entry Point

```
User → Login Page (index.html)
  ↓
Authentication (P1)
  ↓
Role-Based Dashboard
  ↓
Module Access (Based on Role)
```

### Role-Based Access Flow

```
┌─────────────────────────────────────────┐
│         Authentication (P1)              │
│  - Validate credentials                  │
│  - Check role & permissions              │
│  - Create session                        │
└─────────────────────────────────────────┘
                    ↓
        ┌───────────┴───────────┐
        │                       │
    ┌───▼───┐              ┌───▼───┐
    │ Admin │              │ Staff │
    │  Full │              │ Role- │
    │ Access│              │ Based │
    └───┬───┘              └───┬───┘
        │                     │
        └───────────┬─────────┘
                    ↓
        ┌───────────────────┐
        │  Dashboard (P8)   │
        │  - Statistics     │
        │  - Alerts         │
        │  - Recent Activity│
        └───────────────────┘
```

---

## 👥 User Journey Flows

### 1. Patient Registration Flow

```
New Patient
    ↓
[Register Page]
    ↓
Step 1: Personal Info
  - Name, DOB, Sex, Civil Status
    ↓
Step 2: Contact Details
  - Address, Phone, Email, Facility Selection
    ↓
Step 3: Account Setup
  - Username, Password, Consent
    ↓
[System Generates UIC]
    ↓
[Save to D2: Patients Database]
    ↓
[Create User Account in D1]
    ↓
[Log Audit Entry in D8]
    ↓
[Auto-Login]
    ↓
Patient Dashboard
```

### 2. Clinical Visit Flow

```
Patient Arrives
    ↓
[Nurse/Physician Selects Patient]
    ↓
[Create Clinical Visit Record]
    ↓
Enter Vital Signs
  - Height, Weight → Auto-calculate BMI
  - BP, Pulse, Temperature, RR, O2 Sat
    ↓
[Save to D3: Clinical Records]
    ↓
[Update Patient Summary in D2]
    ↓
[Physician Adds Clinical Notes]
  - Chief Complaint
  - Assessment
  - Plan
  - WHO Stage
    ↓
[Save Complete Visit]
    ↓
[Log Audit Entry in D8]
    ↓
[Trigger ARPA Recalculation]
    ↓
[Update Dashboard Alerts]
```

### 3. Prescription Flow

```
Physician Reviews Patient
    ↓
[Select Patient from D2]
    ↓
[Create Prescription]
    ↓
Add Medications
  - Select from Medication Catalog (D4)
  - Set Dosage, Frequency, Duration
    ↓
[Check Inventory Stock in D4]
    ↓
Stock Available?
  ├─ Yes → [Save Prescription to D4]
  └─ No → [Alert Nurse for Restock]
    ↓
[Generate Prescription Number]
    ↓
[Create Medication Reminders]
  - Link to Patient (D2)
  - Schedule in D4
    ↓
[Log Audit Entry in D8]
    ↓
[Print Prescription Template]
    ↓
[Nurse Dispenses Medication]
    ↓
[Update Inventory in D4]
    ↓
[Record Dispense Event]
    ↓
[Update Patient Adherence Tracking]
```

### 4. Lab Test Flow

```
Physician Orders Lab Test
    ↓
[Create Lab Order in D5]
  - Patient (D2)
  - Test Panel
  - Priority Level
    ↓
[Status: Ordered]
    ↓
[Lab Personnel Collects Sample]
    ↓
[Update Status: Collected]
    ↓
[Lab Personnel Enters Results]
    ↓
[Save Results to D5]
    ↓
[Check Critical Values]
    ↓
Critical?
  ├─ Yes → [Alert Provider]
  │         [Send Notification]
  │         [Log Critical Alert in D8]
  └─ No → [Normal Processing]
    ↓
[Link Results to Patient (D2)]
    ↓
[Update Patient Summary]
    ↓
[Trigger ARPA Recalculation]
    ↓
[Physician Reviews Results]
    ↓
[Make Clinical Decision]
  - Prescribe Medication
  - Schedule Follow-up
  - Order Additional Tests
```

### 5. Appointment Flow

```
User Initiates Booking
  (Admin/Physician/Nurse/Patient)
    ↓
[Select Patient from D2]
    ↓
[Select Date & Time]
    ↓
[Check Availability in D6]
    ↓
Slot Available?
    ├─ Yes → [Reserve Slot]
    │         [Create Appointment]
    │         [Set Status: Scheduled]
    └─ No → [Show Conflict Warning]
    ↓
[Save Appointment to D6]
    ↓
[Generate Reminder Schedule]
    ↓
[Create Reminder Records]
    - 24 hours before
    - 2 hours before
    ↓
[Log Audit Entry in D8]
    ↓
[Send Browser Notification]
    ↓
Appointment Day
    ↓
[Update Status: In Progress]
    ↓
[Complete Appointment]
    ↓
[Update Status: Completed]
    ↓
[Link to Clinical Visit (if applicable)]
```

### 6. ART Regimen Flow

```
Physician Assesses Patient
    ↓
[Select Patient from D2]
    ↓
[Review Patient History]
    - Previous regimens (D4)
    - Lab results (D5)
    - Clinical visits (D3)
    ↓
[Create ART Regimen]
    ↓
Select Regimen Type
    - First-line
    - Second-line
    - Third-line
    ↓
[Add Drugs to Regimen]
    - Select Medications (D4)
    - Set Dosage per Drug
    - Set Pills per Day
    - Set Total Duration
    ↓
[Set Start Date]
    ↓
[Save Regimen to D4]
    - Status: Active
    ↓
[Initialize Adherence Tracking]
    - Pills Dispensed: 0
    - Pills Remaining: 0
    - Missed Doses: 0
    ↓
[Nurse Dispenses Medications]
    ↓
[Update Pills Dispensed]
    ↓
[Update Pills Remaining]
    ↓
[Track Missed Doses]
    ↓
[Calculate Adherence Rate]
    ↓
[Update Regimen Status]
    - Active
    - Stopped (with reason)
    - Changed (with reason)
    ↓
[Log History Entry in D4]
    ↓
[Trigger ARPA Recalculation]
    ↓
[Log Audit Entry in D8]
```

### 7. Vaccination Flow

```
Patient/Provider Initiates Vaccination
    ↓
[Select Patient from D2]
    ↓
[Select Vaccine from D10 Catalog]
    ↓
[Check Previous Doses]
    - Query D10 (Vaccination Records)
    - Determine Next Dose Number
    ↓
[Record Vaccination]
    - Dose Number
    - Total Doses Required
    - Date Given
    - Lot Number
    - Administration Site
    - Provider ID
    ↓
[Calculate Next Dose Date]
    - Based on Vaccine Schedule (D10)
    - Dose Intervals from Catalog
    ↓
[Save Vaccination Record to D10]
    ↓
[Update Status]
    - Complete (if final dose)
    - In Progress (if more doses)
    - Due Soon (if approaching)
    - Overdue (if missed)
    ↓
[Create Reminder for Next Dose]
    ↓
[Link to Patient Record (D2)]
    ↓
[Log Audit Entry in D8]
```

### 8. Survey Submission Flow

```
Patient Completes Visit/Service
    ↓
[Patient Accesses Survey Form]
    ↓
[Answer Survey Questions]
    - Overall Satisfaction (1-5)
    - Staff Friendliness (1-5)
    - Wait Time (1-5)
    - Facility Cleanliness (1-5)
    - Would Recommend (Yes/Maybe/No)
    - Comments (Optional)
    ↓
[Select Facility (D9)]
    ↓
[Calculate Average Score]
    ↓
[Save Survey Response to D11]
    ↓
[Update Survey Metrics]
    - Aggregate by Facility
    - Calculate Period Averages
    - Update Recommendation Rate
    ↓
[Save Metrics to D11]
    ↓
[Log Audit Entry in D8]
    ↓
[Show Thank You Message]
    ↓
Admin Views Analytics
    ↓
[Query Survey Metrics (D11)]
    ↓
[Generate Charts & Reports]
    - Average Scores Over Time
    - Facility Comparison
    - Question Breakdown
    - Recommendation Rates
```

### 9. Education & Forum Flow

```
Patient Accesses Education Module
    ↓
Select Content Type
    ├─ Learning Modules
    ├─ FAQs
    └─ Community Forum
    ↓
┌─────────────────────────────────┐
│ Learning Modules Flow            │
│  - Browse Modules (D12)          │
│  - Select Module                 │
│  - View Content                  │
│  - Track View Count              │
│  - Mark as Completed            │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│ FAQs Flow                        │
│  - Browse FAQs (D12)             │
│  - Search by Category             │
│  - View Question/Answer           │
│  - Track View Count               │
│  - Rate Helpfulness              │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│ Forum Flow                       │
│  - Browse Categories (D12)       │
│  - View Posts                     │
│  - Create Post (if Patient)       │
│  - Reply to Post                  │
│  - Moderation (Admin)             │
│  - Update View/Reply Counts       │
└─────────────────────────────────┘
    ↓
[Log Activity to D8]
```

### 10. Inventory Order Flow

```
Nurse/Admin Detects Low Stock
    ↓
[View Inventory Alerts (D14)]
    ↓
[Select Medication]
    ↓
[Create Inventory Order]
    ↓
[Select Supplier from D14]
    ↓
[Add Order Items]
    - Medication (D4)
    - Quantity Ordered
    - Unit Cost
    - Expected Delivery Date
    ↓
[Calculate Total Cost]
    ↓
[Save Order to D14]
    - Status: Pending
    ↓
[Send Order to Supplier]
    ↓
[Update Status: Ordered]
    ↓
[Wait for Delivery]
    ↓
[Receive Shipment]
    ↓
[Update Order Items]
    - Quantity Received
    - Batch Numbers
    - Expiry Dates
    ↓
[Update Inventory Stock]
    - Add to Quantity on Hand
    - Update Last Restocked Date
    ↓
[Create Inventory Transaction]
    - Type: Restock
    - Quantity Before/After
    - Reference to Order
    ↓
[Save Transaction to D14]
    ↓
[Update Order Status]
    - Received (if complete)
    - Partial (if incomplete)
    ↓
[Log Audit Entry in D8]
```

---

## 🔄 Module Data Flows

### Patient Management (P2) Flow

```
User Action (Admin/Physician/Nurse)
    ↓
[Patient Management Module]
    ↓
┌─────────────────────────────────┐
│  P2.1: Register New Patient     │
│  - Validate Data                 │
│  - Check Duplicate UIC           │
│  - Generate Unique UIC           │
│  - Save to D2                    │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│  P2.2: Update Patient Profile   │
│  - Load from D2                  │
│  - Update Fields                 │
│  - Validate Changes              │
│  - Save to D2                    │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│  P2.3: Search & View Patients    │
│  - Query D2                      │
│  - Filter Results                │
│  - Display List                  │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│  P2.4: Calculate ARPA Risk      │
│  - Query D3 (Visits)             │
│  - Query D4 (Medications)        │
│  - Query D5 (Lab Results)        │
│  - Query D6 (Appointments)       │
│  - Calculate Score               │
│  - Save to D2                    │
└─────────────────────────────────┘
    ↓
[Log All Actions to D8]
```

### Medication Management (P4) Flow

```
Physician Creates Prescription
    ↓
┌─────────────────────────────────┐
│  P4.1: Create Prescription     │
│  - Select Patient (D2)          │
│  - Add Medications              │
│  - Set Dosage/Frequency         │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│  P4.2: Check Inventory          │
│  - Query D4 (Stock Levels)      │
│  - Check Availability            │
│  - Return Status                 │
└─────────────────────────────────┘
    ↓
Stock Available?
  ├─ Yes → [Save Prescription]
  └─ No → [Alert Nurse]
    ↓
┌─────────────────────────────────┐
│  P4.3: Dispense Medication      │
│  - Read Prescription (D4)       │
│  - Update Stock (D4)            │
│  - Record Dispense Event         │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│  P4.4: Manage Inventory         │
│  - View Stock Levels             │
│  - Restock Items                 │
│  - Check Expiry Dates            │
│  - Generate Alerts                │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│  P4.5: Create Reminders         │
│  - Link to Prescription          │
│  - Set Schedule                  │
│  - Enable Notifications           │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│  P4.6: Track Adherence           │
│  - Record Doses Taken            │
│  - Calculate Adherence %         │
│  - Update Patient Record         │
└─────────────────────────────────┘
    ↓
[Log All Actions to D8]
```

### Care Coordination (P7) Flow

```
Case Manager Creates Referral
    ↓
┌─────────────────────────────────┐
│  P7.1: Create Referral          │
│  - Select Patient (D2)           │
│  - Select From/To Facilities     │
│  - Enter Reason & Urgency        │
│  - Set Status: Pending           │
│  - Save to D7                    │
└─────────────────────────────────┘
    ↓
[Notify Receiving Facility]
    ↓
┌─────────────────────────────────┐
│  P7.2: Manage Referral Status   │
│  - Update Status                 │
│  - Accept/Reject/Complete        │
│  - Update Patient Facility       │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│  P7.3: Conduct HTS Session      │
│  - Pre-test Counseling           │
│  - Conduct Test                  │
│  - Record Result                 │
│  - Post-test Counseling          │
│  - Link to Care (if positive)    │
│  - Save to D7                    │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│  P7.4: Record Counseling        │
│  - Select Patient (D2)           │
│  - Select Session Type            │
│  - Enter Notes                   │
│  - Schedule Follow-up            │
│  - Save to D7                    │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│  P7.5: Schedule Follow-up        │
│  - Review Sessions (D7)           │
│  - Identify Due Follow-ups       │
│  - Create Appointment (D6)        │
└─────────────────────────────────┘
    ↓
[Log All Actions to D8]
```

---

## 🔑 Key Workflows

### Complete Patient Care Workflow

```
1. Patient Registration
   Patient → Register → UIC Generated → Saved to D2

2. Initial Appointment
   Book Appointment → D6 → Clinical Visit → D3

3. Clinical Assessment
   Record Visit → Enter Vitals → D3 → Calculate ARPA → D2

4. Diagnosis & Treatment
   Add Diagnosis → D3 → Create Prescription → D4

5. Medication Dispensing
   Check Inventory → D4 → Dispense → Update Stock → D4

6. Follow-up Care
   Schedule Appointment → D6 → Lab Order → D5 → Review Results → D5

7. Ongoing Monitoring
   Track Adherence → D4 → Update ARPA → D2 → Generate Alerts
```

### ARPA Risk Calculation Flow

```
Trigger Event
  - Medication Missed
  - Appointment Missed
  - Lab Overdue
  - Visit Overdue
    ↓
Gather Patient Data
    ↓
┌─────────────────────────────────┐
│  Component 1: Medications (35%) │
│  - Query D4 (Prescriptions)    │
│  - Count Missed Doses           │
│  - Calculate Score              │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│  Component 2: Appointments (25%)│
│  - Query D6 (Appointments)      │
│  - Count Missed Appointments    │
│  - Calculate Score              │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│  Component 3: Lab Compliance (20%)│
│  - Query D5 (Lab Orders)         │
│  - Check Overdue Tests           │
│  - Calculate Score               │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│  Component 4: Visit Timing (20%)│
│  - Query D3 (Last Visit)         │
│  - Calculate Days Since         │
│  - Calculate Score               │
└─────────────────────────────────┘
    ↓
Apply Component Weights
    ↓
Calculate Total Risk Score (0-100)
    ↓
Determine Risk Level
  - Low: 0-24
  - Medium: 25-49
  - High: 50-74
  - Critical: 75-100
    ↓
Save Score to D2 (Patient Record)
    ↓
Generate Recommendations
    ↓
Update Dashboard Alerts
    ↓
Notify Provider (if High/Critical)
```

### Inventory Management Flow

```
Inventory Check
    ↓
[Query D4: Medication Inventory]
    ↓
For Each Medication:
    ↓
┌─────────────────────────────────┐
│  Check Stock Level              │
│  Current < Reorder Level?       │
│    ├─ Yes → Generate Low Stock  │
│    │         Alert               │
│    └─ No → Continue             │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│  Check Expiry Date              │
│  Expiring Soon?                 │
│    ├─ Yes → Generate Expiry     │
│    │         Alert               │
│    └─ No → Continue             │
└─────────────────────────────────┘
    ↓
[Display Alerts on Dashboard]
    ↓
Nurse Reviews Alerts
    ↓
[Create Restock Order]
    ↓
[Update Inventory]
    ↓
[Record Transaction in D4]
    ↓
[Log Audit Entry in D8]
```

---

## 📈 Data Flow Patterns

### Create Pattern (CRUD)

```
User Input
    ↓
[Validate Data]
    ↓
[Check Permissions]
    ↓
[Generate ID]
    ↓
[Save to Data Store]
    ↓
[Update Related Records]
    ↓
[Log Audit Entry]
    ↓
[Return Success]
    ↓
[Update UI]
```

### Read Pattern (CRUD)

```
User Request
    ↓
[Check Permissions]
    ↓
[Query Data Store]
    ↓
[Filter by Role/Facility]
    ↓
[Format Data]
    ↓
[Return Results]
    ↓
[Display in UI]
```

### Update Pattern (CRUD)

```
User Edit Request
    ↓
[Load Current Record]
    ↓
[Validate Changes]
    ↓
[Check Permissions]
    ↓
[Save Changes]
    ↓
[Update Related Records]
    ↓
[Log Audit Entry (Old/New Values)]
    ↓
[Return Success]
    ↓
[Refresh UI]
```

### Delete Pattern (CRUD)

```
User Delete Request
    ↓
[Check Dependencies]
    ↓
Has Related Records?
    ├─ Yes → [Show Warning]
    │         [Prevent Deletion]
    └─ No → [Confirm Deletion]
    ↓
[Remove Record]
    ↓
[Log Audit Entry]
    ↓
[Return Success]
    ↓
[Refresh UI]
```

---

## ⚙️ System Processes

### Authentication Process (P1)

```
1. User Enters Credentials
   ↓
2. Validate Format
   ↓
3. Query D1 (Users Database)
   ↓
4. Check Password Hash
   ↓
5. Check Account Status
   ↓
6. Check MFA (if enabled)
   ↓
7. Create Session
   - Generate Session Token
   - Set Expiry Time
   - Store in D1 (auth_sessions)
   ↓
8. Load User Permissions
   - Query D1 (user_roles)
   - Query D1 (role_permissions)
   ↓
9. Initialize Dashboard
   ↓
10. Log Login to D8
```

### Audit Logging Process (P8)

```
System Action Occurs
    ↓
Capture Event Details
  - User ID
  - Action Type (CREATE/UPDATE/DELETE/VIEW)
  - Module
  - Entity Type
  - Entity ID
  - Old Value (for updates)
  - New Value
  - IP Address
  - Device Type
  - Timestamp
    ↓
[Save to D8: Audit Log]
    ↓
[Index for Quick Retrieval]
    ↓
Available for:
  - Compliance Reports
  - Security Audits
  - Activity Tracking
```

### Notification Process

```
Event Triggered
  - Appointment Reminder
  - Medication Reminder
  - Critical Lab Result
  - Low Stock Alert
    ↓
[Check User Preferences]
    ↓
[Generate Notification]
    ↓
[Check Browser Permission]
    ↓
Permission Granted?
    ├─ Yes → [Send Browser Notification]
    │         [Play Sound (if enabled)]
    └─ No → [Show In-App Alert]
    ↓
[Log Notification Sent]
    ↓
[Update Notification Status]
```

---

## 📊 Additional Module Flows

### Reporting & Analytics (P8) Flow

```
User Requests Report
    ↓
[Select Report Type]
    - Patient Demographics
    - Clinical Visits
    - Medication Adherence
    - Inventory Levels
    - Survey Analytics
    - Custom Report
    ↓
[Set Parameters]
    - Date Range
    - Facility Filter
    - Patient Filter
    - Other Filters
    ↓
[Query Data Stores]
    - D2 (Patients)
    - D3 (Clinical Records)
    - D4 (Medications)
    - D5 (Lab Results)
    - D6 (Appointments)
    - D11 (Surveys)
    ↓
[Calculate Metrics]
    - Aggregations
    - Averages
    - Percentages
    - Trends
    ↓
[Generate Visualization]
    - Charts
    - Tables
    - Graphs
    ↓
[Save Report Query to D8]
    ↓
[Cache Results in D8]
    ↓
[Display Report]
    ↓
User Actions
    ├─ Export PDF
    ├─ Export CSV
    ├─ Export Excel
    ├─ Print
    └─ Share
    ↓
[Log Report Generation to D8]
```

### System Administration (P9) Flow

```
Admin Accesses Admin Module
    ↓
┌─────────────────────────────────┐
│ User Management Flow             │
│  - View Users (D1)               │
│  - Create User                    │
│  - Assign Role                    │
│  - Assign Facility                │
│  - Set Permissions                │
│  - Update User Status             │
│  - Delete User                    │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│ Facility Management Flow         │
│  - View Facilities (D9)           │
│  - Create Facility                │
│  - Set Facility Type              │
│  - Assign Region                  │
│  - Update Contact Info            │
│  - Deactivate Facility            │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│ System Settings Flow            │
│  - View Settings (D9)             │
│  - Update Configuration           │
│  - Set System Parameters          │
│  - Configure Alerts                │
└─────────────────────────────────┘
    ↓
[Log All Changes to D8]
```

## 🔄 Cross-Module Interactions

### Patient → Clinical Visit → Prescription Flow

```
1. Patient Record (D2)
   ↓
2. Clinical Visit Created (D3)
   - Links to Patient (D2)
   ↓
3. Prescription Created (D4)
   - Links to Patient (D2)
   - Links to Visit (D3)
   ↓
4. Medication Reminder Created (D4)
   - Links to Prescription (D4)
   - Links to Patient (D2)
   ↓
5. ARPA Recalculated (D2)
   - Uses Visit Data (D3)
   - Uses Medication Data (D4)
```

### Appointment → Visit → Lab → Prescription Flow

```
1. Appointment Scheduled (D6)
   ↓
2. Appointment Completed
   ↓
3. Clinical Visit Recorded (D3)
   - Links to Appointment (D6)
   ↓
4. Lab Test Ordered (D5)
   - Links to Visit (D3)
   ↓
5. Lab Results Entered (D5)
   ↓
6. Prescription Created (D4)
   - Based on Lab Results (D5)
   - Links to Visit (D3)
```

### Referral → Appointment → Visit Flow

```
1. Referral Created (D7)
   - Patient Transferred
   ↓
2. Appointment Scheduled (D6)
   - At New Facility
   ↓
3. Clinical Visit (D3)
   - At New Facility
   ↓
4. Referral Status Updated (D7)
   - Status: Completed
```

---

## 📊 Data Relationships

### Patient-Centric View

```
Patient (D2)
    ├──→ Clinical Visits (D3)
    │       ├──→ Diagnoses
    │       ├──→ Procedures
    │       └──→ Vital Signs
    │
    ├──→ Prescriptions (D4)
    │       ├──→ Prescription Items
    │       ├──→ Medication Reminders
    │       └──→ Medication Adherence
    │
    ├──→ Lab Orders (D5)
    │       └──→ Lab Results
    │
    ├──→ Appointments (D6)
    │       └──→ Appointment Reminders
    │
    ├──→ Referrals (D7)
    │
    ├──→ Counseling Sessions (D7)
    │
    ├──→ HTS Sessions (D7)
    │
    ├──→ ART Regimens (D4)
    │       ├──→ Regimen Drugs
    │       └──→ Regimen History
    │
    ├──→ Vaccination Records (D10)
    │       └──→ Vaccine Catalog
    │
    ├──→ Survey Responses (D11)
    │
    └──→ Forum Posts (D12)
```

### Facility-Centric View

```
Facility (D9)
    ├──→ Users (D1)
    │       └──→ User Roles
    │
    ├──→ Patients (D2)
    │
    ├──→ Clinical Visits (D3)
    │
    ├──→ Appointments (D6)
    │
    ├──→ Inventory (D4, D14)
    │       ├──→ Stock Levels
    │       ├──→ Transactions
    │       └──→ Orders
    │
    ├──→ Survey Metrics (D11)
    │
    ├──→ Vaccination Records (D10)
    │
    └──→ System Settings (D9)
```

### Medication-Centric View

```
Medication (D4)
    ├──→ Prescriptions
    │       └──→ Prescription Items
    │
    ├──→ Inventory Stock (D4, D14)
    │       ├──→ Stock Levels
    │       ├──→ Transactions
    │       └──→ Alerts
    │
    ├──→ ART Regimen Drugs (D4)
    │       └──→ Regimen History
    │
    ├──→ Medication Reminders
    │
    └──→ Medication Adherence
```

---

## 🔗 Integration Flows

### External Laboratory Integration

```
Physician Orders Lab Test
    ↓
[Create Lab Order in D5]
    ↓
[Status: Ordered]
    ↓
[Export Order to External Lab]
    ↓
External Lab Processes Test
    ↓
[Lab Returns Results]
    ↓
[Lab Personnel Enters Results]
    ↓
[Save to D5]
    ↓
[Check Critical Values]
    ↓
[Alert Provider if Critical]
```

### External Facility Referral Flow

```
Case Manager Creates Referral
    ↓
[Select Receiving Facility]
    ↓
External Facility?
    ├─ Yes → [Send Referral Data]
    │         [Status: Pending]
    │         [Wait for Acceptance]
    │         [Update Status on Response]
    └─ No → [Internal Processing]
    ↓
[Track Referral Status]
    ↓
[Update Patient Facility on Completion]
```

### Pharmacy Integration Flow

```
Prescription Created
    ↓
[Check Internal Inventory]
    ↓
Stock Available?
    ├─ Yes → [Dispense Internally]
    └─ No → [Send to External Pharmacy]
            ↓
            [Pharmacy Dispenses]
            ↓
            [Update Prescription Status]
            ↓
            [Record External Dispense]
```

## 🎯 Summary

### Key Flow Characteristics

1. **Patient-Centric**: All modules revolve around patient records (D2)
2. **Audit Trail**: Every action is logged to D8 for compliance
3. **Role-Based**: Access and permissions controlled by P1
4. **Real-Time Updates**: Changes trigger recalculations (ARPA, alerts)
5. **Interconnected**: Modules share data through common data stores
6. **Workflow-Driven**: Processes follow clinical workflows
7. **Alert-Driven**: System generates alerts for critical events
8. **Multi-Module Support**: 15 modules covering all aspects of care
9. **External Integration Ready**: Flows support external labs, facilities, pharmacies

### Data Flow Principles

- **Single Source of Truth**: Each entity stored in one primary location
- **Referential Integrity**: Foreign keys maintain relationships
- **Audit Everything**: All changes tracked in audit log
- **Role-Based Filtering**: Data filtered by user role and facility
- **Real-Time Calculation**: Risk scores and metrics calculated on-demand
- **Cascading Updates**: Related records update automatically
- **Status Workflows**: Clear status transitions for all entities

### Complete Module Coverage

The system flow documentation now covers all **15 modules**:
- ✅ P1: Authentication & Authorization
- ✅ P2: Patient Management
- ✅ P3: Clinical Care
- ✅ P4: Medication Management
- ✅ P5: Lab Test Management
- ✅ P6: Appointment Scheduling
- ✅ P7: Care Coordination
- ✅ P8: Reporting & Analytics
- ✅ P9: System Administration
- ✅ P10: Vaccination Program
- ✅ P11: Patient Feedback & Surveys
- ✅ P12: Community Forum & Education
- ✅ P14: Inventory Management
- ✅ P15: ART Regimen Management

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**System**: MyHubCares Healthcare Management Platform

