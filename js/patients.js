// ============================================================
// MyHubCares - Patient Profile Management CRUD
// ============================================================

const Patients = {
    // Load patients page
    loadPatientsPage(container) {
        const role = Auth.getCurrentUser().role;
        
        if (!Auth.permissions.canViewAllPatients(role)) {
            container.innerHTML = '<div class="alert alert-danger">Access denied</div>';
            return;
        }

        const patients = JSON.parse(localStorage.getItem('patients')) || [];

        let html = `
            <div class="patient-list-header">
                <div>
                    <h2>Patient Management</h2>
                    <p>Manage patient records and information</p>
                </div>
                ${Auth.permissions.canEditPatient(role) ? 
                    '<button class="btn btn-primary" onclick="Patients.showAddPatientModal()">Add New Patient</button>' :
                    ''}
            </div>

            <div class="card">
                <div class="card-header">
                    <div class="search-filter-bar">
                        <div class="search-bar">
                            <input type="text" id="patientSearch" class="search-input" placeholder="Search patients by name, UIC...">
                        </div>
                        <select id="sexFilter">
                            <option value="all">All Genders</option>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                        </select>
                    </div>
                </div>
                <div class="card-body">
                    <div id="patientList">
                        ${this.renderPatientList(patients)}
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;

        // Setup search
        document.getElementById('patientSearch').addEventListener('input', (e) => {
            this.filterPatients(e.target.value);
        });

        // Setup filter
        document.getElementById('sexFilter').addEventListener('change', (e) => {
            this.applySexFilter(e.target.value);
        });
    },

    // Render patient list
    renderPatientList(patients) {
        if (patients.length === 0) {
            return '<p class="text-muted">No patients found</p>';
        }

        const role = Auth.getCurrentUser().role;

        return patients.map(patient => {
            const age = this.calculateAge(patient.birthDate);
            const initials = `${patient.firstName[0]}${patient.lastName[0]}`;
            const riskScore = typeof ARPA !== 'undefined' ? ARPA.calculateRiskScore(patient.id) : null;

            return `
                <div class="patient-card">
                    <div class="patient-info">
                        <div class="patient-avatar">${initials}</div>
                        <div class="patient-details">
                            <h3>${patient.firstName} ${patient.middleName ? patient.middleName[0] + '.' : ''} ${patient.lastName}</h3>
                            <div class="patient-meta">
                                <span>👤 ${patient.sex === 'M' ? 'Male' : 'Female'}</span>
                                <span>🎂 ${age} years old</span>
                                <span>📱 ${patient.contactPhone || 'N/A'}</span>
                                ${patient.uic ? `<span>🆔 ${patient.uic}</span>` : ''}
                                ${riskScore && role !== 'patient' ? `<span class="risk-badge ${riskScore.level}">${riskScore.level.toUpperCase()}</span>` : ''}
                            </div>
                        </div>
                    </div>
                    <div class="patient-actions">
                        <button class="btn btn-sm btn-primary" onclick="Patients.viewPatient(${patient.id})">
                            View
                        </button>
                        ${riskScore && (role === 'physician' || role === 'admin') ? `
                            <button class="btn btn-sm btn-warning" onclick="ARPA.showRiskDetails(${patient.id})">
                                ARPA
                            </button>
                        ` : ''}
                        ${Auth.permissions.canEditPatient(role) ? `
                            <button class="btn btn-sm btn-outline" onclick="Patients.showEditPatientModal(${patient.id})">
                                Edit
                            </button>
                        ` : ''}
                        ${Auth.permissions.canDeletePatient(role) ? `
                            <button class="btn btn-sm btn-danger" onclick="Patients.deletePatient(${patient.id})">
                                Delete
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    },

    // Calculate age from birth date
    calculateAge(birthDate) {
        if (!birthDate) return 'N/A';
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    },

    // Filter patients by search term
    filterPatients(searchTerm) {
        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const filtered = patients.filter(p => 
            `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.uic && p.uic.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (p.contactPhone && p.contactPhone.includes(searchTerm))
        );

        document.getElementById('patientList').innerHTML = this.renderPatientList(filtered);
    },

    // Apply sex filter
    applySexFilter(sex) {
        let patients = JSON.parse(localStorage.getItem('patients')) || [];
        
        if (sex !== 'all') {
            patients = patients.filter(p => p.sex === sex);
        }

        document.getElementById('patientList').innerHTML = this.renderPatientList(patients);
    },

    // View patient details
    viewPatient(patientId) {
        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const patient = patients.find(p => p.id === patientId);

        if (!patient) {
            App.showError('Patient not found');
            return;
        }

        const visits = JSON.parse(localStorage.getItem('visits')) || [];
        const patientVisits = visits.filter(v => v.patientId === patientId);

        const prescriptions = JSON.parse(localStorage.getItem('prescriptions')) || [];
        const patientPrescriptions = prescriptions.filter(p => p.patientId === patientId);

        const labTests = JSON.parse(localStorage.getItem('labTests')) || [];
        const patientLabTests = labTests.filter(l => l.patientId === patientId);

        const role = Auth.getCurrentUser().role;
        const showRisk = role === 'physician' || role === 'admin';
        const riskScore = showRisk && typeof ARPA !== 'undefined' ? ARPA.calculateRiskScore(patientId) : null;

        const content = `
            ${riskScore ? `
                <div class="alert alert-${riskScore.level === 'critical' || riskScore.level === 'high' ? 'danger' : riskScore.level === 'medium' ? 'warning' : 'success'}" style="margin-bottom: 20px;">
                    <div class="d-flex justify-between align-center">
                        <div>
                            <strong>ARPA Risk Level:</strong> <span class="risk-badge ${riskScore.level}">${riskScore.level.toUpperCase()}</span>
                            <span style="margin-left: 10px;">Score: ${riskScore.score}/100 | Adherence: ${riskScore.adherenceRate}%</span>
                        </div>
                        <button class="btn btn-sm btn-outline" onclick="ARPA.showRiskDetails(${patientId})">
                            View Details
                        </button>
                    </div>
                </div>
            ` : ''}
            
            <div class="tabs">
                <div class="tab active" data-tab="demographics">Demographics</div>
                <div class="tab" data-tab="visits">Visits (${patientVisits.length})</div>
                <div class="tab" data-tab="prescriptions">Prescriptions (${patientPrescriptions.length})</div>
                <div class="tab" data-tab="labs">Lab Results (${patientLabTests.length})</div>
            </div>

            <div class="tab-content active" id="demographicsTab">
                ${this.renderDemographics(patient)}
            </div>

            <div class="tab-content" id="visitsTab">
                ${this.renderVisits(patientVisits)}
            </div>

            <div class="tab-content" id="prescriptionsTab">
                ${this.renderPrescriptionsTab(patientPrescriptions)}
            </div>

            <div class="tab-content" id="labsTab">
                ${this.renderLabTests(patientLabTests)}
            </div>
        `;

        App.showModal(`Patient: ${patient.firstName} ${patient.lastName}`, content, '');

        // Setup tabs in modal
        document.querySelectorAll('.modal .tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.getAttribute('data-tab');
                
                document.querySelectorAll('.modal .tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                
                document.querySelectorAll('.modal .tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                document.getElementById(tabName + 'Tab').classList.add('active');
            });
        });
    },

    // Render demographics tab
    renderDemographics(patient) {
        return `
            <div class="form-row">
                <div class="form-group">
                    <label>First Name</label>
                    <input type="text" value="${patient.firstName}" readonly>
                </div>
                <div class="form-group">
                    <label>Middle Name</label>
                    <input type="text" value="${patient.middleName || 'N/A'}" readonly>
                </div>
                <div class="form-group">
                    <label>Last Name</label>
                    <input type="text" value="${patient.lastName}" readonly>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Date of Birth</label>
                    <input type="date" value="${patient.birthDate}" readonly>
                </div>
                <div class="form-group">
                    <label>Sex</label>
                    <input type="text" value="${patient.sex === 'M' ? 'Male' : 'Female'}" readonly>
                </div>
                <div class="form-group">
                    <label>Civil Status</label>
                    <input type="text" value="${patient.civilStatus || 'N/A'}" readonly>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Contact Phone</label>
                    <input type="text" value="${patient.contactPhone || 'N/A'}" readonly>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" value="${patient.email || 'N/A'}" readonly>
                </div>
            </div>
            <div class="form-group">
                <label>Current Address</label>
                <input type="text" value="${patient.currentCity}, ${patient.currentProvince}" readonly>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>UIC</label>
                    <input type="text" value="${patient.uic || 'Not Generated'}" readonly>
                </div>
                <div class="form-group">
                    <label>PhilHealth No.</label>
                    <input type="text" value="${patient.philhealthNo || 'N/A'}" readonly>
                </div>
            </div>
        `;
    },

    // Render visits tab
    renderVisits(visits) {
        if (visits.length === 0) {
            return '<p class="text-muted">No visit records found</p>';
        }

        return `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Type</th>
                            <th>WHO Stage</th>
                            <th>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${visits.map(visit => `
                            <tr>
                                <td>${new Date(visit.visitDate).toLocaleDateString()}</td>
                                <td>${visit.visitType}</td>
                                <td>${visit.whoStage || 'N/A'}</td>
                                <td>${visit.notes || '-'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    // Render prescriptions tab
    renderPrescriptionsTab(prescriptions) {
        if (prescriptions.length === 0) {
            return '<p class="text-muted">No prescriptions found</p>';
        }

        return prescriptions.map(rx => `
            <div class="card mb-2">
                <div class="card-header">
                    <strong>Date: ${new Date(rx.prescriptionDate).toLocaleDateString()}</strong>
                    <span class="badge badge-primary">Active</span>
                </div>
                <div class="card-body">
                    ${rx.drugs.map(drug => `
                        <div class="mb-2">
                            <strong>${drug.drugName}</strong><br>
                            ${drug.dosage} - ${drug.frequency} for ${drug.duration}<br>
                            <small class="text-muted">${drug.instructions}</small>
                        </div>
                    `).join('')}
                    ${rx.notes ? `<p class="mt-2"><strong>Notes:</strong> ${rx.notes}</p>` : ''}
                </div>
            </div>
        `).join('');
    },

    // Render lab tests tab
    renderLabTests(labTests) {
        if (labTests.length === 0) {
            return '<p class="text-muted">No lab test results found</p>';
        }

        return `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Test Name</th>
                            <th>Result</th>
                            <th>Date</th>
                            <th>Lab Code</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${labTests.map(test => `
                            <tr>
                                <td>${test.testName}</td>
                                <td><strong>${test.resultValue} ${test.resultUnit || ''}</strong></td>
                                <td>${new Date(test.dateDone).toLocaleDateString()}</td>
                                <td>${test.labCode}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    // Show add patient modal
    showAddPatientModal() {
        const content = `
            <form id="addPatientForm">
                <div class="form-row">
                    <div class="form-group">
                        <label class="required">First Name</label>
                        <input type="text" id="firstName" required>
                    </div>
                    <div class="form-group">
                        <label>Middle Name</label>
                        <input type="text" id="middleName">
                    </div>
                    <div class="form-group">
                        <label class="required">Last Name</label>
                        <input type="text" id="lastName" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="required">Date of Birth</label>
                        <input type="date" id="birthDate" required>
                    </div>
                    <div class="form-group">
                        <label class="required">Sex</label>
                        <select id="sex" required>
                            <option value="">Select</option>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Civil Status</label>
                        <select id="civilStatus">
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                            <option value="Widowed">Widowed</option>
                            <option value="Separated">Separated</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Contact Phone</label>
                        <input type="tel" id="contactPhone">
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="email">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Current City</label>
                        <input type="text" id="currentCity">
                    </div>
                    <div class="form-group">
                        <label>Current Province</label>
                        <input type="text" id="currentProvince">
                    </div>
                </div>
                <div class="form-group">
                    <label>PhilHealth Number</label>
                    <input type="text" id="philhealthNo">
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="Patients.addPatient()">Add Patient</button>
        `;

        App.showModal('Add New Patient', content, footer);
    },

    // Add patient
    addPatient() {
        const form = document.getElementById('addPatientForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const newPatient = {
            id: patients.length > 0 ? Math.max(...patients.map(p => p.id)) + 1 : 1,
            firstName: document.getElementById('firstName').value,
            middleName: document.getElementById('middleName').value,
            lastName: document.getElementById('lastName').value,
            birthDate: document.getElementById('birthDate').value,
            sex: document.getElementById('sex').value,
            civilStatus: document.getElementById('civilStatus').value,
            contactPhone: document.getElementById('contactPhone').value,
            email: document.getElementById('email').value,
            currentCity: document.getElementById('currentCity').value,
            currentProvince: document.getElementById('currentProvince').value,
            philhealthNo: document.getElementById('philhealthNo').value,
            nationality: 'Filipino',
            uic: this.generateUIC(document.getElementById('firstName').value, document.getElementById('lastName').value, document.getElementById('birthDate').value)
        };

        patients.push(newPatient);
        localStorage.setItem('patients', JSON.stringify(patients));

        App.closeModal();
        App.showSuccess('Patient added successfully');
        App.loadPage('patients');
    },

    // Generate UIC (simplified version)
    generateUIC(firstName, lastName, birthDate) {
        const date = new Date(birthDate);
        const motherLetters = (firstName.substring(0, 2) || 'XX').toUpperCase();
        const fatherLetters = (lastName.substring(0, 2) || 'XX').toUpperCase();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        
        return `${motherLetters}${fatherLetters}${month}${day}${year}`;
    },

    // Show edit patient modal
    showEditPatientModal(patientId) {
        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const patient = patients.find(p => p.id === patientId);

        if (!patient) {
            App.showError('Patient not found');
            return;
        }

        const content = `
            <form id="editPatientForm">
                <input type="hidden" id="patientId" value="${patient.id}">
                <div class="form-row">
                    <div class="form-group">
                        <label class="required">First Name</label>
                        <input type="text" id="firstName" value="${patient.firstName}" required>
                    </div>
                    <div class="form-group">
                        <label>Middle Name</label>
                        <input type="text" id="middleName" value="${patient.middleName || ''}">
                    </div>
                    <div class="form-group">
                        <label class="required">Last Name</label>
                        <input type="text" id="lastName" value="${patient.lastName}" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Contact Phone</label>
                        <input type="tel" id="contactPhone" value="${patient.contactPhone || ''}">
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="email" value="${patient.email || ''}">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Current City</label>
                        <input type="text" id="currentCity" value="${patient.currentCity || ''}">
                    </div>
                    <div class="form-group">
                        <label>Current Province</label>
                        <input type="text" id="currentProvince" value="${patient.currentProvince || ''}">
                    </div>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="Patients.updatePatient()">Update Patient</button>
        `;

        App.showModal('Edit Patient', content, footer);
    },

    // Update patient
    updatePatient() {
        const form = document.getElementById('editPatientForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const patientId = parseInt(document.getElementById('patientId').value);
        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const index = patients.findIndex(p => p.id === patientId);

        if (index === -1) {
            App.showError('Patient not found');
            return;
        }

        patients[index] = {
            ...patients[index],
            firstName: document.getElementById('firstName').value,
            middleName: document.getElementById('middleName').value,
            lastName: document.getElementById('lastName').value,
            contactPhone: document.getElementById('contactPhone').value,
            email: document.getElementById('email').value,
            currentCity: document.getElementById('currentCity').value,
            currentProvince: document.getElementById('currentProvince').value
        };

        localStorage.setItem('patients', JSON.stringify(patients));

        App.closeModal();
        App.showSuccess('Patient updated successfully');
        App.loadPage('patients');
    },

    // Delete patient
    deletePatient(patientId) {
        if (!confirm('Are you sure you want to delete this patient? This action cannot be undone.')) {
            return;
        }

        let patients = JSON.parse(localStorage.getItem('patients')) || [];
        patients = patients.filter(p => p.id !== patientId);
        localStorage.setItem('patients', JSON.stringify(patients));

        App.showSuccess('Patient deleted successfully');
        App.loadPage('patients');
    }
};

