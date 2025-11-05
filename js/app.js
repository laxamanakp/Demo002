// ============================================================
// MyHubCares - Main Application Logic & Routing
// ============================================================

const App = {
    currentPage: 'dashboard',
    currentUser: null,

    // Initialize the application
    init() {
        this.currentUser = Auth.getCurrentUser();
        
        if (!this.currentUser) {
            window.location.href = 'index.html';
            return;
        }

        this.setupUI();
        this.setupEventListeners();
        this.loadPage('dashboard');
    },

    // Setup UI elements
    setupUI() {
        // Set user info in topbar
        document.getElementById('userName').textContent = this.currentUser.fullName;
        document.getElementById('userRole').textContent = this.currentUser.role.replace('_', ' ');
        
        // Set user initials
        const initials = this.currentUser.fullName.split(' ').map(n => n[0]).join('');
        document.getElementById('userInitials').textContent = initials;

        // Load navigation menu
        this.loadNavigationMenu();

        // Load notifications
        this.loadNotifications();
    },

    // Setup event listeners
    setupEventListeners() {
        // Logout button
        document.getElementById('logoutBtn').addEventListener('click', () => {
            Auth.logout();
        });

        // Menu toggle for mobile
        document.getElementById('menuToggle').addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('active');
        });

        // Notification button
        document.getElementById('notificationBtn').addEventListener('click', () => {
            document.getElementById('notificationPanel').classList.toggle('active');
        });

        // Close notifications
        document.getElementById('closeNotifications').addEventListener('click', () => {
            document.getElementById('notificationPanel').classList.remove('active');
        });

        // Handle hash changes for routing
        window.addEventListener('hashchange', () => {
            const page = window.location.hash.slice(1) || 'dashboard';
            this.loadPage(page);
        });
    },

    // Load navigation menu based on role
    loadNavigationMenu() {
        const navContainer = document.getElementById('sidebarNav');
        const menuItems = Auth.getNavigationMenu(this.currentUser.role);
        
        let html = '';
        menuItems.forEach(item => {
            html += `
                <div class="nav-item" data-page="${item.id}">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        ${Auth.getIcon(item.icon)}
                    </svg>
                    <span>${item.label}</span>
                </div>
            `;
        });
        
        navContainer.innerHTML = html;

        // Add click handlers to nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const page = e.currentTarget.getAttribute('data-page');
                window.location.hash = page;
            });
        });
    },

    // Load page content
    loadPage(page) {
        this.currentPage = page;
        document.getElementById('pageTitle').textContent = this.getPageTitle(page);
        
        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => {
            if (item.getAttribute('data-page') === page) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Load page content
        const contentArea = document.getElementById('contentArea');
        
        switch (page) {
            case 'dashboard':
                this.loadDashboard(contentArea);
                break;
            case 'patients':
                Patients.loadPatientsPage(contentArea);
                break;
            case 'appointments':
                Appointments.loadAppointmentsPage(contentArea);
                break;
            case 'inventory':
                Inventory.loadInventoryPage(contentArea);
                break;
            case 'prescriptions':
                Prescriptions.loadPrescriptionsPage(contentArea);
                break;
            case 'lab-tests':
            case 'lab-results':
                this.loadLabTestsPage(contentArea);
                break;
            case 'reminders':
                Reminders.loadRemindersPage(contentArea);
                break;
            case 'education':
                Education.loadEducationPage(contentArea);
                break;
            case 'users':
                Admin.loadUsersPage(contentArea);
                break;
            case 'facilities':
                Admin.loadFacilitiesPage(contentArea);
                break;
            case 'profile':
                this.loadProfilePage(contentArea);
                break;
            case 'reports':
                this.loadReportsPage(contentArea);
                break;
            case 'referrals':
                this.loadReferralsPage(contentArea);
                break;
            case 'visits':
                Visits.loadVisitsPage(contentArea);
                break;
            case 'art-regimen':
                ARTRegimen.loadARTPage(contentArea);
                break;
            case 'hts':
                HTS.loadHTSPage(contentArea);
                break;
            case 'counseling':
                Counseling.loadCounselingPage(contentArea);
                break;
            case 'surveys':
                Surveys.loadSurveysPage(contentArea);
                break;
            default:
                contentArea.innerHTML = '<div class="alert alert-warning">Page not found</div>';
        }
    },

    // Get page title
    getPageTitle(page) {
        const titles = {
            dashboard: 'Dashboard',
            patients: 'Patient Management',
            appointments: 'Appointments',
            inventory: 'Inventory Management',
            prescriptions: 'Prescriptions',
            'lab-tests': 'Laboratory Tests',
            'lab-results': 'Lab Results',
            reminders: 'Medication Reminders',
            education: 'Health Education',
            users: 'User Management',
            facilities: 'Facility Management',
            profile: 'My Profile',
            reports: 'Reports',
            referrals: 'Patient Referrals',
            visits: 'Clinical Visits',
            'art-regimen': 'ART Regimen Management',
            hts: 'HIV Testing Services',
            counseling: 'Counseling Sessions',
            surveys: 'Satisfaction Surveys'
        };
        return titles[page] || 'MyHubCares';
    },

    // Load dashboard based on role
    loadDashboard(container) {
        const role = this.currentUser.role;
        
        if (role === 'patient') {
            this.loadPatientDashboard(container);
        } else if (Auth.permissions.canAccessWorkerDashboard(role)) {
            Dashboard.loadWorkerDashboard(container);
        } else {
            container.innerHTML = '<div class="alert alert-info">Welcome to MyHubCares - Your Partner in Sexual Health and Wellness</div>';
        }
    },

    // Load patient dashboard
    loadPatientDashboard(container) {
        const patientId = this.currentUser.patientId;
        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const patient = patients.find(p => p.id === patientId);
        
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        const upcomingAppointments = appointments.filter(a => 
            a.patientId === patientId && 
            new Date(a.appointmentDate) >= new Date() &&
            a.status === 'scheduled'
        );

        const reminders = JSON.parse(localStorage.getItem('reminders')) || [];
        const activeReminders = reminders.filter(r => r.patientId === patientId && r.active);

        const prescriptions = JSON.parse(localStorage.getItem('prescriptions')) || [];
        const recentPrescriptions = prescriptions.filter(p => p.patientId === patientId).slice(0, 3);

        let html = `
            <div class="dashboard-header">
                <h2>Welcome back, ${patient ? patient.firstName : 'Patient'}!</h2>
                <p>Here's your health summary</p>
            </div>

            <div class="dashboard-grid">
                <div class="stat-card">
                    <div class="stat-card-header">
                        <div>
                            <div class="stat-value">${upcomingAppointments.length}</div>
                            <div class="stat-label">Upcoming Appointments</div>
                        </div>
                        <div class="stat-card-icon primary">📅</div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-card-header">
                        <div>
                            <div class="stat-value">${activeReminders.length}</div>
                            <div class="stat-label">Active Reminders</div>
                        </div>
                        <div class="stat-card-icon success">🔔</div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-card-header">
                        <div>
                            <div class="stat-value">${recentPrescriptions.length}</div>
                            <div class="stat-label">Active Prescriptions</div>
                        </div>
                        <div class="stat-card-icon warning">💊</div>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Upcoming Appointments</h3>
                    <button class="btn btn-primary btn-sm" onclick="window.location.hash='appointments'">
                        Book Appointment
                    </button>
                </div>
                <div class="card-body">
                    ${upcomingAppointments.length > 0 ? this.renderAppointmentList(upcomingAppointments) : '<p class="text-muted">No upcoming appointments</p>'}
                </div>
            </div>

            <div class="card mt-3">
                <div class="card-header">
                    <h3 class="card-title">Today's Medications</h3>
                </div>
                <div class="card-body">
                    ${activeReminders.length > 0 ? this.renderReminderList(activeReminders) : '<p class="text-muted">No medication reminders set</p>'}
                </div>
            </div>
        `;

        container.innerHTML = html;
    },

    // Render appointment list
    renderAppointmentList(appointments) {
        const facilities = JSON.parse(localStorage.getItem('facilities')) || [];
        const users = JSON.parse(localStorage.getItem('users')) || [];

        return appointments.map(apt => {
            const facility = facilities.find(f => f.id === apt.facilityId);
            const provider = users.find(u => u.id === apt.providerId);
            const date = new Date(apt.appointmentDate);

            return `
                <div class="patient-card">
                    <div class="patient-info">
                        <div>
                            <strong>${date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>
                            <div class="patient-meta">
                                <span>🕐 ${apt.appointmentTime}</span>
                                <span>📍 ${facility ? facility.name : 'N/A'}</span>
                                <span>👨‍⚕️ ${provider ? provider.fullName : 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                    <span class="badge badge-primary">${apt.type}</span>
                </div>
            `;
        }).join('');
    },

    // Render reminder list
    renderReminderList(reminders) {
        return reminders.map(reminder => {
            return `
                <div class="reminder-card">
                    <div class="reminder-info">
                        <h4>${reminder.drugName}</h4>
                        <p class="text-muted">Take at ${reminder.time} ${reminder.frequency}</p>
                    </div>
                    <div class="reminder-time">
                        ${reminder.time}
                    </div>
                </div>
            `;
        }).join('');
    },

    // Load lab tests page
    loadLabTestsPage(container) {
        const role = this.currentUser.role;
        const labTests = JSON.parse(localStorage.getItem('labTests')) || [];
        const patients = JSON.parse(localStorage.getItem('patients')) || [];

        let filteredTests = labTests;
        if (role === 'patient') {
            filteredTests = labTests.filter(t => t.patientId === this.currentUser.patientId);
        }

        let html = `
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Laboratory Tests</h3>
                    ${Auth.permissions.canManageLabTests(role) ? 
                        '<button class="btn btn-primary btn-sm" onclick="App.showAddLabTestModal()">Add Test Result</button>' : 
                        ''}
                </div>
                <div class="card-body">
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    ${role !== 'patient' ? '<th>Patient</th>' : ''}
                                    <th>Test Name</th>
                                    <th>Result</th>
                                    <th>Date</th>
                                    <th>Lab Code</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${filteredTests.map(test => {
                                    const patient = patients.find(p => p.id === test.patientId);
                                    return `
                                        <tr>
                                            ${role !== 'patient' ? `<td>${patient ? patient.firstName + ' ' + patient.lastName : 'N/A'}</td>` : ''}
                                            <td>${test.testName}</td>
                                            <td><strong>${test.resultValue} ${test.resultUnit || ''}</strong></td>
                                            <td>${new Date(test.dateDone).toLocaleDateString()}</td>
                                            <td>${test.labCode}</td>
                                        </tr>
                                    `;
                                }).join('') || '<tr><td colspan="5" class="text-center text-muted">No lab tests found</td></tr>'}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;
    },

    // Load profile page
    loadProfilePage(container) {
        const patientId = this.currentUser.patientId;
        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const patient = patients.find(p => p.id === patientId);

        if (!patient) {
            container.innerHTML = '<div class="alert alert-warning">Patient profile not found</div>';
            return;
        }

        let html = `
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">My Profile</h3>
                </div>
                <div class="card-body">
                    <div class="form-row">
                        <div class="form-group">
                            <label>First Name</label>
                            <input type="text" value="${patient.firstName}" readonly>
                        </div>
                        <div class="form-group">
                            <label>Last Name</label>
                            <input type="text" value="${patient.lastName}" readonly>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Date of Birth</label>
                            <input type="date" value="${patient.birthDate}" readonly>
                        </div>
                        <div class="form-group">
                            <label>Sex</label>
                            <input type="text" value="${patient.sex === 'M' ? 'Male' : 'Female'}" readonly>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Contact Phone</label>
                            <input type="text" value="${patient.contactPhone || 'N/A'}" readonly>
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" value="${patient.email || 'N/A'}" readonly>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Address</label>
                        <input type="text" value="${patient.currentCity}, ${patient.currentProvince}" readonly>
                    </div>
                    <div class="form-group">
                        <label>UIC</label>
                        <input type="text" value="${patient.uic || 'N/A'}" readonly>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;
    },

    // Load reports page
    loadReportsPage(container) {
        let html = `
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">System Reports</h3>
                </div>
                <div class="card-body">
                    <div class="dashboard-grid">
                        <div class="module-card">
                            <div class="module-content">
                                <h3 class="module-title">Patient Statistics</h3>
                                <p class="module-description">View patient enrollment and demographic reports</p>
                                <button class="btn btn-primary btn-sm" onclick="App.generateReport('patient-stats')">Generate Report</button>
                            </div>
                        </div>
                        <div class="module-card">
                            <div class="module-content">
                                <h3 class="module-title">Adherence Report</h3>
                                <p class="module-description">Review medication adherence and compliance</p>
                                <button class="btn btn-primary btn-sm" onclick="App.generateReport('adherence')">Generate Report</button>
                            </div>
                        </div>
                        <div class="module-card">
                            <div class="module-content">
                                <h3 class="module-title">Inventory Report</h3>
                                <p class="module-description">Check stock levels and consumption patterns</p>
                                <button class="btn btn-primary btn-sm" onclick="App.generateReport('inventory')">Generate Report</button>
                            </div>
                        </div>
                        <div class="module-card">
                            <div class="module-content">
                                <h3 class="module-title">Appointment Report</h3>
                                <p class="module-description">View appointment statistics and attendance rates</p>
                                <button class="btn btn-primary btn-sm" onclick="App.generateReport('appointments')">Generate Report</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;
    },

    // Load referrals page (Case Manager)
    loadReferralsPage(container) {
        const referrals = JSON.parse(localStorage.getItem('referrals')) || [];
        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const facilities = JSON.parse(localStorage.getItem('facilities')) || [];

        let html = `
            <div class="patient-list-header">
                <div>
                    <h2>Patient Referrals</h2>
                    <p>Manage patient referrals and care coordination</p>
                </div>
                <button class="btn btn-primary" onclick="App.showAddReferralModal()">
                    Create Referral
                </button>
            </div>

            <div class="card mt-3">
                <div class="card-header">
                    <div class="search-filter-bar">
                        <input type="text" id="referralSearch" placeholder="Search referrals..." class="search-input">
                        <select id="statusFilter">
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="accepted">Accepted</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>
                <div class="card-body">
                    ${referrals.length > 0 ? this.renderReferralsList(referrals, patients, facilities) : '<p class="text-muted">No referrals found. Click "Create Referral" to start.</p>'}
                </div>
            </div>
        `;

        container.innerHTML = html;
    },

    // Render referrals list
    renderReferralsList(referrals, patients, facilities) {
        return referrals.map(ref => {
            const patient = patients.find(p => p.id === ref.patientId);
            const fromFacility = facilities.find(f => f.id === ref.fromFacilityId);
            const toFacility = facilities.find(f => f.id === ref.toFacilityId);
            
            let statusClass = 'secondary';
            if (ref.status === 'pending') statusClass = 'warning';
            if (ref.status === 'accepted') statusClass = 'info';
            if (ref.status === 'completed') statusClass = 'success';
            if (ref.status === 'cancelled') statusClass = 'danger';

            return `
                <div class="patient-card">
                    <div class="patient-info">
                        <div>
                            <h3>${patient ? patient.firstName + ' ' + patient.lastName : 'N/A'}</h3>
                            <div class="patient-meta">
                                <span>📤 From: ${fromFacility ? fromFacility.name : 'N/A'}</span>
                                <span>📥 To: ${toFacility ? toFacility.name : 'N/A'}</span>
                                <span>📅 ${new Date(ref.referralDate).toLocaleDateString()}</span>
                            </div>
                            <p class="mt-1"><strong>Reason:</strong> ${ref.reason}</p>
                        </div>
                    </div>
                    <div class="patient-actions">
                        <span class="badge badge-${statusClass}">${ref.status}</span>
                        <button class="btn btn-sm btn-primary" onclick="App.viewReferralDetails(${ref.id})">
                            View
                        </button>
                        ${ref.status === 'pending' ? `
                            <button class="btn btn-sm btn-success" onclick="App.updateReferralStatus(${ref.id}, 'accepted')">
                                Accept
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    },

    // Show add referral modal
    showAddReferralModal() {
        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const facilities = JSON.parse(localStorage.getItem('facilities')) || [];
        const currentUser = Auth.getCurrentUser();

        const content = `
            <form id="addReferralForm">
                <div class="form-group">
                    <label class="required">Patient</label>
                    <select id="patientId" required>
                        <option value="">Select Patient</option>
                        ${patients.map(p => `<option value="${p.id}">${p.firstName} ${p.lastName}</option>`).join('')}
                    </select>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="required">From Facility</label>
                        <select id="fromFacilityId" required>
                            ${facilities.map(f => `<option value="${f.id}" ${f.id === currentUser.facilityId ? 'selected' : ''}>${f.name}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="required">To Facility</label>
                        <select id="toFacilityId" required>
                            <option value="">Select Facility</option>
                            ${facilities.map(f => `<option value="${f.id}">${f.name}</option>`).join('')}
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="required">Referral Date</label>
                    <input type="date" id="referralDate" value="${new Date().toISOString().split('T')[0]}" required>
                </div>
                <div class="form-group">
                    <label class="required">Reason for Referral</label>
                    <textarea id="reason" rows="3" required placeholder="Enter reason for referral..."></textarea>
                </div>
                <div class="form-group">
                    <label>Urgency Level</label>
                    <select id="urgency">
                        <option value="routine">Routine</option>
                        <option value="urgent">Urgent</option>
                        <option value="emergency">Emergency</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Additional Notes</label>
                    <textarea id="notes" rows="3"></textarea>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="App.addReferral()">Create Referral</button>
        `;

        App.showModal('Create Patient Referral', content, footer);
    },

    // Add referral
    addReferral() {
        const form = document.getElementById('addReferralForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const referrals = JSON.parse(localStorage.getItem('referrals')) || [];
        const currentUser = Auth.getCurrentUser();

        const newReferral = {
            id: referrals.length > 0 ? Math.max(...referrals.map(r => r.id)) + 1 : 1,
            patientId: parseInt(document.getElementById('patientId').value),
            fromFacilityId: parseInt(document.getElementById('fromFacilityId').value),
            toFacilityId: parseInt(document.getElementById('toFacilityId').value),
            referralDate: document.getElementById('referralDate').value,
            reason: document.getElementById('reason').value,
            urgency: document.getElementById('urgency').value,
            notes: document.getElementById('notes').value,
            status: 'pending',
            createdBy: currentUser.userId,
            createdAt: new Date().toISOString()
        };

        referrals.push(newReferral);
        localStorage.setItem('referrals', JSON.stringify(referrals));

        App.closeModal();
        App.showSuccess('Referral created successfully');
        App.loadPage('referrals');
    },

    // View referral details
    viewReferralDetails(referralId) {
        const referrals = JSON.parse(localStorage.getItem('referrals')) || [];
        const referral = referrals.find(r => r.id === referralId);

        if (!referral) {
            App.showError('Referral not found');
            return;
        }

        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const facilities = JSON.parse(localStorage.getItem('facilities')) || [];
        const patient = patients.find(p => p.id === referral.patientId);
        const fromFacility = facilities.find(f => f.id === referral.fromFacilityId);
        const toFacility = facilities.find(f => f.id === referral.toFacilityId);

        const content = `
            <div class="form-group">
                <label>Patient Name</label>
                <input type="text" value="${patient ? patient.firstName + ' ' + patient.lastName : 'N/A'}" readonly>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>From Facility</label>
                    <input type="text" value="${fromFacility ? fromFacility.name : 'N/A'}" readonly>
                </div>
                <div class="form-group">
                    <label>To Facility</label>
                    <input type="text" value="${toFacility ? toFacility.name : 'N/A'}" readonly>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Referral Date</label>
                    <input type="date" value="${referral.referralDate}" readonly>
                </div>
                <div class="form-group">
                    <label>Status</label>
                    <input type="text" value="${referral.status}" readonly style="text-transform: capitalize;">
                </div>
            </div>
            <div class="form-group">
                <label>Urgency Level</label>
                <input type="text" value="${referral.urgency}" readonly style="text-transform: capitalize;">
            </div>
            <div class="form-group">
                <label>Reason for Referral</label>
                <textarea rows="3" readonly>${referral.reason}</textarea>
            </div>
            ${referral.notes ? `
                <div class="form-group">
                    <label>Additional Notes</label>
                    <textarea rows="3" readonly>${referral.notes}</textarea>
                </div>
            ` : ''}
        `;

        App.showModal('Referral Details', content, '');
    },

    // Update referral status
    updateReferralStatus(referralId, newStatus) {
        const referrals = JSON.parse(localStorage.getItem('referrals')) || [];
        const index = referrals.findIndex(r => r.id === referralId);

        if (index === -1) {
            App.showError('Referral not found');
            return;
        }

        referrals[index].status = newStatus;
        referrals[index].updatedAt = new Date().toISOString();

        localStorage.setItem('referrals', JSON.stringify(referrals));

        App.showSuccess(`Referral ${newStatus} successfully`);
        App.loadPage('referrals');
    },

    // Generate report (simulated)
    generateReport(reportType) {
        App.showSuccess(`Generating ${reportType} report... This would export data in a production environment.`);
        
        // Simulate report generation with setTimeout
        setTimeout(() => {
            const reportData = this.getReportData(reportType);
            console.log('Report Data:', reportData);
            alert(`Report generated successfully!\n\nReport Type: ${reportType}\nTotal Records: ${reportData.count}\n\nCheck browser console for details.`);
        }, 1000);
    },

    // Get report data based on type
    getReportData(reportType) {
        switch(reportType) {
            case 'patient-stats':
                const patients = JSON.parse(localStorage.getItem('patients')) || [];
                return {
                    type: 'Patient Statistics',
                    count: patients.length,
                    data: patients
                };
            case 'adherence':
                const reminders = JSON.parse(localStorage.getItem('reminders')) || [];
                return {
                    type: 'Adherence Report',
                    count: reminders.length,
                    data: reminders
                };
            case 'inventory':
                const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
                return {
                    type: 'Inventory Report',
                    count: inventory.length,
                    data: inventory
                };
            case 'appointments':
                const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
                return {
                    type: 'Appointment Report',
                    count: appointments.length,
                    data: appointments
                };
            default:
                return { type: 'Unknown', count: 0, data: [] };
        }
    },

    // Load notifications
    loadNotifications() {
        const notifications = this.generateNotifications();
        const notificationList = document.getElementById('notificationList');
        const notificationCount = document.getElementById('notificationCount');

        notificationCount.textContent = notifications.filter(n => !n.read).length;

        notificationList.innerHTML = notifications.map(notif => `
            <div class="notification-item ${notif.read ? '' : 'unread'}">
                <strong>${notif.title}</strong>
                <p>${notif.message}</p>
                <div class="notification-time">${notif.time}</div>
            </div>
        `).join('');
    },

    // Generate notifications based on role and data
    generateNotifications() {
        const notifications = [];
        const role = this.currentUser.role;

        if (role === 'patient') {
            const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
            const upcomingAppointments = appointments.filter(a => 
                a.patientId === this.currentUser.patientId && 
                new Date(a.appointmentDate) >= new Date() &&
                a.status === 'scheduled'
            );

            if (upcomingAppointments.length > 0) {
                const nextApt = upcomingAppointments[0];
                notifications.push({
                    title: 'Upcoming Appointment',
                    message: `You have an appointment on ${new Date(nextApt.appointmentDate).toLocaleDateString()}`,
                    time: '1 hour ago',
                    read: false
                });
            }
        } else {
            notifications.push({
                title: 'System Update',
                message: 'Dashboard statistics have been updated',
                time: '2 hours ago',
                read: false
            });
        }

        return notifications;
    },

    // Show modal helper
    showModal(title, content, footer = '') {
        const modalHTML = `
            <div class="modal-overlay" id="modalOverlay">
                <div class="modal">
                    <div class="modal-header">
                        <h3 class="modal-title">${title}</h3>
                        <button class="btn-close" onclick="App.closeModal()">×</button>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                    ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
                </div>
            </div>
        `;

        document.getElementById('modalContainer').innerHTML = modalHTML;

        // Close on overlay click
        document.getElementById('modalOverlay').addEventListener('click', (e) => {
            if (e.target.id === 'modalOverlay') {
                this.closeModal();
            }
        });
    },

    // Close modal helper
    closeModal() {
        document.getElementById('modalContainer').innerHTML = '';
    },

    // Show success message
    showSuccess(message) {
        this.showMessage(message, 'success');
    },

    // Show error message
    showError(message) {
        this.showMessage(message, 'danger');
    },

    // Show message helper
    showMessage(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        alertDiv.style.position = 'fixed';
        alertDiv.style.top = '20px';
        alertDiv.style.right = '20px';
        alertDiv.style.zIndex = '9999';
        alertDiv.style.minWidth = '300px';
        
        document.body.appendChild(alertDiv);

        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    },

    // Show add lab test modal
    showAddLabTestModal() {
        const patients = JSON.parse(localStorage.getItem('patients')) || [];

        const content = `
            <form id="addLabTestForm">
                <div class="form-group">
                    <label class="required">Patient</label>
                    <select id="patientId" required>
                        <option value="">Select Patient</option>
                        ${patients.map(p => `<option value="${p.id}">${p.firstName} ${p.lastName}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label class="required">Test Name</label>
                    <select id="testName" required>
                        <option value="">Select Test</option>
                        <option value="CD4 Count">CD4 Count</option>
                        <option value="Viral Load">Viral Load</option>
                        <option value="Complete Blood Count">Complete Blood Count</option>
                        <option value="Liver Function Test">Liver Function Test</option>
                        <option value="Kidney Function Test">Kidney Function Test</option>
                        <option value="Lipid Profile">Lipid Profile</option>
                        <option value="Blood Sugar">Blood Sugar</option>
                        <option value="Hepatitis B Test">Hepatitis B Test</option>
                        <option value="Hepatitis C Test">Hepatitis C Test</option>
                    </select>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="required">Result Value</label>
                        <input type="text" id="resultValue" required placeholder="e.g., 450, Undetectable">
                    </div>
                    <div class="form-group">
                        <label>Unit</label>
                        <input type="text" id="resultUnit" placeholder="e.g., cells/μL, copies/mL">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="required">Date Done</label>
                        <input type="date" id="dateDone" value="${new Date().toISOString().split('T')[0]}" required>
                    </div>
                    <div class="form-group">
                        <label class="required">Lab Code</label>
                        <input type="text" id="labCode" required placeholder="e.g., LAB-2025-001">
                    </div>
                </div>
                <div class="form-group">
                    <label>Performed By</label>
                    <input type="text" id="performedBy" value="${Auth.getCurrentUser().fullName}">
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="App.addLabTest()">Add Test Result</button>
        `;

        App.showModal('Add Lab Test Result', content, footer);
    },

    // Add lab test
    addLabTest() {
        const form = document.getElementById('addLabTestForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const labTests = JSON.parse(localStorage.getItem('labTests')) || [];
        const newTest = {
            id: labTests.length > 0 ? Math.max(...labTests.map(t => t.id)) + 1 : 1,
            patientId: parseInt(document.getElementById('patientId').value),
            testName: document.getElementById('testName').value,
            resultValue: document.getElementById('resultValue').value,
            resultUnit: document.getElementById('resultUnit').value,
            dateDone: document.getElementById('dateDone').value,
            labCode: document.getElementById('labCode').value,
            performedBy: document.getElementById('performedBy').value
        };

        labTests.push(newTest);
        localStorage.setItem('labTests', JSON.stringify(labTests));

        App.closeModal();
        App.showSuccess('Lab test result added successfully');
        App.loadPage('lab-tests');
    }
};

