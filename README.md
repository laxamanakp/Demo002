# DOH HIV Platform - Frontend Demo

A comprehensive HTML/CSS/JavaScript-based HIV healthcare management platform with role-based access control, designed for the Department of Health.

## 🌟 Features

### Core Functionality
- **Role-Based Access Control (RBAC)**: 6 user roles with specific permissions
  - Admin - Full system access
  - Case Manager - Patient coordination, counseling, referrals
  - Nurse - Patient care, inventory, HTS sessions
  - Physician - Clinical visits, prescriptions, ART regimens
  - Lab Personnel - Lab tests, HTS sessions
  - Patient - Personal health management

### Main Modules (19 Modules)

1. **Patient Management**
   - Complete CRUD operations
   - Patient registration with UIC generation
   - Demographics and medical history
   - Visit tracking and treatment timeline

2. **Appointment System**
   - Interactive calendar view
   - Appointment scheduling and management
   - SMS/Email reminder simulation (browser notifications)
   - Multiple appointment types

3. **Inventory Management**
   - Medication stock tracking
   - Low stock alerts
   - Expiry date monitoring
   - Restock management

4. **Digital Prescriptions**
   - Create and manage prescriptions
   - Custom printable prescription template
   - Prescription history
   - Automatic reminder creation

5. **Medication Reminders**
   - Customizable alarm times
   - Browser notifications
   - Adherence tracking
   - Missed dose monitoring

6. **Health Education**
   - Interactive learning modules
   - FAQ section
   - Community forum (simulated)
   - Resource library

7. **Healthcare Worker Dashboard**
   - Real-time statistics
   - System alerts
   - Recent activity feed
   - Patient risk overview

8. **ARPA (Adherence Risk Prediction Algorithm)**
   - Risk score calculation based on:
     - Missed medications
     - Missed appointments
     - Lab compliance
     - Time since last visit
   - Color-coded risk levels
   - Automated recommendations
   - Risk trend visualization

9. **Admin Dashboard**
   - User management
   - Facility management
   - System configuration
   - Reports generation

10. **Clinical Visit Management** ✨ NEW
    - Record patient visits with vital signs
    - Capture BP, HR, RR, Temperature, Weight, Height
    - BMI auto-calculation
    - Clinical notes and symptoms
    - WHO stage tracking
    - Assessment and treatment plan
    - Export visit summary

11. **ART Regimen Management** ✨ NEW
    - Start/stop ART regimens
    - Multiple drugs per regimen
    - Track pills dispensed and remaining
    - Monitor missed doses per drug
    - Status tracking (active/stopped/changed)
    - Stop/change reason documentation
    - Days on ART calculation

12. **HIV Testing Services (HTS)** ✨ NEW
    - Record HTS sessions
    - Pre-test counseling checklist
    - Informed consent tracking
    - Test result recording
    - Post-test counseling
    - Linkage to care referral
    - Session type tracking

13. **Counseling Sessions** ✨ NEW
    - Record counseling sessions
    - Multiple counseling types
    - Duration and topics tracking
    - Follow-up scheduling
    - ARPA-based task suggestions
    - Session notes documentation

14. **Satisfaction Surveys** ✨ NEW
    - 5-question patient feedback (1-4 scale)
    - Patient submission form
    - Admin analytics dashboard
    - Average satisfaction calculation
    - Per-question breakdown
    - Comments and remarks

15. **Patient Referrals** ✨ NEW
    - Create and track referrals
    - From/To facility management
    - Urgency levels
    - Status workflow
    - Referral reason documentation

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Edge, Safari)
- No backend server required - runs entirely in the browser

### Installation

1. Download or clone this repository
2. Open `index.html` in your web browser
3. Login with demo credentials (see below)

### Demo Credentials

```
Admin:
Username: admin
Password: admin123

Physician:
Username: physician
Password: doc123

Nurse:
Username: nurse
Password: nurse123

Case Manager:
Username: case_manager
Password: case123

Lab Personnel:
Username: lab_personnel
Password: lab123

Patient:
Username: patient
Password: pat123
```

## 📁 Project Structure

