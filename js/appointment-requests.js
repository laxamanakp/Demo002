// ============================================================
// MyHubCares - Appointment Request & Approval Workflow
// ============================================================
// This module handles the patient appointment request flow
// with Case Manager approval process.
// ============================================================

const AppointmentRequests = {
    // Status constants
    STATUS: {
        PENDING: 'pending',
        APPROVED: 'approved',
        DECLINED: 'declined',
        CANCELLED: 'cancelled'
    },

    // ========== PAGE LOADERS ==========

    // Load Appointment Requests Page (Case Manager / Admin view)
    loadRequestsPage(container) {
        const role = Auth.getCurrentUser().role;
        
        if (!this.canReviewRequests(role)) {
            container.innerHTML = '<div class="alert alert-danger">Access denied. Only Case Managers and Admins can review appointment requests.</div>';
            return;
        }

        const requests = this.getAllRequests();
        const pendingCount = requests.filter(r => r.status === this.STATUS.PENDING).length;

        let html = `
            <div class="patient-list-header">
                <div>
                    <h2>📋 Appointment Requests</h2>
                    <p>Review and manage patient appointment requests</p>
                </div>
                <div class="d-flex gap-2">
                    <span class="badge badge-warning" style="font-size: 1rem; padding: 0.5rem 1rem;">
                        ${pendingCount} Pending
                    </span>
                </div>
            </div>

            <div class="card mt-3">
                <div class="card-header">
                    <div class="search-filter-bar">
                        <input type="text" id="requestSearch" placeholder="Search by patient name..." class="search-input">
                        <select id="statusFilter" onchange="AppointmentRequests.filterByStatus(this.value)">
                            <option value="all">All Status</option>
                            <option value="pending" selected>Pending</option>
                            <option value="approved">Approved</option>
                            <option value="declined">Declined</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>
                <div class="card-body">
                    <div id="requestsList">
                        ${this.renderRequestsList(requests.filter(r => r.status === this.STATUS.PENDING))}
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;

        // Setup search
        const searchInput = document.getElementById('requestSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterRequests(e.target.value);
            });
        }
    },

    // Load Patient's Own Requests Page
    loadMyRequestsPage(container) {
        const currentUser = Auth.getCurrentUser();
        const patientId = currentUser.patientId || currentUser.userId;
        const requests = this.getRequestsByPatient(patientId);

        let html = `
            <div class="patient-list-header">
                <div>
                    <h2>📝 My Appointment Requests</h2>
                    <p>Track the status of your appointment requests</p>
                </div>
                <button class="btn btn-primary" onclick="AppointmentRequests.showRequestModal()">
                    ➕ Request New Appointment
                </button>
            </div>

            <div class="card mt-3">
                <div class="card-body">
                    ${requests.length > 0 ? this.renderPatientRequestsList(requests) : 
                        '<p class="text-muted text-center py-4">No appointment requests yet. Click "Request New Appointment" to get started.</p>'}
                </div>
            </div>
        `;

        container.innerHTML = html;
    },

    // ========== RENDER FUNCTIONS ==========

    // Render requests list for Case Manager
    renderRequestsList(requests) {
        if (requests.length === 0) {
            return '<p class="text-muted text-center py-4">No appointment requests found.</p>';
        }

        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const facilities = JSON.parse(localStorage.getItem('facilities')) || [];
        const users = JSON.parse(localStorage.getItem('users')) || [];

        return requests.map(req => {
            const patient = patients.find(p => p.id === req.patient_id);
            const facility = facilities.find(f => f.id === req.facility_id);
            const provider = users.find(u => u.id === req.provider_id);
            const requestDate = new Date(req.requested_date);

            let statusBadge = this.getStatusBadge(req.status);
            let actionButtons = '';

            if (req.status === this.STATUS.PENDING) {
                actionButtons = `
                    <button class="btn btn-sm btn-success" onclick="AppointmentRequests.showApproveModal('${req.request_id}')">
                        ✅ Approve
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="AppointmentRequests.showDeclineModal('${req.request_id}')">
                        ❌ Decline
                    </button>
                `;
            }

            return `
                <div class="patient-card request-card" data-status="${req.status}" data-patient="${patient ? (patient.firstName + ' ' + patient.lastName).toLowerCase() : ''}">
                    <div class="patient-info">
                        <div>
                            <div class="d-flex align-center gap-2 mb-1">
                                <h3>${patient ? patient.firstName + ' ' + patient.lastName : 'Unknown Patient'}</h3>
                                ${statusBadge}
                            </div>
                            <div class="patient-meta">
                                <span>📅 ${requestDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                <span>⏰ ${req.requested_time}</span>
                            </div>
                            <div class="patient-meta mt-1">
                                <span>🏥 ${facility ? facility.name : 'N/A'}</span>
                                <span>👨‍⚕️ ${provider ? provider.fullName : 'N/A'}</span>
                            </div>
                            <div class="mt-1">
                                <span class="badge badge-info">${req.appointment_type}</span>
                            </div>
                            ${req.patient_notes ? `<p class="mt-2 text-muted"><em>"${req.patient_notes}"</em></p>` : ''}
                            <p class="text-muted mt-1" style="font-size: 0.85rem;">
                                Submitted: ${new Date(req.created_at).toLocaleString()}
                            </p>
                        </div>
                    </div>
                    <div class="patient-actions">
                        <button class="btn btn-sm btn-outline" onclick="Patients.viewPatient(${req.patient_id})">
                            👤 View Patient
                        </button>
                        ${actionButtons}
                    </div>
                </div>
            `;
        }).join('');
    },

    // Render patient's own requests list
    renderPatientRequestsList(requests) {
        const facilities = JSON.parse(localStorage.getItem('facilities')) || [];
        const users = JSON.parse(localStorage.getItem('users')) || [];

        return requests.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map(req => {
            const facility = facilities.find(f => f.id === req.facility_id);
            const provider = users.find(u => u.id === req.provider_id);
            const requestDate = new Date(req.requested_date);

            let statusBadge = this.getStatusBadge(req.status);
            let statusMessage = '';
            let cancelButton = '';

            if (req.status === this.STATUS.PENDING) {
                statusMessage = '<p class="text-warning mt-2">⏳ Waiting for Case Manager approval...</p>';
                cancelButton = `
                    <button class="btn btn-sm btn-outline" onclick="AppointmentRequests.cancelRequest('${req.request_id}')">
                        Cancel Request
                    </button>
                `;
            } else if (req.status === this.STATUS.APPROVED) {
                statusMessage = `<p class="text-success mt-2">✅ Approved! Your appointment is confirmed.</p>`;
                if (req.review_notes) {
                    statusMessage += `<p class="text-muted"><em>Note: ${req.review_notes}</em></p>`;
                }
            } else if (req.status === this.STATUS.DECLINED) {
                statusMessage = `<p class="text-danger mt-2">❌ Request was declined.</p>`;
                if (req.decline_reason) {
                    statusMessage += `<p class="text-muted"><em>Reason: ${req.decline_reason}</em></p>`;
                }
            }

            return `
                <div class="patient-card">
                    <div class="patient-info">
                        <div>
                            <div class="d-flex align-center gap-2 mb-1">
                                <strong>${requestDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>
                                ${statusBadge}
                            </div>
                            <div class="patient-meta">
                                <span>⏰ ${req.requested_time}</span>
                                <span>🏥 ${facility ? facility.name : 'N/A'}</span>
                                <span>👨‍⚕️ ${provider ? provider.fullName : 'N/A'}</span>
                            </div>
                            <div class="mt-1">
                                <span class="badge badge-info">${req.appointment_type}</span>
                            </div>
                            ${statusMessage}
                        </div>
                    </div>
                    <div class="patient-actions">
                        ${cancelButton}
                    </div>
                </div>
            `;
        }).join('');
    },

    // Get status badge HTML
    getStatusBadge(status) {
        const badges = {
            pending: '<span class="badge badge-warning">🟡 Pending</span>',
            approved: '<span class="badge badge-success">✅ Approved</span>',
            declined: '<span class="badge badge-danger">❌ Declined</span>',
            cancelled: '<span class="badge badge-secondary">⚪ Cancelled</span>'
        };
        return badges[status] || '<span class="badge badge-secondary">Unknown</span>';
    },

    // ========== MODAL FUNCTIONS ==========

    // Show appointment request modal (for patients)
    showRequestModal() {
        const currentUser = Auth.getCurrentUser();
        const facilities = JSON.parse(localStorage.getItem('facilities')) || [];
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const providers = users.filter(u => ['physician', 'nurse'].includes(u.role));

        // For patient users, auto-set patient ID
        let patientSelect = '';
        if (currentUser.role === 'patient') {
            patientSelect = `<input type="hidden" id="reqPatientId" value="${currentUser.patientId}">`;
        } else {
            const patients = JSON.parse(localStorage.getItem('patients')) || [];
            patientSelect = `
                <div class="form-group">
                    <label class="required">Patient</label>
                    <select id="reqPatientId" required>
                        <option value="">Select Patient</option>
                        ${patients.map(p => `<option value="${p.id}">${p.firstName} ${p.lastName}</option>`).join('')}
                    </select>
                </div>
            `;
        }

        const content = `
            <form id="appointmentRequestForm">
                ${patientSelect}
                
                <div class="form-group">
                    <label class="required">MyHubCares Branch</label>
                    <select id="reqFacilityId" required onchange="AppointmentRequests.loadAvailableSlots()">
                        <option value="">Select Branch</option>
                        ${facilities.map(f => `<option value="${f.id}">${f.name}</option>`).join('')}
                    </select>
                </div>

                <div class="form-group">
                    <label class="required">Provider</label>
                    <select id="reqProviderId" required onchange="AppointmentRequests.loadAvailableSlots()">
                        <option value="">Select Provider</option>
                        ${providers.map(p => `<option value="${p.id}">${p.fullName} (${p.role})</option>`).join('')}
                    </select>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label class="required">Preferred Date</label>
                        <input type="date" id="reqDate" required min="${new Date().toISOString().split('T')[0]}" onchange="AppointmentRequests.loadAvailableSlots()">
                    </div>
                    <div class="form-group">
                        <label class="required">Preferred Time</label>
                        <select id="reqTime" required>
                            <option value="">Select time after choosing date</option>
                        </select>
                    </div>
                </div>

                <div id="availableSlotsContainer" class="mb-3" style="display: none;">
                    <label>Available Time Slots</label>
                    <div id="availableSlots" class="d-flex gap-2 flex-wrap mt-1"></div>
                </div>

                <div class="form-group">
                    <label class="required">Appointment Type</label>
                    <select id="reqType" required>
                        <option value="">Select Type</option>
                        <option value="Initial Consultation">Initial Consultation</option>
                        <option value="Follow-up Consultation">Follow-up Consultation</option>
                        <option value="ART Pickup">ART Pickup</option>
                        <option value="Lab Test">Lab Test</option>
                        <option value="Counseling">Counseling</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Notes / Reason for Visit (Optional)</label>
                    <textarea id="reqNotes" rows="3" placeholder="Please describe the reason for your appointment..."></textarea>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="AppointmentRequests.submitRequest()">📤 Submit Request</button>
        `;

        App.showModal('📅 Request Appointment', content, footer);
    },

    // Load available time slots based on selections
    loadAvailableSlots() {
        const facilityId = parseInt(document.getElementById('reqFacilityId').value);
        const providerId = parseInt(document.getElementById('reqProviderId').value);
        const date = document.getElementById('reqDate').value;
        const timeSelect = document.getElementById('reqTime');
        const slotsContainer = document.getElementById('availableSlotsContainer');
        const slotsDiv = document.getElementById('availableSlots');

        if (!facilityId || !providerId || !date) {
            slotsContainer.style.display = 'none';
            timeSelect.innerHTML = '<option value="">Select time after choosing date</option>';
            return;
        }

        // Get availability slots
        const slots = JSON.parse(localStorage.getItem('availability_slots')) || [];
        const availableSlots = slots.filter(slot =>
            slot.provider_id === providerId &&
            slot.facility_id === facilityId &&
            slot.slot_date === date &&
            slot.slot_status === 'available'
        );

        // Generate time options
        let timeOptions = '<option value="">Select Time</option>';
        const timeSlots = this.generateTimeSlots(availableSlots);
        
        timeSlots.forEach(time => {
            timeOptions += `<option value="${time}">${time}</option>`;
        });

        timeSelect.innerHTML = timeOptions;

        // Show available slots visually
        if (timeSlots.length > 0) {
            slotsContainer.style.display = 'block';
            slotsDiv.innerHTML = timeSlots.map(time => `
                <button type="button" class="btn btn-outline btn-sm slot-btn" onclick="AppointmentRequests.selectTimeSlot('${time}')">
                    ${time}
                </button>
            `).join('');
        } else {
            slotsContainer.style.display = 'block';
            slotsDiv.innerHTML = '<p class="text-warning">No available slots for this date. Please try another date.</p>';
        }
    },

    // Generate time slots from availability
    generateTimeSlots(availableSlots) {
        const times = [];
        
        if (availableSlots.length === 0) {
            // Default business hours if no slots defined
            for (let hour = 9; hour <= 16; hour++) {
                times.push(`${hour.toString().padStart(2, '0')}:00`);
                if (hour < 16) times.push(`${hour.toString().padStart(2, '0')}:30`);
            }
        } else {
            // Generate times from available slots
            availableSlots.forEach(slot => {
                const startHour = parseInt(slot.start_time.split(':')[0]);
                const endHour = parseInt(slot.end_time.split(':')[0]);
                
                for (let hour = startHour; hour < endHour; hour++) {
                    const time = `${hour.toString().padStart(2, '0')}:00`;
                    if (!times.includes(time)) times.push(time);
                    
                    const halfTime = `${hour.toString().padStart(2, '0')}:30`;
                    if (!times.includes(halfTime) && hour < endHour - 1) times.push(halfTime);
                }
            });
        }
        
        return times.sort();
    },

    // Select time slot button handler
    selectTimeSlot(time) {
        document.getElementById('reqTime').value = time;
        
        // Update button styles
        document.querySelectorAll('.slot-btn').forEach(btn => {
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-outline');
        });
        event.target.classList.remove('btn-outline');
        event.target.classList.add('btn-primary');
    },

    // Submit appointment request
    submitRequest() {
        const form = document.getElementById('appointmentRequestForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const currentUser = Auth.getCurrentUser();
        const patientId = parseInt(document.getElementById('reqPatientId').value);
        const facilityId = parseInt(document.getElementById('reqFacilityId').value);
        const providerId = parseInt(document.getElementById('reqProviderId').value);
        const date = document.getElementById('reqDate').value;
        const time = document.getElementById('reqTime').value;
        const type = document.getElementById('reqType').value;
        const notes = document.getElementById('reqNotes').value;

        const newRequest = {
            request_id: 'req_' + Date.now(),
            patient_id: patientId,
            facility_id: facilityId,
            provider_id: providerId,
            requested_date: date,
            requested_time: time,
            appointment_type: type,
            patient_notes: notes,
            status: this.STATUS.PENDING,
            reviewed_by: null,
            reviewed_at: null,
            review_notes: null,
            decline_reason: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            created_by: currentUser.userId,
            appointment_id: null
        };

        // Save request
        const requests = this.getAllRequests();
        requests.push(newRequest);
        localStorage.setItem('appointment_requests', JSON.stringify(requests));

        // Create notification for Case Managers
        this.createNotification({
            type: 'new_request',
            request_id: newRequest.request_id,
            message: 'New appointment request submitted',
            for_role: 'case_manager'
        });

        // Log audit
        if (typeof logAudit === 'function') {
            logAudit('create', 'appointment_requests', 'Patient submitted appointment request', newRequest.request_id);
        }

        App.closeModal();
        App.showSuccess('✅ Appointment request submitted successfully! A Case Manager will review your request shortly.');
        
        // Reload appropriate page
        if (currentUser.role === 'patient') {
            this.loadMyRequestsPage(document.getElementById('contentArea'));
        } else {
            App.loadPage('appointments');
        }
    },

    // Show approve modal
    showApproveModal(requestId) {
        const request = this.getRequestById(requestId);
        if (!request) {
            App.showError('Request not found');
            return;
        }

        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const facilities = JSON.parse(localStorage.getItem('facilities')) || [];
        const users = JSON.parse(localStorage.getItem('users')) || [];

        const patient = patients.find(p => p.id === request.patient_id);
        const facility = facilities.find(f => f.id === request.facility_id);
        const provider = users.find(u => u.id === request.provider_id);

        const content = `
            <div class="alert alert-info">
                You are about to approve this appointment request.
            </div>
            
            <div class="card mb-3">
                <div class="card-body">
                    <p><strong>Patient:</strong> ${patient ? patient.firstName + ' ' + patient.lastName : 'N/A'}</p>
                    <p><strong>Date:</strong> ${new Date(request.requested_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p><strong>Time:</strong> ${request.requested_time}</p>
                    <p><strong>Branch:</strong> ${facility ? facility.name : 'N/A'}</p>
                    <p><strong>Provider:</strong> ${provider ? provider.fullName : 'N/A'}</p>
                    <p><strong>Type:</strong> ${request.appointment_type}</p>
                </div>
            </div>

            <div class="form-group">
                <label>Notes to Patient (Optional)</label>
                <textarea id="approvalNotes" rows="3" placeholder="e.g., Please arrive 15 minutes early..."></textarea>
            </div>

            <div class="form-group">
                <label>
                    <input type="checkbox" id="notifyPatient" checked> Send notification to patient
                </label>
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="notifyProvider"> Send notification to provider
                </label>
            </div>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-success" onclick="AppointmentRequests.approveRequest('${requestId}')">✅ Confirm Approval</button>
        `;

        App.showModal('✅ Approve Appointment Request', content, footer);
    },

    // Approve request
    approveRequest(requestId) {
        const currentUser = Auth.getCurrentUser();
        const notes = document.getElementById('approvalNotes').value;
        const notifyPatient = document.getElementById('notifyPatient').checked;
        const notifyProvider = document.getElementById('notifyProvider').checked;

        const requests = this.getAllRequests();
        const index = requests.findIndex(r => r.request_id === requestId);
        
        if (index === -1) {
            App.showError('Request not found');
            return;
        }

        const request = requests[index];

        // Update request status
        requests[index] = {
            ...request,
            status: this.STATUS.APPROVED,
            reviewed_by: currentUser.userId,
            reviewed_at: new Date().toISOString(),
            review_notes: notes,
            updated_at: new Date().toISOString()
        };

        // Create the actual appointment
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        const newAppointment = {
            id: appointments.length > 0 ? Math.max(...appointments.map(a => a.id)) + 1 : 1,
            patientId: request.patient_id,
            facilityId: request.facility_id,
            providerId: request.provider_id,
            appointmentDate: request.requested_date,
            appointmentTime: request.requested_time,
            type: request.appointment_type,
            status: 'scheduled',
            notes: request.patient_notes,
            requestId: requestId,
            createdAt: new Date().toISOString()
        };

        appointments.push(newAppointment);
        requests[index].appointment_id = newAppointment.id;

        // Save both
        localStorage.setItem('appointment_requests', JSON.stringify(requests));
        localStorage.setItem('appointments', JSON.stringify(appointments));

        // Schedule reminder
        if (typeof Appointments !== 'undefined' && Appointments.scheduleReminder) {
            Appointments.scheduleReminder(newAppointment);
        }

        // Send notifications
        if (notifyPatient) {
            this.createNotification({
                type: 'request_approved',
                request_id: requestId,
                patient_id: request.patient_id,
                message: `Your appointment for ${request.requested_date} at ${request.requested_time} has been approved!`
            });
        }

        if (notifyProvider) {
            this.createNotification({
                type: 'new_appointment',
                appointment_id: newAppointment.id,
                provider_id: request.provider_id,
                message: `New appointment scheduled for ${request.requested_date} at ${request.requested_time}`
            });
        }

        // Log audit
        if (typeof logAudit === 'function') {
            logAudit('update', 'appointment_requests', 'Appointment request approved', requestId);
        }

        App.closeModal();
        App.showSuccess('✅ Appointment request approved! The appointment has been scheduled.');
        this.loadRequestsPage(document.getElementById('contentArea'));
    },

    // Show decline modal
    showDeclineModal(requestId) {
        const request = this.getRequestById(requestId);
        if (!request) {
            App.showError('Request not found');
            return;
        }

        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const patient = patients.find(p => p.id === request.patient_id);

        const content = `
            <div class="alert alert-warning">
                You are about to decline this appointment request for ${patient ? patient.firstName + ' ' + patient.lastName : 'the patient'}.
            </div>

            <div class="form-group">
                <label class="required">Reason for Declining</label>
                <select id="declineReasonSelect" required onchange="AppointmentRequests.toggleOtherReason()">
                    <option value="">Select a reason</option>
                    <option value="Provider not available">Provider not available on selected date</option>
                    <option value="Time slot already booked">Time slot has been booked</option>
                    <option value="Patient needs different appointment type">Patient requires different service</option>
                    <option value="Facility closed">Facility closed on selected date</option>
                    <option value="Scheduling conflict">Scheduling conflict</option>
                    <option value="other">Other (specify below)</option>
                </select>
            </div>

            <div class="form-group" id="otherReasonGroup" style="display: none;">
                <label class="required">Specify Reason</label>
                <textarea id="otherReasonText" rows="2" placeholder="Please specify the reason..."></textarea>
            </div>

            <div class="form-group">
                <label>Additional Notes to Patient</label>
                <textarea id="declineNotes" rows="3" placeholder="Please select another date or provider..."></textarea>
            </div>

            <div class="form-group">
                <label>
                    <input type="checkbox" id="notifyPatientDecline" checked> Send notification to patient
                </label>
            </div>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-danger" onclick="AppointmentRequests.declineRequest('${requestId}')">❌ Confirm Decline</button>
        `;

        App.showModal('❌ Decline Appointment Request', content, footer);
    },

    // Toggle other reason textarea
    toggleOtherReason() {
        const select = document.getElementById('declineReasonSelect');
        const otherGroup = document.getElementById('otherReasonGroup');
        otherGroup.style.display = select.value === 'other' ? 'block' : 'none';
    },

    // Decline request
    declineRequest(requestId) {
        const currentUser = Auth.getCurrentUser();
        const reasonSelect = document.getElementById('declineReasonSelect').value;
        const otherReason = document.getElementById('otherReasonText').value;
        const notes = document.getElementById('declineNotes').value;
        const notifyPatient = document.getElementById('notifyPatientDecline').checked;

        if (!reasonSelect) {
            App.showError('Please select a reason for declining');
            return;
        }

        const declineReason = reasonSelect === 'other' ? otherReason : reasonSelect;

        if (reasonSelect === 'other' && !otherReason.trim()) {
            App.showError('Please specify the reason');
            return;
        }

        const requests = this.getAllRequests();
        const index = requests.findIndex(r => r.request_id === requestId);
        
        if (index === -1) {
            App.showError('Request not found');
            return;
        }

        const request = requests[index];

        // Update request status
        requests[index] = {
            ...request,
            status: this.STATUS.DECLINED,
            reviewed_by: currentUser.userId,
            reviewed_at: new Date().toISOString(),
            decline_reason: declineReason,
            review_notes: notes,
            updated_at: new Date().toISOString()
        };

        localStorage.setItem('appointment_requests', JSON.stringify(requests));

        // Send notification
        if (notifyPatient) {
            this.createNotification({
                type: 'request_declined',
                request_id: requestId,
                patient_id: request.patient_id,
                message: `Your appointment request for ${request.requested_date} was declined. Reason: ${declineReason}`
            });
        }

        // Log audit
        if (typeof logAudit === 'function') {
            logAudit('update', 'appointment_requests', 'Appointment request declined', requestId);
        }

        App.closeModal();
        App.showSuccess('Request has been declined and patient notified.');
        this.loadRequestsPage(document.getElementById('contentArea'));
    },

    // Cancel request (patient)
    cancelRequest(requestId) {
        if (!confirm('Are you sure you want to cancel this appointment request?')) {
            return;
        }

        const requests = this.getAllRequests();
        const index = requests.findIndex(r => r.request_id === requestId);
        
        if (index === -1) {
            App.showError('Request not found');
            return;
        }

        requests[index].status = this.STATUS.CANCELLED;
        requests[index].updated_at = new Date().toISOString();

        localStorage.setItem('appointment_requests', JSON.stringify(requests));

        App.showSuccess('Appointment request cancelled');
        this.loadMyRequestsPage(document.getElementById('contentArea'));
    },

    // ========== FILTER FUNCTIONS ==========

    // Filter by status
    filterByStatus(status) {
        const requests = this.getAllRequests();
        const filtered = status === 'all' ? requests : requests.filter(r => r.status === status);
        document.getElementById('requestsList').innerHTML = this.renderRequestsList(filtered);
    },

    // Filter by search term
    filterRequests(searchTerm) {
        const statusFilter = document.getElementById('statusFilter').value;
        let requests = this.getAllRequests();
        
        if (statusFilter !== 'all') {
            requests = requests.filter(r => r.status === statusFilter);
        }

        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        
        if (searchTerm.trim()) {
            requests = requests.filter(req => {
                const patient = patients.find(p => p.id === req.patient_id);
                const patientName = patient ? `${patient.firstName} ${patient.lastName}`.toLowerCase() : '';
                return patientName.includes(searchTerm.toLowerCase());
            });
        }

        document.getElementById('requestsList').innerHTML = this.renderRequestsList(requests);
    },

    // ========== HELPER FUNCTIONS ==========

    // Get all requests
    getAllRequests() {
        return JSON.parse(localStorage.getItem('appointment_requests')) || [];
    },

    // Get request by ID
    getRequestById(requestId) {
        const requests = this.getAllRequests();
        return requests.find(r => r.request_id === requestId);
    },

    // Get requests by patient
    getRequestsByPatient(patientId) {
        const requests = this.getAllRequests();
        return requests.filter(r => r.patient_id === patientId);
    },

    // Get pending requests count
    getPendingCount() {
        const requests = this.getAllRequests();
        return requests.filter(r => r.status === this.STATUS.PENDING).length;
    },

    // Check if user can review requests
    canReviewRequests(role) {
        return ['admin', 'case_manager'].includes(role);
    },

    // Create notification
    createNotification(notification) {
        const notifications = JSON.parse(localStorage.getItem('appointment_notifications')) || [];
        notifications.push({
            id: 'notif_' + Date.now(),
            ...notification,
            read: false,
            created_at: new Date().toISOString()
        });
        localStorage.setItem('appointment_notifications', JSON.stringify(notifications));
    },

    // Get Case Manager dashboard widget
    getCaseManagerWidget() {
        const pendingCount = this.getPendingCount();
        if (pendingCount === 0) return '';

        const requests = this.getAllRequests().filter(r => r.status === this.STATUS.PENDING).slice(0, 3);
        const patients = JSON.parse(localStorage.getItem('patients')) || [];

        return `
            <div class="card mt-3">
                <div class="card-header">
                    <h3 class="card-title">📋 Pending Appointment Requests</h3>
                    <span class="badge badge-warning">${pendingCount} Pending</span>
                </div>
                <div class="card-body">
                    ${requests.map(req => {
                        const patient = patients.find(p => p.id === req.patient_id);
                        return `
                            <div class="d-flex justify-between align-center mb-2 p-2" style="border-bottom: 1px solid var(--border-color);">
                                <div>
                                    <strong>${patient ? patient.firstName + ' ' + patient.lastName : 'Unknown'}</strong><br>
                                    <span class="text-muted">${new Date(req.requested_date).toLocaleDateString()} at ${req.requested_time}</span>
                                </div>
                                <button class="btn btn-sm btn-primary" onclick="App.loadPage('appointment-requests')">Review</button>
                            </div>
                        `;
                    }).join('')}
                    <div class="text-center mt-2">
                        <button class="btn btn-outline" onclick="App.loadPage('appointment-requests')">View All Requests</button>
                    </div>
                </div>
            </div>
        `;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppointmentRequests;
}

