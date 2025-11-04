// ============================================================
// DOH HIV Platform - Authentication & RBAC
// ============================================================

const Auth = {
    // Login user
    login(username, password, role) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => 
            u.username === username && 
            u.password === password && 
            u.role === role
        );
        
        if (user) {
            const session = {
                userId: user.id,
                username: user.username,
                role: user.role,
                fullName: user.fullName,
                email: user.email,
                facilityId: user.facilityId,
                patientId: user.patientId,
                loginTime: new Date().toISOString()
            };
            localStorage.setItem('currentUser', JSON.stringify(session));
            
            // Request notification permission
            if ('Notification' in window && Notification.permission === 'default') {
                Notification.requestPermission();
            }
            
            return true;
        }
        return false;
    },

    // Logout user
    logout() {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    },

    // Check if user is authenticated
    isAuthenticated() {
        return localStorage.getItem('currentUser') !== null;
    },

    // Get current user
    getCurrentUser() {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    },

    // Check if user has specific role
    hasRole(role) {
        const user = this.getCurrentUser();
        return user && user.role === role;
    },

    // Check if user has any of the specified roles
    hasAnyRole(roles) {
        const user = this.getCurrentUser();
        return user && roles.includes(user.role);
    },

    // Role-based permissions
    permissions: {
        // Patient management permissions
        canViewAllPatients(role) {
            return ['admin', 'physician', 'nurse', 'case_manager', 'lab_personnel'].includes(role);
        },
        
        canEditPatient(role) {
            return ['admin', 'physician', 'case_manager'].includes(role);
        },
        
        canDeletePatient(role) {
            return ['admin'].includes(role);
        },

        // Appointment permissions
        canManageAppointments(role) {
            return ['admin', 'physician', 'nurse', 'case_manager', 'patient'].includes(role);
        },

        // Prescription permissions
        canCreatePrescription(role) {
            return ['physician'].includes(role);
        },
        
        canViewPrescriptions(role) {
            return ['admin', 'physician', 'nurse', 'patient'].includes(role);
        },

        // Inventory permissions
        canManageInventory(role) {
            return ['admin', 'nurse'].includes(role);
        },
        
        canViewInventory(role) {
            return ['admin', 'physician', 'nurse'].includes(role);
        },

        // Lab test permissions
        canManageLabTests(role) {
            return ['lab_personnel', 'admin'].includes(role);
        },
        
        canViewLabTests(role) {
            return ['admin', 'physician', 'lab_personnel'].includes(role);
        },

        // Admin permissions
        canManageUsers(role) {
            return ['admin'].includes(role);
        },
        
        canManageFacilities(role) {
            return ['admin'].includes(role);
        },

        // Dashboard access
        canAccessAdminDashboard(role) {
            return ['admin'].includes(role);
        },
        
        canAccessWorkerDashboard(role) {
            return ['admin', 'physician', 'nurse', 'case_manager', 'lab_personnel'].includes(role);
        }
    },

    // Get navigation menu based on role
    getNavigationMenu(role) {
        const menus = {
            admin: [
                { id: 'dashboard', label: 'Dashboard', icon: 'home' },
                { id: 'patients', label: 'Patients', icon: 'users' },
                { id: 'appointments', label: 'Appointments', icon: 'calendar' },
                { id: 'visits', label: 'Clinical Visits', icon: 'clipboard' },
                { id: 'inventory', label: 'Inventory', icon: 'package' },
                { id: 'prescriptions', label: 'Prescriptions', icon: 'file-text' },
                { id: 'art-regimen', label: 'ART Regimens', icon: 'pills' },
                { id: 'lab-tests', label: 'Lab Tests', icon: 'activity' },
                { id: 'hts', label: 'HTS Sessions', icon: 'test-tube' },
                { id: 'counseling', label: 'Counseling', icon: 'message-circle' },
                { id: 'referrals', label: 'Referrals', icon: 'share' },
                { id: 'surveys', label: 'Satisfaction Surveys', icon: 'star' },
                { id: 'users', label: 'User Management', icon: 'user-plus' },
                { id: 'facilities', label: 'Facilities', icon: 'building' },
                { id: 'reports', label: 'Reports', icon: 'bar-chart' },
                { id: 'education', label: 'Education', icon: 'book' }
            ],
            physician: [
                { id: 'dashboard', label: 'Dashboard', icon: 'home' },
                { id: 'patients', label: 'Patients', icon: 'users' },
                { id: 'appointments', label: 'Appointments', icon: 'calendar' },
                { id: 'visits', label: 'Clinical Visits', icon: 'clipboard' },
                { id: 'prescriptions', label: 'Prescriptions', icon: 'file-text' },
                { id: 'art-regimen', label: 'ART Regimens', icon: 'pills' },
                { id: 'lab-tests', label: 'Lab Results', icon: 'activity' },
                { id: 'counseling', label: 'Counseling', icon: 'message-circle' },
                { id: 'inventory', label: 'Inventory', icon: 'package' },
                { id: 'education', label: 'Education', icon: 'book' }
            ],
            nurse: [
                { id: 'dashboard', label: 'Dashboard', icon: 'home' },
                { id: 'patients', label: 'Patients', icon: 'users' },
                { id: 'appointments', label: 'Appointments', icon: 'calendar' },
                { id: 'visits', label: 'Clinical Visits', icon: 'clipboard' },
                { id: 'inventory', label: 'Inventory', icon: 'package' },
                { id: 'prescriptions', label: 'Prescriptions', icon: 'file-text' },
                { id: 'hts', label: 'HTS Sessions', icon: 'test-tube' },
                { id: 'education', label: 'Education', icon: 'book' }
            ],
            case_manager: [
                { id: 'dashboard', label: 'Dashboard', icon: 'home' },
                { id: 'patients', label: 'Patients', icon: 'users' },
                { id: 'appointments', label: 'Appointments', icon: 'calendar' },
                { id: 'counseling', label: 'Counseling', icon: 'message-circle' },
                { id: 'referrals', label: 'Referrals', icon: 'share' },
                { id: 'hts', label: 'HTS Sessions', icon: 'test-tube' },
                { id: 'education', label: 'Education', icon: 'book' }
            ],
            lab_personnel: [
                { id: 'dashboard', label: 'Dashboard', icon: 'home' },
                { id: 'lab-tests', label: 'Lab Tests', icon: 'activity' },
                { id: 'hts', label: 'HTS Sessions', icon: 'test-tube' },
                { id: 'patients', label: 'Patients', icon: 'users' },
                { id: 'education', label: 'Education', icon: 'book' }
            ],
            patient: [
                { id: 'dashboard', label: 'My Dashboard', icon: 'home' },
                { id: 'profile', label: 'My Profile', icon: 'user' },
                { id: 'appointments', label: 'Appointments', icon: 'calendar' },
                { id: 'prescriptions', label: 'Prescriptions', icon: 'file-text' },
                { id: 'reminders', label: 'Medication Reminders', icon: 'bell' },
                { id: 'lab-results', label: 'Lab Results', icon: 'activity' },
                { id: 'surveys', label: 'Feedback', icon: 'star' },
                { id: 'education', label: 'Health Education', icon: 'book' }
            ]
        };
        
        return menus[role] || [];
    },

    // Get SVG icon for navigation
    getIcon(iconName) {
        const icons = {
            home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>',
            users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>',
            calendar: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>',
            package: '<line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>',
            'file-text': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>',
            activity: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>',
            'user-plus': '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line>',
            building: '<rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path>',
            'bar-chart': '<line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line>',
            book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>',
            user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>',
            bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path>',
            share: '<circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>',
            clipboard: '<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>',
            pills: '<circle cx="5.5" cy="11.5" r="4.5"></circle><circle cx="18.5" cy="11.5" r="4.5"></circle><line x1="5.5" y1="7" x2="18.5" y2="7"></line><line x1="5.5" y1="16" x2="18.5" y2="16"></line>',
            'test-tube': '<path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5s-2.5-1.1-2.5-2.5V2"></path><path d="M8.5 2h7"></path><path d="M9 16h6"></path>',
            'message-circle': '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>',
            star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>'
        };
        
        return icons[iconName] || '';
    }
};

