// ============================================================
// MyHubCares - Clinical Care (Diagnoses & Procedures)
// ============================================================

const ClinicalCare = {
    // Load diagnoses for a visit
    loadDiagnosesForVisit(visitId) {
        const diagnoses = JSON.parse(localStorage.getItem('diagnoses')) || [];
        return diagnoses.filter(d => d.visit_id === visitId);
    },

    // Load procedures for a visit
    loadProceduresForVisit(visitId) {
        const procedures = JSON.parse(localStorage.getItem('procedures')) || [];
        return procedures.filter(p => p.visit_id === visitId);
    },

    // Add diagnosis
    addDiagnosis(visitId, diagnosisData) {
        const diagnoses = JSON.parse(localStorage.getItem('diagnoses')) || [];
        
        const newDiagnosis = {
            diagnosis_id: 'diag_' + Date.now(),
            visit_id: visitId,
            icd10_code: diagnosisData.icd10_code || null,
            diagnosis_description: diagnosisData.diagnosis_description,
            diagnosis_type: diagnosisData.diagnosis_type || 'primary',
            is_chronic: diagnosisData.is_chronic || false,
            onset_date: diagnosisData.onset_date || null,
            resolved_date: diagnosisData.resolved_date || null
        };

        diagnoses.push(newDiagnosis);
        localStorage.setItem('diagnoses', JSON.stringify(diagnoses));
        return newDiagnosis;
    },

    // Add procedure
    addProcedure(visitId, procedureData) {
        const procedures = JSON.parse(localStorage.getItem('procedures')) || [];
        
        const newProcedure = {
            procedure_id: 'proc_' + Date.now(),
            visit_id: visitId,
            cpt_code: procedureData.cpt_code || null,
            procedure_name: procedureData.procedure_name,
            procedure_description: procedureData.procedure_description || null,
            outcome: procedureData.outcome || null,
            performed_at: procedureData.performed_at ? new Date(procedureData.performed_at).toISOString() : new Date().toISOString()
        };

        procedures.push(newProcedure);
        localStorage.setItem('procedures', JSON.stringify(procedures));
        return newProcedure;
    },

    // Show add diagnosis modal
    showAddDiagnosisModal(visitId) {
        const content = `
            <form id="addDiagnosisForm">
                <input type="hidden" id="visitId" value="${visitId}">
                <div class="form-group">
                    <label>ICD-10 Code</label>
                    <input type="text" id="icd10Code" placeholder="e.g., B20">
                    <small class="text-muted">Optional ICD-10 classification code</small>
                </div>
                <div class="form-group">
                    <label class="required">Diagnosis Description</label>
                    <textarea id="diagnosisDescription" rows="3" required placeholder="Enter diagnosis description..."></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="required">Diagnosis Type</label>
                        <select id="diagnosisType" required>
                            <option value="primary">Primary</option>
                            <option value="secondary">Secondary</option>
                            <option value="differential">Differential</option>
                            <option value="rule_out">Rule Out</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="isChronic"> Chronic Condition
                        </label>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Onset Date</label>
                        <input type="date" id="onsetDate">
                    </div>
                    <div class="form-group">
                        <label>Resolved Date</label>
                        <input type="date" id="resolvedDate">
                    </div>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="ClinicalCare.saveDiagnosis()">Save Diagnosis</button>
        `;

        App.showModal('Add Diagnosis', content, footer);
    },

    // Show add procedure modal
    showAddProcedureModal(visitId) {
        const content = `
            <form id="addProcedureForm">
                <input type="hidden" id="visitId" value="${visitId}">
                <div class="form-group">
                    <label>CPT Code</label>
                    <input type="text" id="cptCode" placeholder="e.g., 99213">
                    <small class="text-muted">Optional CPT procedure code</small>
                </div>
                <div class="form-group">
                    <label class="required">Procedure Name</label>
                    <input type="text" id="procedureName" required placeholder="e.g., Physical Examination">
                </div>
                <div class="form-group">
                    <label>Procedure Description</label>
                    <textarea id="procedureDescription" rows="3" placeholder="Enter procedure details..."></textarea>
                </div>
                <div class="form-group">
                    <label>Outcome</label>
                    <textarea id="outcome" rows="2" placeholder="Enter procedure outcome..."></textarea>
                </div>
                <div class="form-group">
                    <label>Performed At</label>
                    <input type="datetime-local" id="performedAt" value="${new Date().toISOString().slice(0, 16)}">
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="ClinicalCare.saveProcedure()">Save Procedure</button>
        `;

        App.showModal('Add Procedure', content, footer);
    },

    // Save diagnosis
    saveDiagnosis() {
        const form = document.getElementById('addDiagnosisForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const visitId = document.getElementById('visitId').value;
        const onsetDate = document.getElementById('onsetDate').value;
        const resolvedDate = document.getElementById('resolvedDate').value;

        const diagnosisData = {
            icd10_code: document.getElementById('icd10Code').value.trim() || null,
            diagnosis_description: document.getElementById('diagnosisDescription').value.trim(),
            diagnosis_type: document.getElementById('diagnosisType').value,
            is_chronic: document.getElementById('isChronic').checked,
            onset_date: onsetDate ? new Date(onsetDate).toISOString() : null,
            resolved_date: resolvedDate ? new Date(resolvedDate).toISOString() : null
        };

        this.addDiagnosis(visitId, diagnosisData);
        
        App.closeModal();
        App.showSuccess('Diagnosis added successfully');
        
        // Refresh visit details if modal is open
        if (typeof Visits !== 'undefined' && Visits.viewVisitDetails) {
            Visits.viewVisitDetails(parseInt(visitId));
        }
    },

    // Save procedure
    saveProcedure() {
        const form = document.getElementById('addProcedureForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const visitId = document.getElementById('visitId').value;
        const performedAt = document.getElementById('performedAt').value;

        const procedureData = {
            cpt_code: document.getElementById('cptCode').value.trim() || null,
            procedure_name: document.getElementById('procedureName').value.trim(),
            procedure_description: document.getElementById('procedureDescription').value.trim() || null,
            outcome: document.getElementById('outcome').value.trim() || null,
            performed_at: performedAt ? new Date(performedAt).toISOString() : new Date().toISOString()
        };

        this.addProcedure(visitId, procedureData);
        
        App.closeModal();
        App.showSuccess('Procedure added successfully');
        
        // Refresh visit details if modal is open
        if (typeof Visits !== 'undefined' && Visits.viewVisitDetails) {
            Visits.viewVisitDetails(parseInt(visitId));
        }
    },

    // Delete diagnosis
    deleteDiagnosis(diagnosisId) {
        if (!confirm('Delete this diagnosis?')) {
            return;
        }

        const diagnoses = JSON.parse(localStorage.getItem('diagnoses')) || [];
        const filtered = diagnoses.filter(d => d.diagnosis_id !== diagnosisId);
        localStorage.setItem('diagnoses', JSON.stringify(filtered));
        
        App.showSuccess('Diagnosis deleted successfully');
    },

    // Delete procedure
    deleteProcedure(procedureId) {
        if (!confirm('Delete this procedure?')) {
            return;
        }

        const procedures = JSON.parse(localStorage.getItem('procedures')) || [];
        const filtered = procedures.filter(p => p.procedure_id !== procedureId);
        localStorage.setItem('procedures', JSON.stringify(filtered));
        
        App.showSuccess('Procedure deleted successfully');
    },

    // Render diagnoses section
    renderDiagnosesSection(visitId) {
        const diagnoses = this.loadDiagnosesForVisit(visitId);
        
        if (diagnoses.length === 0) {
            return `
                <div class="mt-3">
                    <h4>Diagnoses</h4>
                    <p class="text-muted">No diagnoses recorded</p>
                    <button class="btn btn-sm btn-primary" onclick="ClinicalCare.showAddDiagnosisModal('${visitId}')">Add Diagnosis</button>
                </div>
            `;
        }

        return `
            <div class="mt-3">
                <div class="d-flex justify-between align-center mb-2">
                    <h4>Diagnoses</h4>
                    <button class="btn btn-sm btn-primary" onclick="ClinicalCare.showAddDiagnosisModal('${visitId}')">Add Diagnosis</button>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ICD-10</th>
                                <th>Description</th>
                                <th>Type</th>
                                <th>Chronic</th>
                                <th>Onset</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${diagnoses.map(diag => `
                                <tr>
                                    <td>${diag.icd10_code || '-'}</td>
                                    <td>${diag.diagnosis_description}</td>
                                    <td><span class="badge badge-info">${diag.diagnosis_type}</span></td>
                                    <td>${diag.is_chronic ? '<span class="badge badge-warning">Yes</span>' : 'No'}</td>
                                    <td>${diag.onset_date ? new Date(diag.onset_date).toLocaleDateString() : '-'}</td>
                                    <td>
                                        <button class="btn btn-sm btn-danger" onclick="ClinicalCare.deleteDiagnosis('${diag.diagnosis_id}')">Delete</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    // Render procedures section
    renderProceduresSection(visitId) {
        const procedures = this.loadProceduresForVisit(visitId);
        
        if (procedures.length === 0) {
            return `
                <div class="mt-3">
                    <h4>Procedures</h4>
                    <p class="text-muted">No procedures recorded</p>
                    <button class="btn btn-sm btn-primary" onclick="ClinicalCare.showAddProcedureModal('${visitId}')">Add Procedure</button>
                </div>
            `;
        }

        return `
            <div class="mt-3">
                <div class="d-flex justify-between align-center mb-2">
                    <h4>Procedures</h4>
                    <button class="btn btn-sm btn-primary" onclick="ClinicalCare.showAddProcedureModal('${visitId}')">Add Procedure</button>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>CPT Code</th>
                                <th>Procedure Name</th>
                                <th>Description</th>
                                <th>Performed At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${procedures.map(proc => `
                                <tr>
                                    <td>${proc.cpt_code || '-'}</td>
                                    <td><strong>${proc.procedure_name}</strong></td>
                                    <td>${proc.procedure_description || '-'}</td>
                                    <td>${new Date(proc.performed_at).toLocaleString()}</td>
                                    <td>
                                        <button class="btn btn-sm btn-danger" onclick="ClinicalCare.deleteProcedure('${proc.procedure_id}')">Delete</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }
};

