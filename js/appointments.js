// ============================================================
// MyHubCares - Appointment Management CRUD
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
                <div class="form-group">
                    <label class="required">MyHubCares Branch</label>
                    <select id="facilityId" required>
                        <option value="">Select MyHubCares Branch</option>
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
                    <label class="required">Date</label>
                    <input type="date" id="appointmentDate" required min="${new Date().toISOString().split('T')[0]}">
                </div>
                <div class="form-group">
                    <label class="required">Time</label>
                    <div id="timeSlotContainer">
                        <input type="time" id="appointmentTime" required disabled>
                        <div id="availableSlotsDisplay" class="available-slots mt-2">
                            <div class="slot-message">
                                <small class="text-muted">Please select provider, facility, and date to see available slots</small>
                            </div>
                        </div>
                    </div>
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
        
        // Setup event listeners for dynamic slot loading
        this.setupSlotEventListeners();
    },

    // Add appointment
    addAppointment() {
        const form = document.getElementById('addAppointmentForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        const patientId = parseInt(document.getElementById('patientId').value);
        const facilityId = parseInt(document.getElementById('facilityId').value);
        const providerId = parseInt(document.getElementById('providerId').value);
        const appointmentDate = document.getElementById('appointmentDate').value;
        const appointmentTime = document.getElementById('appointmentTime').value;
        const slotLookup = this.findAvailableSlot(providerId, facilityId, appointmentDate, appointmentTime);

        if (!slotLookup.slot) {
            App.showError(slotLookup.message || 'Selected time is no longer available. Please choose another slot.');
            return;
        }

        const scheduledStart = this.getScheduledDateTime(appointmentDate, appointmentTime);
        const scheduledEnd = this.getScheduledDateTime(appointmentDate, appointmentTime, this.getDefaultDurationMinutes());

        const newAppointment = {
            id: appointments.length > 0 ? Math.max(...appointments.map(a => a.id)) + 1 : 1,
            patientId,
            facilityId,
            providerId,
            appointmentDate,
            appointmentTime,
            type: document.getElementById('appointmentType').value,
            status: 'scheduled',
            notes: document.getElementById('notes').value,
            slotId: slotLookup.slot.slot_id,
            scheduledStart,
            scheduledEnd,
            durationMinutes: this.getDefaultDurationMinutes()
        };

        appointments.push(newAppointment);
        localStorage.setItem('appointments', JSON.stringify(appointments));

        this.markSlotAsBooked(slotLookup.slot.slot_id, newAppointment.id);

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
                    <label class="required">Date</label>
                    <input type="date" id="appointmentDate" value="${appointment.appointmentDate}" required>
                </div>
                <div class="form-group">
                    <label class="required">Time</label>
                    <div id="timeSlotContainer">
                        <input type="time" id="appointmentTime" value="${appointment.appointmentTime}" required>
                        <div id="availableSlotsDisplay" class="available-slots mt-2">
                            <div class="slot-message">
                                <small class="text-muted">Select date to see available slots</small>
                            </div>
                        </div>
                    </div>
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
        
        // Setup event listeners and load slots for current selection
        this.setupSlotEventListeners();
        // Load slots after a brief delay to ensure DOM is ready
        setTimeout(() => {
            this.loadAvailableSlots();
            // Pre-select current appointment time if it exists in available slots
            if (appointment.appointmentTime) {
                setTimeout(() => {
                    this.selectTimeSlot(appointment.appointmentTime);
                }, 200);
            }
        }, 100);
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

        const patientId = parseInt(document.getElementById('patientId').value);
        const facilityId = parseInt(document.getElementById('facilityId').value);
        const providerId = parseInt(document.getElementById('providerId').value);
        const appointmentDate = document.getElementById('appointmentDate').value;
        const appointmentTime = document.getElementById('appointmentTime').value;
        const appointmentType = document.getElementById('appointmentType').value;
        const notes = document.getElementById('notes').value;
        const currentAppointment = appointments[index];

        const requiresSlotUpdate = currentAppointment.providerId !== providerId ||
            currentAppointment.facilityId !== facilityId ||
            currentAppointment.appointmentDate !== appointmentDate ||
            currentAppointment.appointmentTime !== appointmentTime;

        let slotLookup = null;

        if (requiresSlotUpdate) {
            slotLookup = this.findAvailableSlot(providerId, facilityId, appointmentDate, appointmentTime);

            if (!slotLookup.slot) {
                App.showError(slotLookup.message || 'Selected time is no longer available. Please choose another slot.');
                return;
            }
        }

        const scheduledStart = this.getScheduledDateTime(appointmentDate, appointmentTime);
        const scheduledEnd = this.getScheduledDateTime(appointmentDate, appointmentTime, this.getDefaultDurationMinutes());

        appointments[index] = {
            ...appointments[index],
            patientId,
            facilityId,
            providerId,
            appointmentDate,
            appointmentTime,
            type: appointmentType,
            notes,
            slotId: requiresSlotUpdate ? slotLookup.slot.slot_id : appointments[index].slotId,
            scheduledStart,
            scheduledEnd,
            durationMinutes: this.getDefaultDurationMinutes()
        };

        localStorage.setItem('appointments', JSON.stringify(appointments));

        if (requiresSlotUpdate) {
            this.releaseSlot(currentAppointment);
            this.markSlotAsBooked(slotLookup.slot.slot_id, appointments[index].id);
        }

        this.scheduleReminder(appointments[index]);

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

        this.releaseSlot(appointments[index]);
        this.cancelReminderForAppointment(appointmentId);

        App.showSuccess('Appointment cancelled successfully');
        App.loadPage('appointments');
    },

    // Schedule reminder notification (simulated)
    scheduleReminder(appointment) {
        const reminders = JSON.parse(localStorage.getItem('appointment_reminders')) || [];
        const appointmentDateTime = appointment.scheduledStart
            ? new Date(appointment.scheduledStart)
            : new Date(`${appointment.appointmentDate}T${appointment.appointmentTime}`);
        const reminderDate = new Date(appointmentDateTime.getTime() - 24 * 60 * 60 * 1000);
        const reminderScheduledAt = isNaN(reminderDate.getTime()) ? new Date() : reminderDate;
        const reminderId = `rem_${Date.now()}`;

        const existingReminderIndex = reminders.findIndex(r => r.appointment_id === appointment.id);
        const reminderPayload = {
            reminder_id: existingReminderIndex !== -1 ? reminders[existingReminderIndex].reminder_id : reminderId,
            appointment_id: appointment.id,
            reminder_type: 'in_app',
            reminder_scheduled_at: reminderScheduledAt.toISOString(),
            reminder_sent_at: null,
            status: 'pending',
            created_at: existingReminderIndex !== -1 ? reminders[existingReminderIndex].created_at : new Date().toISOString()
        };

        if (existingReminderIndex !== -1) {
            reminders[existingReminderIndex] = reminderPayload;
        } else {
            reminders.push(reminderPayload);
        }

        localStorage.setItem('appointment_reminders', JSON.stringify(reminders));

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
    },

    cancelReminderForAppointment(appointmentId) {
        const reminders = JSON.parse(localStorage.getItem('appointment_reminders')) || [];
        const reminderIndex = reminders.findIndex(r => r.appointment_id === appointmentId);

        if (reminderIndex !== -1) {
            reminders[reminderIndex].status = 'cancelled';
            reminders[reminderIndex].reminder_sent_at = null;
            localStorage.setItem('appointment_reminders', JSON.stringify(reminders));
        }
    },

    findAvailableSlot(providerId, facilityId, appointmentDate, appointmentTime, providedSlots = null) {
        const slots = providedSlots || JSON.parse(localStorage.getItem('availability_slots')) || [];
        const matchingSlots = slots.filter(slot =>
            slot.provider_id === providerId &&
            slot.facility_id === facilityId &&
            slot.slot_date === appointmentDate
        );

        if (matchingSlots.length === 0) {
            return {
                slot: null,
                slots,
                message: 'No availability slots configured for the selected provider, facility, and date.'
            };
        }

        const requestedTime = this.timeStringToMinutes(appointmentTime);
        const availableSlot = matchingSlots.find(slot =>
            slot.slot_status === 'available' &&
            requestedTime >= this.timeStringToMinutes(slot.start_time) &&
            requestedTime < this.timeStringToMinutes(slot.end_time)
        );

        if (!availableSlot) {
            return {
                slot: null,
                slots,
                message: 'Selected time is already booked or outside the provider’s available hours.'
            };
        }

        return { slot: availableSlot, slots };
    },

    timeStringToMinutes(timeString) {
        if (!timeString) return 0;
        const [hours, minutes] = timeString.split(':').map(num => parseInt(num, 10));
        return (hours * 60) + minutes;
    },

    markSlotAsBooked(slotId, appointmentId) {
        if (!slotId) return;
        const slots = JSON.parse(localStorage.getItem('availability_slots')) || [];
        const slotIndex = slots.findIndex(slot => slot.slot_id === slotId);
        if (slotIndex === -1) return;

        slots[slotIndex] = {
            ...slots[slotIndex],
            slot_status: 'booked',
            appointment_id: appointmentId
        };

        localStorage.setItem('availability_slots', JSON.stringify(slots));
    },

    releaseSlot(appointment) {
        if (!appointment || !appointment.slotId) return;
        const slots = JSON.parse(localStorage.getItem('availability_slots')) || [];
        const slotIndex = slots.findIndex(slot => slot.slot_id === appointment.slotId);
        if (slotIndex === -1) return;

        if (slots[slotIndex].appointment_id && slots[slotIndex].appointment_id !== appointment.id) {
            return;
        }

        slots[slotIndex] = {
            ...slots[slotIndex],
            slot_status: 'available',
            appointment_id: null
        };

        localStorage.setItem('availability_slots', JSON.stringify(slots));
    },

    getScheduledDateTime(date, time, offsetMinutes = 0) {
        const timestamp = new Date(`${date}T${time}`);
        if (isNaN(timestamp.getTime())) {
            return null;
        }

        if (offsetMinutes) {
            timestamp.setMinutes(timestamp.getMinutes() + offsetMinutes);
        }

        return timestamp.toISOString();
    },

    getDefaultDurationMinutes() {
        return 30;
    },

    // ========== AVAILABLE SLOTS FEATURE ==========
    
    // Get available slots for a provider, facility, and date
    getAvailableSlots(providerId, facilityId, appointmentDate) {
        if (!providerId || !facilityId || !appointmentDate) {
            return {
                slots: [],
                message: 'Please select provider, facility, and date first.'
            };
        }

        const slots = JSON.parse(localStorage.getItem('availability_slots')) || [];
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        
        // Filter slots by provider, facility, and date
        const matchingSlots = slots.filter(slot =>
            slot.provider_id === providerId &&
            slot.facility_id === facilityId &&
            slot.slot_date === appointmentDate
        );

        if (matchingSlots.length === 0) {
            return {
                slots: [],
                message: 'No availability slots configured for the selected provider, facility, and date.'
            };
        }

        // Get booked times from appointments
        const bookedTimes = appointments
            .filter(apt => 
                apt.providerId === providerId &&
                apt.facilityId === facilityId &&
                apt.appointmentDate === appointmentDate &&
                apt.status === 'scheduled'
            )
            .map(apt => apt.appointmentTime);

        // Filter available slots and generate time options
        const availableSlots = matchingSlots.filter(slot => 
            slot.slot_status === 'available'
        );

        if (availableSlots.length === 0) {
            return {
                slots: [],
                message: 'All slots are booked for this date. Please try another date.'
            };
        }

        // Generate time slots from available ranges
        const timeSlots = this.generateTimeSlots(availableSlots, bookedTimes);

        return {
            slots: timeSlots,
            message: timeSlots.length > 0 ? `${timeSlots.length} available slot(s)` : 'No available slots'
        };
    },

    // Generate discrete time slots from slot ranges
    generateTimeSlots(slots, bookedTimes = [], intervalMinutes = 30) {
        const timeSlots = [];
        const bookedMinutes = bookedTimes.map(time => this.timeStringToMinutes(time));

        slots.forEach(slot => {
            const startMinutes = this.timeStringToMinutes(slot.start_time);
            const endMinutes = this.timeStringToMinutes(slot.end_time);
            
            // Generate time slots in intervals
            for (let minutes = startMinutes; minutes < endMinutes; minutes += intervalMinutes) {
                const timeString = this.minutesToTimeString(minutes);
                
                // Skip if this time is already booked
                if (!bookedMinutes.includes(minutes)) {
                    // Check if time slot already exists
                    if (!timeSlots.find(ts => ts.time === timeString)) {
                        timeSlots.push({
                            time: timeString,
                            display: this.formatTimeDisplay(timeString),
                            slotId: slot.slot_id,
                            minutes: minutes
                        });
                    }
                }
            }
        });

        // Sort by time
        return timeSlots.sort((a, b) => a.minutes - b.minutes);
    },

    // Convert minutes to time string (HH:MM)
    minutesToTimeString(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    },

    // Format time for display (e.g., "09:00" -> "9:00 AM")
    formatTimeDisplay(timeString) {
        const [hours, minutes] = timeString.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
        return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
    },

    // Load and display available slots
    loadAvailableSlots() {
        const providerId = document.getElementById('providerId')?.value;
        const facilityId = document.getElementById('facilityId')?.value;
        const appointmentDate = document.getElementById('appointmentDate')?.value;
        const timeSlotContainer = document.getElementById('timeSlotContainer');
        const availableSlotsDisplay = document.getElementById('availableSlotsDisplay');
        const appointmentTimeInput = document.getElementById('appointmentTime');

        if (!timeSlotContainer || !availableSlotsDisplay) return;

        // Clear previous display
        availableSlotsDisplay.innerHTML = '';
        
        if (!providerId || !facilityId || !appointmentDate) {
            availableSlotsDisplay.innerHTML = `
                <div class="slot-message">
                    <small class="text-muted">Please select provider, facility, and date to see available slots</small>
                </div>
            `;
            if (appointmentTimeInput) {
                appointmentTimeInput.disabled = true;
                appointmentTimeInput.value = '';
            }
            return;
        }

        // Show loading state
        availableSlotsDisplay.innerHTML = `
            <div class="slot-loading">
                <div class="spinner" style="width: 20px; height: 20px; border-width: 2px;"></div>
                <small class="text-muted">Loading available slots...</small>
            </div>
        `;

        // Simulate slight delay for better UX (remove in production if not needed)
        setTimeout(() => {
            const result = this.getAvailableSlots(
                parseInt(providerId),
                parseInt(facilityId),
                appointmentDate
            );

            if (result.slots.length === 0) {
                availableSlotsDisplay.innerHTML = `
                    <div class="slot-message">
                        <small class="text-warning">${result.message}</small>
                    </div>
                `;
                if (appointmentTimeInput) {
                    appointmentTimeInput.disabled = true;
                    appointmentTimeInput.value = '';
                }
            } else {
                // Render available slots
                availableSlotsDisplay.innerHTML = this.renderAvailableSlots(result.slots);
                if (appointmentTimeInput) {
                    appointmentTimeInput.disabled = false;
                }
            }
        }, 100);
    },

    // Render available slots as buttons
    renderAvailableSlots(slots) {
        if (!slots || slots.length === 0) {
            return '<div class="slot-message"><small class="text-muted">No slots available</small></div>';
        }

        const slotsHtml = slots.map(slot => `
            <button type="button" 
                    class="slot-btn available" 
                    data-time="${slot.time}"
                    onclick="Appointments.selectTimeSlot('${slot.time}')">
                ${slot.display}
            </button>
        `).join('');

        return `
            <div class="slot-info">
                <small class="text-muted">${slots.length} available slot(s) - Click to select:</small>
            </div>
            <div class="available-slots-grid">
                ${slotsHtml}
            </div>
        `;
    },

    // Select a time slot
    selectTimeSlot(timeString) {
        const appointmentTimeInput = document.getElementById('appointmentTime');
        if (appointmentTimeInput) {
            appointmentTimeInput.value = timeString;
            
            // Update visual selection
            document.querySelectorAll('.slot-btn').forEach(btn => {
                btn.classList.remove('selected');
                if (btn.getAttribute('data-time') === timeString) {
                    btn.classList.add('selected');
                }
            });

            // Trigger change event
            appointmentTimeInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
    },

    // Setup event listeners for slot loading
    setupSlotEventListeners() {
        const providerSelect = document.getElementById('providerId');
        const facilitySelect = document.getElementById('facilityId');
        const dateInput = document.getElementById('appointmentDate');

        if (providerSelect) {
            providerSelect.addEventListener('change', () => {
                this.loadAvailableSlots();
            });
        }

        if (facilitySelect) {
            facilitySelect.addEventListener('change', () => {
                this.loadAvailableSlots();
            });
        }

        if (dateInput) {
            dateInput.addEventListener('change', () => {
                this.loadAvailableSlots();
            });
        }
    }
};

