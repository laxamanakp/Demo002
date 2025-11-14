// ============================================================
// MyHubCares - Digital Prescriptions
// ============================================================

const Prescriptions = {
    // Load prescriptions page
    loadPrescriptionsPage(container) {
        const role = Auth.getCurrentUser().role;
        const currentUser = Auth.getCurrentUser();
        
        if (!Auth.permissions.canViewPrescriptions(role)) {
            container.innerHTML = '<div class="alert alert-danger">Access denied</div>';
            return;
        }

        let prescriptions = JSON.parse(localStorage.getItem('prescriptions')) || [];
        
        // Filter for patient role
        if (role === 'patient') {
            prescriptions = prescriptions.filter(rx => rx.patientId === currentUser.patientId);
        }

        let html = `
            <div class="patient-list-header">
                <div>
                    <h2>Prescriptions</h2>
                    <p>Manage digital prescriptions</p>
                </div>
                ${Auth.permissions.canCreatePrescription(role) ? 
                    '<button class="btn btn-primary" onclick="Prescriptions.showAddPrescriptionModal()">Create Prescription</button>' :
                    ''}
            </div>

            <div class="card">
                <div class="card-header">
                    <div class="search-filter-bar">
                        <input type="text" id="prescriptionSearch" placeholder="Search prescriptions..." class="search-input">
                    </div>
                </div>
                <div class="card-body">
                    <div id="prescriptionList">
                        ${this.renderPrescriptionList(prescriptions)}
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;

        // Setup search
        document.getElementById('prescriptionSearch').addEventListener('input', (e) => {
            this.filterPrescriptions(e.target.value);
        });
    },

    // Render prescription list
    renderPrescriptionList(prescriptions) {
        if (prescriptions.length === 0) {
            return '<p class="text-muted">No prescriptions found</p>';
        }

        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const role = Auth.getCurrentUser().role;

        return prescriptions.map(rx => {
            const patient = patients.find(p => p.id === rx.patientId);
            const physician = users.find(u => u.id === rx.physicianId);
            const date = new Date(rx.prescriptionDate);

            return `
                <div class="card mb-3">
                    <div class="card-header">
                        <div>
                            ${role !== 'patient' ? `<strong>Patient: ${patient ? patient.firstName + ' ' + patient.lastName : 'N/A'}</strong><br>` : ''}
                            <span class="text-muted">Prescribed by: ${physician ? physician.fullName : 'N/A'}</span><br>
                            <span class="text-muted">Date: ${date.toLocaleDateString()}</span>
                        </div>
                        <div>
                            <button class="btn btn-sm btn-primary" onclick="Prescriptions.viewPrescription(${rx.id})">
                                View
                            </button>
                            <button class="btn btn-sm btn-outline" onclick="Prescriptions.printPrescription(${rx.id})">
                                Print
                            </button>
                            ${(role === 'nurse' || role === 'admin') ? `
                            <button class="btn btn-sm btn-primary" onclick="Prescriptions.showDispenseModal(${rx.id})">
                                Dispense
                            </button>
                            ` : ''}
                        </div>
                    </div>
                    <div class="card-body">
                        <strong>Medications:</strong>
                        <ul>
                            ${rx.drugs.map(drug => `
                                <li>${drug.drugName} - ${drug.dosage}, ${drug.frequency}</li>
                            `).join('')}
                        </ul>
                        ${rx.notes ? `<p class="mt-2"><strong>Notes:</strong> ${rx.notes}</p>` : ''}
                        ${rx.nextRefill ? `<p><strong>Next Refill:</strong> ${new Date(rx.nextRefill).toLocaleDateString()}</p>` : ''}
                    </div>
                </div>
            `;
        }).join('');
    },

    // Filter prescriptions
    filterPrescriptions(searchTerm) {
        const role = Auth.getCurrentUser().role;
        const currentUser = Auth.getCurrentUser();
        let prescriptions = JSON.parse(localStorage.getItem('prescriptions')) || [];
        
        if (role === 'patient') {
            prescriptions = prescriptions.filter(rx => rx.patientId === currentUser.patientId);
        }

        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const filtered = prescriptions.filter(rx => {
            const patient = patients.find(p => p.id === rx.patientId);
            const patientName = patient ? `${patient.firstName} ${patient.lastName}`.toLowerCase() : '';
            const drugNames = rx.drugs.map(d => d.drugName.toLowerCase()).join(' ');
            return patientName.includes(searchTerm.toLowerCase()) || drugNames.includes(searchTerm.toLowerCase());
        });

        document.getElementById('prescriptionList').innerHTML = this.renderPrescriptionList(filtered);
    },

    // Show add prescription modal
    showAddPrescriptionModal() {
        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const facilities = JSON.parse(localStorage.getItem('facilities')) || [];

        const content = `
            <form id="addPrescriptionForm">
                <div class="form-group">
                    <label class="required">Patient</label>
                    <select id="patientId" required>
                        <option value="">Select Patient</option>
                        ${patients.map(p => `<option value="${p.id}">${p.firstName} ${p.lastName}</option>`).join('')}
                    </select>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="required">Prescription Date</label>
                        <input type="date" id="prescriptionDate" value="${new Date().toISOString().split('T')[0]}" required>
                    </div>
                    <div class="form-group">
                        <label class="required">MyHubCares Branch</label>
                        <select id="facilityId" required>
                            <option value="">Select MyHubCares Branch</option>
                            ${facilities.map(f => `<option value="${f.id}">${f.name}</option>`).join('')}
                        </select>
                    </div>
                </div>
                
                <h4 class="mt-3">Medications</h4>
                <div id="drugsContainer">
                    <div class="drug-item card p-2 mb-2">
                        <div class="form-group">
                            <label class="required">Medication</label>
                            <select class="medicationSelect" required>
                                <option value="">Select Medication</option>
                                ${(() => {
                                    const medications = JSON.parse(localStorage.getItem('medications')) || [];
                                    return medications.filter(m => m.active).map(m => 
                                        `<option value="${m.medication_id}" data-name="${m.medication_name}">${m.medication_name}${m.generic_name ? ' (' + m.generic_name + ')' : ''}${m.strength ? ' - ' + m.strength : ''}</option>`
                                    ).join('');
                                })()}
                            </select>
                            <small class="text-muted">Or <a href="#" onclick="App.loadPage('medication-catalog'); App.closeModal();">add new medication</a></small>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label class="required">Dosage</label>
                                <input type="text" class="dosage" placeholder="e.g., 1 tablet" required>
                            </div>
                            <div class="form-group">
                                <label class="required">Frequency</label>
                                <input type="text" class="frequency" placeholder="e.g., Once daily" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label class="required">Duration</label>
                                <input type="text" class="duration" placeholder="e.g., 30 days" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Instructions</label>
                            <textarea class="instructions" rows="2"></textarea>
                        </div>
                    </div>
                </div>
                <button type="button" class="btn btn-sm btn-outline" onclick="Prescriptions.addDrugField()">
                    + Add Another Drug
                </button>

                <div class="form-group mt-3">
                    <label>Prescription Notes</label>
                    <textarea id="notes" rows="3"></textarea>
                </div>

                <div class="form-group">
                    <label>Next Refill Date</label>
                    <input type="date" id="nextRefill">
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="Prescriptions.addPrescription()">Create Prescription</button>
        `;

        App.showModal('Create Prescription', content, footer);
    },

    // Add drug field
    addDrugField() {
        const container = document.getElementById('drugsContainer');
        const medications = JSON.parse(localStorage.getItem('medications')) || [];
        const activeMedications = medications.filter(m => m.active);
        
        const drugItem = document.createElement('div');
        drugItem.className = 'drug-item card p-2 mb-2';
        drugItem.innerHTML = `
            <div class="d-flex justify-between align-center mb-1">
                <strong>Medication</strong>
                <button type="button" class="btn-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
            <div class="form-group">
                <label class="required">Medication</label>
                <select class="medicationSelect" required>
                    <option value="">Select Medication</option>
                    ${activeMedications.map(m => 
                        `<option value="${m.medication_id}" data-name="${m.medication_name}">${m.medication_name}${m.generic_name ? ' (' + m.generic_name + ')' : ''}${m.strength ? ' - ' + m.strength : ''}</option>`
                    ).join('')}
                </select>
                <small class="text-muted">Or <a href="#" onclick="App.loadPage('medication-catalog'); App.closeModal();">add new medication</a></small>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label class="required">Dosage</label>
                    <input type="text" class="dosage" placeholder="e.g., 1 tablet" required>
                </div>
                <div class="form-group">
                    <label class="required">Frequency</label>
                    <input type="text" class="frequency" placeholder="e.g., Once daily" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label class="required">Duration</label>
                    <input type="text" class="duration" placeholder="e.g., 30 days" required>
                </div>
            </div>
            <div class="form-group">
                <label>Instructions</label>
                <textarea class="instructions" rows="2"></textarea>
            </div>
        `;
        container.appendChild(drugItem);
    },

    // Add prescription
    addPrescription() {
        const form = document.getElementById('addPrescriptionForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Collect drug data
        const drugItems = document.querySelectorAll('.drug-item');
        const drugs = [];
        const medications = JSON.parse(localStorage.getItem('medications')) || [];
        
        drugItems.forEach(item => {
            const medicationSelect = item.querySelector('.medicationSelect');
            const medicationId = medicationSelect.value;
            const medication = medications.find(m => m.medication_id === medicationId);
            const drugName = medication ? medication.medication_name : medicationSelect.options[medicationSelect.selectedIndex]?.dataset.name || '';
            
            drugs.push({
                medication_id: medicationId || null,
                drugName: drugName,
                dosage: item.querySelector('.dosage').value,
                frequency: item.querySelector('.frequency').value,
                duration: item.querySelector('.duration').value,
                instructions: item.querySelector('.instructions').value
            });
        });

        const prescriptions = JSON.parse(localStorage.getItem('prescriptions')) || [];
        const currentUser = Auth.getCurrentUser();

        const newPrescription = {
            id: prescriptions.length > 0 ? Math.max(...prescriptions.map(p => p.id)) + 1 : 1,
            patientId: parseInt(document.getElementById('patientId').value),
            physicianId: currentUser.userId,
            facilityId: parseInt(document.getElementById('facilityId').value),
            prescriptionDate: document.getElementById('prescriptionDate').value,
            drugs: drugs,
            notes: document.getElementById('notes').value,
            nextRefill: document.getElementById('nextRefill').value
        };

        prescriptions.push(newPrescription);
        localStorage.setItem('prescriptions', JSON.stringify(prescriptions));

        App.closeModal();
        App.showSuccess('Prescription created successfully');
        App.loadPage('prescriptions');

        // Create reminders for the prescription
        Reminders.createRemindersFromPrescription(newPrescription);
    },

    // View prescription
    viewPrescription(prescriptionId) {
        const prescriptions = JSON.parse(localStorage.getItem('prescriptions')) || [];
        const rx = prescriptions.find(p => p.id === prescriptionId);

        if (!rx) {
            App.showError('Prescription not found');
            return;
        }

        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const facilities = JSON.parse(localStorage.getItem('facilities')) || [];

        const patient = patients.find(p => p.id === rx.patientId);
        const physician = users.find(u => u.id === rx.physicianId);
        const facility = facilities.find(f => f.id === rx.facilityId);

        const content = this.renderPrescriptionTemplate(rx, patient, physician, facility);

        App.showModal('Prescription Details', content, '');
    },

    // Render prescription template
    renderPrescriptionTemplate(rx, patient, physician, facility) {
        return `
            <div class="prescription-template">
                <div class="prescription-header">
                    <h1>Medical Prescription</h1>
                    <p>${facility ? facility.name : 'MyHubCares'}</p>
                    <p>${facility ? facility.address : ''}</p>
                </div>

                <div class="prescription-info">
                    <div>
                        <strong>Patient Information</strong><br>
                        Name: ${patient ? patient.firstName + ' ' + patient.lastName : 'N/A'}<br>
                        Age: ${patient ? this.calculateAge(patient.birthDate) : 'N/A'} years<br>
                        Sex: ${patient ? (patient.sex === 'M' ? 'Male' : 'Female') : 'N/A'}
                    </div>
                    <div>
                        <strong>Prescription Details</strong><br>
                        Date: ${new Date(rx.prescriptionDate).toLocaleDateString()}<br>
                        Rx No: RX-${String(rx.id).padStart(6, '0')}<br>
                        ${rx.nextRefill ? `Next Refill: ${new Date(rx.nextRefill).toLocaleDateString()}` : ''}
                    </div>
                </div>

                <div class="prescription-section">
                    <h3>℞ Medications</h3>
                    <div class="prescription-drugs">
                        ${rx.drugs.map((drug, index) => `
                            <div class="prescription-drug-item">
                                <strong>${index + 1}. ${drug.drugName}</strong><br>
                                Sig: ${drug.dosage} ${drug.frequency}<br>
                                Duration: ${drug.duration}<br>
                                ${drug.instructions ? `Instructions: ${drug.instructions}` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>

                ${rx.notes ? `
                    <div class="prescription-section">
                        <strong>Notes:</strong><br>
                        ${rx.notes}
                    </div>
                ` : ''}

                <div class="prescription-footer">
                    <div class="prescription-signature">
                        <div class="prescription-signature-line">
                            ${physician ? physician.fullName : 'Physician'}
                        </div>
                        <small>Prescribing Physician</small>
                    </div>
                </div>
            </div>
        `;
    },

    // Calculate age
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

    // Print prescription
    printPrescription(prescriptionId) {
        const prescriptions = JSON.parse(localStorage.getItem('prescriptions')) || [];
        const rx = prescriptions.find(p => p.id === prescriptionId);

        if (!rx) {
            App.showError('Prescription not found');
            return;
        }

        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const facilities = JSON.parse(localStorage.getItem('facilities')) || [];

        const patient = patients.find(p => p.id === rx.patientId);
        const physician = users.find(u => u.id === rx.physicianId);
        const facility = facilities.find(f => f.id === rx.facilityId);

        const content = this.renderPrescriptionTemplate(rx, patient, physician, facility);

        // Create print window
        const printWindow = window.open('', '', 'width=800,height=600');
        printWindow.document.write(`
            <html>
            <head>
                <title>Prescription - RX-${String(rx.id).padStart(6, '0')}</title>
                <link rel="stylesheet" href="css/main.css">
                <link rel="stylesheet" href="css/components.css">
                <link rel="stylesheet" href="css/dashboard.css">
                <style>
                    body { padding: 20px; }
                    @media print {
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                ${content}
                <div class="no-print" style="margin-top: 20px; text-align: center;">
                    <button onclick="window.print()" class="btn btn-primary">Print</button>
                    <button onclick="window.close()" class="btn btn-secondary">Close</button>
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
    },

    // Show dispense modal
    showDispenseModal(prescriptionId) {
        const prescriptions = JSON.parse(localStorage.getItem('prescriptions')) || [];
        const prescription = prescriptions.find(p => p.id === prescriptionId);
        
        if (!prescription) {
            App.showError('Prescription not found');
            return;
        }

        const content = `
            <form id="dispenseForm">
                <input type="hidden" id="prescriptionId" value="${prescriptionId}">
                <div class="form-group">
                    <label class="required">Quantity to Dispense</label>
                    <input type="number" id="quantityDispensed" min="1" required>
                </div>
                <div class="form-group">
                    <label>Batch Number</label>
                    <input type="text" id="batchNumber" placeholder="e.g., BATCH-2024-001">
                </div>
                <div class="form-group">
                    <label>Notes</label>
                    <textarea id="dispenseNotes" rows="2" placeholder="Dispensing notes..."></textarea>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="Prescriptions.dispenseMedication()">Dispense</button>
        `;

        App.showModal('Dispense Medication', content, footer);
    },

    // Dispense medication
    dispenseMedication() {
        const form = document.getElementById('dispenseForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const prescriptions = JSON.parse(localStorage.getItem('prescriptions')) || [];
        const prescriptionId = parseInt(document.getElementById('prescriptionId').value);
        const prescription = prescriptions.find(p => p.id === prescriptionId);
        
        if (!prescription) {
            App.showError('Prescription not found');
            return;
        }

        const dispenseEvents = JSON.parse(localStorage.getItem('dispense_events')) || [];
        const currentUser = Auth.getCurrentUser();

        const newDispense = {
            dispense_id: 'disp_' + Date.now(),
            prescription_id: prescriptionId,
            prescription_item_id: null,
            nurse_id: currentUser.userId,
            facility_id: prescription.facilityId,
            dispensed_date: new Date().toISOString().split('T')[0],
            quantity_dispensed: parseInt(document.getElementById('quantityDispensed').value),
            batch_number: document.getElementById('batchNumber').value.trim() || null,
            notes: document.getElementById('dispenseNotes').value.trim() || null,
            created_at: new Date().toISOString()
        };

        // Add patient_id to dispense event
        newDispense.patient_id = prescription.patientId;

        dispenseEvents.push(newDispense);
        localStorage.setItem('dispense_events', JSON.stringify(dispenseEvents));
        
        App.closeModal();
        App.showSuccess('Medication dispensed successfully');
        App.loadPage('prescriptions');
    }
};

