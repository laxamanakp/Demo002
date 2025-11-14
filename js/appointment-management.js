// ============================================================
// MyHubCares - Appointment Management (Slots & Reminders)
// ============================================================

const AppointmentManagement = {
    // Load availability slots page
    loadAvailabilitySlotsPage(container) {
        const role = Auth.getCurrentUser().role;
        
        if (!['admin', 'physician', 'nurse'].includes(role)) {
            container.innerHTML = '<div class="alert alert-danger">Access denied</div>';
            return;
        }

        const slots = JSON.parse(localStorage.getItem('availability_slots')) || [];
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const facilities = JSON.parse(localStorage.getItem('facilities')) || [];

        let html = `
            <div class="patient-list-header">
                <div>
                    <h2>Provider Availability</h2>
                    <p>Manage provider availability slots</p>
                </div>
                <button class="btn btn-primary" onclick="AppointmentManagement.showAddSlotModal()">Add Availability</button>
            </div>

            <div class="card mt-3">
                <div class="card-header">
                    <div class="search-filter-bar">
                        <select id="providerFilter">
                            <option value="all">All Providers</option>
                            ${users.filter(u => ['physician', 'nurse'].includes(u.role)).map(u => 
                                `<option value="${u.id}">${u.fullName}</option>`
                            ).join('')}
                        </select>
                        <input type="date" id="slotDateFilter" value="${new Date().toISOString().split('T')[0]}">
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Provider</th>
                                    <th>Facility</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="slotsTableBody">
                                ${this.renderSlotsTable(slots, users, facilities)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;
    },

    renderSlotsTable(slots, users, facilities) {
        if (slots.length === 0) {
            return '<tr><td colspan="6" class="text-center text-muted">No availability slots found</td></tr>';
        }

        return slots.map(slot => {
            const provider = users.find(u => u.id === slot.provider_id);
            const facility = facilities.find(f => f.id === slot.facility_id);
            
            return `
                <tr>
                    <td>${provider ? provider.fullName : 'Unknown'}</td>
                    <td>${facility ? facility.name : 'N/A'}</td>
                    <td>${new Date(slot.slot_date).toLocaleDateString()}</td>
                    <td>${slot.start_time} - ${slot.end_time}</td>
                    <td><span class="badge badge-${slot.slot_status === 'available' ? 'success' : slot.slot_status === 'booked' ? 'primary' : 'warning'}">${slot.slot_status}</span></td>
                    <td>
                        <div class="table-actions">
                            ${slot.slot_status === 'available' ? `<button class="btn btn-sm btn-danger" onclick="AppointmentManagement.blockSlot('${slot.slot_id}')">Block</button>` : ''}
                            ${slot.slot_status === 'blocked' ? `<button class="btn btn-sm btn-success" onclick="AppointmentManagement.unblockSlot('${slot.slot_id}')">Unblock</button>` : ''}
                            <button class="btn btn-sm btn-danger" onclick="AppointmentManagement.deleteSlot('${slot.slot_id}')">Delete</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    },

    showAddSlotModal() {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const facilities = JSON.parse(localStorage.getItem('facilities')) || [];
        const providers = users.filter(u => ['physician', 'nurse'].includes(u.role));

        const content = `
            <form id="addSlotForm">
                <div class="form-group">
                    <label class="required">Provider</label>
                    <select id="providerId" required>
                        <option value="">Select Provider</option>
                        ${providers.map(p => `<option value="${p.id}">${p.fullName}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label class="required">Facility</label>
                    <select id="facilityId" required>
                        <option value="">Select Facility</option>
                        ${facilities.map(f => `<option value="${f.id}">${f.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label class="required">Date</label>
                    <input type="date" id="slotDate" value="${new Date().toISOString().split('T')[0]}" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="required">Start Time</label>
                        <input type="time" id="startTime" value="09:00" required>
                    </div>
                    <div class="form-group">
                        <label class="required">End Time</label>
                        <input type="time" id="endTime" value="17:00" required>
                    </div>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="AppointmentManagement.addSlot()">Add Slot</button>
        `;

        App.showModal('Add Availability Slot', content, footer);
    },

    addSlot() {
        const form = document.getElementById('addSlotForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const slots = JSON.parse(localStorage.getItem('availability_slots')) || [];

        const newSlot = {
            slot_id: 'slot_' + Date.now(),
            provider_id: parseInt(document.getElementById('providerId').value),
            facility_id: parseInt(document.getElementById('facilityId').value),
            slot_date: document.getElementById('slotDate').value,
            start_time: document.getElementById('startTime').value,
            end_time: document.getElementById('endTime').value,
            slot_status: 'available',
            appointment_id: null,
            created_at: new Date().toISOString()
        };

        slots.push(newSlot);
        localStorage.setItem('availability_slots', JSON.stringify(slots));
        
        App.closeModal();
        App.showSuccess('Availability slot added successfully');
        this.loadAvailabilitySlotsPage(document.getElementById('contentArea'));
    },

    blockSlot(slotId) {
        const slots = JSON.parse(localStorage.getItem('availability_slots')) || [];
        const slot = slots.find(s => s.slot_id === slotId);
        if (slot) {
            slot.slot_status = 'blocked';
            localStorage.setItem('availability_slots', JSON.stringify(slots));
            App.showSuccess('Slot blocked successfully');
            this.loadAvailabilitySlotsPage(document.getElementById('contentArea'));
        }
    },

    unblockSlot(slotId) {
        const slots = JSON.parse(localStorage.getItem('availability_slots')) || [];
        const slot = slots.find(s => s.slot_id === slotId);
        if (slot) {
            slot.slot_status = 'available';
            localStorage.setItem('availability_slots', JSON.stringify(slots));
            App.showSuccess('Slot unblocked successfully');
            this.loadAvailabilitySlotsPage(document.getElementById('contentArea'));
        }
    },

    deleteSlot(slotId) {
        if (!confirm('Delete this availability slot?')) {
            return;
        }

        const slots = JSON.parse(localStorage.getItem('availability_slots')) || [];
        const filtered = slots.filter(s => s.slot_id !== slotId);
        localStorage.setItem('availability_slots', JSON.stringify(filtered));
        
        App.showSuccess('Slot deleted successfully');
        this.loadAvailabilitySlotsPage(document.getElementById('contentArea'));
    },

    // ========== APPOINTMENT REMINDERS ==========
    loadAppointmentRemindersPage(container) {
        const reminders = JSON.parse(localStorage.getItem('appointment_reminders')) || [];
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        const patients = JSON.parse(localStorage.getItem('patients')) || [];

        let html = `
            <div class="patient-list-header">
                <div>
                    <h2>Appointment Reminders</h2>
                    <p>Manage appointment reminder scheduling</p>
                </div>
            </div>

            <div class="card mt-3">
                <div class="card-header">
                    <div class="search-filter-bar">
                        <select id="reminderStatusFilter">
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="sent">Sent</option>
                            <option value="failed">Failed</option>
                        </select>
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Patient</th>
                                    <th>Appointment</th>
                                    <th>Reminder Type</th>
                                    <th>Scheduled At</th>
                                    <th>Sent At</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="remindersTableBody">
                                ${this.renderRemindersTable(reminders, appointments, patients)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;
    },

    renderRemindersTable(reminders, appointments, patients) {
        if (reminders.length === 0) {
            return '<tr><td colspan="7" class="text-center text-muted">No reminders found</td></tr>';
        }

        return reminders.map(reminder => {
            const appointment = appointments.find(a => a.id === reminder.appointment_id);
            const patient = patients.find(p => p.id === (appointment ? appointment.patientId : null));
            
            return `
                <tr>
                    <td>${patient ? patient.firstName + ' ' + patient.lastName : 'N/A'}</td>
                    <td>${appointment ? new Date(appointment.scheduledStart).toLocaleString() : 'N/A'}</td>
                    <td><span class="badge badge-info">${reminder.reminder_type.toUpperCase()}</span></td>
                    <td>${new Date(reminder.reminder_scheduled_at).toLocaleString()}</td>
                    <td>${reminder.reminder_sent_at ? new Date(reminder.reminder_sent_at).toLocaleString() : '-'}</td>
                    <td><span class="badge badge-${reminder.status === 'sent' ? 'success' : reminder.status === 'failed' ? 'danger' : 'warning'}">${reminder.status}</span></td>
                    <td>
                        ${reminder.status === 'pending' ? `<button class="btn btn-sm btn-primary" onclick="AppointmentManagement.sendReminder('${reminder.reminder_id}')">Send Now</button>` : ''}
                        ${reminder.status === 'pending' ? `<button class="btn btn-sm btn-danger" onclick="AppointmentManagement.cancelReminder('${reminder.reminder_id}')">Cancel</button>` : ''}
                    </td>
                </tr>
            `;
        }).join('');
    },

    sendReminder(reminderId) {
        const reminders = JSON.parse(localStorage.getItem('appointment_reminders')) || [];
        const reminder = reminders.find(r => r.reminder_id === reminderId);
        
        if (reminder) {
            reminder.status = 'sent';
            reminder.reminder_sent_at = new Date().toISOString();
            localStorage.setItem('appointment_reminders', JSON.stringify(reminders));
            App.showSuccess('Reminder sent successfully');
            this.loadAppointmentRemindersPage(document.getElementById('contentArea'));
        }
    },

    cancelReminder(reminderId) {
        if (!confirm('Cancel this reminder?')) {
            return;
        }

        const reminders = JSON.parse(localStorage.getItem('appointment_reminders')) || [];
        const reminder = reminders.find(r => r.reminder_id === reminderId);
        
        if (reminder) {
            reminder.status = 'cancelled';
            localStorage.setItem('appointment_reminders', JSON.stringify(reminders));
            App.showSuccess('Reminder cancelled successfully');
            this.loadAppointmentRemindersPage(document.getElementById('contentArea'));
        }
    }
};

