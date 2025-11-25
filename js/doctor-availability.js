// ============================================================
// MyHubCares - Admin Doctor Availability Management
// ============================================================
// This module handles admin-only doctor scheduling, conflicts,
// and availability management with lock protection.
// ============================================================

const DoctorAvailability = {
    // Status constants
    SLOT_STATUS: {
        AVAILABLE: 'available',
        BOOKED: 'booked',
        BLOCKED: 'blocked',
        CONFLICT: 'conflict',
        LOCKED: 'locked'
    },

    // ========== PAGE LOADERS ==========

    // Load Doctor Availability Management Page (Admin Only)
    loadDoctorAvailabilityPage(container) {
        const role = Auth.getCurrentUser().role;
        
        if (role !== 'admin') {
            container.innerHTML = '<div class="alert alert-danger">⛔ Access denied. Only Admin can manage doctor availability.</div>';
            return;
        }

        const settings = this.getSchedulingSettings();
        const selectedDate = new Date().toISOString().split('T')[0];

        let html = `
            <div class="patient-list-header">
                <div>
                    <h2>👨‍⚕️ Doctor Availability Management</h2>
                    <p>Assign doctors to specific days, manage conflicts and agendas</p>
                </div>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary" onclick="DoctorAvailability.showAssignDoctorModal()">
                        ➕ Assign Doctor to Day
                    </button>
                    <button class="btn btn-outline" onclick="DoctorAvailability.showSettingsModal()">
                        ⚙️ Scheduling Settings
                    </button>
                </div>
            </div>

            <div class="stats-grid mt-3">
                <div class="stat-card">
                    <div class="stat-icon" style="background: var(--primary-gradient);">👨‍⚕️</div>
                    <div class="stat-info">
                        <span class="stat-value">${settings.maxPatientsPerDay}</span>
                        <span class="stat-label">Max Patients/Day</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon" style="background: linear-gradient(135deg, #10b981, #059669);">📅</div>
                    <div class="stat-info">
                        <span class="stat-value">${settings.maxSlotsPerDoctor}</span>
                        <span class="stat-label">Max Slots/Doctor</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon" style="background: linear-gradient(135deg, #f59e0b, #d97706);">⏰</div>
                    <div class="stat-info">
                        <span class="stat-value">${settings.slotDurationMinutes} min</span>
                        <span class="stat-label">Slot Duration</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon" style="background: linear-gradient(135deg, #ef4444, #dc2626);">🔒</div>
                    <div class="stat-info">
                        <span class="stat-value">${this.getLockedSlotsCount()}</span>
                        <span class="stat-label">Locked Schedules</span>
                    </div>
                </div>
            </div>

            <div class="tabs mt-3">
                <div class="tab active" data-tab="daily">Daily View</div>
                <div class="tab" data-tab="weekly">Weekly Overview</div>
                <div class="tab" data-tab="conflicts">Conflicts & Agendas</div>
                <div class="tab" data-tab="locked">Locked Schedules</div>
            </div>

            <div class="tab-content active" id="dailyTab">
                ${this.renderDailyView(selectedDate)}
            </div>

            <div class="tab-content" id="weeklyTab">
                ${this.renderWeeklyOverview()}
            </div>

            <div class="tab-content" id="conflictsTab">
                ${this.renderConflictsTab()}
            </div>

            <div class="tab-content" id="lockedTab">
                ${this.renderLockedSchedulesTab()}
            </div>
        `;

        container.innerHTML = html;
        this.setupTabs();
    },

    // Setup tabs
    setupTabs() {
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.getAttribute('data-tab');
                
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                document.getElementById(tabName + 'Tab').classList.add('active');
            });
        });
    },

    // ========== RENDER FUNCTIONS ==========

    renderDailyView(selectedDate) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const doctors = users.filter(u => u.role === 'physician');
        const slots = JSON.parse(localStorage.getItem('availability_slots')) || [];
        const assignments = JSON.parse(localStorage.getItem('doctor_assignments')) || [];
        const conflicts = JSON.parse(localStorage.getItem('doctor_conflicts')) || [];
        
        const todayAssignments = assignments.filter(a => a.date === selectedDate);
        const todayConflicts = conflicts.filter(c => c.date === selectedDate);

        return `
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">📅 Daily Doctor Schedule</h3>
                    <div class="d-flex gap-2 align-center">
                        <input type="date" id="dailyDateSelector" value="${selectedDate}" 
                               onchange="DoctorAvailability.refreshDailyView(this.value)" 
                               style="padding: 0.5rem; border-radius: var(--border-radius-sm); border: 1px solid var(--border-color);">
                    </div>
                </div>
                <div class="card-body">
                    <div id="dailyScheduleContent">
                        ${this.renderDailyScheduleTable(selectedDate, doctors, todayAssignments, todayConflicts)}
                    </div>
                </div>
            </div>
        `;
    },

    renderDailyScheduleTable(date, doctors, assignments, conflicts) {
        if (doctors.length === 0) {
            return '<p class="text-muted text-center py-4">No doctors registered in the system.</p>';
        }

        const facilities = JSON.parse(localStorage.getItem('facilities')) || [];

        return `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Doctor</th>
                            <th>Status</th>
                            <th>Facility</th>
                            <th>Time Slot</th>
                            <th>Max Patients</th>
                            <th>Conflict/Agenda</th>
                            <th>Lock Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${doctors.map(doctor => {
                            const assignment = assignments.find(a => a.doctorId === doctor.id);
                            const conflict = conflicts.find(c => c.doctorId === doctor.id);
                            const facility = assignment ? facilities.find(f => f.id === assignment.facilityId) : null;
                            const isLocked = assignment && assignment.isLocked;
                            
                            return `
                                <tr class="${isLocked ? 'locked-row' : ''}">
                                    <td><strong>${doctor.fullName}</strong></td>
                                    <td>
                                        ${assignment ? 
                                            '<span class="badge badge-success">✅ Assigned</span>' : 
                                            conflict ?
                                            '<span class="badge badge-danger">❌ Conflict</span>' :
                                            '<span class="badge badge-secondary">⚪ Not Assigned</span>'
                                        }
                                    </td>
                                    <td>${facility ? facility.name : '-'}</td>
                                    <td>${assignment ? `${assignment.startTime} - ${assignment.endTime}` : '-'}</td>
                                    <td>${assignment ? assignment.maxPatients : '-'}</td>
                                    <td>${conflict ? `<span class="text-danger">${conflict.reason}</span>` : '-'}</td>
                                    <td>
                                        ${isLocked ? 
                                            '<span class="badge badge-warning">🔒 Locked</span>' : 
                                            '<span class="badge badge-info">🔓 Editable</span>'
                                        }
                                    </td>
                                    <td>
                                        <div class="table-actions">
                                            ${!assignment && !conflict ? `
                                                <button class="btn btn-sm btn-primary" onclick="DoctorAvailability.showAssignDoctorModal('${date}', ${doctor.id})">
                                                    Assign
                                                </button>
                                                <button class="btn btn-sm btn-outline" onclick="DoctorAvailability.showAddConflictModal('${date}', ${doctor.id})">
                                                    Add Conflict
                                                </button>
                                            ` : ''}
                                            ${assignment && !isLocked ? `
                                                <button class="btn btn-sm btn-outline" onclick="DoctorAvailability.editAssignment('${assignment.id}')">
                                                    Edit
                                                </button>
                                                <button class="btn btn-sm btn-success" onclick="DoctorAvailability.lockAssignment('${assignment.id}')">
                                                    🔒 Lock
                                                </button>
                                                <button class="btn btn-sm btn-danger" onclick="DoctorAvailability.removeAssignment('${assignment.id}')">
                                                    Remove
                                                </button>
                                            ` : ''}
                                            ${assignment && isLocked ? `
                                                <span class="text-muted">🔒 Cannot modify</span>
                                            ` : ''}
                                            ${conflict ? `
                                                <button class="btn btn-sm btn-danger" onclick="DoctorAvailability.removeConflict('${conflict.id}')">
                                                    Remove Conflict
                                                </button>
                                            ` : ''}
                                        </div>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    renderWeeklyOverview() {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const doctors = users.filter(u => u.role === 'physician');
        const assignments = JSON.parse(localStorage.getItem('doctor_assignments')) || [];
        const conflicts = JSON.parse(localStorage.getItem('doctor_conflicts')) || [];
        
        // Get dates for next 7 days
        const dates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            dates.push(date.toISOString().split('T')[0]);
        }

        return `
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">📆 Weekly Doctor Overview</h3>
                </div>
                <div class="card-body">
                    <div class="table-container" style="overflow-x: auto;">
                        <table>
                            <thead>
                                <tr>
                                    <th>Doctor</th>
                                    ${dates.map(d => `<th>${new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</th>`).join('')}
                                </tr>
                            </thead>
                            <tbody>
                                ${doctors.map(doctor => `
                                    <tr>
                                        <td><strong>${doctor.fullName}</strong></td>
                                        ${dates.map(date => {
                                            const assignment = assignments.find(a => a.doctorId === doctor.id && a.date === date);
                                            const conflict = conflicts.find(c => c.doctorId === doctor.id && c.date === date);
                                            
                                            if (assignment) {
                                                return `<td class="text-center">
                                                    <span class="badge badge-success" title="${assignment.startTime}-${assignment.endTime}">
                                                        ${assignment.isLocked ? '🔒' : '✅'}
                                                    </span>
                                                </td>`;
                                            } else if (conflict) {
                                                return `<td class="text-center">
                                                    <span class="badge badge-danger" title="${conflict.reason}">❌</span>
                                                </td>`;
                                            } else {
                                                return `<td class="text-center">
                                                    <button class="btn btn-sm btn-outline" onclick="DoctorAvailability.showAssignDoctorModal('${date}', ${doctor.id})" title="Assign">+</button>
                                                </td>`;
                                            }
                                        }).join('')}
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    <div class="mt-3">
                        <strong>Legend:</strong>
                        <span class="badge badge-success ml-2">✅ Available</span>
                        <span class="badge badge-success ml-2">🔒 Locked</span>
                        <span class="badge badge-danger ml-2">❌ Conflict</span>
                    </div>
                </div>
            </div>
        `;
    },

    renderConflictsTab() {
        const conflicts = JSON.parse(localStorage.getItem('doctor_conflicts')) || [];
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const doctors = users.filter(u => u.role === 'physician');

        return `
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">⚠️ Doctor Conflicts & Agendas</h3>
                    <button class="btn btn-primary btn-sm" onclick="DoctorAvailability.showAddConflictModal()">
                        ➕ Add Conflict/Agenda
                    </button>
                </div>
                <div class="card-body">
                    ${conflicts.length === 0 ? 
                        '<p class="text-muted text-center py-4">No conflicts or agendas recorded.</p>' :
                        `<div class="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Doctor</th>
                                        <th>Date</th>
                                        <th>Type</th>
                                        <th>Reason/Agenda</th>
                                        <th>Created By</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${conflicts.map(conflict => {
                                        const doctor = doctors.find(d => d.id === conflict.doctorId);
                                        return `
                                            <tr>
                                                <td>${doctor ? doctor.fullName : 'Unknown'}</td>
                                                <td>${new Date(conflict.date).toLocaleDateString()}</td>
                                                <td><span class="badge badge-${conflict.type === 'leave' ? 'warning' : conflict.type === 'meeting' ? 'info' : 'danger'}">${conflict.type}</span></td>
                                                <td>${conflict.reason}</td>
                                                <td>${conflict.createdBy || 'Admin'}</td>
                                                <td>
                                                    <button class="btn btn-sm btn-danger" onclick="DoctorAvailability.removeConflict('${conflict.id}')">Remove</button>
                                                </td>
                                            </tr>
                                        `;
                                    }).join('')}
                                </tbody>
                            </table>
                        </div>`
                    }
                </div>
            </div>
        `;
    },

    renderLockedSchedulesTab() {
        const assignments = JSON.parse(localStorage.getItem('doctor_assignments')) || [];
        const lockedAssignments = assignments.filter(a => a.isLocked);
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const facilities = JSON.parse(localStorage.getItem('facilities')) || [];

        return `
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">🔒 Locked Schedules</h3>
                    <p class="text-muted mb-0">These schedules cannot be modified by anyone except Admin unlock.</p>
                </div>
                <div class="card-body">
                    ${lockedAssignments.length === 0 ? 
                        '<p class="text-muted text-center py-4">No locked schedules. Lock schedules to prevent modifications.</p>' :
                        `<div class="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Doctor</th>
                                        <th>Date</th>
                                        <th>Facility</th>
                                        <th>Time</th>
                                        <th>Locked At</th>
                                        <th>Locked By</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${lockedAssignments.map(assignment => {
                                        const doctor = users.find(u => u.id === assignment.doctorId);
                                        const facility = facilities.find(f => f.id === assignment.facilityId);
                                        return `
                                            <tr class="locked-row">
                                                <td>${doctor ? doctor.fullName : 'Unknown'}</td>
                                                <td>${new Date(assignment.date).toLocaleDateString()}</td>
                                                <td>${facility ? facility.name : 'N/A'}</td>
                                                <td>${assignment.startTime} - ${assignment.endTime}</td>
                                                <td>${assignment.lockedAt ? new Date(assignment.lockedAt).toLocaleString() : '-'}</td>
                                                <td>${assignment.lockedBy || 'Admin'}</td>
                                                <td>
                                                    <button class="btn btn-sm btn-warning" onclick="DoctorAvailability.unlockAssignment('${assignment.id}')">
                                                        🔓 Unlock
                                                    </button>
                                                </td>
                                            </tr>
                                        `;
                                    }).join('')}
                                </tbody>
                            </table>
                        </div>`
                    }
                </div>
            </div>
        `;
    },

    // ========== MODAL FUNCTIONS ==========

    showAssignDoctorModal(date = null, doctorId = null) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const doctors = users.filter(u => u.role === 'physician');
        const facilities = JSON.parse(localStorage.getItem('facilities')) || [];
        const settings = this.getSchedulingSettings();
        
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const minDate = tomorrow.toISOString().split('T')[0];
        const defaultDate = date || minDate;

        const content = `
            <form id="assignDoctorForm">
                <div class="alert alert-info">
                    ℹ️ Assign a doctor to be available for appointments on a specific day.
                </div>
                
                <div class="form-group">
                    <label class="required">Doctor</label>
                    <select id="assignDoctorId" required ${doctorId ? 'disabled' : ''}>
                        <option value="">Select Doctor</option>
                        ${doctors.map(d => `<option value="${d.id}" ${d.id === doctorId ? 'selected' : ''}>${d.fullName}</option>`).join('')}
                    </select>
                    ${doctorId ? `<input type="hidden" id="assignDoctorIdHidden" value="${doctorId}">` : ''}
                </div>

                <div class="form-group">
                    <label class="required">Date</label>
                    <input type="date" id="assignDate" value="${defaultDate}" min="${minDate}" required ${date ? 'readonly' : ''}>
                    <small class="text-muted">Cannot assign for today or past dates</small>
                </div>

                <div class="form-group">
                    <label class="required">Facility/Branch</label>
                    <select id="assignFacilityId" required>
                        <option value="">Select Facility</option>
                        ${facilities.map(f => `<option value="${f.id}">${f.name}</option>`).join('')}
                    </select>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label class="required">Start Time</label>
                        <select id="assignStartTime" required>
                            ${this.generateHourlyOptions(8, 17, '08:00')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="required">End Time</label>
                        <select id="assignEndTime" required>
                            ${this.generateHourlyOptions(9, 18, '17:00')}
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label class="required">Max Patients for This Day</label>
                    <input type="number" id="assignMaxPatients" value="${settings.maxSlotsPerDoctor}" min="1" max="${settings.maxPatientsPerDay}" required>
                    <small class="text-muted">Maximum: ${settings.maxPatientsPerDay} patients per day (system limit)</small>
                </div>

                <div class="form-group">
                    <label>Notes/Agenda</label>
                    <textarea id="assignNotes" rows="2" placeholder="Optional notes for this schedule..."></textarea>
                </div>

                <div class="form-group">
                    <label>
                        <input type="checkbox" id="assignLockImmediately"> 🔒 Lock immediately after saving (cannot be edited by others)
                    </label>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="DoctorAvailability.saveAssignment()">💾 Save Assignment</button>
        `;

        App.showModal('👨‍⚕️ Assign Doctor to Day', content, footer);
    },

    showAddConflictModal(date = null, doctorId = null) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const doctors = users.filter(u => u.role === 'physician');
        
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const minDate = tomorrow.toISOString().split('T')[0];
        const defaultDate = date || minDate;

        const content = `
            <form id="addConflictForm">
                <div class="alert alert-warning">
                    ⚠️ Record a conflict or agenda that prevents a doctor from being available.
                </div>
                
                <div class="form-group">
                    <label class="required">Doctor</label>
                    <select id="conflictDoctorId" required ${doctorId ? 'disabled' : ''}>
                        <option value="">Select Doctor</option>
                        ${doctors.map(d => `<option value="${d.id}" ${d.id === doctorId ? 'selected' : ''}>${d.fullName}</option>`).join('')}
                    </select>
                    ${doctorId ? `<input type="hidden" id="conflictDoctorIdHidden" value="${doctorId}">` : ''}
                </div>

                <div class="form-group">
                    <label class="required">Date</label>
                    <input type="date" id="conflictDate" value="${defaultDate}" min="${minDate}" required ${date ? 'readonly' : ''}>
                </div>

                <div class="form-group">
                    <label class="required">Conflict Type</label>
                    <select id="conflictType" required>
                        <option value="">Select Type</option>
                        <option value="leave">📅 Leave/Vacation</option>
                        <option value="meeting">📋 Meeting/Conference</option>
                        <option value="training">📚 Training</option>
                        <option value="personal">👤 Personal</option>
                        <option value="sick">🏥 Sick</option>
                        <option value="other">📝 Other</option>
                    </select>
                </div>

                <div class="form-group">
                    <label class="required">Reason/Details</label>
                    <textarea id="conflictReason" rows="3" placeholder="Describe the reason for unavailability..." required></textarea>
                </div>

                <div class="form-group">
                    <label>
                        <input type="checkbox" id="conflictAllDay" checked> All Day (entire day unavailable)
                    </label>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-danger" onclick="DoctorAvailability.saveConflict()">⚠️ Save Conflict</button>
        `;

        App.showModal('⚠️ Add Doctor Conflict/Agenda', content, footer);
    },

    showSettingsModal() {
        const settings = this.getSchedulingSettings();

        const content = `
            <form id="schedulingSettingsForm">
                <div class="alert alert-info">
                    ⚙️ Configure global scheduling limits and rules.
                </div>
                
                <div class="form-group">
                    <label class="required">Maximum Patients Per Day (Facility)</label>
                    <input type="number" id="settingMaxPatientsPerDay" value="${settings.maxPatientsPerDay}" min="1" max="100" required>
                    <small class="text-muted">Total patients that can be accommodated per day across all doctors</small>
                </div>

                <div class="form-group">
                    <label class="required">Maximum Slots Per Doctor Per Day</label>
                    <input type="number" id="settingMaxSlotsPerDoctor" value="${settings.maxSlotsPerDoctor}" min="1" max="20" required>
                    <small class="text-muted">Maximum appointments each doctor can have per day</small>
                </div>

                <div class="form-group">
                    <label class="required">Slot Duration (Minutes)</label>
                    <select id="settingSlotDuration" required>
                        <option value="60" ${settings.slotDurationMinutes === 60 ? 'selected' : ''}>60 minutes (Hourly) - Recommended</option>
                        <option value="30" ${settings.slotDurationMinutes === 30 ? 'selected' : ''}>30 minutes</option>
                        <option value="45" ${settings.slotDurationMinutes === 45 ? 'selected' : ''}>45 minutes</option>
                    </select>
                    <small class="text-muted">Per requirements: Hourly intervals recommended</small>
                </div>

                <div class="form-group">
                    <label class="required">Minimum Advance Booking (Days)</label>
                    <input type="number" id="settingMinAdvanceDays" value="${settings.minAdvanceDays || 1}" min="1" max="30" required>
                    <small class="text-muted">How many days in advance appointments must be booked (min: 1 = no same-day)</small>
                </div>

                <div class="form-group">
                    <label>
                        <input type="checkbox" id="settingAllowSameDay" ${settings.allowSameDayBooking ? 'checked' : ''} disabled>
                        Allow Same-Day Booking (DISABLED per requirements)
                    </label>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="DoctorAvailability.saveSettings()">💾 Save Settings</button>
        `;

        App.showModal('⚙️ Scheduling Settings', content, footer);
    },

    // ========== SAVE FUNCTIONS ==========

    saveAssignment() {
        const form = document.getElementById('assignDoctorForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const currentUser = Auth.getCurrentUser();
        const doctorId = parseInt(document.getElementById('assignDoctorIdHidden')?.value || document.getElementById('assignDoctorId').value);
        const date = document.getElementById('assignDate').value;
        const facilityId = parseInt(document.getElementById('assignFacilityId').value);
        const startTime = document.getElementById('assignStartTime').value;
        const endTime = document.getElementById('assignEndTime').value;
        const maxPatients = parseInt(document.getElementById('assignMaxPatients').value);
        const notes = document.getElementById('assignNotes').value;
        const lockImmediately = document.getElementById('assignLockImmediately').checked;

        // Validate time range
        if (startTime >= endTime) {
            App.showError('End time must be after start time');
            return;
        }

        // Check for existing assignment
        const assignments = JSON.parse(localStorage.getItem('doctor_assignments')) || [];
        const existingAssignment = assignments.find(a => a.doctorId === doctorId && a.date === date);
        
        if (existingAssignment) {
            App.showError('This doctor is already assigned for this date. Please edit or remove the existing assignment.');
            return;
        }

        // Check for conflicts
        const conflicts = JSON.parse(localStorage.getItem('doctor_conflicts')) || [];
        const hasConflict = conflicts.find(c => c.doctorId === doctorId && c.date === date);
        
        if (hasConflict) {
            App.showError('This doctor has a conflict on this date. Remove the conflict first.');
            return;
        }

        const newAssignment = {
            id: 'assign_' + Date.now(),
            doctorId,
            date,
            facilityId,
            startTime,
            endTime,
            maxPatients,
            notes,
            isLocked: lockImmediately,
            lockedAt: lockImmediately ? new Date().toISOString() : null,
            lockedBy: lockImmediately ? currentUser.fullName : null,
            createdAt: new Date().toISOString(),
            createdBy: currentUser.fullName
        };

        assignments.push(newAssignment);
        localStorage.setItem('doctor_assignments', JSON.stringify(assignments));

        // Also create availability slots for this assignment
        this.createAvailabilitySlots(newAssignment);

        // Log audit
        if (typeof logAudit === 'function') {
            logAudit('create', 'doctor_assignments', `Assigned doctor for ${date}`, newAssignment.id);
        }

        App.closeModal();
        App.showSuccess(`✅ Doctor assigned successfully${lockImmediately ? ' and locked' : ''}!`);
        this.loadDoctorAvailabilityPage(document.getElementById('contentArea'));
    },

    saveConflict() {
        const form = document.getElementById('addConflictForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const currentUser = Auth.getCurrentUser();
        const doctorId = parseInt(document.getElementById('conflictDoctorIdHidden')?.value || document.getElementById('conflictDoctorId').value);
        const date = document.getElementById('conflictDate').value;
        const type = document.getElementById('conflictType').value;
        const reason = document.getElementById('conflictReason').value;
        const allDay = document.getElementById('conflictAllDay').checked;

        // Check for existing assignment
        const assignments = JSON.parse(localStorage.getItem('doctor_assignments')) || [];
        const existingAssignment = assignments.find(a => a.doctorId === doctorId && a.date === date);
        
        if (existingAssignment) {
            if (existingAssignment.isLocked) {
                App.showError('This doctor has a LOCKED assignment on this date. Cannot add conflict.');
                return;
            }
            if (!confirm('This doctor has an existing assignment on this date. Adding a conflict will remove the assignment. Continue?')) {
                return;
            }
            // Remove the assignment
            const index = assignments.findIndex(a => a.id === existingAssignment.id);
            assignments.splice(index, 1);
            localStorage.setItem('doctor_assignments', JSON.stringify(assignments));
        }

        const conflicts = JSON.parse(localStorage.getItem('doctor_conflicts')) || [];
        
        const newConflict = {
            id: 'conflict_' + Date.now(),
            doctorId,
            date,
            type,
            reason,
            allDay,
            createdAt: new Date().toISOString(),
            createdBy: currentUser.fullName
        };

        conflicts.push(newConflict);
        localStorage.setItem('doctor_conflicts', JSON.stringify(conflicts));

        // Log audit
        if (typeof logAudit === 'function') {
            logAudit('create', 'doctor_conflicts', `Added conflict for ${date}: ${reason}`, newConflict.id);
        }

        App.closeModal();
        App.showSuccess('⚠️ Conflict/Agenda recorded successfully!');
        this.loadDoctorAvailabilityPage(document.getElementById('contentArea'));
    },

    saveSettings() {
        const settings = {
            maxPatientsPerDay: parseInt(document.getElementById('settingMaxPatientsPerDay').value),
            maxSlotsPerDoctor: parseInt(document.getElementById('settingMaxSlotsPerDoctor').value),
            slotDurationMinutes: parseInt(document.getElementById('settingSlotDuration').value),
            minAdvanceDays: parseInt(document.getElementById('settingMinAdvanceDays').value),
            allowSameDayBooking: false // Always false per requirements
        };

        localStorage.setItem('scheduling_settings', JSON.stringify(settings));

        // Log audit
        if (typeof logAudit === 'function') {
            logAudit('update', 'scheduling_settings', 'Updated scheduling settings', null);
        }

        App.closeModal();
        App.showSuccess('⚙️ Scheduling settings saved successfully!');
        this.loadDoctorAvailabilityPage(document.getElementById('contentArea'));
    },

    // ========== ACTION FUNCTIONS ==========

    lockAssignment(assignmentId) {
        if (!confirm('🔒 Lock this schedule? Once locked, it cannot be modified by anyone except Admin unlock.')) {
            return;
        }

        const currentUser = Auth.getCurrentUser();
        const assignments = JSON.parse(localStorage.getItem('doctor_assignments')) || [];
        const index = assignments.findIndex(a => a.id === assignmentId);
        
        if (index === -1) {
            App.showError('Assignment not found');
            return;
        }

        assignments[index].isLocked = true;
        assignments[index].lockedAt = new Date().toISOString();
        assignments[index].lockedBy = currentUser.fullName;

        localStorage.setItem('doctor_assignments', JSON.stringify(assignments));

        // Log audit
        if (typeof logAudit === 'function') {
            logAudit('update', 'doctor_assignments', 'Locked doctor schedule', assignmentId);
        }

        App.showSuccess('🔒 Schedule locked successfully!');
        this.loadDoctorAvailabilityPage(document.getElementById('contentArea'));
    },

    unlockAssignment(assignmentId) {
        const role = Auth.getCurrentUser().role;
        if (role !== 'admin') {
            App.showError('Only Admin can unlock schedules');
            return;
        }

        if (!confirm('🔓 Unlock this schedule? It will become editable again.')) {
            return;
        }

        const assignments = JSON.parse(localStorage.getItem('doctor_assignments')) || [];
        const index = assignments.findIndex(a => a.id === assignmentId);
        
        if (index === -1) {
            App.showError('Assignment not found');
            return;
        }

        assignments[index].isLocked = false;
        assignments[index].lockedAt = null;
        assignments[index].lockedBy = null;

        localStorage.setItem('doctor_assignments', JSON.stringify(assignments));

        // Log audit
        if (typeof logAudit === 'function') {
            logAudit('update', 'doctor_assignments', 'Unlocked doctor schedule', assignmentId);
        }

        App.showSuccess('🔓 Schedule unlocked successfully!');
        this.loadDoctorAvailabilityPage(document.getElementById('contentArea'));
    },

    removeAssignment(assignmentId) {
        const assignments = JSON.parse(localStorage.getItem('doctor_assignments')) || [];
        const assignment = assignments.find(a => a.id === assignmentId);
        
        if (!assignment) {
            App.showError('Assignment not found');
            return;
        }

        if (assignment.isLocked) {
            App.showError('🔒 This schedule is locked. Unlock it first to remove.');
            return;
        }

        if (!confirm('Remove this doctor assignment?')) {
            return;
        }

        const filtered = assignments.filter(a => a.id !== assignmentId);
        localStorage.setItem('doctor_assignments', JSON.stringify(filtered));

        // Remove associated availability slots
        this.removeAvailabilitySlots(assignment);

        // Log audit
        if (typeof logAudit === 'function') {
            logAudit('delete', 'doctor_assignments', 'Removed doctor assignment', assignmentId);
        }

        App.showSuccess('Assignment removed successfully!');
        this.loadDoctorAvailabilityPage(document.getElementById('contentArea'));
    },

    removeConflict(conflictId) {
        if (!confirm('Remove this conflict/agenda?')) {
            return;
        }

        const conflicts = JSON.parse(localStorage.getItem('doctor_conflicts')) || [];
        const filtered = conflicts.filter(c => c.id !== conflictId);
        localStorage.setItem('doctor_conflicts', JSON.stringify(filtered));

        // Log audit
        if (typeof logAudit === 'function') {
            logAudit('delete', 'doctor_conflicts', 'Removed doctor conflict', conflictId);
        }

        App.showSuccess('Conflict removed successfully!');
        this.loadDoctorAvailabilityPage(document.getElementById('contentArea'));
    },

    editAssignment(assignmentId) {
        const assignments = JSON.parse(localStorage.getItem('doctor_assignments')) || [];
        const assignment = assignments.find(a => a.id === assignmentId);
        
        if (!assignment) {
            App.showError('Assignment not found');
            return;
        }

        if (assignment.isLocked) {
            App.showError('🔒 This schedule is locked. Unlock it first to edit.');
            return;
        }

        // Show edit modal (similar to add but pre-filled)
        this.showEditAssignmentModal(assignment);
    },

    showEditAssignmentModal(assignment) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const doctors = users.filter(u => u.role === 'physician');
        const facilities = JSON.parse(localStorage.getItem('facilities')) || [];
        const settings = this.getSchedulingSettings();
        const doctor = doctors.find(d => d.id === assignment.doctorId);

        const content = `
            <form id="editAssignmentForm">
                <input type="hidden" id="editAssignmentId" value="${assignment.id}">
                
                <div class="alert alert-info">
                    ℹ️ Editing assignment for <strong>${doctor ? doctor.fullName : 'Unknown'}</strong> on ${new Date(assignment.date).toLocaleDateString()}
                </div>
                
                <div class="form-group">
                    <label class="required">Facility/Branch</label>
                    <select id="editFacilityId" required>
                        ${facilities.map(f => `<option value="${f.id}" ${f.id === assignment.facilityId ? 'selected' : ''}>${f.name}</option>`).join('')}
                    </select>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label class="required">Start Time</label>
                        <select id="editStartTime" required>
                            ${this.generateHourlyOptions(8, 17, assignment.startTime)}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="required">End Time</label>
                        <select id="editEndTime" required>
                            ${this.generateHourlyOptions(9, 18, assignment.endTime)}
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label class="required">Max Patients for This Day</label>
                    <input type="number" id="editMaxPatients" value="${assignment.maxPatients}" min="1" max="${settings.maxPatientsPerDay}" required>
                </div>

                <div class="form-group">
                    <label>Notes/Agenda</label>
                    <textarea id="editNotes" rows="2">${assignment.notes || ''}</textarea>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="DoctorAvailability.updateAssignment()">💾 Update Assignment</button>
        `;

        App.showModal('✏️ Edit Doctor Assignment', content, footer);
    },

    updateAssignment() {
        const form = document.getElementById('editAssignmentForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const assignmentId = document.getElementById('editAssignmentId').value;
        const facilityId = parseInt(document.getElementById('editFacilityId').value);
        const startTime = document.getElementById('editStartTime').value;
        const endTime = document.getElementById('editEndTime').value;
        const maxPatients = parseInt(document.getElementById('editMaxPatients').value);
        const notes = document.getElementById('editNotes').value;

        if (startTime >= endTime) {
            App.showError('End time must be after start time');
            return;
        }

        const assignments = JSON.parse(localStorage.getItem('doctor_assignments')) || [];
        const index = assignments.findIndex(a => a.id === assignmentId);
        
        if (index === -1) {
            App.showError('Assignment not found');
            return;
        }

        // Remove old availability slots
        this.removeAvailabilitySlots(assignments[index]);

        assignments[index] = {
            ...assignments[index],
            facilityId,
            startTime,
            endTime,
            maxPatients,
            notes,
            updatedAt: new Date().toISOString()
        };

        localStorage.setItem('doctor_assignments', JSON.stringify(assignments));

        // Create new availability slots
        this.createAvailabilitySlots(assignments[index]);

        // Log audit
        if (typeof logAudit === 'function') {
            logAudit('update', 'doctor_assignments', 'Updated doctor assignment', assignmentId);
        }

        App.closeModal();
        App.showSuccess('✅ Assignment updated successfully!');
        this.loadDoctorAvailabilityPage(document.getElementById('contentArea'));
    },

    // ========== HELPER FUNCTIONS ==========

    refreshDailyView(date) {
        const container = document.getElementById('dailyScheduleContent');
        if (!container) return;

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const doctors = users.filter(u => u.role === 'physician');
        const assignments = JSON.parse(localStorage.getItem('doctor_assignments')) || [];
        const conflicts = JSON.parse(localStorage.getItem('doctor_conflicts')) || [];
        
        const todayAssignments = assignments.filter(a => a.date === date);
        const todayConflicts = conflicts.filter(c => c.date === date);

        container.innerHTML = this.renderDailyScheduleTable(date, doctors, todayAssignments, todayConflicts);
    },

    getSchedulingSettings() {
        const settings = JSON.parse(localStorage.getItem('scheduling_settings')) || {};
        return {
            maxPatientsPerDay: settings.maxPatientsPerDay || 20,
            maxSlotsPerDoctor: settings.maxSlotsPerDoctor || 8,
            slotDurationMinutes: settings.slotDurationMinutes || 60,
            minAdvanceDays: settings.minAdvanceDays || 1,
            allowSameDayBooking: false
        };
    },

    getLockedSlotsCount() {
        const assignments = JSON.parse(localStorage.getItem('doctor_assignments')) || [];
        return assignments.filter(a => a.isLocked).length;
    },

    generateHourlyOptions(startHour, endHour, selectedValue) {
        let options = '';
        for (let hour = startHour; hour <= endHour; hour++) {
            const time = `${hour.toString().padStart(2, '0')}:00`;
            const displayTime = this.formatTimeDisplay(time);
            options += `<option value="${time}" ${time === selectedValue ? 'selected' : ''}>${displayTime}</option>`;
        }
        return options;
    },

    formatTimeDisplay(time) {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    },

    createAvailabilitySlots(assignment) {
        const slots = JSON.parse(localStorage.getItem('availability_slots')) || [];
        const startHour = parseInt(assignment.startTime.split(':')[0]);
        const endHour = parseInt(assignment.endTime.split(':')[0]);

        for (let hour = startHour; hour < endHour; hour++) {
            const newSlot = {
                slot_id: `slot_${assignment.id}_${hour}`,
                provider_id: assignment.doctorId,
                facility_id: assignment.facilityId,
                slot_date: assignment.date,
                start_time: `${hour.toString().padStart(2, '0')}:00`,
                end_time: `${(hour + 1).toString().padStart(2, '0')}:00`,
                slot_status: 'available',
                appointment_id: null,
                assignment_id: assignment.id,
                created_at: new Date().toISOString()
            };
            slots.push(newSlot);
        }

        localStorage.setItem('availability_slots', JSON.stringify(slots));
    },

    removeAvailabilitySlots(assignment) {
        const slots = JSON.parse(localStorage.getItem('availability_slots')) || [];
        const filtered = slots.filter(s => s.assignment_id !== assignment.id);
        localStorage.setItem('availability_slots', JSON.stringify(filtered));
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DoctorAvailability;
}