```
/
├── index.html                      # Login page
├── dashboard.html                  # Main dashboard
├── css/
│   ├── main.css                   # Global styles
│   ├── components.css             # Reusable components (radio, modals, etc.)
│   └── dashboard.css              # Dashboard-specific styles
├── js/
│   ├── app.js                     # Main application logic & routing
│   ├── auth.js                    # Authentication & RBAC
│   ├── mockData.js                # Comprehensive mock data
│   ├── inventory.js               # Inventory CRUD
│   ├── appointments.js            # Appointment system
│   ├── calendar.js                # Calendar component
│   ├── patients.js                # Patient management
│   ├── prescriptions.js           # Digital prescriptions
│   ├── reminders.js               # Medication reminders
│   ├── education.js               # Health education
│   ├── dashboard.js               # Worker dashboard
│   ├── arpa.js                    # Risk prediction algorithm
│   ├── admin.js                   # Admin functions
│   ├── visits.js                  # Clinical visits ✨ NEW
│   ├── art-regimen.js             # ART regimen management ✨ NEW
│   ├── hts.js                     # HIV testing services ✨ NEW
│   ├── counseling.js              # Counseling sessions ✨ NEW
│   └── surveys.js                 # Satisfaction surveys ✨ NEW
├── templates/
│   ├── appointment-template.html  # Appointment reminder template
│   └── prescription-template.html # Prescription template
├── assets/
│   └── .gitkeep                   # Assets directory
└── Documentation/
    ├── README.md                  # Main documentation
    ├── USER_GUIDE.md              # Complete user guide
    ├── FEATURES.md                # Feature checklist
    ├── COMPLETE_FEATURE_LIST.md   # Detailed implementation status
    └── CHANGELOG.md               # Version history
```

## 🔒 Security Features

- Role-based access control (RBAC)
- Session management via localStorage
- Route protection
- Field-level access control
- Secure password handling (demo purposes only)

## 💾 Data Storage

All data is stored in browser localStorage for demo purposes. In a production environment, this would be replaced with a proper backend database.

## 🎨 Design

- Modern, clean healthcare-focused design
- Responsive layout (mobile-friendly)
- Professional color scheme (medical blue/green)
- Accessible forms and navigation
- Print-friendly templates

## 🔔 Notifications

- Browser notification API for reminders
- Appointment reminders
- Medication reminders
- System alerts
- Sound alerts (optional)

## 📊 ARPA Algorithm

The Adherence Risk Prediction Algorithm calculates patient risk scores based on:
- **35%** - Missed medications
- **25%** - Missed appointments
- **20%** - Lab compliance
- **20%** - Time since last visit

Risk Levels:
- **Low**: Score 0-24
- **Medium**: Score 25-49
- **High**: Score 50-74
- **Critical**: Score 75-100

## 🛠️ Technologies Used

- HTML5
- CSS3 (with CSS Variables)
- Vanilla JavaScript (ES6+)
- Browser APIs:
  - localStorage
  - Notification API
  - Audio API (for reminders)

## 📝 Notes

- This is a **frontend-only demo application** with **95% feature completion**
- **19 JavaScript modules** with **7000+ lines** of fully functional code
- All CRUD operations work with localStorage
- **6 NEW modules added**: Clinical Visits, ART Regimens, HTS Sessions, Counseling, Surveys, Referrals
- No actual SMS/email sending (simulated with browser notifications)
- Database schema is provided but not used (see SQL schema in project description)
- For production use, implement proper backend with database
- **See `COMPLETE_FEATURE_LIST.md` for 95% implementation details**

## 🚧 Future Enhancements

- Backend integration with MySQL database
- Actual SMS/Email integration
- PDF generation for prescriptions
- Data export functionality
- Advanced reporting and analytics
- Real-time collaboration features
- Mobile app version

## 📄 License

This is a demo project for the Department of Health (DOH) HIV Platform.

## 🤝 Support

For questions or issues with the demo, please contact the development team.

---

**Note**: This is a demonstration application. For production deployment, proper security measures, backend integration, and data protection compliance must be implemented.

