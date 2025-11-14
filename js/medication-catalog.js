// ============================================================
// MyHubCares - Medication Catalog Management
// ============================================================

const MedicationCatalog = {
    // Load medication catalog page
    loadMedicationCatalogPage(container) {
        const role = Auth.getCurrentUser().role;
        
        if (!['admin', 'physician', 'nurse'].includes(role)) {
            container.innerHTML = '<div class="alert alert-danger">Access denied</div>';
            return;
        }

        const medications = JSON.parse(localStorage.getItem('medications')) || [];

        let html = `
            <div class="patient-list-header">
                <div>
                    <h2>Medication Catalog</h2>
                    <p>Manage medication master list and catalog</p>
                </div>
                <button class="btn btn-primary" onclick="MedicationCatalog.showAddMedicationModal()">Add Medication</button>
            </div>

            <div class="card mt-3">
                <div class="card-header">
                    <div class="search-filter-bar">
                        <input type="text" id="medicationSearch" placeholder="Search by name, generic name, or ATC code..." class="search-input">
                        <select id="medicationTypeFilter">
                            <option value="all">All Types</option>
                            <option value="art">ART Medications</option>
                            <option value="controlled">Controlled Substances</option>
                            <option value="other">Other Medications</option>
                        </select>
                        <select id="medicationStatusFilter">
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Medication Name</th>
                                    <th>Generic Name</th>
                                    <th>Form</th>
                                    <th>Strength</th>
                                    <th>ATC Code</th>
                                    <th>ART</th>
                                    <th>Controlled</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="medicationsTableBody">
                                ${this.renderMedicationsTable(medications)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;

        // Setup search and filters
        document.getElementById('medicationSearch').addEventListener('input', (e) => {
            this.filterMedications(e.target.value);
        });

        document.getElementById('medicationTypeFilter').addEventListener('change', (e) => {
            this.applyTypeFilter(e.target.value);
        });

        document.getElementById('medicationStatusFilter').addEventListener('change', (e) => {
            this.applyStatusFilter(e.target.value);
        });
    },

    renderMedicationsTable(medications) {
        if (medications.length === 0) {
            return '<tr><td colspan="9" class="text-center text-muted">No medications found</td></tr>';
        }

        return medications.map(med => `
            <tr>
                <td><strong>${med.medication_name}</strong></td>
                <td>${med.generic_name || '-'}</td>
                <td><span class="badge badge-info">${med.form}</span></td>
                <td>${med.strength || '-'}</td>
                <td><code>${med.atc_code || '-'}</code></td>
                <td>${med.is_art ? '<span class="badge badge-success">Yes</span>' : '-'}</td>
                <td>${med.is_controlled ? '<span class="badge badge-warning">Yes</span>' : '-'}</td>
                <td>${med.active ? '<span class="badge badge-success">Active</span>' : '<span class="badge badge-secondary">Inactive</span>'}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-sm btn-outline" onclick="MedicationCatalog.showEditMedicationModal('${med.medication_id}')">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="MedicationCatalog.deleteMedication('${med.medication_id}')">Delete</button>
                    </div>
                </td>
            </tr>
        `).join('');
    },

    showAddMedicationModal() {
        const content = `
            <form id="addMedicationForm">
                <div class="form-group">
                    <label class="required">Medication Name</label>
                    <input type="text" id="medicationName" required placeholder="e.g., Tenofovir/Lamivudine/Dolutegravir">
                </div>
                <div class="form-group">
                    <label>Generic Name</label>
                    <input type="text" id="genericName" placeholder="e.g., TLD">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="required">Form</label>
                        <select id="form" required>
                            <option value="">Select Form</option>
                            <option value="tablet">Tablet</option>
                            <option value="capsule">Capsule</option>
                            <option value="syrup">Syrup</option>
                            <option value="injection">Injection</option>
                            <option value="cream">Cream</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Strength</label>
                        <input type="text" id="strength" placeholder="e.g., 600mg, 10mg/ml">
                    </div>
                </div>
                <div class="form-group">
                    <label>ATC Code</label>
                    <input type="text" id="atcCode" placeholder="e.g., J05AR10">
                    <small class="text-muted">Anatomical Therapeutic Chemical classification code</small>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="isArt"> ART Medication
                        </label>
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="isControlled"> Controlled Substance
                        </label>
                    </div>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="active" checked> Active
                    </label>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="MedicationCatalog.addMedication()">Save Medication</button>
        `;

        App.showModal('Add Medication', content, footer);
    },

    showEditMedicationModal(medicationId) {
        const medications = JSON.parse(localStorage.getItem('medications')) || [];
        const medication = medications.find(m => m.medication_id === medicationId);
        
        if (!medication) {
            App.showError('Medication not found');
            return;
        }

        const content = `
            <form id="editMedicationForm">
                <div class="form-group">
                    <label class="required">Medication Name</label>
                    <input type="text" id="medicationName" value="${medication.medication_name}" required>
                </div>
                <div class="form-group">
                    <label>Generic Name</label>
                    <input type="text" id="genericName" value="${medication.generic_name || ''}">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="required">Form</label>
                        <select id="form" required>
                            <option value="tablet" ${medication.form === 'tablet' ? 'selected' : ''}>Tablet</option>
                            <option value="capsule" ${medication.form === 'capsule' ? 'selected' : ''}>Capsule</option>
                            <option value="syrup" ${medication.form === 'syrup' ? 'selected' : ''}>Syrup</option>
                            <option value="injection" ${medication.form === 'injection' ? 'selected' : ''}>Injection</option>
                            <option value="cream" ${medication.form === 'cream' ? 'selected' : ''}>Cream</option>
                            <option value="other" ${medication.form === 'other' ? 'selected' : ''}>Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Strength</label>
                        <input type="text" id="strength" value="${medication.strength || ''}">
                    </div>
                </div>
                <div class="form-group">
                    <label>ATC Code</label>
                    <input type="text" id="atcCode" value="${medication.atc_code || ''}">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="isArt" ${medication.is_art ? 'checked' : ''}> ART Medication
                        </label>
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="isControlled" ${medication.is_controlled ? 'checked' : ''}> Controlled Substance
                        </label>
                    </div>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="active" ${medication.active ? 'checked' : ''}> Active
                    </label>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="MedicationCatalog.updateMedication('${medicationId}')">Update Medication</button>
        `;

        App.showModal('Edit Medication', content, footer);
    },

    addMedication() {
        const form = document.getElementById('addMedicationForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const medications = JSON.parse(localStorage.getItem('medications')) || [];
        const medicationName = document.getElementById('medicationName').value.trim();
        
        // Check for duplicate
        if (medications.find(m => m.medication_name.toLowerCase() === medicationName.toLowerCase())) {
            App.showError('Medication with this name already exists');
            return;
        }

        const newMedication = {
            medication_id: 'med_' + Date.now(),
            medication_name: medicationName,
            generic_name: document.getElementById('genericName').value.trim() || null,
            form: document.getElementById('form').value,
            strength: document.getElementById('strength').value.trim() || null,
            atc_code: document.getElementById('atcCode').value.trim() || null,
            is_art: document.getElementById('isArt').checked,
            is_controlled: document.getElementById('isControlled').checked,
            active: document.getElementById('active').checked
        };

        medications.push(newMedication);
        localStorage.setItem('medications', JSON.stringify(medications));
        
        App.closeModal();
        App.showSuccess('Medication added successfully');
        this.loadMedicationCatalogPage(document.getElementById('contentArea'));
    },

    updateMedication(medicationId) {
        const medications = JSON.parse(localStorage.getItem('medications')) || [];
        const medIndex = medications.findIndex(m => m.medication_id === medicationId);
        
        if (medIndex === -1) {
            App.showError('Medication not found');
            return;
        }

        medications[medIndex].medication_name = document.getElementById('medicationName').value.trim();
        medications[medIndex].generic_name = document.getElementById('genericName').value.trim() || null;
        medications[medIndex].form = document.getElementById('form').value;
        medications[medIndex].strength = document.getElementById('strength').value.trim() || null;
        medications[medIndex].atc_code = document.getElementById('atcCode').value.trim() || null;
        medications[medIndex].is_art = document.getElementById('isArt').checked;
        medications[medIndex].is_controlled = document.getElementById('isControlled').checked;
        medications[medIndex].active = document.getElementById('active').checked;

        localStorage.setItem('medications', JSON.stringify(medications));
        
        App.closeModal();
        App.showSuccess('Medication updated successfully');
        this.loadMedicationCatalogPage(document.getElementById('contentArea'));
    },

    deleteMedication(medicationId) {
        if (!confirm('Delete this medication? This action cannot be undone.')) {
            return;
        }

        const medications = JSON.parse(localStorage.getItem('medications')) || [];
        const filtered = medications.filter(m => m.medication_id !== medicationId);
        localStorage.setItem('medications', JSON.stringify(filtered));
        
        App.showSuccess('Medication deleted successfully');
        this.loadMedicationCatalogPage(document.getElementById('contentArea'));
    },

    filterMedications(searchTerm) {
        const medications = JSON.parse(localStorage.getItem('medications')) || [];
        const filtered = medications.filter(med => {
            const name = med.medication_name.toLowerCase();
            const generic = (med.generic_name || '').toLowerCase();
            const atc = (med.atc_code || '').toLowerCase();
            const search = searchTerm.toLowerCase();
            return name.includes(search) || generic.includes(search) || atc.includes(search);
        });

        document.getElementById('medicationsTableBody').innerHTML = this.renderMedicationsTable(filtered);
    },

    applyTypeFilter(type) {
        let medications = JSON.parse(localStorage.getItem('medications')) || [];
        
        if (type === 'art') {
            medications = medications.filter(m => m.is_art);
        } else if (type === 'controlled') {
            medications = medications.filter(m => m.is_controlled);
        } else if (type === 'other') {
            medications = medications.filter(m => !m.is_art && !m.is_controlled);
        }

        document.getElementById('medicationsTableBody').innerHTML = this.renderMedicationsTable(medications);
    },

    applyStatusFilter(status) {
        let medications = JSON.parse(localStorage.getItem('medications')) || [];
        
        if (status === 'active') {
            medications = medications.filter(m => m.active);
        } else if (status === 'inactive') {
            medications = medications.filter(m => !m.active);
        }

        document.getElementById('medicationsTableBody').innerHTML = this.renderMedicationsTable(medications);
    },

    // Get medication by ID (utility function for other modules)
    getMedicationById(medicationId) {
        const medications = JSON.parse(localStorage.getItem('medications')) || [];
        return medications.find(m => m.medication_id === medicationId);
    },

    // Get all active medications (utility function)
    getActiveMedications() {
        const medications = JSON.parse(localStorage.getItem('medications')) || [];
        return medications.filter(m => m.active);
    },

    // Get ART medications (utility function)
    getARTMedications() {
        const medications = JSON.parse(localStorage.getItem('medications')) || [];
        return medications.filter(m => m.is_art && m.active);
    }
};

