// ============================================================
// MyHubCares - Clinical Visit Management
// ============================================================

const Visits = {
    // Load visits page
    loadVisitsPage(container) {
        const role = Auth.getCurrentUser().role;
        
        if (!Auth.permissions.canViewAllPatients(role)) {
            container.innerHTML = '<div class="alert alert-danger">Access denied</div>';
            return;
        }

        const visits = JSON.parse(localStorage.getItem('visits')) || [];
        const patients = JSON.parse(localStorage.getItem('patients')) || [];

        let html = `
            <div class="patient-list-header">
                <div>
                    <h2>Clinical Visits</h2>
                    <p>Record and manage patient consultations</p>
                </div>
                ${role !== 'patient' ? 
                    '<button class="btn btn-primary" onclick="Visits.showAddVisitModal()">Record New Visit</button>' :
                    ''}
            </div>

            <div class="card mt-3">
                <div class="card-header">
                    <div class="search-filter-bar">
                        <input type="text" id="visitSearch" placeholder="Search visits..." class="search-input">
                        <select id="visitTypeFilter">
                            <option value="all">All Types</option>
                            <option value="Initial">Initial Consultation</option>
                            <option value="Follow-up">Follow-up</option>
                            <option value="Emergency">Emergency</option>
                        </select>
                    </div>
                </div>
                <div class="card-body">
                    <div id="visitList">
                        ${this.renderVisitList(visits, patients)}
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;

        // Setup search
        document.getElementById('visitSearch').addEventListener('input', (e) => {
            this.filterVisits(e.target.value);
        });

        document.getElementById('visitTypeFilter').addEventListener('change', (e) => {
            this.applyVisitTypeFilter(e.target.value);
        });
    },

    // Render visit list
    renderVisitList(visits, patients) {
        if (visits.length === 0) {
            return '<p class="text-muted">No visits recorded</p>';
        }

        return visits.map(visit => {
            const patient = patients.find(p => p.id === visit.patientId);
            const date = new Date(visit.visitDate);

            return `
                <div class="patient-card">
                    <div class="patient-info">
                        <div>
                            <h3>${patient ? patient.firstName + ' ' + patient.lastName : 'N/A'}</h3>
                            <div class="patient-meta">
                                <span>📅 ${date.toLocaleDateString()}</span>
                                <span>🏥 ${visit.visitType}</span>
                                <span>📊 WHO Stage: ${visit.whoStage || 'N/A'}</span>
                            </div>
                            ${visit.notes ? `<p class="mt-1"><strong>Notes:</strong> ${visit.notes.substring(0, 100)}...</p>` : ''}
                        </div>
                    </div>
                    <div class="patient-actions">
                        <button class="btn btn-sm btn-primary" onclick="Visits.viewVisitDetails(${visit.id})">
                            View Details
                        </button>
                        <button class="btn btn-sm btn-outline" onclick="Visits.exportVisitSummary(${visit.id})">
                            Export PDF
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    },

    // Filter visits
    filterVisits(searchTerm) {
        const visits = JSON.parse(localStorage.getItem('visits')) || [];
        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        
        const filtered = visits.filter(v => {
            const patient = patients.find(p => p.id === v.patientId);
            const patientName = patient ? `${patient.firstName} ${patient.lastName}`.toLowerCase() : '';
            return patientName.includes(searchTerm.toLowerCase()) ||
                   (v.notes && v.notes.toLowerCase().includes(searchTerm.toLowerCase()));
        });

        document.getElementById('visitList').innerHTML = this.renderVisitList(filtered, patients);
    },

    // Apply visit type filter
    applyVisitTypeFilter(type) {
        let visits = JSON.parse(localStorage.getItem('visits')) || [];
        const patients = JSON.parse(localStorage.getItem('patients')) || [];

        if (type !== 'all') {
            visits = visits.filter(v => v.visitType === type);
        }

        document.getElementById('visitList').innerHTML = this.renderVisitList(visits, patients);
    },

    // Show add visit modal
    showAddVisitModal() {
        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const facilities = JSON.parse(localStorage.getItem('facilities')) || [];

        const content = `
            <form id="addVisitForm">
                <div class="form-group">
                    <label class="required">Patient</label>
                    <select id="patientId" required>
                        <option value="">Select Patient</option>
                        ${patients.map(p => `<option value="${p.id}">${p.firstName} ${p.lastName}</option>`).join('')}
                    </select>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="required">Visit Date</label>
                        <input type="date" id="visitDate" value="${new Date().toISOString().split('T')[0]}" required>
                    </div>
                    <div class="form-group">
                        <label class="required">Visit Type</label>
                        <select id="visitType" required>
                            <option value="Initial">Initial Consultation</option>
                            <option value="Follow-up">Follow-up</option>
                            <option value="Emergency">Emergency</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="required">MyHubCares Branch</label>
                    <select id="facilityId" required>
                        <option value="">Select MyHubCares Branch</option>
                        ${facilities.map(f => `<option value="${f.id}">${f.name}</option>`).join('')}
                    </select>
                </div>

                <h4 class="mt-3">Vital Signs</h4>
                <div class="form-row">
                    <div class="form-group">
                        <label>Blood Pressure</label>
                        <input type="text" id="bp" placeholder="e.g., 120/80">
                    </div>
                    <div class="form-group">
                        <label>Heart Rate (bpm)</label>
                        <input type="text" id="hr" placeholder="e.g., 72">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Respiratory Rate</label>
                        <input type="text" id="rr" placeholder="e.g., 16">
                    </div>
                    <div class="form-group">
                        <label>Temperature (°C)</label>
                        <input type="text" id="temp" placeholder="e.g., 36.5">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Weight (kg)</label>
                        <input type="number" id="weight" step="0.1" placeholder="e.g., 65.5">
                    </div>
                    <div class="form-group">
                        <label>Height (cm)</label>
                        <input type="number" id="height" step="0.1" placeholder="e.g., 170">
                    </div>
                </div>

                <h4 class="mt-3">Clinical Information</h4>
                <div class="form-group">
                    <label>WHO Stage</label>
                    <select id="whoStage">
                        <option value="">Select Stage</option>
                        <option value="Stage 1">Stage 1</option>
                        <option value="Stage 2">Stage 2</option>
                        <option value="Stage 3">Stage 3</option>
                        <option value="Stage 4">Stage 4</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Chief Complaint/Symptoms</label>
                    <textarea id="symptoms" rows="3" placeholder="Enter patient's symptoms..."></textarea>
                </div>
                <div class="form-group">
                    <label>Clinical Notes</label>
                    <textarea id="notes" rows="4" placeholder="Enter clinical notes and observations..."></textarea>
                </div>
                <div class="form-group">
                    <label>Assessment & Plan</label>
                    <textarea id="assessment" rows="3" placeholder="Enter assessment and treatment plan..."></textarea>
                </div>

                <h4 class="mt-3">Diagnoses & Procedures</h4>
                <div class="alert alert-info">
                    <small>You can add diagnoses and procedures after saving the visit.</small>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="Visits.addVisit()">Save Visit</button>
        `;

        App.showModal('Record Clinical Visit', content, footer);
    },

    // Add visit
    addVisit() {
        const form = document.getElementById('addVisitForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const visits = JSON.parse(localStorage.getItem('visits')) || [];
        const currentUser = Auth.getCurrentUser();

        const newVisit = {
            id: visits.length > 0 ? Math.max(...visits.map(v => v.id)) + 1 : 1,
            patientId: parseInt(document.getElementById('patientId').value),
            facilityId: parseInt(document.getElementById('facilityId').value),
            physicianId: currentUser.userId,
            visitDate: document.getElementById('visitDate').value,
            visitType: document.getElementById('visitType').value,
            whoStage: document.getElementById('whoStage').value,
            vitalSigns: {
                bp: document.getElementById('bp').value,
                hr: document.getElementById('hr').value,
                rr: document.getElementById('rr').value,
                temp: document.getElementById('temp').value,
                weight: document.getElementById('weight').value,
                height: document.getElementById('height').value
            },
            symptoms: document.getElementById('symptoms').value,
            notes: document.getElementById('notes').value,
            assessment: document.getElementById('assessment').value,
            createdAt: new Date().toISOString()
        };

        visits.push(newVisit);
        localStorage.setItem('visits', JSON.stringify(visits));

        App.closeModal();
        App.showSuccess('Visit recorded successfully');
        App.loadPage('visits');
    },

    // View visit details
    viewVisitDetails(visitId) {
        const visits = JSON.parse(localStorage.getItem('visits')) || [];
        const visit = visits.find(v => v.id === visitId);

        if (!visit) {
            App.showError('Visit not found');
            return;
        }

        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const facilities = JSON.parse(localStorage.getItem('facilities')) || [];
        const users = JSON.parse(localStorage.getItem('users')) || [];

        const patient = patients.find(p => p.id === visit.patientId);
        const facility = facilities.find(f => f.id === visit.facilityId);
        const physician = users.find(u => u.id === visit.physicianId);

        const content = `
            <div class="form-group">
                <label>Patient Name</label>
                <input type="text" value="${patient ? patient.firstName + ' ' + patient.lastName : 'N/A'}" readonly>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Visit Date</label>
                    <input type="date" value="${visit.visitDate}" readonly>
                </div>
                <div class="form-group">
                    <label>Visit Type</label>
                    <input type="text" value="${visit.visitType}" readonly>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>MyHubCares Branch</label>
                    <input type="text" value="${facility ? facility.name : 'N/A'}" readonly>
                </div>
                <div class="form-group">
                    <label>Physician</label>
                    <input type="text" value="${physician ? physician.fullName : 'N/A'}" readonly>
                </div>
            </div>

            ${visit.vitalSigns ? `
                <h4 class="mt-3">Vital Signs</h4>
                <div class="form-row">
                    <div class="form-group">
                        <label>Blood Pressure</label>
                        <input type="text" value="${visit.vitalSigns.bp || 'N/A'}" readonly>
                    </div>
                    <div class="form-group">
                        <label>Heart Rate</label>
                        <input type="text" value="${visit.vitalSigns.hr || 'N/A'}" readonly>
                    </div>
                    <div class="form-group">
                        <label>Temperature</label>
                        <input type="text" value="${visit.vitalSigns.temp || 'N/A'}" readonly>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Weight (kg)</label>
                        <input type="text" value="${visit.vitalSigns.weight || 'N/A'}" readonly>
                    </div>
                    <div class="form-group">
                        <label>Height (cm)</label>
                        <input type="text" value="${visit.vitalSigns.height || 'N/A'}" readonly>
                    </div>
                    <div class="form-group">
                        <label>BMI</label>
                        <input type="text" value="${this.calculateBMI(visit.vitalSigns.weight, visit.vitalSigns.height)}" readonly>
                    </div>
                </div>
            ` : ''}

            ${visit.whoStage ? `
                <div class="form-group mt-3">
                    <label>WHO Stage</label>
                    <input type="text" value="${visit.whoStage}" readonly>
                </div>
            ` : ''}

            ${visit.symptoms ? `
                <div class="form-group">
                    <label>Symptoms</label>
                    <textarea rows="3" readonly>${visit.symptoms}</textarea>
                </div>
            ` : ''}

            ${visit.notes ? `
                <div class="form-group">
                    <label>Clinical Notes</label>
                    <textarea rows="4" readonly>${visit.notes}</textarea>
                </div>
            ` : ''}

            ${visit.assessment ? `
                <div class="form-group">
                    <label>Assessment & Plan</label>
                    <textarea rows="3" readonly>${visit.assessment}</textarea>
                </div>
            ` : ''}

            ${typeof ClinicalCare !== 'undefined' ? ClinicalCare.renderDiagnosesSection(visitId) : ''}
            ${typeof ClinicalCare !== 'undefined' ? ClinicalCare.renderProceduresSection(visitId) : ''}
        `;

        App.showModal('Visit Details', content, '');
    },

    // Calculate BMI
    calculateBMI(weight, height) {
        if (!weight || !height) return 'N/A';
        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);
        return bmi.toFixed(1);
    },

    // Export visit summary
    exportVisitSummary(visitId) {
        const visits = JSON.parse(localStorage.getItem('visits')) || [];
        const visit = visits.find(v => v.id === visitId);

        if (!visit) {
            App.showError('Visit not found');
            return;
        }

        App.showSuccess('Visit summary exported successfully! (In production, this would generate a PDF)');
        console.log('Visit Summary:', visit);
    }
};

