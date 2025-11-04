// ============================================================
// DOH HIV Platform - Appointment Management CRUD
// ============================================================

const Appointments = {
    // Load appointments page
    loadAppointmentsPage(container) {
        const role = Auth.getCurrentUser().role;
        const currentUser = Auth.getCurrentUser();
        
        if (!Auth.permissions.canManageAppointments(role)) {
            container.innerHTML = '<div class="alert alert-danger">Access denied</div>';
            return;
        }

        let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        
        // Filter appointments for patient role
        if (role === 'patient') {
            appointments = appointments.filter(apt => apt.patientId === currentUser.patientId);
        }

        let html = `
            <div class="tabs">
                <div class="tab active" data-tab="calendar">Calendar View</div>
                <div class="tab" data-tab="list">List View</div>
            </div>

            <div class="tab-content active" id="calendarTab">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Appointment Calendar</h3>
                        <button class="btn btn-primary btn-sm" onclick="Appointments.showAddAppointmentModal()">
                            Book Appointment
                        </button>
                    </div>
                    <div class="card-body">
                        <div id="calendarContainer"></div>
                        <div id="dayAppointments" class="mt-3"></div>
                    </div>
                </div>
            </div>

            <div class="tab-content" id="listTab">
                <div class="card">
                    <div class="card-header">
                        <div class="search-filter-bar">
                            <input type="text" id="appointmentSearch" placeholder="Search appointments..." class="search-input">
                            <select id="statusFilter">
                                <option value="all">All Status</option>
                                <option value="scheduled">Scheduled</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                        <button class="btn btn-primary btn-sm" onclick="Appointments.showAddAppointmentModal()">
                            Book Appointment
                        </button>
                    </div>
                    <div class="card-body">
                        <div id="appointmentList">
                            ${this.renderAppointmentList(appointments)}
                        </div>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;

        // Initialize calendar
        Calendar.render('calendarContainer', appointments);

        // Setup tabs
        this.setupTabs();

        // Setup search and filter
        const searchInput = document.getElementById('appointmentSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterAppointments(e.target.value);
            });
        }

        const statusFilter = document.getElementById('statusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.applyStatusFilter(e.target.value);
            });
        }
    },

    // Setup tabs
    setupTabs() {
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.getAttribute('data-tab');
                
                // Update tab active state
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                
                // Update content active state
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                if (tabName === 'calendar') {
                    document.getElementById('calendarTab').classList.add('active');
                } else {
                    document.getElementById('listTab').classList.add('active');
                }
            });
        });
    },

    // Render appointment list
    renderAppointmentList(appointments) {
        if (appointments.length === 0) {
            return '<p class="text-muted">No appointments found</p>';
        }

        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const facilities = JSON.parse(localStorage.getItem('facilities')) || [];
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const role = Auth.getCurrentUser().role;

        return appointments.map(apt => {
            const patient = patients.find(p => p.id === apt.patientId);
            const facility = facilities.find(f => f.id === apt.facilityId);
            const provider = users.find(u => u.id === apt.providerId);
            const date = new Date(apt.appointmentDate);

            let statusClass = 'secondary';
            if (apt.status === 'scheduled') statusClass = 'primary';
            if (apt.status === 'completed') statusClass = 'success';
            if (apt.status === 'cancelled') statusClass = 'danger';

            return `
                <div class="patient-card">
                    <div class="patient-info">
                        <div>
                            ${role !== 'patient' ? `<h3>${patient ? patient.firstName + ' ' + patient.lastName : 'N/A'}</h3>` : ''}
                            <strong>${date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>
                            <div class="patient-meta">
                                <span>🕐 ${apt.appointmentTime}</span>
                                <span>📍 ${facility ? facility.name : 'N/A'}</span>
                                <span>👨‍⚕️ ${provider ? provider.fullName : 'N/A'}</span>
                            </div>
                            <div class="mt-1">
                                <span class="badge badge-info">${apt.type}</span>
                                <span class="badge badge-${statusClass}">${apt.status}</span>
                            </div>
                        </div>
                    </div>
                    <div class="patient-actions">
                        ${apt.status === 'scheduled' ? `
                            <button class="btn btn-sm btn-primary" onclick="Appointments.showEditAppointmentModal(${apt.id})">
                                Edit
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="Appointments.cancelAppointment(${apt.id})">
                                Cancel
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    },

    // Show appointments for a specific day
    showDayAppointments(dateString, appointments) {
        const container = document.getElementById('dayAppointments');
        if (!container) return;

        if (appointments.length === 0) {
            container.innerHTML = `
                <div class="alert alert-info">
                    No appointments scheduled for ${new Date(dateString).toLocaleDateString()}
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <h4>Appointments on ${new Date(dateString).toLocaleDateString()}</h4>
            ${this.renderAppointmentList(appointments)}
        `;
    },

    // Filter appointments by search term
    filterAppointments(searchTerm) {
        const role = Auth.getCurrentUser().role;
        const currentUser = Auth.getCurrentUser();
        let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        
        if (role === 'patient') {
            appointments = appointments.filter(apt => apt.patientId === currentUser.patientId);
        }

        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const filtered = appointments.filter(apt => {
            const patient = patients.find(p => p.id === apt.patientId);
            const patientName = patient ? `${patient.firstName} ${patient.lastName}`.toLowerCase() : '';
            return patientName.includes(searchTerm.toLowerCase()) ||
                   apt.type.toLowerCase().includes(searchTerm.toLowerCase());
        });

        document.getElementById('appointmentList').innerHTML = this.renderAppointmentList(filtered);
    },

    // Apply status filter
    applyStatusFilter(status) {
        const role = Auth.getCurrentUser().role;
        const currentUser = Auth.getCurrentUser();
        let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        
        if (role === 'patient') {
            appointments = appointments.filter(apt => apt.patientId === currentUser.patientId);
        }

        if (status !== 'all') {
            appointments = appointments.filter(apt => apt.status === status);
        }

        document.getElementById('appointmentList').innerHTML = this.renderAppointmentList(appointments);
    },

    // Show add appointment modal
    showAddAppointmentModal() {
        const role = Auth.getCurrentUser().role;
        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const facilities = JSON.parse(localStorage.getItem('facilities')) || [];
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const providers = users.filter(u => ['physician', 'nurse'].includes(u.role));

        let patientSelect = '';
        if (role === 'patient') {
            const patientId = Auth.getCurrentUser().patientId;
            patientSelect = `<input type="hidden" id="patientId" value="${patientId}">`;
        } else {
            patientSelect = `
                <div class="form-group">
                    <label class="required">Patient</label>
                    <select id="patientId" required>
                        <option value="">Select Patient</option>
                        ${patients.map(p => `<option value="${p.id}">${p.firstName} ${p.lastName}</option>`).join('')}
                    </select>
                </div>
            `;
        }

        const content = `
            <form id="addAppointmentForm">
                ${patientSelect}
                <div class="form-row">
                    <div class="form-group">
                        <label class="required">Date</label>
                        <input type="date" id="appointmentDate" required min="${new Date().toISOString().split('T')[0]}">
                    </div>
                    <div class="form-group">
                        <label class="required">Time</label>
                        <input type="time" id="appointmentTime" required>
                    </div>
                </div>
                <div class="form-group">
                    <label class="required">Facility</label>
                    <select id="facilityId" required>
                        <option value="">Select Facility</option>
                        ${facilities.map(f => `<option value="${f.id}">${f.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label class="required">Provider</label>
                    <select id="providerId" required>
                        <option value="">Select Provider</option>
                        ${providers.map(p => `<option value="${p.id}">${p.fullName} (${p.role})</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label class="required">Appointment Type</label>
                    <select id="appointmentType" required>
                        <option value="">Select Type</option>
                        <option value="Initial Consultation">Initial Consultation</option>
                        <option value="Follow-up Consultation">Follow-up Consultation</option>
                        <option value="ART Pickup">ART Pickup</option>
                        <option value="Lab Test">Lab Test</option>
                        <option value="Counseling">Counseling</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Notes</label>
                    <textarea id="notes" rows="3"></textarea>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="Appointments.addAppointment()">Book Appointment</button>
        `;

        App.showModal('Book Appointment', content, footer);
    },

    // Add appointment
    addAppointment() {
        const form = document.getElementById('addAppointmentForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        const newAppointment = {
            id: appointments.length > 0 ? Math.max(...appointments.map(a => a.id)) + 1 : 1,
            patientId: parseInt(document.getElementById('patientId').value),
            facilityId: parseInt(document.getElementById('facilityId').value),
            providerId: parseInt(document.getElementById('providerId').value),
            appointmentDate: document.getElementById('appointmentDate').value,
            appointmentTime: document.getElementById('appointmentTime').value,
            type: document.getElementById('appointmentType').value,
            status: 'scheduled',
            notes: document.getElementById('notes').value
        };

        appointments.push(newAppointment);
        localStorage.setItem('appointments', JSON.stringify(appointments));

        App.closeModal();
        App.showSuccess('Appointment booked successfully');
        App.loadPage('appointments');

        // Schedule reminder notification
        this.scheduleReminder(newAppointment);
    },

    // Show edit appointment modal
    showEditAppointmentModal(appointmentId) {
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        const appointment = appointments.find(a => a.id === appointmentId);

        if (!appointment) {
            App.showError('Appointment not found');
            return;
        }

        const role = Auth.getCurrentUser().role;
        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const facilities = JSON.parse(localStorage.getItem('facilities')) || [];
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const providers = users.filter(u => ['physician', 'nurse'].includes(u.role));

        let patientSelect = '';
        if (role === 'patient') {
            patientSelect = `<input type="hidden" id="patientId" value="${appointment.patientId}">`;
        } else {
            patientSelect = `
                <div class="form-group">
                    <label class="required">Patient</label>
                    <select id="patientId" required>
                        ${patients.map(p => `<option value="${p.id}" ${p.id === appointment.patientId ? 'selected' : ''}>${p.firstName} ${p.lastName}</option>`).join('')}
                    </select>
                </div>
            `;
        }

        const content = `
            <form id="editAppointmentForm">
                <input type="hidden" id="appointmentId" value="${appointment.id}">
                ${patientSelect}
                <div class="form-row">
                    <div class="form-group">
                        <label class="required">Date</label>
                        <input type="date" id="appointmentDate" value="${appointment.appointmentDate}" required>
                    </div>
                    <div class="form-group">
                        <label class="required">Time</label>
                        <input type="time" id="appointmentTime" value="${appointment.appointmentTime}" required>
                    </div>
                </div>
                <div class="form-group">
                    <label class="required">Facility</label>
                    <select id="facilityId" required>
                        ${facilities.map(f => `<option value="${f.id}" ${f.id === appointment.facilityId ? 'selected' : ''}>${f.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label class="required">Provider</label>
                    <select id="providerId" required>
                        ${providers.map(p => `<option value="${p.id}" ${p.id === appointment.providerId ? 'selected' : ''}>${p.fullName} (${p.role})</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label class="required">Appointment Type</label>
                    <select id="appointmentType" required>
                        <option value="Initial Consultation" ${appointment.type === 'Initial Consultation' ? 'selected' : ''}>Initial Consultation</option>
                        <option value="Follow-up Consultation" ${appointment.type === 'Follow-up Consultation' ? 'selected' : ''}>Follow-up Consultation</option>
                        <option value="ART Pickup" ${appointment.type === 'ART Pickup' ? 'selected' : ''}>ART Pickup</option>
                        <option value="Lab Test" ${appointment.type === 'Lab Test' ? 'selected' : ''}>Lab Test</option>
                        <option value="Counseling" ${appointment.type === 'Counseling' ? 'selected' : ''}>Counseling</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Notes</label>
                    <textarea id="notes" rows="3">${appointment.notes || ''}</textarea>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="Appointments.updateAppointment()">Update Appointment</button>
        `;

        App.showModal('Edit Appointment', content, footer);
    },

    // Update appointment
    updateAppointment() {
        const form = document.getElementById('editAppointmentForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const appointmentId = parseInt(document.getElementById('appointmentId').value);
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        const index = appointments.findIndex(a => a.id === appointmentId);

        if (index === -1) {
            App.showError('Appointment not found');
            return;
        }

        appointments[index] = {
            ...appointments[index],
            patientId: parseInt(document.getElementById('patientId').value),
            facilityId: parseInt(document.getElementById('facilityId').value),
            providerId: parseInt(document.getElementById('providerId').value),
            appointmentDate: document.getElementById('appointmentDate').value,
            appointmentTime: document.getElementById('appointmentTime').value,
            type: document.getElementById('appointmentType').value,
            notes: document.getElementById('notes').value
        };

        localStorage.setItem('appointments', JSON.stringify(appointments));

        App.closeModal();
        App.showSuccess('Appointment updated successfully');
        App.loadPage('appointments');
    },

    // Cancel appointment
    cancelAppointment(appointmentId) {
        if (!confirm('Are you sure you want to cancel this appointment?')) {
            return;
        }

        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        const index = appointments.findIndex(a => a.id === appointmentId);

        if (index === -1) {
            App.showError('Appointment not found');
            return;
        }

        appointments[index].status = 'cancelled';
        localStorage.setItem('appointments', JSON.stringify(appointments));

        App.showSuccess('Appointment cancelled successfully');
        App.loadPage('appointments');
    },

    // Schedule reminder notification (simulated)
    scheduleReminder(appointment) {
        // In a real app, this would schedule actual notifications
        // For demo purposes, we'll just show a message
        console.log('Reminder scheduled for appointment:', appointment);
        
        // Request notification permission if not already granted
        if ('Notification' in window && Notification.permission === 'granted') {
            // Show immediate notification for demo
            new Notification('Appointment Reminder', {
                body: `Your appointment is scheduled for ${appointment.appointmentDate} at ${appointment.appointmentTime}`,
                icon: '/favicon.ico'
            });
        }
    }
};

