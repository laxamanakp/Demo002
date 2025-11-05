// ============================================================
// MyHubCares - Counseling Sessions Management
// ============================================================

const Counseling = {
    // Load counseling page
    loadCounselingPage(container) {
        const role = Auth.getCurrentUser().role;
        
        if (!['admin', 'physician', 'case_manager'].includes(role)) {
            container.innerHTML = '<div class="alert alert-danger">Access denied</div>';
            return;
        }

        const sessions = JSON.parse(localStorage.getItem('counselingSessions')) || [];
        const patients = JSON.parse(localStorage.getItem('patients')) || [];

        // Get sessions requiring follow-up
        const followUpNeeded = sessions.filter(s => 
            s.followUpRequired && 
            new Date(s.followUpDate) <= new Date()
        ).length;

        let html = `
            <div class="patient-list-header">
                <div>
                    <h2>Counseling Sessions</h2>
                    <p>Manage patient counseling and support sessions</p>
                </div>
                <button class="btn btn-primary" onclick="Counseling.showAddSessionModal()">
                    Record Session
                </button>
            </div>

            ${followUpNeeded > 0 ? `
                <div class="alert alert-warning">
                    <strong>⚠️ ${followUpNeeded} patient(s) require follow-up counseling</strong>
                </div>
            ` : ''}

            <div class="dashboard-grid">
                <div class="stat-card">
                    <div class="stat-card-header">
                        <div>
                            <div class="stat-value">${sessions.length}</div>
                            <div class="stat-label">Total Sessions</div>
                        </div>
                        <div class="stat-card-icon primary">💬</div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-card-header">
                        <div>
                            <div class="stat-value">${followUpNeeded}</div>
                            <div class="stat-label">Follow-ups Due</div>
                        </div>
                        <div class="stat-card-icon warning">🔔</div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-card-header">
                        <div>
                            <div class="stat-value">${this.getAvgDuration(sessions)}</div>
                            <div class="stat-label">Avg. Duration (min)</div>
                        </div>
                        <div class="stat-card-icon info">⏱️</div>
                    </div>
                </div>
            </div>

            <div class="card mt-3">
                <div class="card-header">
                    <div class="search-filter-bar">
                        <input type="text" id="counselingSearch" placeholder="Search sessions..." class="search-input">
                        <select id="typeFilter">
                            <option value="all">All Types</option>
                            <option value="Adherence Counseling">Adherence Counseling</option>
                            <option value="Mental Health Support">Mental Health Support</option>
                            <option value="Pre-ART Counseling">Pre-ART Counseling</option>
                            <option value="Disclosure Support">Disclosure Support</option>
                        </select>
                    </div>
                </div>
                <div class="card-body">
                    <div id="counselingList">
                        ${this.renderCounselingList(sessions, patients)}
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;

        // Setup search and filter
        document.getElementById('counselingSearch').addEventListener('input', (e) => {
            this.filterSessions(e.target.value);
        });

        document.getElementById('typeFilter').addEventListener('change', (e) => {
            this.applyTypeFilter(e.target.value);
        });
    },

    // Get average duration
    getAvgDuration(sessions) {
        if (sessions.length === 0) return 0;
        const total = sessions.reduce((sum, s) => sum + s.duration, 0);
        return Math.round(total / sessions.length);
    },

    // Render counseling list
    renderCounselingList(sessions, patients) {
        if (sessions.length === 0) {
            return '<p class="text-muted">No counseling sessions recorded</p>';
        }

        return sessions.map(session => {
            const patient = patients.find(p => p.id === session.patientId);
            const date = new Date(session.sessionDate);
            const isFollowUpDue = session.followUpRequired && new Date(session.followUpDate) <= new Date();

            return `
                <div class="patient-card">
                    <div class="patient-info">
                        <div>
                            <h3>${patient ? patient.firstName + ' ' + patient.lastName : 'N/A'}</h3>
                            <div class="patient-meta">
                                <span>📅 ${date.toLocaleDateString()}</span>
                                <span>💬 ${session.sessionType}</span>
                                <span>⏱ ${session.duration} minutes</span>
                                ${session.followUpRequired ? `<span>🔄 Follow-up: ${new Date(session.followUpDate).toLocaleDateString()}</span>` : ''}
                            </div>
                            <p class="mt-1"><strong>Topics:</strong> ${session.topics.join(', ')}</p>
                        </div>
                    </div>
                    <div class="patient-actions">
                        ${isFollowUpDue ? '<span class="badge badge-warning">Follow-up Due</span>' : ''}
                        <button class="btn btn-sm btn-primary" onclick="Counseling.viewSessionDetails(${session.id})">
                            View Details
                        </button>
                        ${isFollowUpDue ? `
                            <button class="btn btn-sm btn-success" onclick="Counseling.scheduleFollowUp(${session.id})">
                                Schedule
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    },

    // Filter sessions
    filterSessions(searchTerm) {
        const sessions = JSON.parse(localStorage.getItem('counselingSessions')) || [];
        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        
        const filtered = sessions.filter(s => {
            const patient = patients.find(p => p.id === s.patientId);
            const patientName = patient ? `${patient.firstName} ${patient.lastName}`.toLowerCase() : '';
            return patientName.includes(searchTerm.toLowerCase()) ||
                   s.sessionType.toLowerCase().includes(searchTerm.toLowerCase());
        });

        document.getElementById('counselingList').innerHTML = this.renderCounselingList(filtered, patients);
    },

    // Apply type filter
    applyTypeFilter(type) {
        let sessions = JSON.parse(localStorage.getItem('counselingSessions')) || [];
        const patients = JSON.parse(localStorage.getItem('patients')) || [];

        if (type !== 'all') {
            sessions = sessions.filter(s => s.sessionType === type);
        }

        document.getElementById('counselingList').innerHTML = this.renderCounselingList(sessions, patients);
    },

    // Show add session modal
    showAddSessionModal() {
        const patients = JSON.parse(localStorage.getItem('patients')) || [];

        const content = `
            <form id="addCounselingForm">
                <div class="form-group">
                    <label class="required">Patient</label>
                    <select id="patientId" required>
                        <option value="">Select Patient</option>
                        ${patients.map(p => `<option value="${p.id}">${p.firstName} ${p.lastName}</option>`).join('')}
                    </select>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="required">Session Date</label>
                        <input type="date" id="sessionDate" value="${new Date().toISOString().split('T')[0]}" required>
                    </div>
                    <div class="form-group">
                        <label class="required">Duration (minutes)</label>
                        <input type="number" id="duration" min="15" value="45" required>
                    </div>
                </div>
                <div class="form-group">
                    <label class="required">Session Type</label>
                    <select id="sessionType" required>
                        <option value="">Select Type</option>
                        <option value="Adherence Counseling">Adherence Counseling</option>
                        <option value="Mental Health Support">Mental Health Support</option>
                        <option value="Pre-ART Counseling">Pre-ART Counseling</option>
                        <option value="Disclosure Support">Disclosure Support</option>
                        <option value="Family Counseling">Family Counseling</option>
                        <option value="Substance Abuse">Substance Abuse</option>
                    </select>
                </div>

                <div class="form-group">
                    <label class="required">Topics Covered</label>
                    <div id="topicsContainer">
                        <label><input type="checkbox" class="topic" value="Medication Adherence"> Medication Adherence</label><br>
                        <label><input type="checkbox" class="topic" value="Side Effect Management"> Side Effect Management</label><br>
                        <label><input type="checkbox" class="topic" value="Lifestyle Modifications"> Lifestyle Modifications</label><br>
                        <label><input type="checkbox" class="topic" value="Mental Health"> Mental Health</label><br>
                        <label><input type="checkbox" class="topic" value="Stigma Management"> Stigma Management</label><br>
                        <label><input type="checkbox" class="topic" value="Family Disclosure"> Family Disclosure</label><br>
                        <label><input type="checkbox" class="topic" value="Safer Sex Practices"> Safer Sex Practices</label><br>
                        <label><input type="checkbox" class="topic" value="Nutrition"> Nutrition</label>
                    </div>
                </div>

                <div class="form-group">
                    <label class="required">Session Notes</label>
                    <textarea id="notes" rows="4" required placeholder="Document the counseling session..."></textarea>
                </div>

                <div class="form-group">
                    <label>
                        <input type="checkbox" id="followUpRequired">
                        Follow-up session required
                    </label>
                </div>
                <div class="form-group" id="followUpDateContainer" style="display: none;">
                    <label>Follow-up Date</label>
                    <input type="date" id="followUpDate">
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="Counseling.addSession()">Save Session</button>
        `;

        App.showModal('Record Counseling Session', content, footer);

        // Toggle follow-up date field
        setTimeout(() => {
            document.getElementById('followUpRequired').addEventListener('change', (e) => {
                document.getElementById('followUpDateContainer').style.display = 
                    e.target.checked ? 'block' : 'none';
            });
        }, 100);
    },

    // Add counseling session
    addSession() {
        const form = document.getElementById('addCounselingForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Collect selected topics
        const topicCheckboxes = document.querySelectorAll('.topic:checked');
        const topics = Array.from(topicCheckboxes).map(cb => cb.value);

        if (topics.length === 0) {
            App.showError('Please select at least one topic');
            return;
        }

        const sessions = JSON.parse(localStorage.getItem('counselingSessions')) || [];
        const currentUser = Auth.getCurrentUser();

        const newSession = {
            id: sessions.length > 0 ? Math.max(...sessions.map(s => s.id)) + 1 : 1,
            patientId: parseInt(document.getElementById('patientId').value),
            counselorId: currentUser.userId,
            sessionDate: document.getElementById('sessionDate').value,
            sessionType: document.getElementById('sessionType').value,
            duration: parseInt(document.getElementById('duration').value),
            topics: topics,
            notes: document.getElementById('notes').value,
            followUpRequired: document.getElementById('followUpRequired').checked,
            followUpDate: document.getElementById('followUpDate').value || null,
            createdAt: new Date().toISOString()
        };

        sessions.push(newSession);
        localStorage.setItem('counselingSessions', JSON.stringify(sessions));

        App.closeModal();
        App.showSuccess('Counseling session recorded successfully');
        App.loadPage('counseling');
    },

    // View session details
    viewSessionDetails(sessionId) {
        const sessions = JSON.parse(localStorage.getItem('counselingSessions')) || [];
        const session = sessions.find(s => s.id === sessionId);

        if (!session) {
            App.showError('Session not found');
            return;
        }

        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const patient = patients.find(p => p.id === session.patientId);
        const counselor = users.find(u => u.id === session.counselorId);

        const content = `
            <div class="form-group">
                <label>Patient Name</label>
                <input type="text" value="${patient ? patient.firstName + ' ' + patient.lastName : 'N/A'}" readonly>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Session Date</label>
                    <input type="date" value="${session.sessionDate}" readonly>
                </div>
                <div class="form-group">
                    <label>Counselor</label>
                    <input type="text" value="${counselor ? counselor.fullName : 'N/A'}" readonly>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Session Type</label>
                    <input type="text" value="${session.sessionType}" readonly>
                </div>
                <div class="form-group">
                    <label>Duration</label>
                    <input type="text" value="${session.duration} minutes" readonly>
                </div>
            </div>

            <div class="form-group">
                <label>Topics Covered</label>
                <div class="card p-2">
                    ${session.topics.map(topic => `<span class="badge badge-primary mr-1">${topic}</span>`).join('')}
                </div>
            </div>

            <div class="form-group">
                <label>Session Notes</label>
                <textarea rows="4" readonly>${session.notes}</textarea>
            </div>

            ${session.followUpRequired ? `
                <div class="alert alert-info">
                    <strong>Follow-up Required:</strong> ${new Date(session.followUpDate).toLocaleDateString()}
                </div>
            ` : ''}
        `;

        App.showModal('Counseling Session Details', content, '');
    },

    // Schedule follow-up
    scheduleFollowUp(sessionId) {
        const sessions = JSON.parse(localStorage.getItem('counselingSessions')) || [];
        const session = sessions.find(s => s.id === sessionId);

        if (!session) {
            App.showError('Session not found');
            return;
        }

        // Redirect to appointments with pre-filled data
        window.location.hash = 'appointments';
        
        setTimeout(() => {
            App.showSuccess(`Opening appointment booking for follow-up counseling (${new Date(session.followUpDate).toLocaleDateString()})`);
        }, 500);
    }
};

