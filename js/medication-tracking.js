// ============================================================
// MyHubCares - Medication Tracking (Dispensing & Adherence)
// ============================================================

const MedicationTracking = {
    // Load dispense events page
    loadDispenseEventsPage(container) {
        const role = Auth.getCurrentUser().role;
        
        if (!['admin', 'nurse', 'physician'].includes(role)) {
            container.innerHTML = '<div class="alert alert-danger">Access denied</div>';
            return;
        }

        const dispenseEvents = JSON.parse(localStorage.getItem('dispense_events')) || [];
        const prescriptions = JSON.parse(localStorage.getItem('prescriptions')) || [];
        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const users = JSON.parse(localStorage.getItem('users')) || [];

        let html = `
            <div class="patient-list-header">
                <div>
                    <h2>Medication Dispensing</h2>
                    <p>Track medication dispensing events</p>
                </div>
            </div>

            <div class="card mt-3">
                <div class="card-header">
                    <div class="search-filter-bar">
                        <input type="text" id="dispenseSearch" placeholder="Search by patient, medication..." class="search-input">
                        <input type="date" id="dispenseDateFilter" placeholder="Filter by date">
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Patient</th>
                                    <th>Prescription</th>
                                    <th>Quantity</th>
                                    <th>Batch Number</th>
                                    <th>Dispensed By</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="dispenseTableBody">
                                ${this.renderDispenseTable(dispenseEvents, prescriptions, patients, users)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;

        // Setup search
        document.getElementById('dispenseSearch').addEventListener('input', (e) => {
            this.filterDispenseEvents(e.target.value);
        });
    },

    renderDispenseTable(dispenseEvents, prescriptions, patients, users) {
        if (dispenseEvents.length === 0) {
            return '<tr><td colspan="7" class="text-center text-muted">No dispensing events found</td></tr>';
        }

        return dispenseEvents.map(event => {
            const prescription = prescriptions.find(p => p.id === event.prescription_id);
            const patient = patients.find(p => p.id === event.patient_id);
            const nurse = users.find(u => u.id === event.nurse_id);
            
            return `
                <tr>
                    <td>${new Date(event.dispensed_date).toLocaleDateString()}</td>
                    <td>${patient ? patient.firstName + ' ' + patient.lastName : 'N/A'}</td>
                    <td>${prescription ? 'RX #' + prescription.prescriptionNumber : 'N/A'}</td>
                    <td>${event.quantity_dispensed}</td>
                    <td>${event.batch_number || '-'}</td>
                    <td>${nurse ? nurse.fullName : 'Unknown'}</td>
                    <td>
                        <button class="btn btn-sm btn-outline" onclick="MedicationTracking.viewDispenseDetails('${event.dispense_id}')">View</button>
                    </td>
                </tr>
            `;
        }).join('');
    },

    filterDispenseEvents(searchTerm) {
        const dispenseEvents = JSON.parse(localStorage.getItem('dispense_events')) || [];
        const prescriptions = JSON.parse(localStorage.getItem('prescriptions')) || [];
        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        const filtered = dispenseEvents.filter(event => {
            const patient = patients.find(p => p.id === event.patient_id);
            const patientName = patient ? `${patient.firstName} ${patient.lastName}`.toLowerCase() : '';
            const batch = (event.batch_number || '').toLowerCase();
            return patientName.includes(searchTerm.toLowerCase()) || batch.includes(searchTerm.toLowerCase());
        });

        document.getElementById('dispenseTableBody').innerHTML = 
            this.renderDispenseTable(filtered, prescriptions, patients, users);
    },

    viewDispenseDetails(dispenseId) {
        const dispenseEvents = JSON.parse(localStorage.getItem('dispense_events')) || [];
        const event = dispenseEvents.find(e => e.dispense_id === dispenseId);
        
        if (!event) {
            App.showError('Dispense event not found');
            return;
        }

        const prescriptions = JSON.parse(localStorage.getItem('prescriptions')) || [];
        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        const prescription = prescriptions.find(p => p.id === event.prescription_id);
        const patient = patients.find(p => p.id === event.patient_id);
        const nurse = users.find(u => u.id === event.nurse_id);

        const content = `
            <div class="form-group">
                <label>Patient</label>
                <input type="text" value="${patient ? patient.firstName + ' ' + patient.lastName : 'N/A'}" readonly>
            </div>
            <div class="form-group">
                <label>Prescription</label>
                <input type="text" value="${prescription ? 'RX #' + prescription.prescriptionNumber : 'N/A'}" readonly>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Quantity Dispensed</label>
                    <input type="text" value="${event.quantity_dispensed}" readonly>
                </div>
                <div class="form-group">
                    <label>Batch Number</label>
                    <input type="text" value="${event.batch_number || '-'}" readonly>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Dispensed Date</label>
                    <input type="text" value="${new Date(event.dispensed_date).toLocaleString()}" readonly>
                </div>
                <div class="form-group">
                    <label>Dispensed By</label>
                    <input type="text" value="${nurse ? nurse.fullName : 'Unknown'}" readonly>
                </div>
            </div>
            ${event.notes ? `
                <div class="form-group">
                    <label>Notes</label>
                    <textarea rows="3" readonly>${event.notes}</textarea>
                </div>
            ` : ''}
        `;

        App.showModal('Dispense Event Details', content, '');
    },

    // ========== MEDICATION ADHERENCE ==========
    loadAdherencePage(container) {
        const role = Auth.getCurrentUser().role;
        const currentUser = Auth.getCurrentUser();
        
        const adherence = JSON.parse(localStorage.getItem('medication_adherence')) || [];
        const prescriptions = JSON.parse(localStorage.getItem('prescriptions')) || [];
        const patients = JSON.parse(localStorage.getItem('patients')) || [];

        // Filter for patient role
        let filteredAdherence = adherence;
        if (role === 'patient') {
            filteredAdherence = adherence.filter(a => a.patient_id === currentUser.patientId);
        }

        let html = `
            <div class="patient-list-header">
                <div>
                    <h2>Medication Adherence</h2>
                    <p>Track daily medication adherence</p>
                </div>
                ${role === 'patient' ? '<button class="btn btn-primary" onclick="MedicationTracking.showRecordAdherenceModal()">Record Adherence</button>' : ''}
            </div>

            <div class="card mt-3">
                <div class="card-header">
                    <div class="search-filter-bar">
                        <input type="text" id="adherenceSearch" placeholder="Search..." class="search-input">
                        <input type="date" id="adherenceDateFilter" value="${new Date().toISOString().split('T')[0]}">
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Patient</th>
                                    <th>Prescription</th>
                                    <th>Taken</th>
                                    <th>Missed Reason</th>
                                    <th>Adherence %</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="adherenceTableBody">
                                ${this.renderAdherenceTable(filteredAdherence, prescriptions, patients)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;

        // Setup search and filter
        document.getElementById('adherenceSearch').addEventListener('input', (e) => {
            this.filterAdherence(e.target.value);
        });

        document.getElementById('adherenceDateFilter').addEventListener('change', (e) => {
            this.filterAdherenceByDate(e.target.value);
        });
    },

    renderAdherenceTable(adherence, prescriptions, patients) {
        if (adherence.length === 0) {
            return '<tr><td colspan="7" class="text-center text-muted">No adherence records found</td></tr>';
        }

        return adherence.map(record => {
            const prescription = prescriptions.find(p => p.id === record.prescription_id);
            const patient = patients.find(p => p.id === record.patient_id);
            
            return `
                <tr>
                    <td>${new Date(record.adherence_date).toLocaleDateString()}</td>
                    <td>${patient ? patient.firstName + ' ' + patient.lastName : 'N/A'}</td>
                    <td>${prescription ? 'RX #' + prescription.prescriptionNumber : 'N/A'}</td>
                    <td>${record.taken ? '<span class="badge badge-success">Yes</span>' : '<span class="badge badge-danger">No</span>'}</td>
                    <td>${record.missed_reason || '-'}</td>
                    <td>${record.adherence_percentage ? record.adherence_percentage + '%' : '-'}</td>
                    <td>
                        <button class="btn btn-sm btn-outline" onclick="MedicationTracking.viewAdherenceDetails('${record.adherence_id}')">View</button>
                    </td>
                </tr>
            `;
        }).join('');
    },

    showRecordAdherenceModal() {
        const currentUser = Auth.getCurrentUser();
        const prescriptions = JSON.parse(localStorage.getItem('prescriptions')) || [];
        const patientPrescriptions = prescriptions.filter(p => p.patientId === currentUser.patientId && p.status === 'active');

        if (patientPrescriptions.length === 0) {
            App.showError('No active prescriptions found');
            return;
        }

        const content = `
            <form id="recordAdherenceForm">
                <div class="form-group">
                    <label class="required">Prescription</label>
                    <select id="prescriptionId" required>
                        <option value="">Select Prescription</option>
                        ${patientPrescriptions.map(p => `<option value="${p.id}">RX #${p.prescriptionNumber}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label class="required">Date</label>
                    <input type="date" id="adherenceDate" value="${new Date().toISOString().split('T')[0]}" required>
                </div>
                <div class="form-group">
                    <label class="required">Medication Taken?</label>
                    <select id="taken" required>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                </div>
                <div class="form-group" id="missedReasonGroup" style="display: none;">
                    <label>Reason for Missing</label>
                    <textarea id="missedReason" rows="3" placeholder="Enter reason for missing dose..."></textarea>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="MedicationTracking.saveAdherence()">Save Record</button>
        `;

        App.showModal('Record Medication Adherence', content, footer);

        // Show/hide missed reason based on selection
        document.getElementById('taken').addEventListener('change', (e) => {
            document.getElementById('missedReasonGroup').style.display = e.target.value === 'false' ? 'block' : 'none';
        });
    },

    saveAdherence() {
        const form = document.getElementById('recordAdherenceForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const adherence = JSON.parse(localStorage.getItem('medication_adherence')) || [];
        const currentUser = Auth.getCurrentUser();
        const prescriptionId = parseInt(document.getElementById('prescriptionId').value);
        const taken = document.getElementById('taken').value === 'true';
        const adherenceDate = document.getElementById('adherenceDate').value;
        const missedReason = document.getElementById('missedReason').value.trim() || null;

        // Calculate adherence percentage (simplified - in real app, calculate over time period)
        const prescriptions = JSON.parse(localStorage.getItem('prescriptions')) || [];
        const prescription = prescriptions.find(p => p.id === prescriptionId);
        
        // Get all adherence records for this prescription
        const prescriptionAdherence = adherence.filter(a => a.prescription_id === prescriptionId);
        const totalRecords = prescriptionAdherence.length + 1;
        const takenCount = prescriptionAdherence.filter(a => a.taken).length + (taken ? 1 : 0);
        const adherencePercentage = ((takenCount / totalRecords) * 100).toFixed(2);

        const newAdherence = {
            adherence_id: 'adh_' + Date.now(),
            prescription_id: prescriptionId,
            patient_id: currentUser.patientId,
            adherence_date: adherenceDate,
            taken: taken,
            missed_reason: missedReason,
            adherence_percentage: parseFloat(adherencePercentage),
            recorded_at: new Date().toISOString()
        };

        adherence.push(newAdherence);
        localStorage.setItem('medication_adherence', JSON.stringify(adherence));
        
        App.closeModal();
        App.showSuccess('Adherence recorded successfully');
        this.loadAdherencePage(document.getElementById('contentArea'));
    },

    filterAdherence(searchTerm) {
        const adherence = JSON.parse(localStorage.getItem('medication_adherence')) || [];
        const prescriptions = JSON.parse(localStorage.getItem('prescriptions')) || [];
        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        
        const filtered = adherence.filter(record => {
            const patient = patients.find(p => p.id === record.patient_id);
            const patientName = patient ? `${patient.firstName} ${patient.lastName}`.toLowerCase() : '';
            return patientName.includes(searchTerm.toLowerCase());
        });

        document.getElementById('adherenceTableBody').innerHTML = 
            this.renderAdherenceTable(filtered, prescriptions, patients);
    },

    filterAdherenceByDate(date) {
        const adherence = JSON.parse(localStorage.getItem('medication_adherence')) || [];
        const prescriptions = JSON.parse(localStorage.getItem('prescriptions')) || [];
        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        
        const filtered = adherence.filter(record => {
            const recordDate = new Date(record.adherence_date).toISOString().split('T')[0];
            return recordDate === date;
        });

        document.getElementById('adherenceTableBody').innerHTML = 
            this.renderAdherenceTable(filtered, prescriptions, patients);
    },

    viewAdherenceDetails(adherenceId) {
        const adherence = JSON.parse(localStorage.getItem('medication_adherence')) || [];
        const record = adherence.find(a => a.adherence_id === adherenceId);
        
        if (!record) {
            App.showError('Adherence record not found');
            return;
        }

        const prescriptions = JSON.parse(localStorage.getItem('prescriptions')) || [];
        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        
        const prescription = prescriptions.find(p => p.id === record.prescription_id);
        const patient = patients.find(p => p.id === record.patient_id);

        const content = `
            <div class="form-group">
                <label>Patient</label>
                <input type="text" value="${patient ? patient.firstName + ' ' + patient.lastName : 'N/A'}" readonly>
            </div>
            <div class="form-group">
                <label>Prescription</label>
                <input type="text" value="${prescription ? 'RX #' + prescription.prescriptionNumber : 'N/A'}" readonly>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Date</label>
                    <input type="text" value="${new Date(record.adherence_date).toLocaleDateString()}" readonly>
                </div>
                <div class="form-group">
                    <label>Status</label>
                    <input type="text" value="${record.taken ? 'Taken' : 'Missed'}" readonly>
                </div>
            </div>
            ${record.missed_reason ? `
                <div class="form-group">
                    <label>Missed Reason</label>
                    <textarea rows="3" readonly>${record.missed_reason}</textarea>
                </div>
            ` : ''}
            <div class="form-group">
                <label>Adherence Percentage</label>
                <input type="text" value="${record.adherence_percentage}%" readonly>
            </div>
            <div class="form-group">
                <label>Recorded At</label>
                <input type="text" value="${new Date(record.recorded_at).toLocaleString()}" readonly>
            </div>
        `;

        App.showModal('Adherence Record Details', content, '');
    }
};

