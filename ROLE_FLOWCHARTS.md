# MyHubCares - Role-Based Flowcharts

**"It's my hub, and it's yours"** - Your Partner in Sexual Health and Wellness  
**Website**: [www.myhubcares.com](https://www.myhubcares.com/)

This document contains detailed flowcharts for each user role in the MyHubCares system, outlining their workflows and processes.

---

## 👑 ADMIN ROLE FLOWCHART

```mermaid
flowchart TD
    Start([Admin Login]) --> Dashboard[View Dashboard]
    Dashboard --> CheckStats{Review System<br/>Statistics}
    
    CheckStats --> PatientMgmt[Patient Management]
    CheckStats --> ApptMgmt[Appointment Management]
    CheckStats --> UserMgmt[User Management]
    CheckStats --> FacilityMgmt[Facility Management]
    CheckStats --> InventoryMgmt[Inventory Management]
    CheckStats --> Reports[Generate Reports]
    CheckStats --> Audit[Audit Trail]
    
    PatientMgmt --> PatientCRUD{Patient<br/>Operation}
    PatientCRUD -->|Create| AddPatient[Add New Patient]
    PatientCRUD -->|Read| ViewPatients[View All Patients]
    PatientCRUD -->|Update| EditPatient[Edit Patient Info]
    PatientCRUD -->|Delete| DeletePatient[Delete Patient]
    PatientCRUD -->|ARPA| ViewARPA[View ARPA Risk Scores]
    
    AddPatient --> UIC[Generate UIC]
    UIC --> SavePatient[Save Patient Record]
    ViewPatients --> FilterSearch[Filter & Search]
    EditPatient --> UpdateRecord[Update Patient Record]
    DeletePatient --> ConfirmDelete{Confirm<br/>Deletion}
    ConfirmDelete -->|Yes| RemovePatient[Remove Patient]
    ConfirmDelete -->|No| PatientMgmt
    
    ApptMgmt --> ApptCalendar[View Calendar]
    ApptCalendar --> ApptCRUD{Appointment<br/>Operation}
    ApptCRUD -->|Create| BookAppt[Book Appointment]
    ApptCRUD -->|Update| EditAppt[Edit Appointment]
    ApptCRUD -->|Cancel| CancelAppt[Cancel Appointment]
    
    UserMgmt --> UserCRUD{User<br/>Operation}
    UserCRUD -->|Create| AddUser[Add New User]
    UserCRUD -->|Read| ViewUsers[View All Users]
    UserCRUD -->|Update| EditUser[Edit User Info]
    UserCRUD -->|Delete| DeleteUser[Delete User]
    
    FacilityMgmt --> FacilityCRUD{Facility<br/>Operation}
    FacilityCRUD -->|Create| AddFacility[Add Facility]
    FacilityCRUD -->|Read| ViewFacilities[View Facilities]
    FacilityCRUD -->|Update| EditFacility[Edit Facility]
    FacilityCRUD -->|Delete| DeleteFacility[Delete Facility]
    
    InventoryMgmt --> InventoryCRUD{Inventory<br/>Operation}
    InventoryCRUD -->|Create| AddMedication[Add Medication]
    InventoryCRUD -->|Update| Restock[Restock Medication]
    InventoryCRUD -->|Check| CheckStock[Check Stock Levels]
    InventoryCRUD -->|Alert| LowStockAlert[Low Stock Alerts]
    
    Reports --> SelectReport{Report Type}
    SelectReport -->|Patient| PatientReport[Patient Reports]
    SelectReport -->|Clinical| ClinicalReport[Clinical Reports]
    SelectReport -->|Inventory| InventoryReport[Inventory Reports]
    SelectReport -->|Survey| SurveyReport[Survey Analytics]
    
    Audit --> ViewAuditLog[View Audit Trail]
    ViewAuditLog --> FilterAudit[Filter by User/Role/Action]
    
    Dashboard --> ViewVisits[View Clinical Visits]
    Dashboard --> ViewPrescriptions[View All Prescriptions]
    Dashboard --> ViewART[Monitor ART Regimens]
    Dashboard --> ViewLab[View Lab Tests]
    Dashboard --> ViewHTS[View HTS Sessions]
    Dashboard --> ViewCounseling[View Counseling Sessions]
    Dashboard --> ViewReferrals[Manage Referrals]
    Dashboard --> ViewSurveys[Satisfaction Surveys Analytics]
    Dashboard --> Education[Health Education]
    
    SavePatient --> Dashboard
    RemovePatient --> Dashboard
    UpdateRecord --> Dashboard
    BookAppt --> Dashboard
    EditAppt --> Dashboard
    CancelAppt --> Dashboard
    AddUser --> Dashboard
    EditUser --> Dashboard
    DeleteUser --> Dashboard
    AddFacility --> Dashboard
    EditFacility --> Dashboard
    DeleteFacility --> Dashboard
    AddMedication --> Dashboard
    Restock --> Dashboard
    PatientReport --> Dashboard
    ClinicalReport --> Dashboard
    InventoryReport --> Dashboard
    SurveyReport --> Dashboard
    ViewAuditLog --> Dashboard
    
    Dashboard --> Logout([Logout])
```

---

## 👨‍⚕️ PHYSICIAN ROLE FLOWCHART

```mermaid
flowchart TD
    Start([Physician Login]) --> Dashboard[View Dashboard]
    Dashboard --> CheckAlerts{Check ARPA<br/>Alerts}
    
    CheckAlerts --> HighRisk{High Risk<br/>Patients?}
    HighRisk -->|Yes| ReviewARPA[Review ARPA Assessment]
    HighRisk -->|No| PatientMgmt[Patient Management]
    
    ReviewARPA --> RiskDetails[View Risk Details]
    RiskDetails --> TakeAction{Take<br/>Action?}
    TakeAction -->|Intervene| ScheduleAppt[Schedule Appointment]
    TakeAction -->|Monitor| PatientMgmt
    
    PatientMgmt --> SelectPatient[Select Patient]
    SelectPatient --> PatientProfile[View Patient Profile]
    PatientProfile --> ProfileTabs{Profile Tab}
    
    ProfileTabs -->|Demographics| ViewDemographics[View Demographics]
    ProfileTabs -->|Visits| ViewVisits[View Visit History]
    ProfileTabs -->|Prescriptions| ViewPrescriptions[View Prescriptions]
    ProfileTabs -->|Lab Results| ViewLabResults[Review Lab Results]
    ProfileTabs -->|ARPA| ViewARPA[View ARPA Risk Score]
    
    Dashboard --> Appointments[Appointments]
    Appointments --> ApptCalendar[View Calendar]
    ApptCalendar --> BookAppt[Book Appointment]
    BookAppt --> SelectPatient2[Select Patient]
    SelectPatient2 --> SetDateTime[Set Date & Time]
    SetDateTime --> SetType[Set Appointment Type]
    SetType --> SaveAppt[Save Appointment]
    
    Dashboard --> ClinicalVisits[Clinical Visits]
    ClinicalVisits --> NewVisit[Record New Visit]
    NewVisit --> EnterVitals[Enter Vital Signs]
    EnterVitals --> EnterBMI[Calculate BMI]
    EnterBMI --> EnterWHO[Enter WHO Stage]
    EnterWHO --> EnterNotes[Enter Clinical Notes]
    EnterNotes --> SaveVisit[Save Visit Record]
    
    Dashboard --> Prescriptions[Prescriptions]
    Prescriptions --> CreatePrescription[Create Prescription]
    CreatePrescription --> SelectMedication[Select Medication]
    SelectMedication --> SetDosage[Set Dosage & Frequency]
    SetDosage --> SetDuration[Set Duration]
    SetDuration --> AddInstructions[Add Instructions]
    AddInstructions --> SavePrescription[Save Prescription]
    SavePrescription --> PrintPrescription{Print<br/>Prescription?}
    PrintPrescription -->|Yes| GeneratePrint[Generate Print Template]
    PrintPrescription -->|No| CreateReminder[Create Medication Reminder]
    GeneratePrint --> CreateReminder
    
    Dashboard --> ARTRegimens[ART Regimens]
    ARTRegimens --> ViewRegimens[View Patient Regimens]
    ViewRegimens --> NewRegimen{Start New<br/>Regimen?}
    NewRegimen -->|Yes| CreateRegimen[Create ART Regimen]
    NewRegimen -->|No| MonitorAdherence[Monitor Adherence]
    CreateRegimen --> SelectRegimen[Select Regimen Type]
    SelectRegimen --> SetStartDate[Set Start Date]
    SetStartDate --> SaveRegimen[Save Regimen]
    MonitorAdherence --> UpdateStatus[Update Regimen Status]
    
    Dashboard --> LabResults[Lab Results]
    LabResults --> ReviewResults[Review Test Results]
    ReviewResults --> InterpretResults[Interpret Results]
    InterpretResults --> MakeDecision{Clinical<br/>Decision}
    MakeDecision -->|Prescribe| CreatePrescription
    MakeDecision -->|Follow-up| ScheduleAppt
    MakeDecision -->|Counsel| Counseling
    
    Dashboard --> Counseling[Counseling]
    Counseling --> NewSession[New Counseling Session]
    NewSession --> SelectPatient3[Select Patient]
    SelectPatient3 --> EnterSession[Enter Session Details]
    EnterSession --> SetType[Set Counseling Type]
    SetType --> SaveSession[Save Session]
    
    Dashboard --> Inventory[Inventory]
    Inventory --> ViewStock[View Medication Stock]
    ViewStock --> CheckAvailability{Medication<br/>Available?}
    CheckAvailability -->|Yes| CreatePrescription
    CheckAvailability -->|No| AlertNurse[Alert Nurse for Restock]
    
    Dashboard --> Vaccinations[Vaccination Program]
    Vaccinations --> ViewVaccines[View Vaccine Records]
    ViewVaccines --> ScheduleVaccine[Schedule Vaccination]
    
    Dashboard --> Education[Education]
    Education --> AccessResources[Access Learning Resources]
    
    Dashboard --> Audit[My Activity Log]
    Audit --> ViewActivity[View Own Activity]
    
    SaveVisit --> Dashboard
    SavePrescription --> Dashboard
    SaveRegimen --> Dashboard
    SaveSession --> Dashboard
    SaveAppt --> Dashboard
    
    Dashboard --> Logout([Logout])
```

---

## 👩‍⚕️ NURSE ROLE FLOWCHART

```mermaid
flowchart TD
    Start([Nurse Login]) --> Dashboard[View Dashboard]
    Dashboard --> CheckAlerts{Check Care<br/>Coordination Alerts}
    
    CheckAlerts --> PatientCare[Patient Care]
    PatientCare --> SelectPatient[Select Patient]
    SelectPatient --> ViewProfile[View Patient Profile]
    
    Dashboard --> Patients[Patients]
    Patients --> ViewPatients[View Patient List]
    ViewPatients --> PatientActions{Patient<br/>Action}
    PatientActions -->|View| ViewProfile
    PatientActions -->|Assist| Appointments
    
    Dashboard --> Appointments[Appointments]
    Appointments --> ApptCalendar[View Calendar]
    ApptCalendar --> AssistAppt{Assist with<br/>Appointment}
    AssistAppt -->|Book| BookAppt[Book Appointment]
    AssistAppt -->|Reschedule| RescheduleAppt[Reschedule Appointment]
    AssistAppt -->|Cancel| CancelAppt[Cancel Appointment]
    
    Dashboard --> ClinicalVisits[Clinical Visits]
    ClinicalVisits --> RecordVisit[Record Clinical Visit]
    RecordVisit --> EnterVitals[Enter Vital Signs]
    EnterVitals --> EnterWeight[Enter Weight]
    EnterWeight --> EnterHeight[Enter Height]
    EnterHeight --> EnterBP[Enter Blood Pressure]
    EnterBP --> EnterTemp[Enter Temperature]
    EnterTemp --> SaveVisit[Save Visit Record]
    
    Dashboard --> Vaccinations[Vaccination Program]
    Vaccinations --> ViewVaccines[View Vaccination Schedule]
    ViewVaccines --> AdministerVaccine[Administer Vaccine]
    AdministerVaccine --> RecordVaccine[Record Vaccination]
    
    Dashboard --> Inventory[Inventory Management]
    Inventory --> InventoryCRUD{Inventory<br/>Operation}
    InventoryCRUD -->|View| ViewStock[View Stock Levels]
    InventoryCRUD -->|Add| AddMedication[Add Medication]
    InventoryCRUD -->|Restock| RestockMedication[Restock Medication]
    InventoryCRUD -->|Update| UpdateStock[Update Stock]
    InventoryCRUD -->|Check| CheckExpiry[Check Expiry Dates]
    
    ViewStock --> LowStock{Low Stock<br/>Alert?}
    LowStock -->|Yes| GenerateAlert[Generate Alert]
    LowStock -->|No| InventoryCRUD
    
    CheckExpiry --> ExpiringSoon{Expiring<br/>Soon?}
    ExpiringSoon -->|Yes| AlertExpiry[Alert Expiring Medication]
    ExpiringSoon -->|No| InventoryCRUD
    
    Dashboard --> Prescriptions[Prescriptions]
    Prescriptions --> ViewPrescriptions[View Prescriptions]
    ViewPrescriptions --> Dispense{Need to<br/>Dispense?}
    Dispense -->|Yes| CheckStock2[Check Stock Availability]
    Dispense -->|No| ViewPrescriptions
    CheckStock2 --> Available{Available?}
    Available -->|Yes| DispenseMedication[Dispense Medication]
    Available -->|No| AlertStock[Alert Low Stock]
    DispenseMedication --> UpdateDispensed[Mark as Dispensed]
    
    Dashboard --> HTS[HTS Sessions]
    HTS --> NewHTS[Conduct HTS Session]
    NewHTS --> SelectPatient2[Select Patient]
    SelectPatient2 --> PreCounseling[Pre-Test Counseling]
    PreCounseling --> ConductTest[Conduct HIV Test]
    ConductTest --> TestResult{Test<br/>Result}
    TestResult -->|Positive| PostCounselingPos[Post-Test Counseling Positive]
    TestResult -->|Negative| PostCounselingNeg[Post-Test Counseling Negative]
    PostCounselingPos --> LinkToCare[Link to Care]
    PostCounselingNeg --> Prevention[Prevention Counseling]
    LinkToCare --> SaveHTS[Save HTS Session]
    Prevention --> SaveHTS
    
    Dashboard --> Education[Education]
    Education --> AccessTraining[Access Training Resources]
    
    Dashboard --> Audit[My Activity Log]
    Audit --> ViewActivity[View Own Activity]
    
    SaveVisit --> Dashboard
    BookAppt --> Dashboard
    RestockMedication --> Dashboard
    UpdateDispensed --> Dashboard
    SaveHTS --> Dashboard
    RecordVaccine --> Dashboard
    
    Dashboard --> Logout([Logout])
```

---

## 🤝 CASE MANAGER ROLE FLOWCHART

```mermaid
flowchart TD
    Start([Case Manager Login]) --> Dashboard[View Dashboard]
    Dashboard --> CheckCaseLoad{Review Case<br/>Load Overview}
    
    CheckCaseLoad --> PatientCoordination[Patient Coordination]
    PatientCoordination --> SelectPatient[Select Patient]
    SelectPatient --> ViewCase[View Case Details]
    
    Dashboard --> Patients[Patients]
    Patients --> ViewPatients[View Patient List]
    ViewPatients --> PatientActions{Patient<br/>Action}
    PatientActions -->|View| ViewCase
    PatientActions -->|Coordinate| Coordination
    
    Dashboard --> Appointments[Appointments]
    Appointments --> ApptCalendar[View Calendar]
    ApptCalendar --> ScheduleAppt[Schedule Appointment]
    ScheduleAppt --> SelectPatient2[Select Patient]
    SelectPatient2 --> SetDateTime[Set Date & Time]
    SetDateTime --> SetProvider[Select Provider]
    SetProvider --> SetType[Set Appointment Type]
    SetType --> SaveAppt[Save Appointment]
    
    Dashboard --> Counseling[Counseling]
    Counseling --> CounselingCRUD{Counseling<br/>Operation}
    CounselingCRUD -->|Create| NewSession[New Counseling Session]
    CounselingCRUD -->|View| ViewSessions[View Sessions]
    CounselingCRUD -->|Follow-up| FollowUp[Schedule Follow-up]
    
    NewSession --> SelectPatient3[Select Patient]
    SelectPatient3 --> SetSessionType[Set Session Type]
    SetSessionType --> EnterNotes[Enter Session Notes]
    EnterNotes --> SetFollowUp{Need Follow-up?}
    SetFollowUp -->|Yes| SetFollowUpDate[Set Follow-up Date]
    SetFollowUp -->|No| SaveSession[Save Session]
    SetFollowUpDate --> SaveSession
    
    ViewSessions --> ReviewSession[Review Session Details]
    ReviewSession --> UpdateStatus[Update Session Status]
    
    Dashboard --> Referrals[Referrals]
    Referrals --> ReferralCRUD{Referral<br/>Operation}
    ReferralCRUD -->|Create| NewReferral[Create Referral]
    ReferralCRUD -->|View| ViewReferrals[View Referrals]
    ReferralCRUD -->|Update| UpdateStatus2[Update Referral Status]
    
    NewReferral --> SelectPatient4[Select Patient]
    SelectPatient4 --> SelectFacility[Select Receiving Facility]
    SelectFacility --> EnterReason[Enter Referral Reason]
    EnterReason --> SetPriority[Set Priority]
    SetPriority --> SaveReferral[Save Referral]
    
    ViewReferrals --> ReferralStatus{Referral<br/>Status}
    ReferralStatus -->|Pending| MonitorReferral[Monitor Referral]
    ReferralStatus -->|Accepted| ConfirmTransfer[Confirm Transfer]
    ReferralStatus -->|Completed| CloseReferral[Close Referral]
    
    Dashboard --> HTS[HTS Sessions]
    HTS --> ViewHTS[View HTS Sessions]
    ViewHTS --> LinkToCare[Link Patients to Care]
    LinkToCare --> FollowUp2[Follow-up with Patient]
    
    Dashboard --> Education[Education]
    Education --> AccessResources[Access Resources]
    
    Dashboard --> Audit[My Activity Log]
    Audit --> ViewActivity[View Own Activity]
    
    SaveAppt --> Dashboard
    SaveSession --> Dashboard
    SaveReferral --> Dashboard
    ConfirmTransfer --> Dashboard
    CloseReferral --> Dashboard
    
    Dashboard --> Logout([Logout])
```

---

## 🧪 LAB PERSONNEL ROLE FLOWCHART

```mermaid
flowchart TD
    Start([Lab Personnel Login]) --> Dashboard[View Dashboard]
    Dashboard --> CheckStats{Review Lab<br/>Statistics}
    
    CheckStats --> LabTests[Lab Tests]
    LabTests --> LabCRUD{Lab Test<br/>Operation}
    
    LabCRUD -->|Create| NewTest[Enter New Test Result]
    LabCRUD -->|View| ViewTests[View Test Results]
    LabCRUD -->|Update| EditTest[Edit Test Result]
    
    NewTest --> SelectPatient[Select Patient]
    SelectPatient --> SelectTestType[Select Test Type]
    SelectTestType --> TestTypes{Test<br/>Type}
    
    TestTypes -->|CD4| EnterCD4[Enter CD4 Count]
    TestTypes -->|Viral Load| EnterVL[Enter Viral Load]
    TestTypes -->|Chemistry| EnterChem[Enter Chemistry Results]
    TestTypes -->|Hematology| EnterHema[Enter Hematology Results]
    TestTypes -->|Other| EnterOther[Enter Other Results]
    
    EnterCD4 --> EnterDate[Enter Test Date]
    EnterVL --> EnterDate
    EnterChem --> EnterDate
    EnterHema --> EnterDate
    EnterOther --> EnterDate
    
    EnterDate --> EnterValues[Enter Test Values]
    EnterValues --> EnterNotes[Enter Notes/Comments]
    EnterNotes --> SaveTest[Save Test Result]
    
    ViewTests --> FilterTests{Filter<br/>Tests}
    FilterTests -->|By Patient| FilterPatient[Filter by Patient]
    FilterTests -->|By Date| FilterDate[Filter by Date]
    FilterTests -->|By Type| FilterType[Filter by Type]
    
    FilterPatient --> ViewResults[View Results]
    FilterDate --> ViewResults
    FilterType --> ViewResults
    
    ViewResults --> ReviewResult[Review Test Result]
    ReviewResult --> Actions{Action}
    Actions -->|Edit| EditTest
    Actions -->|Notify| NotifyProvider[Notify Provider]
    Actions -->|Print| PrintResult[Print Result]
    
    EditTest --> UpdateValues[Update Test Values]
    UpdateValues --> SaveTest
    
    Dashboard --> HTS[HTS Sessions]
    HTS --> HTSActions{HTS<br/>Operation}
    HTSActions -->|Create| RecordHTS[Record HTS Session]
    HTSActions -->|View| ViewHTS[View HTS Sessions]
    
    RecordHTS --> SelectPatient2[Select Patient]
    SelectPatient2 --> PreCounseling[Pre-Test Counseling]
    PreCounseling --> ConductTest[Conduct HIV Test]
    ConductTest --> RecordResult[Record Test Result]
    RecordResult --> PostCounseling[Post-Test Counseling]
    PostCounseling --> SaveHTS[Save HTS Session]
    
    ViewHTS --> ReviewHTS[Review HTS Records]
    
    Dashboard --> Patients[Patients]
    Patients --> ViewPatientInfo[View Patient Information]
    ViewPatientInfo --> ViewPatientHistory[View Patient History]
    
    Dashboard --> Education[Education]
    Education --> AccessTraining[Access Training Materials]
    
    Dashboard --> Audit[My Activity Log]
    Audit --> ViewActivity[View Own Activity]
    
    SaveTest --> Dashboard
    NotifyProvider --> Dashboard
    SaveHTS --> Dashboard
    
    Dashboard --> Logout([Logout])
```

---

## 👤 PATIENT ROLE FLOWCHART

```mermaid
flowchart TD
    Start([Patient Login]) --> Dashboard[My Dashboard]
    Dashboard --> ViewOverview{View Health<br/>Overview}
    
    ViewOverview --> UpcomingAppts[View Upcoming Appointments]
    ViewOverview --> Medications[View Medications]
    ViewOverview --> LabResults[View Lab Results]
    ViewOverview --> Reminders[View Reminders]
    
    Dashboard --> Profile[My Profile]
    Profile --> ViewDemographics[View Demographics]
    ViewDemographics --> EditProfile{Edit<br/>Profile?}
    EditProfile -->|Yes| UpdateProfile[Update Profile Info]
    EditProfile -->|No| Profile
    
    Dashboard --> Appointments[Appointments]
    Appointments --> ApptActions{Appointment<br/>Action}
    ApptActions -->|Book| BookAppt[Book Appointment]
    ApptActions -->|View| ViewAppts[View Appointments]
    ApptActions -->|Reschedule| RescheduleAppt[Reschedule Appointment]
    ApptActions -->|Cancel| CancelAppt[Cancel Appointment]
    
    BookAppt --> SelectDate[Select Date]
    SelectDate --> SelectTime[Select Time]
    SelectTime --> SelectFacility[Select Facility]
    SelectFacility --> SelectProvider[Select Provider]
    SelectProvider --> SelectType[Select Appointment Type]
    SelectType --> AddNotes[Add Notes]
    AddNotes --> ConfirmAppt[Confirm Appointment]
    ConfirmAppt --> SaveAppt[Save Appointment]
    
    ViewAppts --> ViewDetails[View Appointment Details]
    
    Dashboard --> Vaccinations[My Vaccinations]
    Vaccinations --> ViewVaccines[View Vaccination Records]
    ViewVaccines --> RequestVaccine[Request Vaccination]
    
    Dashboard --> Prescriptions[Prescriptions]
    Prescriptions --> ViewPrescriptions[View Prescriptions]
    ViewPrescriptions --> PrescriptionDetails{Prescription<br/>Details}
    PrescriptionDetails -->|View| ViewDetails2[View Prescription Details]
    PrescriptionDetails -->|Print| PrintPrescription[Print Prescription]
    
    ViewDetails2 --> ViewMedications[View Medications]
    ViewMedications --> ViewInstructions[View Instructions]
    
    Dashboard --> Reminders[Medication Reminders]
    Reminders --> ReminderCRUD{Reminder<br/>Operation}
    ReminderCRUD -->|Create| CreateReminder[Create Reminder]
    ReminderCRUD -->|View| ViewReminders[View Reminders]
    ReminderCRUD -->|Edit| EditReminder[Edit Reminder]
    ReminderCRUD -->|Delete| DeleteReminder[Delete Reminder]
    
    CreateReminder --> SelectMedication[Select Medication]
    SelectMedication --> SetTime[Set Reminder Time]
    SetTime --> SetFrequency[Set Frequency]
    SetFrequency --> EnableNotifications[Enable Notifications]
    EnableNotifications --> SaveReminder[Save Reminder]
    
    ViewReminders --> CheckAdherence[Check Adherence]
    CheckAdherence --> MarkTaken{Mark Medication<br/>Taken?}
    MarkTaken -->|Yes| RecordDose[Record Dose Taken]
    MarkTaken -->|No| CheckAdherence
    
    EditReminder --> UpdateReminder[Update Reminder Settings]
    UpdateReminder --> SaveReminder
    
    Dashboard --> LabResults[Lab Results]
    LabResults --> ViewLabResults[View Lab Results]
    ViewLabResults --> SelectResult[Select Test Result]
    SelectResult --> ViewResultDetails[View Result Details]
    ViewResultDetails --> DownloadResult{Download<br/>Result?}
    DownloadResult -->|Yes| DownloadPDF[Download PDF]
    DownloadResult -->|No| LabResults
    
    Dashboard --> Feedback[Feedback]
    Feedback --> SubmitSurvey[Submit Satisfaction Survey]
    SubmitSurvey --> RateService[Rate Service]
    RateService --> AddComments[Add Comments]
    AddComments --> SubmitFeedback[Submit Feedback]
    
    Dashboard --> Audit[My Activity Log]
    Audit --> ViewActivity[View Own Activity]
    ViewActivity --> FilterActivity[Filter Activity]
    
    Dashboard --> Education[Health Education]
    Education --> EducationActions{Education<br/>Action}
    EducationActions -->|Learn| ViewModules[View Learning Modules]
    EducationActions -->|FAQ| ViewFAQ[View FAQs]
    EducationActions -->|Forum| ViewForum[View Community Forum]
    
    ViewModules --> SelectModule[Select Module]
    SelectModule --> StudyModule[Study Module Content]
    
    SaveAppt --> Dashboard
    UpdateProfile --> Dashboard
    SaveReminder --> Dashboard
    RecordDose --> Dashboard
    SubmitFeedback --> Dashboard
    
    Dashboard --> Logout([Logout])
```

---

## 📊 SUMMARY OF ROLE CAPABILITIES

| Role | Primary Functions | Key Modules | Workflow Focus |
|------|------------------|-------------|----------------|
| **Admin** | System administration, oversight, reporting | 16 modules | Full system access, user/facility management, analytics |
| **Physician** | Clinical care, prescriptions, ART management | 10 modules | Patient diagnosis, treatment, medication management |
| **Nurse** | Patient care, inventory, HTS sessions | 8 modules | Care coordination, medication dispensing, testing |
| **Case Manager** | Patient coordination, referrals, counseling | 7 modules | Care coordination, patient linkage, referrals |
| **Lab Personnel** | Lab testing, result entry, HTS sessions | 5 modules | Test result entry, quality control, reporting |
| **Patient** | Personal health management, appointments | 8 modules | Self-service, appointment booking, medication adherence |

---

## 🔄 COMMON WORKFLOWS ACROSS ROLES

### Appointment Workflow
1. **Schedule** → Select Patient → Set Date/Time → Select Provider → Save
2. **View** → Calendar or List View → Filter/Search
3. **Manage** → Edit/Reschedule/Cancel

### Patient Management Workflow
1. **Access** → View Patient List → Search/Filter
2. **View** → Select Patient → View Profile → Navigate Tabs
3. **Manage** → Create/Edit/Delete (based on permissions)

### Clinical Visit Workflow
1. **Record** → Select Patient → Enter Vitals → Enter Notes → Save
2. **View** → View Visit History → Filter by Date/Patient

### Medication Workflow
1. **Prescribe** (Physician) → Create Prescription → Select Medications → Set Dosage → Save
2. **Dispense** (Nurse) → View Prescription → Check Stock → Dispense → Update Inventory
3. **Remind** (Patient) → Set Reminder → Receive Notifications → Track Adherence

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**System**: MyHubCares Healthcare Management Platform

---

## 📋 MODULE FLOWCHARTS

This section contains detailed flowcharts for each module in the MyHubCares system, showing the complete workflows and processes.

---

## 1. 👥 PATIENTS MODULE FLOWCHART

```mermaid
flowchart TD
    Start([Access Patients Module]) --> CheckPermission{Check<br/>Permissions}
    CheckPermission -->|Denied| AccessDenied[Access Denied]
    CheckPermission -->|Allowed| LoadPage[Load Patients Page]
    
    LoadPage --> DisplayList[Display Patient List]
    DisplayList --> ShowFilters[Show Search & Filters]
    
    ShowFilters --> UserAction{User<br/>Action}
    UserAction -->|Search| Search[Search by Name/UIC]
    UserAction -->|Filter| Filter[Filter by Gender/Status]
    UserAction -->|Add| AddPatient[Add New Patient]
    UserAction -->|View| ViewPatient[View Patient Details]
    UserAction -->|Edit| EditPatient[Edit Patient]
    UserAction -->|Delete| DeletePatient[Delete Patient]
    UserAction -->|ARPA| ViewARPA[View ARPA Risk]
    
    Search --> FilterResults[Filter Results]
    Filter --> FilterResults
    FilterResults --> DisplayList
    
    AddPatient --> ShowForm[Show Add Patient Form]
    ShowForm --> EnterDemographics[Enter Demographics]
    EnterDemographics --> EnterMedical[Enter Medical History]
    EnterMedical --> Validate{Validate<br/>Data}
    Validate -->|Invalid| ShowErrors[Show Validation Errors]
    Validate -->|Valid| GenerateUIC[Generate UIC]
    ShowErrors --> ShowForm
    GenerateUIC --> SavePatient[Save Patient Record]
    SavePatient --> LogAudit[Log Audit Trail]
    LogAudit --> RefreshList[Refresh Patient List]
    
    ViewPatient --> LoadProfile[Load Patient Profile]
    LoadProfile --> ShowTabs{Display<br/>Tabs}
    ShowTabs -->|Demographics| ShowDemographics[Show Demographics]
    ShowTabs -->|Visits| ShowVisits[Show Visit History]
    ShowTabs -->|Prescriptions| ShowPrescriptions[Show Prescriptions]
    ShowTabs -->|Lab Results| ShowLabResults[Show Lab Results]
    ShowTabs -->|ARPA| CalculateARPA[Calculate ARPA Score]
    
    EditPatient --> LoadEditForm[Load Edit Form]
    LoadEditForm --> UpdateFields[Update Patient Fields]
    UpdateFields --> ValidateEdit{Validate<br/>Changes}
    ValidateEdit -->|Invalid| ShowErrorsEdit[Show Errors]
    ValidateEdit -->|Valid| SaveChanges[Save Changes]
    ShowErrorsEdit --> LoadEditForm
    SaveChanges --> LogAuditEdit[Log Edit Audit]
    LogAuditEdit --> RefreshList
    
    DeletePatient --> ConfirmDelete{Confirm<br/>Deletion}
    ConfirmDelete -->|Cancel| DisplayList
    ConfirmDelete -->|Confirm| CheckDependencies{Check<br/>Dependencies}
    CheckDependencies -->|Has Records| ShowWarning[Show Warning]
    CheckDependencies -->|No Records| DeleteRecord[Delete Record]
    ShowWarning --> DisplayList
    DeleteRecord --> LogAuditDelete[Log Delete Audit]
    LogAuditDelete --> RefreshList
    
    ViewARPA --> CalculateRisk[Calculate Risk Score]
    CalculateRisk --> ShowRiskDetails[Show Risk Details]
    ShowRiskDetails --> ShowComponents[Show Risk Components]
    ShowComponents --> ShowRecommendations[Show Recommendations]
    
    RefreshList --> DisplayList
```

---

## 2. 📅 APPOINTMENTS MODULE FLOWCHART

```mermaid
flowchart TD
    Start([Access Appointments Module]) --> CheckPermission{Check<br/>Permissions}
    CheckPermission -->|Denied| AccessDenied[Access Denied]
    CheckPermission -->|Allowed| LoadPage[Load Appointments Page]
    
    LoadPage --> SelectView{Select<br/>View}
    SelectView -->|Calendar| CalendarView[Calendar View]
    SelectView -->|List| ListView[List View]
    
    CalendarView --> RenderCalendar[Render Calendar]
    RenderCalendar --> ShowMonth[Show Month/Week/Day]
    ShowMonth --> SelectDate[Select Date]
    SelectDate --> ShowDayAppts[Show Day Appointments]
    
    ListView --> DisplayList[Display Appointment List]
    DisplayList --> ShowFilters[Show Search & Status Filter]
    
    ShowFilters --> UserAction{User<br/>Action}
    UserAction -->|Search| Search[Search Appointments]
    UserAction -->|Filter| FilterStatus[Filter by Status]
    UserAction -->|Book| BookAppt[Book Appointment]
    UserAction -->|Edit| EditAppt[Edit Appointment]
    UserAction -->|Cancel| CancelAppt[Cancel Appointment]
    UserAction -->|View| ViewDetails[View Details]
    
    Search --> FilterResults[Filter Results]
    FilterStatus --> FilterResults
    FilterResults --> DisplayList
    
    BookAppt --> ShowBookingForm[Show Booking Form]
    ShowBookingForm --> SelectPatient[Select Patient]
    SelectPatient --> SelectDate[Select Date & Time]
    SelectDate --> SelectFacility[Select Facility]
    SelectFacility --> SelectProvider[Select Provider]
    SelectProvider --> SelectType[Select Appointment Type]
    SelectType --> AddNotes[Add Notes Optional]
    AddNotes --> ValidateBooking{Validate<br/>Booking}
    ValidateBooking -->|Invalid| ShowErrors[Show Errors]
    ValidateBooking -->|Valid| CheckConflict{Check<br/>Conflict}
    ShowErrors --> ShowBookingForm
    
    CheckConflict -->|Conflict| ShowConflict[Show Conflict Warning]
    CheckConflict -->|No Conflict| SaveAppt[Save Appointment]
    ShowConflict --> ShowBookingForm
    
    SaveAppt --> GenerateReminder[Generate Reminder]
    GenerateReminder --> LogAudit[Log Audit Trail]
    LogAudit --> RefreshList[Refresh Appointment List]
    
    EditAppt --> LoadEditForm[Load Edit Form]
    LoadEditForm --> UpdateFields[Update Fields]
    UpdateFields --> ValidateEdit{Validate<br/>Changes}
    ValidateEdit -->|Invalid| ShowErrorsEdit[Show Errors]
    ValidateEdit -->|Valid| SaveChanges[Save Changes]
    ShowErrorsEdit --> LoadEditForm
    SaveChanges --> LogAuditEdit[Log Edit Audit]
    LogAuditEdit --> RefreshList
    
    CancelAppt --> ConfirmCancel{Confirm<br/>Cancellation}
    ConfirmCancel -->|Cancel| DisplayList
    ConfirmCancel -->|Confirm| SetStatus[Set Status to Cancelled]
    SetStatus --> LogAuditCancel[Log Cancel Audit]
    LogAuditCancel --> RefreshList
    
    ViewDetails --> ShowFullDetails[Show Full Details]
    ShowFullDetails --> ShowReminder[Show Reminder Info]
    
    RefreshList --> DisplayList
```

---

## 3. 🏥 CLINICAL VISITS MODULE FLOWCHART

```mermaid
flowchart TD
    Start([Access Clinical Visits Module]) --> CheckPermission{Check<br/>Permissions}
    CheckPermission -->|Denied| AccessDenied[Access Denied]
    CheckPermission -->|Allowed| LoadPage[Load Visits Page]
    
    LoadPage --> DisplayList[Display Visit List]
    DisplayList --> ShowFilters[Show Search & Type Filter]
    
    ShowFilters --> UserAction{User<br/>Action}
    UserAction -->|Search| Search[Search Visits]
    UserAction -->|Filter| FilterType[Filter by Visit Type]
    UserAction -->|Record| RecordVisit[Record New Visit]
    UserAction -->|View| ViewVisit[View Visit Details]
    UserAction -->|Export| ExportVisit[Export Visit Summary]
    
    Search --> FilterResults[Filter Results]
    FilterType --> FilterResults
    FilterResults --> DisplayList
    
    RecordVisit --> ShowVisitForm[Show Visit Form]
    ShowVisitForm --> SelectPatient[Select Patient]
    SelectPatient --> EnterVitals[Enter Vital Signs]
    EnterVitals --> EnterWeight[Enter Weight]
    EnterWeight --> EnterHeight[Enter Height]
    EnterHeight --> CalculateBMI[Calculate BMI Automatically]
    CalculateBMI --> EnterBP[Enter Blood Pressure]
    EnterBP --> EnterTemp[Enter Temperature]
    EnterTemp --> EnterPulse[Enter Pulse Rate]
    EnterPulse --> EnterResp[Enter Respiratory Rate]
    EnterResp --> SelectVisitType[Select Visit Type]
    SelectVisitType --> SelectWHOStage[Select WHO Stage]
    SelectWHOStage --> EnterNotes[Enter Clinical Notes]
    EnterNotes --> EnterAssessment[Enter Assessment]
    EnterAssessment --> ValidateVisit{Validate<br/>Data}
    
    ValidateVisit -->|Invalid| ShowErrors[Show Validation Errors]
    ValidateVisit -->|Valid| SaveVisit[Save Visit Record]
    ShowErrors --> ShowVisitForm
    
    SaveVisit --> LinkToPatient[Link to Patient Profile]
    LinkToPatient --> LogAudit[Log Audit Trail]
    LogAudit --> RefreshList[Refresh Visit List]
    
    ViewVisit --> LoadDetails[Load Visit Details]
    LoadDetails --> ShowVitals[Show Vital Signs]
    ShowVitals --> ShowBMI[Show BMI Calculation]
    ShowBMI --> ShowWHOStage[Show WHO Stage]
    ShowWHOStage --> ShowNotes[Show Clinical Notes]
    ShowNotes --> ShowAssessment[Show Assessment]
    
    ExportVisit --> GeneratePDF[Generate PDF Summary]
    GeneratePDF --> DownloadFile[Download PDF File]
    
    RefreshList --> DisplayList
```

---

## 4. 💊 PRESCRIPTIONS MODULE FLOWCHART

```mermaid
flowchart TD
    Start([Access Prescriptions Module]) --> CheckPermission{Check<br/>Permissions}
    CheckPermission -->|Denied| AccessDenied[Access Denied]
    CheckPermission -->|Allowed| LoadPage[Load Prescriptions Page]
    
    LoadPage --> CheckRole{Check<br/>User Role}
    CheckRole -->|Physician| ShowCreate[Show Create Button]
    CheckRole -->|Other| ShowViewOnly[Show View Only]
    
    ShowCreate --> DisplayList[Display Prescription List]
    ShowViewOnly --> DisplayList
    
    DisplayList --> ShowFilters[Show Search Filter]
    
    ShowFilters --> UserAction{User<br/>Action}
    UserAction -->|Search| Search[Search Prescriptions]
    UserAction -->|Create| CreatePrescription[Create Prescription]
    UserAction -->|View| ViewPrescription[View Prescription]
    UserAction -->|Print| PrintPrescription[Print Prescription]
    
    Search --> FilterResults[Filter Results]
    FilterResults --> DisplayList
    
    CreatePrescription --> ShowForm[Show Prescription Form]
    ShowForm --> SelectPatient[Select Patient]
    SelectPatient --> AddMedication[Add Medication]
    AddMedication --> EnterDrugName[Enter Drug Name]
    EnterDrugName --> EnterDosage[Enter Dosage]
    EnterDosage --> EnterFrequency[Enter Frequency]
    EnterFrequency --> EnterDuration[Enter Duration]
    EnterDuration --> AddMore{Add More<br/>Medications?}
    
    AddMore -->|Yes| AddMedication
    AddMore -->|No| EnterInstructions[Enter Special Instructions]
    EnterInstructions --> SetRefillDate[Set Next Refill Date]
    SetRefillDate --> ValidatePrescription{Validate<br/>Prescription}
    
    ValidatePrescription -->|Invalid| ShowErrors[Show Validation Errors]
    ValidatePrescription -->|Valid| GeneratePrescNum[Generate Prescription Number]
    ShowErrors --> ShowForm
    
    GeneratePrescNum --> SavePrescription[Save Prescription]
    SavePrescription --> CheckInventory{Check<br/>Inventory}
    CheckInventory -->|Low Stock| AlertNurse[Alert Nurse]
    CheckInventory -->|Available| CreateReminder[Create Medication Reminder]
    AlertNurse --> CreateReminder
    
    CreateReminder --> LogAudit[Log Audit Trail]
    LogAudit --> RefreshList[Refresh Prescription List]
    
    ViewPrescription --> LoadDetails[Load Prescription Details]
    LoadDetails --> ShowPatient[Show Patient Info]
    ShowPatient --> ShowMedications[Show Medications List]
    ShowMedications --> ShowInstructions[Show Instructions]
    ShowInstructions --> ShowRefillDate[Show Refill Date]
    
    PrintPrescription --> LoadTemplate[Load Prescription Template]
    LoadTemplate --> FillTemplate[Fill Template with Data]
    FillTemplate --> GeneratePrint[Generate Print View]
    GeneratePrint --> PrintDialog[Show Print Dialog]
    
    RefreshList --> DisplayList
```

---

## 5. 🔔 MEDICATION REMINDERS MODULE FLOWCHART

```mermaid
flowchart TD
    Start([Access Reminders Module]) --> CheckRole{Check<br/>Role}
    CheckRole -->|Patient| LoadPatientPage[Load Patient Page]
    CheckRole -->|Other| AccessDenied[Access Denied - Patient Only]
    
    LoadPatientPage --> CalculateStats[Calculate Adherence Stats]
    CalculateStats --> DisplayStats[Display Adherence Card]
    DisplayStats --> ShowTodayReminders[Show Today's Reminders]
    
    ShowTodayReminders --> UserAction{User<br/>Action}
    UserAction -->|Create| CreateReminder[Create Reminder]
    UserAction -->|Edit| EditReminder[Edit Reminder]
    UserAction -->|Delete| DeleteReminder[Delete Reminder]
    UserAction -->|Mark Taken| MarkTaken[Mark Medication Taken]
    UserAction -->|View All| ViewAllReminders[View All Reminders]
    
    CreateReminder --> ShowForm[Show Reminder Form]
    ShowForm --> SelectMedication[Select Medication]
    SelectMedication --> SetTime[Set Reminder Time]
    SetTime --> SetFrequency[Set Frequency]
    SetFrequency --> EnableNotifications{Enable<br/>Notifications?}
    
    EnableNotifications -->|Yes| RequestPermission[Request Notification Permission]
    EnableNotifications -->|No| SaveReminder[Save Reminder]
    RequestPermission -->|Granted| SaveReminder
    RequestPermission -->|Denied| ShowWarning[Show Warning]
    ShowWarning --> SaveReminder
    
    SaveReminder --> ScheduleAlarm[Schedule Browser Alarm]
    ScheduleAlarm --> LogAudit[Log Audit Trail]
    LogAudit --> RefreshList[Refresh Reminder List]
    
    EditReminder --> LoadEditForm[Load Edit Form]
    LoadEditForm --> UpdateFields[Update Reminder Fields]
    UpdateFields --> SaveChanges[Save Changes]
    SaveChanges --> UpdateAlarm[Update Alarm Schedule]
    UpdateAlarm --> RefreshList
    
    DeleteReminder --> ConfirmDelete{Confirm<br/>Deletion}
    ConfirmDelete -->|Cancel| ShowTodayReminders
    ConfirmDelete -->|Confirm| RemoveReminder[Remove Reminder]
    RemoveReminder --> CancelAlarm[Cancel Alarm]
    CancelAlarm --> RefreshList
    
    MarkTaken --> RecordDose[Record Dose Taken]
    RecordDose --> UpdateAdherence[Update Adherence Rate]
    UpdateAdherence --> LogDose[Log Dose Taken]
    LogDose --> RefreshList
    
    ViewAllReminders --> ShowAllReminders[Show All Reminders]
    ShowAllReminders --> ShowHistory[Show Adherence History]
    
    RefreshList --> ShowTodayReminders
    
    StartReminderCheck[Start Reminder Check Loop] --> CheckTime{Check<br/>Current Time}
    CheckTime -->|Match| TriggerNotification[Trigger Notification]
    CheckTime -->|No Match| Wait[Wait]
    TriggerNotification --> ShowNotification[Show Browser Notification]
    ShowNotification --> PlaySound[Play Sound Alert]
    PlaySound --> Wait
    Wait --> CheckTime
```

---

## 6. 📦 INVENTORY MODULE FLOWCHART

```mermaid
flowchart TD
    Start([Access Inventory Module]) --> CheckPermission{Check<br/>Permissions}
    CheckPermission -->|Denied| AccessDenied[Access Denied]
    CheckPermission -->|View Only| LoadViewPage[Load View Page]
    CheckPermission -->|Manage| LoadManagePage[Load Manage Page]
    
    LoadViewPage --> DisplayGrid[Display Inventory Grid]
    LoadManagePage --> DisplayGrid
    
    DisplayGrid --> ShowFilters[Show Search & Filter Options]
    
    ShowFilters --> UserAction{User<br/>Action}
    UserAction -->|Search| Search[Search Inventory]
    UserAction -->|Filter| FilterItems[Filter by Status]
    UserAction -->|View| ViewItem[View Item Details]
    UserAction -->|Add| AddItem[Add New Item]
    UserAction -->|Edit| EditItem[Edit Item]
    UserAction -->|Restock| RestockItem[Restock Item]
    UserAction -->|Delete| DeleteItem[Delete Item]
    
    Search --> FilterResults[Filter Results]
    FilterItems --> FilterResults
    FilterResults --> DisplayGrid
    
    ViewItem --> LoadDetails[Load Item Details]
    LoadDetails --> ShowStock[Show Stock Level]
    ShowStock --> ShowReorderLevel[Show Reorder Level]
    ShowReorderLevel --> ShowExpiry[Show Expiry Date]
    ShowExpiry --> ShowSupplier[Show Supplier Info]
    
    AddItem --> ShowAddForm[Show Add Form]
    ShowAddForm --> EnterDrugName[Enter Drug Name]
    EnterDrugName --> EnterStock[Enter Stock Quantity]
    EnterStock --> EnterUnit[Enter Unit]
    EnterUnit --> EnterReorderLevel[Enter Reorder Level]
    EnterReorderLevel --> EnterExpiry[Enter Expiry Date]
    EnterExpiry --> EnterSupplier[Enter Supplier]
    EnterSupplier --> ValidateItem{Validate<br/>Data}
    
    ValidateItem -->|Invalid| ShowErrors[Show Validation Errors]
    ValidateItem -->|Valid| SaveItem[Save Item]
    ShowErrors --> ShowAddForm
    
    SaveItem --> CheckStockLevel{Check Stock<br/>Level}
    CheckStockLevel -->|Low| GenerateAlert[Generate Low Stock Alert]
    CheckStockLevel -->|OK| CheckExpiry[Check Expiry Date]
    GenerateAlert --> CheckExpiry
    
    CheckExpiry -->|Expiring Soon| GenerateExpiryAlert[Generate Expiry Alert]
    CheckExpiry -->|OK| LogAudit[Log Audit Trail]
    GenerateExpiryAlert --> LogAudit
    
    LogAudit --> RefreshGrid[Refresh Inventory Grid]
    
    EditItem --> LoadEditForm[Load Edit Form]
    LoadEditForm --> UpdateFields[Update Fields]
    UpdateFields --> ValidateEdit{Validate<br/>Changes}
    ValidateEdit -->|Invalid| ShowErrorsEdit[Show Errors]
    ValidateEdit -->|Valid| SaveChanges[Save Changes]
    ShowErrorsEdit --> LoadEditForm
    SaveChanges --> LogAuditEdit[Log Edit Audit]
    LogAuditEdit --> RefreshGrid
    
    RestockItem --> ShowRestockForm[Show Restock Form]
    ShowRestockForm --> EnterQuantity[Enter Quantity to Add]
    EnterQuantity --> EnterBatch[Enter Batch Number]
    EnterBatch --> EnterNewExpiry[Enter New Expiry Date]
    EnterNewExpiry --> UpdateStock[Update Stock Quantity]
    UpdateStock --> LogRestock[Log Restock Audit]
    LogRestock --> RefreshGrid
    
    DeleteItem --> ConfirmDelete{Confirm<br/>Deletion}
    ConfirmDelete -->|Cancel| DisplayGrid
    ConfirmDelete -->|Confirm| RemoveItem[Remove Item]
    RemoveItem --> LogDelete[Log Delete Audit]
    LogDelete --> RefreshGrid
    
    RefreshGrid --> DisplayGrid
```

---

## 7. 💊 ART REGIMENS MODULE FLOWCHART

```mermaid
flowchart TD
    Start([Access ART Regimens Module]) --> CheckPermission{Check<br/>Permissions}
    CheckPermission -->|Denied| AccessDenied[Access Denied]
    CheckPermission -->|Allowed| LoadPage[Load ART Regimens Page]
    
    LoadPage --> DisplayList[Display Regimen List]
    DisplayList --> ShowFilters[Show Search & Status Filter]
    
    ShowFilters --> UserAction{User<br/>Action}
    UserAction -->|Search| Search[Search Regimens]
    UserAction -->|Filter| FilterStatus[Filter by Status]
    UserAction -->|Create| CreateRegimen[Start New Regimen]
    UserAction -->|View| ViewRegimen[View Regimen Details]
    UserAction -->|Stop| StopRegimen[Stop/Change Regimen]
    UserAction -->|Update| UpdateAdherence[Update Adherence]
    
    Search --> FilterResults[Filter Results]
    FilterStatus --> FilterResults
    FilterResults --> DisplayList
    
    CreateRegimen --> ShowForm[Show Regimen Form]
    ShowForm --> SelectPatient[Select Patient]
    SelectPatient --> SelectRegimenType[Select Regimen Type]
    SelectRegimenType --> AddDrugs[Add Drugs to Regimen]
    AddDrugs --> EnterDrugName[Enter Drug Name]
    EnterDrugName --> EnterDosage[Enter Dosage]
    EnterDosage --> EnterFrequency[Enter Frequency]
    EnterFrequency --> SetPillsPerDose[Set Pills per Dose]
    SetPillsPerDose --> AddMoreDrugs{Add More<br/>Drugs?}
    
    AddMoreDrugs -->|Yes| AddDrugs
    AddMoreDrugs -->|No| SetStartDate[Set Start Date]
    SetStartDate --> EnterNotes[Enter Notes]
    EnterNotes --> ValidateRegimen{Validate<br/>Regimen}
    
    ValidateRegimen -->|Invalid| ShowErrors[Show Validation Errors]
    ValidateRegimen -->|Valid| SetStatusActive[Set Status to Active]
    ShowErrors --> ShowForm
    
    SetStatusActive --> SaveRegimen[Save Regimen]
    SaveRegimen --> InitializeAdherence[Initialize Adherence Tracking]
    InitializeAdherence --> LogAudit[Log Audit Trail]
    LogAudit --> RefreshList[Refresh Regimen List]
    
    ViewRegimen --> LoadDetails[Load Regimen Details]
    LoadDetails --> ShowPatient[Show Patient Info]
    ShowPatient --> ShowRegimenType[Show Regimen Type]
    ShowRegimenType --> ShowDrugs[Show Drugs List]
    ShowDrugs --> ShowStartDate[Show Start Date]
    ShowStartDate --> ShowDuration[Calculate Days on ART]
    ShowDuration --> ShowStatus[Show Current Status]
    ShowStatus --> ShowAdherence[Show Adherence Data]
    
    StopRegimen --> ShowStopForm[Show Stop/Change Form]
    ShowStopForm --> SelectReason[Select Stop Reason]
    SelectReason --> SetStopDate[Set Stop Date]
    SetStopDate --> EnterStopNotes[Enter Stop Notes]
    EnterStopNotes --> ChangeToNew{Change to<br/>New Regimen?}
    
    ChangeToNew -->|Yes| CreateRegimen
    ChangeToNew -->|No| UpdateStatus[Update Status to Stopped]
    UpdateStatus --> SaveChanges[Save Changes]
    SaveChanges --> LogAuditStop[Log Stop Audit]
    LogAuditStop --> RefreshList
    
    UpdateAdherence --> ShowAdherenceForm[Show Adherence Form]
    ShowAdherenceForm --> UpdatePillsDispensed[Update Pills Dispensed]
    UpdatePillsDispensed --> UpdatePillsRemaining[Update Pills Remaining]
    UpdatePillsRemaining --> UpdateMissedDoses[Update Missed Doses]
    UpdateMissedDoses --> CalculateAdherenceRate[Calculate Adherence Rate]
    CalculateAdherenceRate --> SaveAdherence[Save Adherence Data]
    SaveAdherence --> RefreshList
    
    RefreshList --> DisplayList
```

---

## 8. 🧪 LAB TESTS MODULE FLOWCHART

```mermaid
flowchart TD
    Start([Access Lab Tests Module]) --> CheckPermission{Check<br/>Permissions}
    CheckPermission -->|Denied| AccessDenied[Access Denied]
    CheckPermission -->|View Only| LoadViewPage[Load View Page]
    CheckPermission -->|Manage| LoadManagePage[Load Manage Page]
    
    LoadViewPage --> DisplayList[Display Lab Tests List]
    LoadManagePage --> DisplayList
    
    DisplayList --> ShowFilters[Show Search & Filter Options]
    
    ShowFilters --> UserAction{User<br/>Action}
    UserAction -->|Search| Search[Search Tests]
    UserAction -->|Filter| FilterType[Filter by Test Type]
    UserAction -->|Filter| FilterDate[Filter by Date]
    UserAction -->|Create| CreateTest[Enter Test Result]
    UserAction -->|View| ViewTest[View Test Result]
    UserAction -->|Edit| EditTest[Edit Test Result]
    UserAction -->|Notify| NotifyProvider[Notify Provider]
    UserAction -->|Print| PrintResult[Print Result]
    
    Search --> FilterResults[Filter Results]
    FilterType --> FilterResults
    FilterDate --> FilterResults
    FilterResults --> DisplayList
    
    CreateTest --> ShowForm[Show Test Entry Form]
    ShowForm --> SelectPatient[Select Patient]
    SelectPatient --> SelectTestType[Select Test Type]
    SelectTestType --> TestTypes{Test<br/>Type}
    
    TestTypes -->|CD4| EnterCD4[Enter CD4 Count]
    TestTypes -->|Viral Load| EnterViralLoad[Enter Viral Load]
    TestTypes -->|Chemistry| EnterChemistry[Enter Chemistry Values]
    TestTypes -->|Hematology| EnterHematology[Enter Hematology Values]
    TestTypes -->|Other| EnterOther[Enter Other Values]
    
    EnterCD4 --> EnterDate[Enter Test Date]
    EnterViralLoad --> EnterDate
    EnterChemistry --> EnterDate
    EnterHematology --> EnterDate
    EnterOther --> EnterDate
    
    EnterDate --> EnterValues[Enter Test Values]
    EnterValues --> EnterNotes[Enter Notes/Comments]
    EnterNotes --> ValidateTest{Validate<br/>Data}
    
    ValidateTest -->|Invalid| ShowErrors[Show Validation Errors]
    ValidateTest -->|Valid| SaveTest[Save Test Result]
    ShowErrors --> ShowForm
    
    SaveTest --> LinkToPatient[Link to Patient Profile]
    LinkToPatient --> CheckCritical{Check Critical<br/>Values?}
    CheckCritical -->|Critical| AlertProvider[Alert Provider]
    CheckCritical -->|Normal| LogAudit[Log Audit Trail]
    AlertProvider --> LogAudit
    
    LogAudit --> RefreshList[Refresh Test List]
    
    ViewTest --> LoadDetails[Load Test Details]
    LoadDetails --> ShowPatient[Show Patient Info]
    ShowPatient --> ShowTestType[Show Test Type]
    ShowTestType --> ShowValues[Show Test Values]
    ShowValues --> ShowDate[Show Test Date]
    ShowDate --> ShowNotes[Show Notes]
    ShowNotes --> ShowReferenceRange[Show Reference Range]
    
    EditTest --> LoadEditForm[Load Edit Form]
    LoadEditForm --> UpdateValues[Update Test Values]
    UpdateValues --> ValidateEdit{Validate<br/>Changes}
    ValidateEdit -->|Invalid| ShowErrorsEdit[Show Errors]
    ValidateEdit -->|Valid| SaveChanges[Save Changes]
    ShowErrorsEdit --> LoadEditForm
    SaveChanges --> LogEditAudit[Log Edit Audit]
    LogEditAudit --> RefreshList
    
    NotifyProvider --> SelectProvider[Select Provider]
    SelectProvider --> SendNotification[Send Notification]
    SendNotification --> RefreshList
    
    PrintResult --> GeneratePrint[Generate Print View]
    GeneratePrint --> PrintDialog[Show Print Dialog]
    
    RefreshList --> DisplayList
```

---

## 9. 🧬 HTS SESSIONS MODULE FLOWCHART

```mermaid
flowchart TD
    Start([Access HTS Module]) --> CheckPermission{Check<br/>Permissions}
    CheckPermission -->|Denied| AccessDenied[Access Denied]
    CheckPermission -->|Allowed| LoadPage[Load HTS Sessions Page]
    
    LoadPage --> DisplayList[Display HTS Sessions List]
    DisplayList --> ShowFilters[Show Search & Result Filter]
    
    ShowFilters --> UserAction{User<br/>Action}
    UserAction -->|Search| Search[Search Sessions]
    UserAction -->|Filter| FilterResult[Filter by Result]
    UserAction -->|Create| CreateSession[Record HTS Session]
    UserAction -->|View| ViewSession[View Session Details]
    
    Search --> FilterResults[Filter Results]
    FilterResult --> FilterResults
    FilterResults --> DisplayList
    
    CreateSession --> ShowForm[Show HTS Session Form]
    ShowForm --> SelectPatient[Select Patient]
    SelectPatient --> SelectSessionType[Select Session Type]
    SelectSessionType --> PreTestCounseling[Pre-Test Counseling]
    
    PreTestCounseling --> ConductPreCounseling{Conduct<br/>Pre-Counseling?}
    ConductPreCounseling -->|Yes| EnterPreCounseling[Enter Pre-Counseling Details]
    ConductPreCounseling -->|No| CheckConsent[Check Informed Consent]
    EnterPreCounseling --> CheckConsent
    
    CheckConsent --> ConsentObtained{Consent<br/>Obtained?}
    ConsentObtained -->|No| CannotProceed[Cannot Proceed]
    ConsentObtained -->|Yes| ConductTest[Conduct HIV Test]
    
    ConductTest --> EnterTestResult[Enter Test Result]
    EnterTestResult --> ResultTypes{Test<br/>Result}
    
    ResultTypes -->|Positive| PostCounselingPositive[Post-Test Counseling Positive]
    ResultTypes -->|Reactive| PostCounselingPositive
    ResultTypes -->|Non-Reactive| PostCounselingNegative[Post-Test Counseling Negative]
    
    PostCounselingPositive --> EnterPostCounselingPos[Enter Post-Counseling Details]
    EnterPostCounselingPos --> LinkToCare[Link to Care]
    LinkToCare --> ScheduleAppt[Schedule Appointment]
    ScheduleAppt --> ProvideResources[Provide Resources]
    
    PostCounselingNegative --> EnterPostCounselingNeg[Enter Post-Counseling Details]
    EnterPostCounselingNeg --> PreventionCounseling[Prevention Counseling]
    PreventionCounseling --> SaveSession[Save Session]
    
    ProvideResources --> SaveSession
    
    SaveSession --> ValidateSession{Validate<br/>Session}
    ValidateSession -->|Invalid| ShowErrors[Show Validation Errors]
    ValidateSession -->|Valid| SaveRecord[Save Session Record]
    ShowErrors --> ShowForm
    
    SaveRecord --> LogAudit[Log Audit Trail]
    LogAudit --> RefreshList[Refresh Session List]
    
    ViewSession --> LoadDetails[Load Session Details]
    LoadDetails --> ShowPatient[Show Patient Info]
    ShowPatient --> ShowSessionType[Show Session Type]
    ShowSessionType --> ShowPreCounseling[Show Pre-Counseling]
    ShowPreCounseling --> ShowConsent[Show Consent Status]
    ShowConsent --> ShowTestResult[Show Test Result]
    ShowTestResult --> ShowPostCounseling[Show Post-Counseling]
    ShowPostCounseling --> ShowLinkage[Show Linkage to Care]
    
    RefreshList --> DisplayList
```

---

## 10. 💬 COUNSELING MODULE FLOWCHART

```mermaid
flowchart TD
    Start([Access Counseling Module]) --> CheckPermission{Check<br/>Permissions}
    CheckPermission -->|Denied| AccessDenied[Access Denied]
    CheckPermission -->|Allowed| LoadPage[Load Counseling Page]
    
    LoadPage --> CalculateStats[Calculate Statistics]
    CalculateStats --> DisplayStats[Display Statistics Cards]
    DisplayStats --> DisplayList[Display Sessions List]
    
    DisplayList --> ShowFilters[Show Search & Type Filter]
    ShowFilters --> CheckFollowUps[Check Follow-ups Due]
    
    CheckFollowUps -->|Follow-ups Due| ShowAlert[Show Follow-up Alert]
    CheckFollowUps -->|No Follow-ups| UserAction{User<br/>Action}
    ShowAlert --> UserAction
    
    UserAction -->|Search| Search[Search Sessions]
    UserAction -->|Filter| FilterType[Filter by Type]
    UserAction -->|Create| CreateSession[Record Session]
    UserAction -->|View| ViewSession[View Session Details]
    UserAction -->|Follow-up| ScheduleFollowUp[Schedule Follow-up]
    UserAction -->|Update| UpdateStatus[Update Status]
    
    Search --> FilterResults[Filter Results]
    FilterType --> FilterResults
    FilterResults --> DisplayList
    
    CreateSession --> ShowForm[Show Session Form]
    ShowForm --> SelectPatient[Select Patient]
    SelectPatient --> SelectSessionType[Select Session Type]
    SelectSessionType --> SelectTopics[Select Topics Multi-select]
    SelectTopics --> EnterDuration[Enter Session Duration]
    EnterDuration --> EnterNotes[Enter Session Notes]
    EnterNotes --> EnterSummary[Enter Session Summary]
    EnterSummary --> SetFollowUp{Need<br/>Follow-up?}
    
    SetFollowUp -->|Yes| SetFollowUpDate[Set Follow-up Date]
    SetFollowUp -->|No| SaveSession[Save Session]
    SetFollowUpDate --> SaveSession
    
    SaveSession --> ValidateSession{Validate<br/>Session}
    ValidateSession -->|Invalid| ShowErrors[Show Validation Errors]
    ValidateSession -->|Valid| SaveRecord[Save Session Record]
    ShowErrors --> ShowForm
    
    SaveRecord --> UpdateStats[Update Statistics]
    UpdateStats --> LogAudit[Log Audit Trail]
    LogAudit --> RefreshList[Refresh Session List]
    
    ViewSession --> LoadDetails[Load Session Details]
    LoadDetails --> ShowPatient[Show Patient Info]
    ShowPatient --> ShowSessionType[Show Session Type]
    ShowSessionType --> ShowTopics[Show Topics Covered]
    ShowTopics --> ShowDuration[Show Duration]
    ShowDuration --> ShowNotes[Show Notes]
    ShowNotes --> ShowSummary[Show Summary]
    ShowSummary --> ShowFollowUp[Show Follow-up Info]
    
    ScheduleFollowUp --> ShowFollowUpForm[Show Follow-up Form]
    ShowFollowUpForm --> SetDate[Set Follow-up Date]
    SetDate --> SetReminder[Set Reminder]
    SetReminder --> SaveFollowUp[Save Follow-up]
    SaveFollowUp --> RefreshList
    
    UpdateStatus --> LoadStatusForm[Load Status Form]
    LoadStatusForm --> UpdateStatusValue[Update Status]
    UpdateStatusValue --> SaveStatus[Save Status]
    SaveStatus --> RefreshList
    
    RefreshList --> DisplayList
```

---

## 11. 🔄 REFERRALS MODULE FLOWCHART

```mermaid
flowchart TD
    Start([Access Referrals Module]) --> CheckPermission{Check<br/>Permissions}
    CheckPermission -->|Denied| AccessDenied[Access Denied]
    CheckPermission -->|Allowed| LoadPage[Load Referrals Page]
    
    LoadPage --> DisplayList[Display Referrals List]
    DisplayList --> ShowFilters[Show Search & Status Filter]
    
    ShowFilters --> UserAction{User<br/>Action}
    UserAction -->|Search| Search[Search Referrals]
    UserAction -->|Filter| FilterStatus[Filter by Status]
    UserAction -->|Create| CreateReferral[Create Referral]
    UserAction -->|View| ViewReferral[View Referral Details]
    UserAction -->|Update| UpdateStatus[Update Referral Status]
    UserAction -->|Accept| AcceptReferral[Accept Referral]
    UserAction -->|Complete| CompleteReferral[Complete Referral]
    
    Search --> FilterResults[Filter Results]
    FilterStatus --> FilterResults
    FilterResults --> DisplayList
    
    CreateReferral --> ShowForm[Show Referral Form]
    ShowForm --> SelectPatient[Select Patient]
    SelectPatient --> SelectFromFacility[Select From Facility]
    SelectFromFacility --> SelectToFacility[Select To Facility]
    SelectToFacility --> EnterReason[Enter Referral Reason]
    EnterReason --> SetUrgency[Set Urgency Level]
    SetUrgency --> EnterNotes[Enter Notes]
    EnterNotes --> ValidateReferral{Validate<br/>Referral}
    
    ValidateReferral -->|Invalid| ShowErrors[Show Validation Errors]
    ValidateReferral -->|Valid| SetStatusPending[Set Status to Pending]
    ShowErrors --> ShowForm
    
    SetStatusPending --> SaveReferral[Save Referral]
    SaveReferral --> NotifyReceivingFacility[Notify Receiving Facility]
    NotifyReceivingFacility --> LogAudit[Log Audit Trail]
    LogAudit --> RefreshList[Refresh Referral List]
    
    ViewReferral --> LoadDetails[Load Referral Details]
    LoadDetails --> ShowPatient[Show Patient Info]
    ShowPatient --> ShowFromFacility[Show From Facility]
    ShowFromFacility --> ShowToFacility[Show To Facility]
    ShowToFacility --> ShowReason[Show Referral Reason]
    ShowReason --> ShowUrgency[Show Urgency Level]
    ShowUrgency --> ShowStatus[Show Current Status]
    ShowStatus --> ShowNotes[Show Notes]
    
    UpdateStatus --> ShowStatusForm[Show Status Form]
    ShowStatusForm --> SelectNewStatus[Select New Status]
    SelectNewStatus --> StatusTypes{Status<br/>Type}
    
    StatusTypes -->|Accepted| AcceptReferral
    StatusTypes -->|Completed| CompleteReferral
    StatusTypes -->|Rejected| RejectReferral[Reject Referral]
    
    AcceptReferral --> SetStatusAccepted[Set Status to Accepted]
    SetStatusAccepted --> UpdatePatientFacility[Update Patient Facility]
    UpdatePatientFacility --> SaveStatus[Save Status]
    
    CompleteReferral --> SetStatusCompleted[Set Status to Completed]
    SetStatusCompleted --> EnterCompletionNotes[Enter Completion Notes]
    EnterCompletionNotes --> SaveStatus
    
    RejectReferral --> SetStatusRejected[Set Status to Rejected]
    SetStatusRejected --> EnterRejectionReason[Enter Rejection Reason]
    EnterRejectionReason --> SaveStatus
    
    SaveStatus --> LogStatusAudit[Log Status Audit]
    LogStatusAudit --> RefreshList
    
    RefreshList --> DisplayList
```

---

## 12. ⭐ SATISFACTION SURVEYS MODULE FLOWCHART

```mermaid
flowchart TD
    Start([Access Surveys Module]) --> CheckRole{Check<br/>User Role}
    CheckRole -->|Patient| LoadPatientPage[Load Patient Page]
    CheckRole -->|Staff| LoadStaffPage[Load Staff Page]
    
    LoadPatientPage --> ShowSurveyForm[Show Survey Form]
    ShowSurveyForm --> UserAction{User<br/>Action}
    UserAction -->|Submit| SubmitSurvey[Submit Survey]
    UserAction -->|View Past| ViewPastSurveys[View Past Surveys]
    
    SubmitSurvey --> ShowQuestions[Show Survey Questions]
    ShowQuestions --> RateQ1[Rate Question 1: Service Quality]
    RateQ1 --> RateQ2[Rate Question 2: Staff Friendliness]
    RateQ2 --> RateQ3[Rate Question 3: Wait Time]
    RateQ3 --> RateQ4[Rate Question 4: Facility Cleanliness]
    RateQ4 --> RateQ5[Rate Question 5: Overall Satisfaction]
    RateQ5 --> AddComments[Add Comments Optional]
    AddComments --> SelectFacility[Select Facility]
    SelectFacility --> ValidateSurvey{Validate<br/>Survey}
    
    ValidateSurvey -->|Invalid| ShowErrors[Show Validation Errors]
    ValidateSurvey -->|Valid| SaveSurvey[Save Survey]
    ShowErrors --> ShowQuestions
    
    SaveSurvey --> CalculateAverage[Calculate Average Score]
    CalculateAverage --> LogAudit[Log Audit Trail]
    LogAudit --> ShowThankYou[Show Thank You Message]
    
    ViewPastSurveys --> DisplayPastSurveys[Display Past Surveys]
    
    LoadStaffPage --> CalculateAnalytics[Calculate Analytics]
    CalculateAnalytics --> DisplayStats[Display Statistics Cards]
    DisplayStats --> DisplayCharts[Display Satisfaction Charts]
    DisplayCharts --> DisplayList[Display Survey Responses List]
    
    DisplayList --> UserAction2{User<br/>Action}
    UserAction2 -->|View| ViewResponse[View Response Details]
    UserAction2 -->|Filter| FilterSurveys[Filter Surveys]
    UserAction2 -->|Export| ExportData[Export Survey Data]
    
    ViewResponse --> LoadResponseDetails[Load Response Details]
    LoadResponseDetails --> ShowPatient[Show Patient Info]
    ShowPatient --> ShowRatings[Show Individual Ratings]
    ShowRatings --> ShowAverage[Show Average Score]
    ShowAverage --> ShowComments[Show Comments]
    ShowComments --> ShowDate[Show Submission Date]
    
    FilterSurveys --> FilterByDate[Filter by Date Range]
    FilterByDate --> FilterByFacility[Filter by Facility]
    FilterByFacility --> FilterByRating[Filter by Rating]
    FilterByRating --> ApplyFilters[Apply Filters]
    ApplyFilters --> RefreshList[Refresh Survey List]
    
    ExportData --> GenerateReport[Generate Survey Report]
    GenerateReport --> DownloadCSV[Download CSV]
    
    RefreshList --> DisplayList
```

---

## 13. 👤 USER MANAGEMENT MODULE FLOWCHART

```mermaid
flowchart TD
    Start([Access User Management]) --> CheckPermission{Check<br/>Permissions}
    CheckPermission -->|Denied| AccessDenied[Access Denied - Admin Only]
    CheckPermission -->|Allowed| LoadPage[Load Users Page]
    
    LoadPage --> DisplayTable[Display Users Table]
    DisplayTable --> ShowFilters[Show Search & Role Filter]
    
    ShowFilters --> UserAction{User<br/>Action}
    UserAction -->|Search| Search[Search Users]
    UserAction -->|Filter| FilterRole[Filter by Role]
    UserAction -->|Add| AddUser[Add New User]
    UserAction -->|Edit| EditUser[Edit User]
    UserAction -->|Delete| DeleteUser[Delete User]
    UserAction -->|View| ViewUser[View User Details]
    
    Search --> FilterResults[Filter Results]
    FilterRole --> FilterResults
    FilterResults --> DisplayTable
    
    AddUser --> ShowForm[Show Add User Form]
    ShowForm --> EnterUsername[Enter Username]
    EnterUsername --> EnterPassword[Enter Password]
    EnterPassword --> EnterFullName[Enter Full Name]
    EnterFullName --> EnterEmail[Enter Email]
    EnterEmail --> SelectRole[Select Role]
    SelectRole --> SelectFacility[Select Facility]
    SelectFacility --> LinkPatient{Link to<br/>Patient?}
    
    LinkPatient -->|Yes| SelectPatient[Select Patient]
    LinkPatient -->|No| ValidateUser{Validate<br/>User Data}
    SelectPatient --> ValidateUser
    
    ValidateUser -->|Invalid| ShowErrors[Show Validation Errors]
    ValidateUser -->|Valid| CheckUsername{Check Username<br/>Uniqueness}
    ShowErrors --> ShowForm
    
    CheckUsername -->|Exists| ShowUsernameError[Show Username Exists Error]
    CheckUsername -->|Unique| SaveUser[Save User]
    ShowUsernameError --> ShowForm
    
    SaveUser --> HashPassword[Hash Password]
    HashPassword --> AssignPermissions[Assign Role Permissions]
    AssignPermissions --> LogAudit[Log Audit Trail]
    LogAudit --> RefreshTable[Refresh Users Table]
    
    EditUser --> LoadEditForm[Load Edit Form]
    LoadEditForm --> UpdateFields[Update User Fields]
    UpdateFields --> ValidateEdit{Validate<br/>Changes}
    ValidateEdit -->|Invalid| ShowErrorsEdit[Show Errors]
    ValidateEdit -->|Valid| SaveChanges[Save Changes]
    ShowErrorsEdit --> LoadEditForm
    
    SaveChanges --> UpdatePermissions{Update<br/>Permissions?}
    UpdatePermissions -->|Yes| UpdateRolePermissions[Update Role Permissions]
    UpdatePermissions -->|No| LogEditAudit[Log Edit Audit]
    UpdateRolePermissions --> LogEditAudit
    LogEditAudit --> RefreshTable
    
    DeleteUser --> ConfirmDelete{Confirm<br/>Deletion}
    ConfirmDelete -->|Cancel| DisplayTable
    ConfirmDelete -->|Confirm| CheckSelfDelete{Deleting<br/>Self?}
    
    CheckSelfDelete -->|Yes| ShowSelfDeleteError[Show Cannot Delete Self Error]
    CheckSelfDelete -->|No| CheckHasRecords{Check User<br/>Records}
    ShowSelfDeleteError --> DisplayTable
    
    CheckHasRecords -->|Has Records| ShowWarning[Show Warning]
    CheckHasRecords -->|No Records| RemoveUser[Remove User]
    ShowWarning --> DisplayTable
    
    RemoveUser --> LogDeleteAudit[Log Delete Audit]
    LogDeleteAudit --> RefreshTable
    
    ViewUser --> LoadDetails[Load User Details]
    LoadDetails --> ShowUsername[Show Username]
    ShowUsername --> ShowRole[Show Role]
    ShowRole --> ShowPermissions[Show Permissions]
    ShowPermissions --> ShowFacility[Show Facility]
    ShowFacility --> ShowActivity[Show Activity Log]
    
    RefreshTable --> DisplayTable
```

---

## 14. 🏢 FACILITY MANAGEMENT MODULE FLOWCHART

```mermaid
flowchart TD
    Start([Access Facility Management]) --> CheckPermission{Check<br/>Permissions}
    CheckPermission -->|Denied| AccessDenied[Access Denied - Admin Only]
    CheckPermission -->|Allowed| LoadPage[Load Facilities Page]
    
    LoadPage --> DisplayList[Display Facilities List]
    DisplayList --> ShowFilters[Show Search Filter]
    
    ShowFilters --> UserAction{User<br/>Action}
    UserAction -->|Search| Search[Search Facilities]
    UserAction -->|Add| AddFacility[Add New Facility]
    UserAction -->|Edit| EditFacility[Edit Facility]
    UserAction -->|Delete| DeleteFacility[Delete Facility]
    UserAction -->|View| ViewFacility[View Facility Details]
    
    Search --> FilterResults[Filter Results]
    FilterResults --> DisplayList
    
    AddFacility --> ShowForm[Show Add Facility Form]
    ShowForm --> EnterName[Enter Facility Name]
    EnterName --> EnterAddress[Enter Address]
    EnterAddress --> EnterCity[Enter City]
    EnterCity --> EnterPhone[Enter Phone Number]
    EnterPhone --> EnterEmail[Enter Email]
    EnterEmail --> SelectType[Select Facility Type]
    SelectType --> EnterCapacity[Enter Capacity Optional]
    EnterCapacity --> ValidateFacility{Validate<br/>Data}
    
    ValidateFacility -->|Invalid| ShowErrors[Show Validation Errors]
    ValidateFacility -->|Valid| SaveFacility[Save Facility]
    ShowErrors --> ShowForm
    
    SaveFacility --> GenerateFacilityId[Generate Facility ID]
    GenerateFacilityId --> LogAudit[Log Audit Trail]
    LogAudit --> RefreshList[Refresh Facilities List]
    
    EditFacility --> LoadEditForm[Load Edit Form]
    LoadEditForm --> UpdateFields[Update Facility Fields]
    UpdateFields --> ValidateEdit{Validate<br/>Changes}
    ValidateEdit -->|Invalid| ShowErrorsEdit[Show Errors]
    ValidateEdit -->|Valid| SaveChanges[Save Changes]
    ShowErrorsEdit --> LoadEditForm
    
    SaveChanges --> LogEditAudit[Log Edit Audit]
    LogEditAudit --> RefreshList
    
    DeleteFacility --> ConfirmDelete{Confirm<br/>Deletion}
    ConfirmDelete -->|Cancel| DisplayList
    ConfirmDelete -->|Confirm| CheckUsers{Check Facility<br/>Users}
    
    CheckUsers -->|Has Users| ShowWarning[Show Warning - Has Users]
    CheckUsers -->|No Users| CheckPatients{Check Facility<br/>Patients}
    ShowWarning --> DisplayList
    
    CheckPatients -->|Has Patients| ShowWarningPatients[Show Warning - Has Patients]
    CheckPatients -->|No Patients| RemoveFacility[Remove Facility]
    ShowWarningPatients --> DisplayList
    
    RemoveFacility --> LogDeleteAudit[Log Delete Audit]
    LogDeleteAudit --> RefreshList
    
    ViewFacility --> LoadDetails[Load Facility Details]
    LoadDetails --> ShowName[Show Facility Name]
    ShowName --> ShowAddress[Show Address]
    ShowAddress --> ShowContact[Show Contact Info]
    ShowContact --> ShowType[Show Facility Type]
    ShowType --> ShowUsers[Show Assigned Users]
    ShowUsers --> ShowPatients[Show Patient Count]
    
    RefreshList --> DisplayList
```

---

## 15. 📊 DASHBOARD MODULE FLOWCHART

```mermaid
flowchart TD
    Start([Access Dashboard]) --> CheckRole{Check<br/>User Role}
    CheckRole -->|Admin| LoadAdminDashboard[Load Admin Dashboard]
    CheckRole -->|Physician| LoadPhysicianDashboard[Load Physician Dashboard]
    CheckRole -->|Nurse| LoadNurseDashboard[Load Nurse Dashboard]
    CheckRole -->|Case Manager| LoadCaseManagerDashboard[Load Case Manager Dashboard]
    CheckRole -->|Lab Personnel| LoadLabDashboard[Load Lab Dashboard]
    CheckRole -->|Patient| LoadPatientDashboard[Load Patient Dashboard]
    
    LoadAdminDashboard --> CalculateAdminStats[Calculate Admin Statistics]
    CalculateAdminStats --> DisplayAdminStats[Display Admin Stats Cards]
    DisplayAdminStats --> DisplayAdminCharts[Display Admin Charts]
    DisplayAdminCharts --> DisplayAlerts[Display System Alerts]
    DisplayAlerts --> DisplayRecentActivity[Display Recent Activity]
    
    LoadPhysicianDashboard --> CalculatePhysicianStats[Calculate Physician Statistics]
    CalculatePhysicianStats --> DisplayPhysicianStats[Display Physician Stats]
    DisplayPhysicianStats --> DisplayARPAAlerts[Display ARPA Alerts]
    DisplayARPAAlerts --> DisplayRiskPanel[Display Patient Risk Panel]
    DisplayRiskPanel --> DisplayRecentActivity
    
    LoadNurseDashboard --> CalculateNurseStats[Calculate Nurse Statistics]
    CalculateNurseStats --> DisplayNurseStats[Display Nurse Stats]
    DisplayNurseStats --> DisplayCareAlerts[Display Care Coordination Alerts]
    DisplayCareAlerts --> DisplayRecentActivity
    
    LoadCaseManagerDashboard --> CalculateCaseManagerStats[Calculate Case Manager Statistics]
    CalculateCaseManagerStats --> DisplayCaseManagerStats[Display Case Manager Stats]
    DisplayCaseManagerStats --> DisplayCaseLoad[Display Case Load Overview]
    DisplayCaseLoad --> DisplayRecentActivity
    
    LoadLabDashboard --> CalculateLabStats[Calculate Lab Statistics]
    CalculateLabStats --> DisplayLabStats[Display Lab Stats]
    DisplayLabStats --> DisplayPendingTests[Display Pending Tests]
    DisplayPendingTests --> DisplayRecentActivity
    
    LoadPatientDashboard --> CalculatePatientStats[Calculate Patient Statistics]
    CalculatePatientStats --> DisplayPatientStats[Display Patient Stats]
    DisplayPatientStats --> DisplayUpcomingAppts[Display Upcoming Appointments]
    DisplayUpcomingAppts --> DisplayMedications[Display Medications]
    DisplayMedications --> DisplayLabResults[Display Lab Results]
    DisplayLabResults --> DisplayReminders[Display Reminders]
    
    DisplayRecentActivity --> UserAction{User<br/>Action}
    UserAction -->|View Stats| ViewStatsDetails[View Statistics Details]
    UserAction -->|View Alert| ViewAlertDetails[View Alert Details]
    UserAction -->|Navigate| NavigateToModule[Navigate to Module]
    UserAction -->|Refresh| RefreshDashboard[Refresh Dashboard]
    
    ViewStatsDetails --> ShowDetailedStats[Show Detailed Statistics]
    ViewAlertDetails --> ShowAlertDetails[Show Alert Details]
    NavigateToModule --> LoadModule[Load Module Page]
    RefreshDashboard --> RecalculateStats[Recalculate Statistics]
    RecalculateStats --> CheckRole
    
    DisplayAdminStats --> ShowTotalPatients[Show Total Patients]
    ShowTotalPatients --> ShowTotalAppointments[Show Total Appointments]
    ShowTotalAppointments --> ShowLowStockItems[Show Low Stock Items]
    ShowLowStockItems --> ShowPendingReferrals[Show Pending Referrals]
    
    DisplayARPAAlerts --> CheckHighRiskPatients[Check High Risk Patients]
    CheckHighRiskPatients -->|High Risk Found| ShowARPAAlert[Show ARPA Alert]
    CheckHighRiskPatients -->|No High Risk| ContinueDashboard[Continue Dashboard]
    ShowARPAAlert --> DisplayRiskPanel
    
    DisplayPatientStats --> ShowUpcomingAppts[Show Upcoming Appointments Count]
    ShowUpcomingAppts --> ShowActiveReminders[Show Active Reminders Count]
    ShowActiveReminders --> ShowAdherenceRate[Show Adherence Rate]
    ShowAdherenceRate --> ShowRecentResults[Show Recent Lab Results]
```

---

## 16. 📈 REPORTS MODULE FLOWCHART

```mermaid
flowchart TD
    Start([Access Reports Module]) --> CheckPermission{Check<br/>Permissions}
    CheckPermission -->|Denied| AccessDenied[Access Denied]
    CheckPermission -->|Allowed| LoadPage[Load Reports Page]
    
    LoadPage --> DisplayReports[Display Available Reports]
    DisplayReports --> ShowReportTypes[Show Report Types]
    
    ShowReportTypes --> UserAction{User<br/>Action}
    UserAction -->|Patient Demographics| GeneratePatientDemo[Generate Patient Demographics Report]
    UserAction -->|Adherence Trends| GenerateAdherence[Generate Adherence Trends Report]
    UserAction -->|Inventory Levels| GenerateInventory[Generate Inventory Report]
    UserAction -->|Appointment Attendance| GenerateAppointments[Generate Appointment Report]
    UserAction -->|Clinical Visits| GenerateVisits[Generate Clinical Visits Report]
    UserAction -->|Custom| GenerateCustom[Generate Custom Report]
    
    GeneratePatientDemo --> SelectDateRange[Select Date Range]
    SelectDateRange --> SelectFilters[Select Filters]
    SelectFilters --> GatherPatientData[Gather Patient Data]
    GatherPatientData --> CalculateDemographics[Calculate Demographics]
    CalculateDemographics --> GenerateChart[Generate Demographics Chart]
    GenerateChart --> DisplayReport[Display Report]
    
    GenerateAdherence --> SelectDateRange2[Select Date Range]
    SelectDateRange2 --> GatherAdherenceData[Gather Adherence Data]
    GatherAdherenceData --> CalculateTrends[Calculate Adherence Trends]
    CalculateTrends --> GenerateTrendChart[Generate Trend Chart]
    GenerateTrendChart --> DisplayReport
    
    GenerateInventory --> SelectFilters2[Select Filters]
    SelectFilters2 --> GatherInventoryData[Gather Inventory Data]
    GatherInventoryData --> CalculateStockLevels[Calculate Stock Levels]
    CalculateStockLevels --> GenerateStockChart[Generate Stock Chart]
    GenerateStockChart --> DisplayReport
    
    GenerateAppointments --> SelectDateRange3[Select Date Range]
    SelectDateRange3 --> GatherAppointmentData[Gather Appointment Data]
    GatherAppointmentData --> CalculateAttendance[Calculate Attendance Rates]
    CalculateAttendance --> GenerateAttendanceChart[Generate Attendance Chart]
    GenerateAttendanceChart --> DisplayReport
    
    GenerateVisits --> SelectDateRange4[Select Date Range]
    SelectDateRange4 --> GatherVisitData[Gather Visit Data]
    GatherVisitData --> CalculateVisitStats[Calculate Visit Statistics]
    CalculateVisitStats --> GenerateVisitChart[Generate Visit Chart]
    GenerateVisitChart --> DisplayReport
    
    GenerateCustom --> ShowCustomForm[Show Custom Report Form]
    ShowCustomForm --> SelectDataSources[Select Data Sources]
    SelectDataSources --> SelectMetrics[Select Metrics]
    SelectMetrics --> SelectVisualization[Select Visualization Type]
    SelectVisualization --> GenerateCustomReport[Generate Custom Report]
    GenerateCustomReport --> DisplayReport
    
    DisplayReport --> ReportActions{Report<br/>Actions}
    ReportActions -->|Export PDF| ExportPDF[Export to PDF]
    ReportActions -->|Export CSV| ExportCSV[Export to CSV]
    ReportActions -->|Export Excel| ExportExcel[Export to Excel]
    ReportActions -->|Print| PrintReport[Print Report]
    ReportActions -->|Share| ShareReport[Share Report]
    
    ExportPDF --> GeneratePDF[Generate PDF File]
    GeneratePDF --> DownloadPDF[Download PDF]
    
    ExportCSV --> GenerateCSV[Generate CSV File]
    GenerateCSV --> DownloadCSV[Download CSV]
    
    ExportExcel --> GenerateExcel[Generate Excel File]
    GenerateExcel --> DownloadExcel[Download Excel]
    
    PrintReport --> GeneratePrintView[Generate Print View]
    GeneratePrintView --> OpenPrintDialog[Open Print Dialog]
    
    ShareReport --> SelectShareMethod[Select Share Method]
    SelectShareMethod --> ShareViaEmail[Share via Email]
    ShareViaEmail --> SendReport[Send Report]
    
    DisplayReport --> LogAudit[Log Report Generation Audit]
    LogAudit --> RefreshReports[Refresh Reports List]
```

---

## 17. 🎓 EDUCATION MODULE FLOWCHART

```mermaid
flowchart TD
    Start([Access Education Module]) --> LoadPage[Load Education Page]
    LoadPage --> SelectTab{Select<br/>Tab}
    SelectTab -->|Modules| LearningModules[Learning Modules Tab]
    SelectTab -->|FAQs| FAQsTab[FAQs Tab]
    SelectTab -->|Forum| ForumTab[Community Forum Tab]
    
    LearningModules --> DisplayModules[Display Learning Modules]
    DisplayModules --> ShowSearch[Show Search Bar]
    
    ShowSearch --> UserAction{User<br/>Action}
    UserAction -->|Search| SearchModules[Search Modules]
    UserAction -->|Select| SelectModule[Select Module]
    UserAction -->|Filter| FilterCategory[Filter by Category]
    
    SearchModules --> FilterModuleResults[Filter Module Results]
    FilterCategory --> FilterModuleResults
    FilterModuleResults --> DisplayModules
    
    SelectModule --> LoadModuleContent[Load Module Content]
    LoadModuleContent --> ShowModuleTitle[Show Module Title]
    ShowModuleTitle --> ShowModuleDescription[Show Module Description]
    ShowModuleDescription --> ShowModuleContent[Show Module Content]
    ShowModuleContent --> ShowReadTime[Show Estimated Read Time]
    ShowReadTime --> MarkCompleted{Mark as<br/>Completed?}
    
    MarkCompleted -->|Yes| RecordCompletion[Record Completion]
    MarkCompleted -->|No| ContinueReading[Continue Reading]
    RecordCompletion --> UpdateProgress[Update Learning Progress]
    ContinueReading --> ShowModuleContent
    
    FAQsTab --> DisplayFAQs[Display FAQs]
    DisplayFAQs --> ShowCategories[Show FAQ Categories]
    
    ShowCategories --> UserAction2{User<br/>Action}
    UserAction2 -->|Search| SearchFAQs[Search FAQs]
    UserAction2 -->|Select| SelectFAQ[Select FAQ]
    UserAction2 -->|Filter| FilterFAQCategory[Filter by Category]
    
    SearchFAQs --> FilterFAQResults[Filter FAQ Results]
    FilterFAQCategory --> FilterFAQResults
    FilterFAQResults --> DisplayFAQs
    
    SelectFAQ --> ExpandFAQ[Expand FAQ]
    ExpandFAQ --> ShowQuestion[Show Question]
    ShowQuestion --> ShowAnswer[Show Answer]
    ShowAnswer --> WasHelpful{Was<br/>Helpful?}
    
    WasHelpful -->|Yes| RecordHelpful[Record Helpful]
    WasHelpful -->|No| RecordNotHelpful[Record Not Helpful]
    RecordHelpful --> DisplayFAQs
    RecordNotHelpful --> DisplayFAQs
    
    ForumTab --> DisplayForum[Display Community Forum]
    DisplayForum --> ShowCategoriesForum[Show Forum Categories]
    
    ShowCategoriesForum --> UserAction3{User<br/>Action}
    UserAction3 -->|View| ViewPosts[View Posts]
    UserAction3 -->|Create| CreatePost[Create Post]
    UserAction3 -->|Reply| ReplyToPost[Reply to Post]
    
    ViewPosts --> LoadPosts[Load Posts]
    LoadPosts --> DisplayPostList[Display Post List]
    DisplayPostList --> SelectPost[Select Post]
    SelectPost --> ShowPostDetails[Show Post Details]
    ShowPostDetails --> ShowReplies[Show Replies]
    
    CreatePost --> ShowPostForm[Show Post Form]
    ShowPostForm --> EnterTitle[Enter Post Title]
    EnterTitle --> EnterContent[Enter Post Content]
    EnterContent --> SelectCategory[Select Category]
    SelectCategory --> SubmitPost[Submit Post]
    SubmitPost --> ValidatePost{Validate<br/>Post}
    
    ValidatePost -->|Invalid| ShowErrors[Show Validation Errors]
    ValidatePost -->|Valid| SavePost[Save Post]
    ShowErrors --> ShowPostForm
    
    SavePost --> LogAudit[Log Audit Trail]
    LogAudit --> RefreshForum[Refresh Forum]
    
    ReplyToPost --> ShowReplyForm[Show Reply Form]
    ShowReplyForm --> EnterReply[Enter Reply Content]
    EnterReply --> SubmitReply[Submit Reply]
    SubmitReply --> SaveReply[Save Reply]
    SaveReply --> RefreshForum
    
    RefreshForum --> DisplayForum
```

---

## 18. 💉 VACCINATIONS MODULE FLOWCHART

```mermaid
flowchart TD
    Start([Access Vaccinations Module]) --> CheckRole{Check<br/>User Role}
    CheckRole -->|Patient| LoadPatientPage[Load Patient Page]
    CheckRole -->|Staff| LoadStaffPage[Load Staff Page]
    
    LoadPatientPage --> DisplayMyVaccines[Display My Vaccinations]
    DisplayMyVaccines --> ShowUpcoming[Show Upcoming Vaccinations]
    ShowUpcoming --> UserAction{User<br/>Action}
    UserAction -->|View| ViewVaccine[View Vaccination Details]
    UserAction -->|Request| RequestVaccine[Request Vaccination]
    
    ViewVaccine --> LoadVaccineDetails[Load Vaccination Details]
    LoadVaccineDetails --> ShowVaccineName[Show Vaccine Name]
    ShowVaccineName --> ShowDose[Show Dose Number]
    ShowDose --> ShowDateGiven[Show Date Given]
    ShowDateGiven --> ShowNextDose[Show Next Dose Date]
    ShowNextDose --> ShowStatus[Show Status]
    ShowStatus --> ShowProvider[Show Provider]
    
    RequestVaccine --> ShowRequestForm[Show Request Form]
    ShowRequestForm --> SelectVaccine[Select Vaccine Type]
    SelectVaccine --> EnterReason[Enter Reason]
    EnterReason --> SubmitRequest[Submit Request]
    SubmitRequest --> SaveRequest[Save Request]
    SaveRequest --> NotifyStaff[Notify Staff]
    
    LoadStaffPage --> DisplayVaccinesList[Display Vaccinations List]
    DisplayVaccinesList --> ShowFilters[Show Search Filter]
    
    ShowFilters --> UserAction2{User<br/>Action}
    UserAction2 -->|Search| SearchVaccines[Search Vaccinations]
    UserAction2 -->|Record| RecordVaccination[Record Vaccination]
    UserAction2 -->|View| ViewVaccination[View Vaccination]
    UserAction2 -->|Edit| EditVaccination[Edit Vaccination]
    UserAction2 -->|Schedule| ScheduleNextDose[Schedule Next Dose]
    
    SearchVaccines --> FilterResults[Filter Results]
    FilterResults --> DisplayVaccinesList
    
    RecordVaccination --> ShowRecordForm[Show Record Form]
    ShowRecordForm --> SelectPatient[Select Patient]
    SelectPatient --> SelectVaccineType[Select Vaccine Type]
    SelectVaccineType --> EnterDoseNumber[Enter Dose Number]
    EnterDoseNumber --> EnterTotalDoses[Enter Total Doses]
    EnterTotalDoses --> EnterDateGiven[Enter Date Given]
    EnterDateGiven --> EnterBatchNumber[Enter Batch Number]
    EnterBatchNumber --> EnterManufacturer[Enter Manufacturer]
    EnterManufacturer --> EnterSite[Enter Administration Site]
    EnterSite --> EnterProvider[Select Provider]
    EnterProvider --> CalculateNextDose[Calculate Next Dose Date]
    CalculateNextDose --> ValidateVaccination{Validate<br/>Data}
    
    ValidateVaccination -->|Invalid| ShowErrors[Show Validation Errors]
    ValidateVaccination -->|Valid| SaveVaccination[Save Vaccination]
    ShowErrors --> ShowRecordForm
    
    SaveVaccination --> SetStatus[Set Status to Completed]
    SetStatus --> CheckNextDose{Has Next<br/>Dose?}
    CheckNextDose -->|Yes| ScheduleNextDose2[Schedule Next Dose]
    CheckNextDose -->|No| MarkComplete[Mark Series Complete]
    ScheduleNextDose2 --> SetNextDoseDate[Set Next Dose Date]
    SetNextDoseDate --> CreateReminder[Create Reminder]
    CreateReminder --> LogAudit[Log Audit Trail]
    MarkComplete --> LogAudit
    
    LogAudit --> RefreshList[Refresh Vaccinations List]
    
    ViewVaccination --> LoadDetails[Load Vaccination Details]
    LoadDetails --> ShowPatientInfo[Show Patient Info]
    ShowPatientInfo --> ShowVaccineInfo[Show Vaccine Info]
    ShowVaccineInfo --> ShowDoseInfo[Show Dose Information]
    ShowDoseInfo --> ShowAdministrationInfo[Show Administration Info]
    ShowAdministrationInfo --> ShowNextDoseInfo[Show Next Dose Info]
    
    EditVaccination --> LoadEditForm[Load Edit Form]
    LoadEditForm --> UpdateFields[Update Fields]
    UpdateFields --> ValidateEdit{Validate<br/>Changes}
    ValidateEdit -->|Invalid| ShowErrorsEdit[Show Errors]
    ValidateEdit -->|Valid| SaveChanges[Save Changes]
    ShowErrorsEdit --> LoadEditForm
    SaveChanges --> LogEditAudit[Log Edit Audit]
    LogEditAudit --> RefreshList
    
    ScheduleNextDose --> ShowScheduleForm[Show Schedule Form]
    ShowScheduleForm --> SetDate[Set Next Dose Date]
    SetDate --> SetReminder[Set Reminder]
    SetReminder --> SaveSchedule[Save Schedule]
    SaveSchedule --> RefreshList
    
    RefreshList --> DisplayVaccinesList
```

---

## 19. 📋 AUDIT TRAIL MODULE FLOWCHART

```mermaid
flowchart TD
    Start([Access Audit Trail Module]) --> CheckRole{Check<br/>User Role}
    CheckRole -->|Admin| LoadAdminPage[Load Admin Audit Trail]
    CheckRole -->|Other| LoadUserPage[Load User Activity Log]
    
    LoadAdminPage --> DisplayAllLogs[Display All System Logs]
    LoadUserPage --> DisplayUserLogs[Display User's Own Logs]
    
    DisplayAllLogs --> ShowFilters[Show Filters]
    DisplayUserLogs --> ShowFilters
    
    ShowFilters --> UserAction{User<br/>Action}
    UserAction -->|Filter| FilterLogs[Filter Logs]
    UserAction -->|Search| SearchLogs[Search Logs]
    UserAction -->|Export| ExportLogs[Export Audit Log]
    UserAction -->|Clear| ClearOldLogs[Clear Old Logs]
    UserAction -->|View| ViewLogDetails[View Log Details]
    
    FilterLogs --> FilterByAction[Filter by Action Type]
    FilterByAction --> FilterByModule[Filter by Module]
    FilterByModule --> FilterByDate[Filter by Date Range]
    FilterByDate --> FilterByUser[Filter by User]
    FilterByUser --> ApplyFilters[Apply Filters]
    ApplyFilters --> RefreshDisplay[Refresh Display]
    
    SearchLogs --> EnterSearchTerm[Enter Search Term]
    EnterSearchTerm --> SearchInLogs[Search in Logs]
    SearchInLogs --> DisplayResults[Display Search Results]
    
    ExportLogs --> SelectFormat[Select Export Format]
    SelectFormat --> FormatTypes{Format<br/>Type}
    FormatTypes -->|CSV| GenerateCSV[Generate CSV]
    FormatTypes -->|PDF| GeneratePDF[Generate PDF]
    FormatTypes -->|Excel| GenerateExcel[Generate Excel]
    
    GenerateCSV --> DownloadCSV[Download CSV File]
    GeneratePDF --> DownloadPDF[Download PDF File]
    GenerateExcel --> DownloadExcel[Download Excel File]
    
    ClearOldLogs --> ConfirmClear{Confirm<br/>Clear Old Logs?}
    ConfirmClear -->|Cancel| DisplayAllLogs
    ConfirmClear -->|Confirm| SelectRetention[Select Retention Period]
    SelectRetention --> ClearLogs[Clear Logs Older Than Period]
    ClearLogs --> LogClearAction[Log Clear Action]
    LogClearAction --> RefreshDisplay
    
    ViewLogDetails --> LoadLogDetails[Load Log Details]
    LoadLogDetails --> ShowTimestamp[Show Timestamp]
    ShowTimestamp --> ShowUser[Show User Info]
    ShowUser --> ShowAction[Show Action Type]
    ShowAction --> ShowModule[Show Module]
    ShowModule --> ShowEntity[Show Entity]
    ShowEntity --> ShowDetails[Show Action Details]
    ShowDetails --> ShowIPAddress[Show IP Address]
    ShowIPAddress --> ShowDevice[Show Device Info]
    ShowDevice --> ShowStatus[Show Action Status]
    
    RefreshDisplay --> DisplayFilteredLogs[Display Filtered Logs]
    DisplayFilteredLogs --> ShowLogEntry[Show Log Entry]
    ShowLogEntry --> ShowActionBadge[Show Action Badge]
    ShowActionBadge --> ShowModuleBadge[Show Module Badge]
    ShowModuleBadge --> ShowStatusBadge[Show Status Badge]
    ShowStatusBadge --> ShowDateTime[Show Date/Time]
    ShowDateTime --> ShowUserInfo[Show User Info]
    ShowUserInfo --> ShowDescription[Show Description]
    
    AutoLogAction[Auto-Log System Action] --> CreateLogEntry[Create Log Entry]
    CreateLogEntry --> SetTimestamp[Set Timestamp]
    SetTimestamp --> SetUser[Set User Info]
    SetUser --> SetAction[Set Action Type]
    SetAction --> SetModule[Set Module]
    SetModule --> SetEntity[Set Entity]
    SetEntity --> SetDetails[Set Action Details]
    SetDetails --> SetIP[Set IP Address]
    SetIP --> SetDevice[Set Device Info]
    SetDevice --> SetStatus[Set Status]
    SetStatus --> SaveLog[Save Log Entry]
    SaveLog --> StoreInStorage[Store in LocalStorage]
```

---

## 20. 🤖 ARPA MODULE FLOWCHART

```mermaid
flowchart TD
    Start([Access ARPA Risk Assessment]) --> CheckPermission{Check<br/>Permissions}
    CheckPermission -->|Denied| AccessDenied[Access Denied]
    CheckPermission -->|Allowed| SelectPatient[Select Patient]
    
    SelectPatient --> CalculateRisk[Calculate Risk Score]
    CalculateRisk --> GatherData[Gather Patient Data]
    
    GatherData --> GetMedications[Get Medication Data]
    GetMedications --> GetAppointments[Get Appointment Data]
    GetAppointments --> GetLabTests[Get Lab Test Data]
    GetLabTests --> GetVisits[Get Visit Data]
    
    GetMedications --> ScoreMissedMeds[Score Missed Medications]
    ScoreMissedMeds --> CalculateMedScore[Calculate Medication Score]
    
    GetAppointments --> ScoreMissedAppts[Score Missed Appointments]
    ScoreMissedAppts --> CalculateApptScore[Calculate Appointment Score]
    
    GetLabTests --> ScoreLabCompliance[Score Lab Compliance]
    ScoreLabCompliance --> CalculateLabScore[Calculate Lab Score]
    
    GetVisits --> ScoreTimeSinceVisit[Score Time Since Last Visit]
    ScoreTimeSinceVisit --> CalculateVisitScore[Calculate Visit Score]
    
    CalculateMedScore --> ApplyWeights[Apply Component Weights]
    CalculateApptScore --> ApplyWeights
    CalculateLabScore --> ApplyWeights
    CalculateVisitScore --> ApplyWeights
    
    ApplyWeights --> CalculateTotalScore[Calculate Total Risk Score]
    CalculateTotalScore --> DetermineLevel{Determine<br/>Risk Level}
    
    DetermineLevel -->|0-24| LowRisk[Low Risk]
    DetermineLevel -->|25-49| MediumRisk[Medium Risk]
    DetermineLevel -->|50-74| HighRisk[High Risk]
    DetermineLevel -->|75-100| CriticalRisk[Critical Risk]
    
    LowRisk --> GenerateRecommendations[Generate Recommendations]
    MediumRisk --> GenerateRecommendations
    HighRisk --> GenerateRecommendations
    CriticalRisk --> GenerateRecommendations
    
    GenerateRecommendations --> ShowRiskDetails[Show Risk Details]
    ShowRiskDetails --> DisplayScore[Display Risk Score]
    DisplayScore --> DisplayLevel[Display Risk Level]
    DisplayLevel --> DisplayComponents[Display Component Scores]
    DisplayComponents --> DisplayProgressBars[Display Progress Bars]
    DisplayProgressBars --> DisplayRecommendations[Display Recommendations]
    DisplayRecommendations --> DisplayTrendChart[Display Trend Chart]
    
    DisplayTrendChart --> ShowSixMonthTrend[Show 6-Month Trend]
    ShowSixMonthTrend --> ShowActionButtons[Show Action Buttons]
    
    ShowActionButtons --> UserAction{User<br/>Action}
    UserAction -->|Schedule Appt| ScheduleAppointment[Schedule Appointment]
    UserAction -->|Create Reminder| CreateReminder[Create Medication Reminder]
    UserAction -->|Document| DocumentIntervention[Document Intervention]
    UserAction -->|Monitor| SetMonitorFlag[Set Monitor Flag]
    
    ScheduleAppointment --> NavigateToAppts[Navigate to Appointments]
    CreateReminder --> NavigateToReminders[Navigate to Reminders]
    DocumentIntervention --> CreateNote[Create Clinical Note]
    SetMonitorFlag --> UpdatePatientFlag[Update Patient Flag]
    
    UpdatePatientFlag --> GenerateAlert[Generate Alert]
    GenerateAlert --> ShowDashboardAlert[Show Dashboard Alert]
    
    CalculateRisk --> AutoCalculate{Auto-Calculate<br/>on Events}
    AutoCalculate -->|Medication Missed| TriggerRecalc[Trigger Recalculation]
    AutoCalculate -->|Appointment Missed| TriggerRecalc
    AutoCalculate -->|Lab Overdue| TriggerRecalc
    AutoCalculate -->|Visit Overdue| TriggerRecalc
    
    TriggerRecalc --> CalculateRisk
    
    ShowRiskDetails --> LogAccess[Log ARPA Access]
    LogAccess --> StoreInHistory[Store in History]
    StoreInHistory --> UpdateDashboard[Update Dashboard]
```

---

## 📊 MODULE SUMMARY TABLE

| Module | Primary Functions | Key Features | Access Roles |
|--------|------------------|-------------|--------------|
| **Patients** | CRUD, Registration, ARPA | UIC Generation, Demographics, Medical History | Admin, Physician, Nurse, Case Manager, Lab Personnel |
| **Appointments** | Scheduling, Calendar, Reminders | Interactive Calendar, Status Tracking, Browser Notifications | All Roles |
| **Clinical Visits** | Visit Recording, Vital Signs | BMI Calculation, WHO Staging, Export | Admin, Physician, Nurse |
| **Prescriptions** | Create, View, Print | Multi-drug, Auto Reminders, Print Template | Physician (Create), All (View) |
| **Medication Reminders** | Reminder Management, Adherence | Browser Notifications, Sound Alerts, Adherence Tracking | Patient Only |
| **Inventory** | Stock Management, Alerts | Low Stock Alerts, Expiry Monitoring, Restock | Admin, Nurse (Manage), Physician (View) |
| **ART Regimens** | Regimen Management, Adherence | Multi-drug Tracking, Status Workflow, Adherence | Admin, Physician, Nurse |
| **Lab Tests** | Test Entry, Result Management | Multiple Test Types, Critical Value Alerts, Print | Lab Personnel (Create), Admin, Physician (View) |
| **HTS Sessions** | Testing Sessions, Counseling | Pre/Post Counseling, Test Results, Linkage to Care | Admin, Physician, Nurse, Case Manager, Lab Personnel |
| **Counseling** | Session Recording, Follow-ups | Multiple Types, Topic Tracking, Follow-up Alerts | Admin, Physician, Case Manager |
| **Referrals** | Inter-facility Transfers | Urgency Levels, Status Workflow, Facility Tracking | Admin, Case Manager |
| **Satisfaction Surveys** | Patient Feedback, Analytics | 5-Question Survey, Charts, Analytics | Patient (Submit), Staff (View Analytics) |
| **User Management** | User CRUD, Role Management | Role Permissions, Facility Assignment, Password Management | Admin Only |
| **Facility Management** | Facility CRUD | Address, Contact Info, Capacity | Admin Only |
| **Dashboard** | Role-based Analytics | Real-time Stats, Charts, Alerts, Activity Feed | All Roles |
| **Reports** | Report Generation, Export | Multiple Report Types, PDF/CSV/Excel Export | Admin, Staff |
| **Education** | Learning Modules, FAQs, Forum | Interactive Modules, Searchable FAQs, Community Forum | All Roles |
| **Vaccinations** | Vaccination Records, Scheduling | Dose Tracking, Next Dose Reminders, Status Management | Patient (View), Staff (Manage) |
| **Audit Trail** | Activity Logging, Compliance | Action Tracking, Filtering, Export | Admin (All), Others (Own) |
| **ARPA** | Risk Prediction, Alerts | Real-time Calculation, Component Scores, Recommendations | Admin, Physician |

---

**Document Version**: 2.0  
**Last Updated**: 2024  
**System**: MyHubCares Healthcare Management Platform

