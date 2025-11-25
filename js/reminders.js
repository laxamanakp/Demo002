// ============================================================
// MyHubCares - Medication Reminder System
// ============================================================

const Reminders = {
    currentTab: 'reminders',

    // Load unified medications page (Reminders + Refills)
    loadMedicationsPage(container) {
        const role = Auth.getCurrentUser().role;
        const currentUser = Auth.getCurrentUser();
        
        if (role !== 'patient') {
            container.innerHTML = '<div class="alert alert-danger">This page is only available for patients</div>';
            return;
        }

        let reminders = JSON.parse(localStorage.getItem('reminders')) || [];
        reminders = reminders.filter(r => r.patientId === currentUser.patientId);

        // Get refill requests for this patient
        const patientId = currentUser.patientId || currentUser.userId;
        const refillRequests = (JSON.parse(localStorage.getItem('refill_requests')) || [])
            .filter(r => r.patient_id === patientId);
        const pendingRefills = refillRequests.filter(r => r.status === 'pending').length;
        const readyRefills = refillRequests.filter(r => ['approved', 'ready'].includes(r.status)).length;

        let html = `
            <div class="patient-list-header">
                <div>
                    <h2>💊 My Medications</h2>
                    <p>Manage your medication reminders and refill requests</p>
                </div>
            </div>

            ${this.renderMedicationStats(reminders, refillRequests)}

            <div class="card mt-3">
                <div class="card-header">
                    <div class="tabs">
                        <button class="tab-btn ${this.currentTab === 'reminders' ? 'active' : ''}" onclick="Reminders.switchTab('reminders')">
                            🔔 Reminders
                        </button>
                        <button class="tab-btn ${this.currentTab === 'refills' ? 'active' : ''}" onclick="Reminders.switchTab('refills')">
                            📦 Refill Requests
                            ${pendingRefills > 0 ? `<span class="badge badge-warning" style="margin-left: 5px;">${pendingRefills}</span>` : ''}
                            ${readyRefills > 0 ? `<span class="badge badge-success" style="margin-left: 5px;">${readyRefills} ready</span>` : ''}
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <div id="medicationsTabContent">
                        ${this.currentTab === 'reminders' ? this.renderRemindersTab(reminders) : this.renderRefillsTab(refillRequests)}
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;

        // Start reminder check
        this.startReminderCheck();
    },

    // Switch between tabs
    switchTab(tab) {
        this.currentTab = tab;
        const currentUser = Auth.getCurrentUser();
        const patientId = currentUser.patientId || currentUser.userId;
        
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        // Update content
        const contentArea = document.getElementById('medicationsTabContent');
        if (tab === 'reminders') {
            let reminders = JSON.parse(localStorage.getItem('reminders')) || [];
            reminders = reminders.filter(r => r.patientId === currentUser.patientId);
            contentArea.innerHTML = this.renderRemindersTab(reminders);
        } else {
            const refillRequests = (JSON.parse(localStorage.getItem('refill_requests')) || [])
                .filter(r => r.patient_id === patientId);
            contentArea.innerHTML = this.renderRefillsTab(refillRequests);
        }
    },

    // Render medication statistics
    renderMedicationStats(reminders, refillRequests) {
        const activeReminders = reminders.filter(r => r.active);
        const totalDoses = activeReminders.length * 30;
        const missedDoses = activeReminders.reduce((sum, r) => sum + (r.missedDoses || 0), 0);
        const adherenceRate = totalDoses > 0 ? Math.round(((totalDoses - missedDoses) / totalDoses) * 100) : 100;

        let adherenceClass = 'success';
        if (adherenceRate < 95) adherenceClass = 'warning';
        if (adherenceRate < 80) adherenceClass = 'danger';

        const pendingRefills = refillRequests.filter(r => r.status === 'pending').length;
        const readyRefills = refillRequests.filter(r => ['approved', 'ready'].includes(r.status)).length;

        return `
            <div class="dashboard-grid">
                <div class="stat-card">
                    <div class="stat-card-header">
                        <div>
                            <div class="stat-value">${activeReminders.length}</div>
                            <div class="stat-label">Active Reminders</div>
                        </div>
                        <div class="stat-card-icon primary">🔔</div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-card-header">
                        <div>
                            <div class="stat-value">${adherenceRate}%</div>
                            <div class="stat-label">Adherence Rate</div>
                        </div>
                        <div class="stat-card-icon ${adherenceClass}">✓</div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-card-header">
                        <div>
                            <div class="stat-value">${pendingRefills}</div>
                            <div class="stat-label">Pending Refills</div>
                        </div>
                        <div class="stat-card-icon warning">⏳</div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-card-header">
                        <div>
                            <div class="stat-value">${readyRefills}</div>
                            <div class="stat-label">Ready for Pickup</div>
                        </div>
                        <div class="stat-card-icon success">📦</div>
                    </div>
                </div>
            </div>
        `;
    },

    // Render reminders tab content
    renderRemindersTab(reminders) {
        return `
            <div class="d-flex justify-between align-center mb-3">
                <h3 style="margin: 0;">Today's Medications</h3>
                <button class="btn btn-primary" onclick="Reminders.showAddReminderModal()">
                    ➕ Add Reminder
                </button>
            </div>
            <div class="reminder-list">
                ${this.renderReminderList(reminders)}
            </div>
        `;
    },

    // Render refills tab content
    renderRefillsTab(refillRequests) {
        const facilities = JSON.parse(localStorage.getItem('facilities')) || [];

        let html = `
            <div class="d-flex justify-between align-center mb-3">
                <h3 style="margin: 0;">My Refill Requests</h3>
                <button class="btn btn-primary" onclick="RefillRequests.showRequestModal()">
                    ➕ Request Refill
                </button>
            </div>
        `;

        if (refillRequests.length === 0) {
            html += '<p class="text-muted text-center py-4">No refill requests yet. Click "Request Refill" to get started.</p>';
            return html;
        }

        // Group by status
        const statusOrder = ['ready', 'approved', 'pending', 'dispensed', 'declined', 'cancelled'];
        const sortedRequests = [...refillRequests].sort((a, b) => {
            const orderA = statusOrder.indexOf(a.status);
            const orderB = statusOrder.indexOf(b.status);
            if (orderA !== orderB) return orderA - orderB;
            return new Date(b.created_at) - new Date(a.created_at);
        });

        html += sortedRequests.map(req => {
            const facility = facilities.find(f => f.id === req.pickup_facility_id);
            let statusBadge = '';
            let statusMessage = '';
            let actionButtons = '';

            switch (req.status) {
                case 'pending':
                    statusBadge = '<span class="badge badge-warning">⏳ Pending Review</span>';
                    statusMessage = '<p class="text-warning mt-2" style="font-size: 0.9rem;">Waiting for Case Manager approval...</p>';
                    actionButtons = `
                        <button class="btn btn-sm btn-outline" onclick="Reminders.cancelRefillRequest('${req.request_id}')">
                            Cancel
                        </button>
                    `;
                    break;
                case 'approved':
                case 'ready':
                    statusBadge = '<span class="badge badge-success">✅ Ready for Pickup</span>';
                    statusMessage = `
                        <div class="mt-2 p-2" style="background: var(--success-light, #d1fae5); border-radius: var(--border-radius-sm);">
                            <p style="margin: 0; color: var(--success-color, #059669);">
                                <strong>📅 Pickup Date:</strong> ${new Date(req.ready_for_pickup_date || req.preferred_pickup_date).toLocaleDateString()}<br>
                                <strong>🏥 Location:</strong> ${facility ? facility.name : 'N/A'}
                            </p>
                            ${req.review_notes ? `<p style="margin: 5px 0 0 0; font-style: italic; color: var(--text-muted);">"${req.review_notes}"</p>` : ''}
                        </div>
                    `;
                    break;
                case 'dispensed':
                    statusBadge = '<span class="badge badge-secondary">✓ Dispensed</span>';
                    statusMessage = `<p class="text-muted mt-2" style="font-size: 0.9rem;">Picked up on ${new Date(req.dispensed_at).toLocaleDateString()}</p>`;
                    break;
                case 'declined':
                    statusBadge = '<span class="badge badge-danger">❌ Declined</span>';
                    statusMessage = `
                        <div class="mt-2 p-2" style="background: var(--danger-light, #fee2e2); border-radius: var(--border-radius-sm);">
                            <p style="margin: 0; color: var(--danger-color, #dc2626);">
                                <strong>Reason:</strong> ${req.decline_reason || 'Not specified'}
                            </p>
                        </div>
                    `;
                    break;
                case 'cancelled':
                    statusBadge = '<span class="badge badge-secondary">⚪ Cancelled</span>';
                    break;
            }

            return `
                <div class="patient-card mb-2" style="border-left: 4px solid ${this.getStatusColor(req.status)};">
                    <div class="patient-info">
                        <div>
                            <div class="d-flex align-center gap-2 mb-1">
                                <strong>💊 ${req.medication_name}</strong>
                                ${statusBadge}
                            </div>
                            <div class="patient-meta">
                                <span>📦 ${req.quantity_requested} ${req.unit || 'tablets'}</span>
                                <span>📅 Requested: ${new Date(req.preferred_pickup_date).toLocaleDateString()}</span>
                            </div>
                            ${statusMessage}
                            <p class="text-muted mt-1" style="font-size: 0.8rem;">
                                Submitted: ${new Date(req.created_at).toLocaleString()}
                            </p>
                        </div>
                    </div>
                    <div class="patient-actions">
                        ${actionButtons}
                    </div>
                </div>
            `;
        }).join('');

        return html;
    },

    // Get status color
    getStatusColor(status) {
        const colors = {
            pending: '#f59e0b',
            approved: '#10b981',
            ready: '#10b981',
            dispensed: '#6b7280',
            declined: '#ef4444',
            cancelled: '#9ca3af'
        };
        return colors[status] || '#6b7280';
    },

    // Cancel refill request from patient view
    cancelRefillRequest(requestId) {
        if (typeof RefillRequests !== 'undefined') {
            RefillRequests.cancelRequest(requestId);
            // Reload the page to reflect changes
            setTimeout(() => {
                this.loadMedicationsPage(document.getElementById('contentArea'));
            }, 500);
        }
    },

    // Legacy load reminders page (redirects to combined page)
    loadRemindersPage(container) {
        this.currentTab = 'reminders';
        this.loadMedicationsPage(container);
    },

    // Render adherence card
    renderAdherenceCard(reminders) {
        const activeReminders = reminders.filter(r => r.active);
        const totalDoses = activeReminders.length * 30; // Assume 30 days
        const missedDoses = activeReminders.reduce((sum, r) => sum + (r.missedDoses || 0), 0);
        const adherenceRate = totalDoses > 0 ? Math.round(((totalDoses - missedDoses) / totalDoses) * 100) : 100;

        let adherenceClass = 'success';
        if (adherenceRate < 95) adherenceClass = 'warning';
        if (adherenceRate < 80) adherenceClass = 'danger';

        return `
            <div class="dashboard-grid">
                <div class="stat-card">
                    <div class="stat-card-header">
                        <div>
                            <div class="stat-value">${activeReminders.length}</div>
                            <div class="stat-label">Active Reminders</div>
                        </div>
                        <div class="stat-card-icon primary">🔔</div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-card-header">
                        <div>
                            <div class="stat-value">${adherenceRate}%</div>
                            <div class="stat-label">Adherence Rate</div>
                        </div>
                        <div class="stat-card-icon ${adherenceClass}">✓</div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-card-header">
                        <div>
                            <div class="stat-value">${missedDoses}</div>
                            <div class="stat-label">Missed Doses (30 days)</div>
                        </div>
                        <div class="stat-card-icon warning">⚠</div>
                    </div>
                </div>
            </div>
        `;
    },

    // Render reminder list
    renderReminderList(reminders) {
        if (reminders.length === 0) {
            return '<p class="text-muted">No medication reminders set. Create one to get started!</p>';
        }

        const activeReminders = reminders.filter(r => r.active);
        if (activeReminders.length === 0) {
            return '<p class="text-muted">No active reminders</p>';
        }

        return activeReminders.map(reminder => {
            const timeRemaining = this.getTimeRemaining(reminder.time);
            const isOverdue = timeRemaining.includes('ago');

            return `
                <div class="reminder-card ${isOverdue ? 'missed' : 'active'}">
                    <div class="reminder-info">
                        <h4>${reminder.drugName}</h4>
                        <p class="text-muted">Take ${reminder.frequency} at ${reminder.time}</p>
                        ${reminder.lastTaken ? `<small class="text-muted">Last taken: ${new Date(reminder.lastTaken).toLocaleDateString()}</small>` : ''}
                        ${reminder.missedDoses > 0 ? `<br><small class="text-danger">Missed doses: ${reminder.missedDoses}</small>` : ''}
                    </div>
                    <div>
                        <div class="reminder-time">${reminder.time}</div>
                        <div class="reminder-countdown">${timeRemaining}</div>
                        <div class="mt-2">
                            <button class="btn btn-sm btn-success" onclick="Reminders.markAsTaken(${reminder.id})">
                                Mark as Taken
                            </button>
                            <button class="btn btn-sm btn-outline" onclick="Reminders.showEditReminderModal(${reminder.id})">
                                Edit
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    // Get time remaining until reminder
    getTimeRemaining(reminderTime) {
        const now = new Date();
        const [hours, minutes] = reminderTime.split(':').map(Number);
        const reminderDate = new Date();
        reminderDate.setHours(hours, minutes, 0, 0);

        const diff = reminderDate - now;
        const diffHours = Math.floor(Math.abs(diff) / (1000 * 60 * 60));
        const diffMinutes = Math.floor((Math.abs(diff) % (1000 * 60 * 60)) / (1000 * 60));

        if (diff < 0) {
            if (diffHours > 0) {
                return `${diffHours}h ${diffMinutes}m ago`;
            } else {
                return `${diffMinutes}m ago`;
            }
        } else {
            if (diffHours > 0) {
                return `in ${diffHours}h ${diffMinutes}m`;
            } else {
                return `in ${diffMinutes}m`;
            }
        }
    },

    // Show add reminder modal
    showAddReminderModal() {
        const prescriptions = JSON.parse(localStorage.getItem('prescriptions')) || [];
        const currentUser = Auth.getCurrentUser();
        const patientPrescriptions = prescriptions.filter(p => p.patientId === currentUser.patientId);

        const content = `
            <form id="addReminderForm">
                <div class="form-group">
                    <label class="required">Medication Name</label>
                    <input type="text" id="drugName" required list="drugSuggestions">
                    <datalist id="drugSuggestions">
                        ${patientPrescriptions.flatMap(rx => rx.drugs.map(d => `<option value="${d.drugName}">`)).join('')}
                    </datalist>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="required">Reminder Time</label>
                        <input type="time" id="reminderTime" required>
                    </div>
                    <div class="form-group">
                        <label class="required">Frequency</label>
                        <select id="frequency" required>
                            <option value="daily">Daily</option>
                            <option value="twice-daily">Twice Daily</option>
                            <option value="three-times-daily">Three Times Daily</option>
                            <option value="weekly">Weekly</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="enableNotifications" checked>
                        Enable browser notifications
                    </label>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="enableSound" checked>
                        Enable sound alerts
                    </label>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="Reminders.addReminder()">Create Reminder</button>
        `;

        App.showModal('Add Medication Reminder', content, footer);
    },

    // Add reminder
    addReminder() {
        const form = document.getElementById('addReminderForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const reminders = JSON.parse(localStorage.getItem('reminders')) || [];
        const currentUser = Auth.getCurrentUser();

        const newReminder = {
            id: reminders.length > 0 ? Math.max(...reminders.map(r => r.id)) + 1 : 1,
            patientId: currentUser.patientId,
            drugName: document.getElementById('drugName').value,
            time: document.getElementById('reminderTime').value,
            frequency: document.getElementById('frequency').value,
            active: true,
            enableNotifications: document.getElementById('enableNotifications').checked,
            enableSound: document.getElementById('enableSound').checked,
            missedDoses: 0,
            lastTaken: null
        };

        reminders.push(newReminder);
        localStorage.setItem('reminders', JSON.stringify(reminders));

        App.closeModal();
        App.showSuccess('Reminder created successfully');
        App.loadPage('reminders');

        // Request notification permission if needed
        if (newReminder.enableNotifications && 'Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    },

    // Show edit reminder modal
    showEditReminderModal(reminderId) {
        const reminders = JSON.parse(localStorage.getItem('reminders')) || [];
        const reminder = reminders.find(r => r.id === reminderId);

        if (!reminder) {
            App.showError('Reminder not found');
            return;
        }

        const content = `
            <form id="editReminderForm">
                <input type="hidden" id="reminderId" value="${reminder.id}">
                <div class="form-group">
                    <label class="required">Medication Name</label>
                    <input type="text" id="drugName" value="${reminder.drugName}" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="required">Reminder Time</label>
                        <input type="time" id="reminderTime" value="${reminder.time}" required>
                    </div>
                    <div class="form-group">
                        <label class="required">Frequency</label>
                        <select id="frequency" required>
                            <option value="daily" ${reminder.frequency === 'daily' ? 'selected' : ''}>Daily</option>
                            <option value="twice-daily" ${reminder.frequency === 'twice-daily' ? 'selected' : ''}>Twice Daily</option>
                            <option value="three-times-daily" ${reminder.frequency === 'three-times-daily' ? 'selected' : ''}>Three Times Daily</option>
                            <option value="weekly" ${reminder.frequency === 'weekly' ? 'selected' : ''}>Weekly</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="active" ${reminder.active ? 'checked' : ''}>
                        Active
                    </label>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="enableNotifications" ${reminder.enableNotifications ? 'checked' : ''}>
                        Enable browser notifications
                    </label>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-danger" onclick="Reminders.deleteReminder(${reminder.id})">Delete</button>
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="Reminders.updateReminder()">Update</button>
        `;

        App.showModal('Edit Reminder', content, footer);
    },

    // Update reminder
    updateReminder() {
        const form = document.getElementById('editReminderForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const reminderId = parseInt(document.getElementById('reminderId').value);
        const reminders = JSON.parse(localStorage.getItem('reminders')) || [];
        const index = reminders.findIndex(r => r.id === reminderId);

        if (index === -1) {
            App.showError('Reminder not found');
            return;
        }

        reminders[index] = {
            ...reminders[index],
            drugName: document.getElementById('drugName').value,
            time: document.getElementById('reminderTime').value,
            frequency: document.getElementById('frequency').value,
            active: document.getElementById('active').checked,
            enableNotifications: document.getElementById('enableNotifications').checked
        };

        localStorage.setItem('reminders', JSON.stringify(reminders));

        App.closeModal();
        App.showSuccess('Reminder updated successfully');
        App.loadPage('reminders');
    },

    // Delete reminder
    deleteReminder(reminderId) {
        if (!confirm('Are you sure you want to delete this reminder?')) {
            return;
        }

        let reminders = JSON.parse(localStorage.getItem('reminders')) || [];
        reminders = reminders.filter(r => r.id !== reminderId);
        localStorage.setItem('reminders', JSON.stringify(reminders));

        App.closeModal();
        App.showSuccess('Reminder deleted successfully');
        App.loadPage('reminders');
    },

    // Mark reminder as taken
    markAsTaken(reminderId) {
        const reminders = JSON.parse(localStorage.getItem('reminders')) || [];
        const index = reminders.findIndex(r => r.id === reminderId);

        if (index === -1) {
            App.showError('Reminder not found');
            return;
        }

        reminders[index].lastTaken = new Date().toISOString();
        localStorage.setItem('reminders', JSON.stringify(reminders));

        App.showSuccess('Medication marked as taken');
        App.loadPage('reminders');
    },

    // Create reminders from prescription
    createRemindersFromPrescription(prescription) {
        const reminders = JSON.parse(localStorage.getItem('reminders')) || [];
        
        prescription.drugs.forEach(drug => {
            // Suggest reminder time based on frequency
            let suggestedTime = '20:00'; // Default evening time
            
            const newReminder = {
                id: reminders.length > 0 ? Math.max(...reminders.map(r => r.id)) + 1 : 1,
                patientId: prescription.patientId,
                prescriptionId: prescription.id,
                drugName: drug.drugName,
                time: suggestedTime,
                frequency: 'daily',
                active: true,
                enableNotifications: true,
                enableSound: true,
                missedDoses: 0,
                lastTaken: null
            };

            reminders.push(newReminder);
        });

        localStorage.setItem('reminders', JSON.stringify(reminders));
    },

    // Start reminder check (simulated)
    startReminderCheck() {
        // In a real app, this would use service workers or background tasks
        // For demo, we'll just check every minute
        setInterval(() => {
            this.checkReminders();
        }, 60000); // Check every minute

        // Also check immediately
        this.checkReminders();
    },

    // Check for due reminders
    checkReminders() {
        const currentUser = Auth.getCurrentUser();
        if (!currentUser || currentUser.role !== 'patient') return;

        const reminders = JSON.parse(localStorage.getItem('reminders')) || [];
        const activeReminders = reminders.filter(r => r.active && r.patientId === currentUser.patientId);

        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        activeReminders.forEach(reminder => {
            if (reminder.time === currentTime && reminder.enableNotifications) {
                this.showNotification(reminder);
            }
        });
    },

    // Show notification
    showNotification(reminder) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Medication Reminder', {
                body: `Time to take ${reminder.drugName}`,
                icon: '/favicon.ico',
                tag: `reminder-${reminder.id}`
            });

            // Play sound if enabled
            if (reminder.enableSound) {
                // Create a simple beep sound
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = 800;
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.5);
            }
        }
    }
};

