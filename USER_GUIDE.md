# DOH HIV Platform - User Guide

## Quick Start Guide

### 1. Login
Open `index.html` in your browser and select your role:

**Demo Accounts:**
- **Admin**: `admin` / `admin123` - Full system access
- **Physician**: `physician` / `doc123` - Clinical features
- **Nurse**: `nurse` / `nurse123` - Patient care & inventory
- **Case Manager**: `case_manager` / `case123` - Patient coordination
- **Lab Personnel**: `lab_personnel` / `lab123` - Lab tests
- **Patient**: `patient` / `pat123` - Personal health records

### 2. Dashboard Navigation

#### Admin Dashboard
- View system statistics (total patients, appointments, inventory alerts)
- Manage users and facilities
- Access all system modules
- Generate reports

#### Healthcare Worker Dashboards
- View real-time statistics
- Monitor patient adherence (ARPA)
- Receive system alerts
- Track recent activity

#### Patient Dashboard
- View upcoming appointments
- Check medication reminders
- Access prescriptions
- View lab results

## Key Features

### 📋 Patient Management
**How to use:**
1. Navigate to "Patients" from the sidebar
2. Click "Add New Patient" to register
3. Fill in demographics and medical information
4. System auto-generates UIC (Unique Identifier Code)
5. Click "View" to see full patient profile with tabs:
   - Demographics
   - Visit history
   - Prescriptions
   - Lab results
   - ARPA risk assessment (for physicians)

### 📅 Appointments
**How to use:**
1. Navigate to "Appointments"
2. Switch between Calendar View and List View
3. Click "Book Appointment" to create new:
   - Select patient (or auto-filled for patient role)
   - Choose date, time, and facility
   - Select provider and appointment type
   - Add notes if needed
4. Edit or cancel scheduled appointments
5. Browser notifications sent for reminders

### 💊 Digital Prescriptions
**How to use (Physicians only):**
1. Navigate to "Prescriptions"
2. Click "Create Prescription"
3. Select patient and facility
4. Add medications:
   - Drug name, dosage, frequency
   - Duration and special instructions
   - Click "+ Add Another Drug" for multiple medications
5. Set next refill date
6. View or print prescriptions anytime

**Patient View:**
- View all prescriptions
- Print prescriptions
- Automatic reminder creation

### 🔔 Medication Reminders
**How to use (Patients):**
1. Navigate to "Medication Reminders"
2. View adherence statistics
3. Click "Add Reminder" to create:
   - Enter medication name
   - Set reminder time
   - Choose frequency
   - Enable notifications and sound
4. Mark medications as taken
5. Edit or delete reminders

**Features:**
- Browser notifications at scheduled times
- Sound alerts (optional)
- Adherence tracking
- Missed dose monitoring

### 📦 Inventory Management
**How to use (Admin/Nurse):**
1. Navigate to "Inventory"
2. View all medications with stock levels
3. Filter by:
   - Low stock items
   - Expiring soon
4. Click "Add New Item" to add medications
5. Click "Restock" to add quantity
6. Edit or delete items as needed

**Alerts:**
- Low stock warnings (red badge)
- Expiring soon warnings (yellow badge)

### 🧪 Laboratory Tests
**How to use (Lab Personnel):**
1. Navigate to "Lab Tests"
2. Click "Add Test Result"
3. Select patient and test type
4. Enter result value and unit
5. Add lab code and date
6. Results viewable by physicians and patients

### 📊 ARPA Risk Assessment
**How to use (Physicians/Admin):**
1. View patient list - risk badges shown automatically
2. Click "ARPA" button on patient card
3. View detailed risk breakdown:
   - Overall risk score (0-100)
   - Risk level: Low, Medium, High, Critical
   - Component scores:
     * Missed medications (35%)
     * Missed appointments (25%)
     * Lab compliance (20%)
     * Time since last visit (20%)
4. View automated recommendations
5. See 6-month risk trend chart

**Risk Levels:**
- **Low (0-24)**: Good adherence, minimal intervention
- **Medium (25-49)**: Monitor closely, counseling recommended
- **High (50-74)**: Immediate attention needed
- **Critical (75-100)**: Urgent intervention required

### 🎓 Health Education
**How to use:**
1. Navigate to "Health Education"
2. Browse learning modules by category:
   - Basics of HIV
   - Lifestyle management
   - Treatment information
   - Prevention strategies
3. View FAQs (click to expand)
4. Access community forum (simulated)

### 👥 User Management (Admin only)
**How to use:**
1. Navigate to "User Management"
2. View all system users
3. Add new users with specific roles
4. Edit user information and permissions
5. Delete users if needed

### 🏥 Facility Management (Admin only)
**How to use:**
1. Navigate to "Facilities"
2. View all healthcare facilities
3. Add new facilities with contact information
4. Edit or delete facilities

## Tips & Best Practices

### For Patients:
- ✅ Set up medication reminders immediately after getting prescriptions
- ✅ Check notifications regularly
- ✅ Book appointments in advance
- ✅ Keep contact information updated
- ✅ Review educational materials regularly

### For Healthcare Workers:
- ✅ Check ARPA alerts daily
- ✅ Monitor high-risk patients closely
- ✅ Document all patient interactions
- ✅ Keep inventory levels updated
- ✅ Review system alerts each morning

### For Physicians:
- ✅ Review ARPA scores before consultations
- ✅ Create digital prescriptions for automatic reminders
- ✅ Document visit notes thoroughly
- ✅ Follow up on high-risk patients

### For Admin:
- ✅ Monitor inventory levels weekly
- ✅ Review system statistics regularly
- ✅ Keep user accounts up to date
- ✅ Audit facility information monthly

## Keyboard Shortcuts

- `Ctrl + /` - Focus search bar (where available)
- `Esc` - Close modal dialogs
- `Tab` - Navigate form fields

## Browser Compatibility

**Recommended Browsers:**
- Chrome 90+
- Firefox 88+
- Edge 90+
- Safari 14+

**Required Features:**
- JavaScript enabled
- localStorage available
- Notification API (for reminders)

## Troubleshooting

### Can't login?
- Ensure JavaScript is enabled
- Check console for errors (F12)
- Clear browser cache and try again
- Verify credentials match demo accounts

### Notifications not working?
- Click "Allow" when prompted for notification permission
- Check browser notification settings
- Ensure browser supports Notification API

### Data not saving?
- localStorage must be enabled
- Check browser privacy settings
- Clear localStorage and reload: `localStorage.clear()`

### Calendar not showing appointments?
- Ensure appointments exist for the current month
- Navigate to different months using arrows
- Check appointment status (only scheduled shown)

## Data Management

### Reset All Data:
Open browser console (F12) and run:
```javascript
localStorage.clear();
location.reload();
```

### Export Data (simulated):
Use the Reports section to generate CSV exports

### Backup Data:
Copy localStorage contents from browser DevTools





