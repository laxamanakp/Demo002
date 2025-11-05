// ============================================================
// MyHubCares - HIV Testing Services (HTS)
// ============================================================

const HTS = {
    // Load HTS page
    loadHTSPage(container) {
        const role = Auth.getCurrentUser().role;
        
        if (!['admin', 'physician', 'nurse', 'case_manager', 'lab_personnel'].includes(role)) {
            container.innerHTML = '<div class="alert alert-danger">Access denied</div>';
            return;
        }

        const sessions = JSON.parse(localStorage.getItem('htsSessions')) || [];
        const patients = JSON.parse(localStorage.getItem('patients')) || [];

        let html = `
            <div class="patient-list-header">
                <div>
                    <h2>HIV Testing Services (HTS)</h2>
                    <p>Manage testing sessions and counseling</p>
                </div>
                <button class="btn btn-primary" onclick="HTS.showAddSessionModal()">
                    Record HTS Session
                </button>
            </div>

            <div class="card mt-3">
                <div class="card-header">
                    <div class="search-filter-bar">
                        <input type="text" id="htsSearch" placeholder="Search sessions..." class="search-input">
                        <select id="resultFilter">
                            <option value="all">All Results</option>
                            <option value="Positive">Positive</option>
                            <option value="Reactive">Reactive</option>
                            <option value="Non-reactive">Non-reactive</option>
                        </select>
                    </div>
                </div>
                <div class="card-body">
                    <div id="htsList">
                        ${this.renderHTSList(sessions, patients)}
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;

        // Setup search and filter
        document.getElementById('htsSearch').addEventListener('input', (e) => {
            this.filterSessions(e.target.value);
        });

        document.getElementById('resultFilter').addEventListener('change', (e) => {
            this.applyResultFilter(e.target.value);
        });
    },

    // Render HTS list
    renderHTSList(sessions, patients) {
        if (sessions.length === 0) {
            return '<p class="text-muted">No HTS sessions recorded</p>';
        }

        return sessions.map(session => {
            const patient = patients.find(p => p.id === session.patientId);
            const date = new Date(session.sessionDate);

            let resultClass = 'secondary';
            if (session.testResult === 'Positive' || session.testResult === 'Reactive') {
                resultClass = 'danger';
            } else if (session.testResult === 'Non-reactive') {
                resultClass = 'success';
            }

            return `
                <div class="patient-card">
                    <div class="patient-info">
                        <div>
                            <h3>${patient ? patient.firstName + ' ' + patient.lastName : 'N/A'}</h3>
                            <div class="patient-meta">
                                <span>📅 ${date.toLocaleDateString()}</span>
                                <span>🏥 ${session.sessionType}</span>
                                <span>✓ Pre-test: ${session.pretestCounseling ? 'Yes' : 'No'}</span>
                                <span>✓ Post-test: ${session.posttestCounseling ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                    </div>
                    <div class="patient-actions">
                        <span class="badge badge-${resultClass}">${session.testResult}</span>
                        <button class="btn btn-sm btn-primary" onclick="HTS.viewSessionDetails(${session.id})">
                            View Details
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    },

    // Filter sessions
    filterSessions(searchTerm) {
        const sessions = JSON.parse(localStorage.getItem('htsSessions')) || [];
        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        
        const filtered = sessions.filter(s => {
            const patient = patients.find(p => p.id === s.patientId);
            const patientName = patient ? `${patient.firstName} ${patient.lastName}`.toLowerCase() : '';
            return patientName.includes(searchTerm.toLowerCase());
        });

        document.getElementById('htsList').innerHTML = this.renderHTSList(filtered, patients);
    },

    // Apply result filter
    applyResultFilter(result) {
        let sessions = JSON.parse(localStorage.getItem('htsSessions')) || [];
        const patients = JSON.parse(localStorage.getItem('patients')) || [];

        if (result !== 'all') {
            sessions = sessions.filter(s => s.testResult === result);
        }

        document.getElementById('htsList').innerHTML = this.renderHTSList(sessions, patients);
    },

    // Show add session modal
    showAddSessionModal() {
        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const facilities = JSON.parse(localStorage.getItem('facilities')) || [];
        const clientTypes = JSON.parse(localStorage.getItem('clientTypes')) || [];

        const content = `
            <form id="addHTSForm">
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
                        <label class="required">Session Type</label>
                        <select id="sessionType" required>
                            <option value="Facility-based">Facility-based</option>
                            <option value="Community-based">Community-based</option>
                            <option value="Mobile">Mobile</option>
                            <option value="Home">Home</option>
                        </select>
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
                    <label>Client Type</label>
                    <select id="clientType">
                        <option value="">Select Type</option>
                        ${clientTypes.map(ct => `<option value="${ct.id}">${ct.name}</option>`).join('')}
                    </select>
                </div>

                <h4 class="mt-3">Pre-Test Counseling</h4>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="pretestCounseling" checked>
                        Pre-test counseling provided
                    </label>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="consentGiven" checked>
                        Informed consent obtained
                    </label>
                </div>

                <h4 class="mt-3">Test Results</h4>
                <div class="form-group">
                    <label class="required">Test Result</label>
                    <select id="testResult" required>
                        <option value="">Select Result</option>
                        <option value="Non-reactive">Non-reactive</option>
                        <option value="Reactive">Reactive</option>
                        <option value="Positive">Positive</option>
                        <option value="Indeterminate">Indeterminate</option>
                    </select>
                </div>

                <h4 class="mt-3">Post-Test</h4>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="posttestCounseling">
                        Post-test counseling provided
                    </label>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="linkageReferred">
                        Referred for linkage to care
                    </label>
                </div>
                <div class="form-group">
                    <label>Referral Destination</label>
                    <input type="text" id="referralDestination" placeholder="e.g., ART Clinic">
                </div>

                <div class="form-group">
                    <label>Remarks</label>
                    <textarea id="remarks" rows="3"></textarea>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="HTS.addSession()">Save Session</button>
        `;

        App.showModal('Record HTS Session', content, footer);
    },

    // Add HTS session
    addSession() {
        const form = document.getElementById('addHTSForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const sessions = JSON.parse(localStorage.getItem('htsSessions')) || [];
        const currentUser = Auth.getCurrentUser();

        const newSession = {
            id: sessions.length > 0 ? Math.max(...sessions.map(s => s.id)) + 1 : 1,
            patientId: parseInt(document.getElementById('patientId').value),
            facilityId: parseInt(document.getElementById('facilityId').value),
            counselorId: currentUser.userId,
            sessionDate: document.getElementById('sessionDate').value,
            sessionType: document.getElementById('sessionType').value,
            clientType: document.getElementById('clientType').value,
            pretestCounseling: document.getElementById('pretestCounseling').checked,
            consentGiven: document.getElementById('consentGiven').checked,
            testResult: document.getElementById('testResult').value,
            posttestCounseling: document.getElementById('posttestCounseling').checked,
            linkageReferred: document.getElementById('linkageReferred').checked,
            referralDestination: document.getElementById('referralDestination').value,
            remarks: document.getElementById('remarks').value,
            createdAt: new Date().toISOString()
        };

        sessions.push(newSession);
        localStorage.setItem('htsSessions', JSON.stringify(sessions));

        App.closeModal();
        App.showSuccess('HTS session recorded successfully');
        App.loadPage('hts');
    },

    // View session details
    viewSessionDetails(sessionId) {
        const sessions = JSON.parse(localStorage.getItem('htsSessions')) || [];
        const session = sessions.find(s => s.id === sessionId);

        if (!session) {
            App.showError('Session not found');
            return;
        }

        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const facilities = JSON.parse(localStorage.getItem('facilities')) || [];
        const users = JSON.parse(localStorage.getItem('users')) || [];

        const patient = patients.find(p => p.id === session.patientId);
        const facility = facilities.find(f => f.id === session.facilityId);
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
                    <label>Session Type</label>
                    <input type="text" value="${session.sessionType}" readonly>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Facility</label>
                    <input type="text" value="${facility ? facility.name : 'N/A'}" readonly>
                </div>
                <div class="form-group">
                    <label>Counselor</label>
                    <input type="text" value="${counselor ? counselor.fullName : 'N/A'}" readonly>
                </div>
            </div>

            <h4 class="mt-3">Counseling & Consent</h4>
            <div class="form-group">
                <label>
                    <input type="checkbox" ${session.pretestCounseling ? 'checked' : ''} disabled>
                    Pre-test counseling provided
                </label>
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" ${session.consentGiven ? 'checked' : ''} disabled>
                    Informed consent obtained
                </label>
            </div>

            <h4 class="mt-3">Test Results</h4>
            <div class="form-group">
                <label>Result</label>
                <input type="text" value="${session.testResult}" readonly>
            </div>

            <h4 class="mt-3">Post-Test & Linkage</h4>
            <div class="form-group">
                <label>
                    <input type="checkbox" ${session.posttestCounseling ? 'checked' : ''} disabled>
                    Post-test counseling provided
                </label>
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" ${session.linkageReferred ? 'checked' : ''} disabled>
                    Referred for linkage to care
                </label>
            </div>
            ${session.referralDestination ? `
                <div class="form-group">
                    <label>Referral Destination</label>
                    <input type="text" value="${session.referralDestination}" readonly>
                </div>
            ` : ''}

            ${session.remarks ? `
                <div class="form-group mt-3">
                    <label>Remarks</label>
                    <textarea rows="3" readonly>${session.remarks}</textarea>
                </div>
            ` : ''}
        `;

        App.showModal('HTS Session Details', content, '');
    }
};

