// ============================================================
// MyHubCares - ART Regimen Management
// ============================================================

const ARTRegimen = {
    // Load ART regimen page
    loadARTPage(container) {
        const role = Auth.getCurrentUser().role;
        
        if (!['admin', 'physician', 'nurse'].includes(role)) {
            container.innerHTML = '<div class="alert alert-danger">Access denied</div>';
            return;
        }

        const regimens = JSON.parse(localStorage.getItem('artRegimens')) || [];
        const patients = JSON.parse(localStorage.getItem('patients')) || [];

        let html = `
            <div class="patient-list-header">
                <div>
                    <h2>ART Regimen Management</h2>
                    <p>Manage antiretroviral therapy regimens and adherence</p>
                </div>
                <button class="btn btn-primary" onclick="ARTRegimen.showAddRegimenModal()">
                    Start New Regimen
                </button>
            </div>

            <div class="card mt-3">
                <div class="card-header">
                    <div class="search-filter-bar">
                        <input type="text" id="regimenSearch" placeholder="Search regimens..." class="search-input">
                        <select id="statusFilter">
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="stopped">Stopped</option>
                            <option value="changed">Changed</option>
                        </select>
                    </div>
                </div>
                <div class="card-body">
                    <div id="regimenList">
                        ${this.renderRegimenList(regimens, patients)}
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;

        // Setup search and filter
        document.getElementById('regimenSearch').addEventListener('input', (e) => {
            this.filterRegimens(e.target.value);
        });

        document.getElementById('statusFilter').addEventListener('change', (e) => {
            this.applyStatusFilter(e.target.value);
        });
    },

    // Render regimen list
    renderRegimenList(regimens, patients) {
        if (regimens.length === 0) {
            return '<p class="text-muted">No ART regimens recorded</p>';
        }

        return regimens.map(regimen => {
            const patient = patients.find(p => p.id === regimen.patientId);
            const startDate = new Date(regimen.startDate);
            const daysOnART = regimen.stopDate ? 
                Math.floor((new Date(regimen.stopDate) - startDate) / (1000 * 60 * 60 * 24)) :
                Math.floor((new Date() - startDate) / (1000 * 60 * 60 * 24));

            let statusClass = 'success';
            if (regimen.status === 'stopped') statusClass = 'danger';
            if (regimen.status === 'changed') statusClass = 'warning';

            return `
                <div class="patient-card">
                    <div class="patient-info">
                        <div>
                            <h3>${patient ? patient.firstName + ' ' + patient.lastName : 'N/A'}</h3>
                            <div class="patient-meta">
                                <span>📅 Started: ${startDate.toLocaleDateString()}</span>
                                <span>⏱ ${daysOnART} days on ART</span>
                                <span>💊 ${regimen.drugs ? regimen.drugs.length : 0} medications</span>
                            </div>
                            ${regimen.notes ? `<p class="mt-1"><strong>Notes:</strong> ${regimen.notes}</p>` : ''}
                        </div>
                    </div>
                    <div class="patient-actions">
                        <span class="badge badge-${statusClass}">${regimen.status}</span>
                        <button class="btn btn-sm btn-primary" onclick="ARTRegimen.viewRegimenDetails(${regimen.id})">
                            View
                        </button>
                        ${regimen.status === 'active' ? `
                            <button class="btn btn-sm btn-warning" onclick="ARTRegimen.showStopRegimenModal(${regimen.id})">
                                Stop/Change
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    },

    // Filter regimens
    filterRegimens(searchTerm) {
        const regimens = JSON.parse(localStorage.getItem('artRegimens')) || [];
        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        
        const filtered = regimens.filter(r => {
            const patient = patients.find(p => p.id === r.patientId);
            const patientName = patient ? `${patient.firstName} ${patient.lastName}`.toLowerCase() : '';
            return patientName.includes(searchTerm.toLowerCase());
        });

        document.getElementById('regimenList').innerHTML = this.renderRegimenList(filtered, patients);
    },

    // Apply status filter
    applyStatusFilter(status) {
        let regimens = JSON.parse(localStorage.getItem('artRegimens')) || [];
        const patients = JSON.parse(localStorage.getItem('patients')) || [];

        if (status !== 'all') {
            regimens = regimens.filter(r => r.status === status);
        }

        document.getElementById('regimenList').innerHTML = this.renderRegimenList(regimens, patients);
    },

    // Show add regimen modal
    showAddRegimenModal() {
        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const inventory = JSON.parse(localStorage.getItem('inventory')) || [];

        const content = `
            <form id="addRegimenForm">
                <div class="form-group">
                    <label class="required">Patient</label>
                    <select id="patientId" required>
                        <option value="">Select Patient</option>
                        ${patients.map(p => `<option value="${p.id}">${p.firstName} ${p.lastName}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label class="required">Start Date</label>
                    <input type="date" id="startDate" value="${new Date().toISOString().split('T')[0]}" required>
                </div>

                <h4 class="mt-3">ART Medications</h4>
                <div id="drugsContainer">
                    <div class="drug-item card p-2 mb-2">
                        <div class="form-group">
                            <label class="required">Drug Name</label>
                            <select class="drugName" required>
                                <option value="">Select Drug</option>
                                ${inventory.map(item => `<option value="${item.drugName}">${item.drugName}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label class="required">Dosage</label>
                                <input type="text" class="dose" placeholder="e.g., 1 tablet" required>
                            </div>
                            <div class="form-group">
                                <label class="required">Pills per Day</label>
                                <input type="number" class="pillsPerDay" min="1" value="1" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Initial Pills Dispensed</label>
                            <input type="number" class="pillsDispensed" min="0" value="30">
                        </div>
                    </div>
                </div>
                <button type="button" class="btn btn-sm btn-outline" onclick="ARTRegimen.addDrugField()">
                    + Add Another Drug
                </button>

                <div class="form-group mt-3">
                    <label>Clinical Notes</label>
                    <textarea id="notes" rows="3" placeholder="Enter regimen notes..."></textarea>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="ARTRegimen.addRegimen()">Start Regimen</button>
        `;

        App.showModal('Start ART Regimen', content, footer);
    },

    // Add drug field
    addDrugField() {
        const container = document.getElementById('drugsContainer');
        const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
        
        const drugItem = document.createElement('div');
        drugItem.className = 'drug-item card p-2 mb-2';
        drugItem.innerHTML = `
            <div class="d-flex justify-between align-center mb-1">
                <strong>Medication</strong>
                <button type="button" class="btn-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
            <div class="form-group">
                <label class="required">Drug Name</label>
                <select class="drugName" required>
                    <option value="">Select Drug</option>
                    ${inventory.map(item => `<option value="${item.drugName}">${item.drugName}</option>`).join('')}
                </select>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label class="required">Dosage</label>
                    <input type="text" class="dose" placeholder="e.g., 1 tablet" required>
                </div>
                <div class="form-group">
                    <label class="required">Pills per Day</label>
                    <input type="number" class="pillsPerDay" min="1" value="1" required>
                </div>
            </div>
            <div class="form-group">
                <label>Initial Pills Dispensed</label>
                <input type="number" class="pillsDispensed" min="0" value="30">
            </div>
        `;
        container.appendChild(drugItem);
    },

    // Add regimen
    addRegimen() {
        const form = document.getElementById('addRegimenForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Collect drug data
        const drugItems = document.querySelectorAll('.drug-item');
        const drugs = [];
        drugItems.forEach(item => {
            drugs.push({
                drugName: item.querySelector('.drugName').value,
                dose: item.querySelector('.dose').value,
                pillsPerDay: parseInt(item.querySelector('.pillsPerDay').value),
                pillsDispensed: parseInt(item.querySelector('.pillsDispensed').value) || 0,
                pillsRemaining: parseInt(item.querySelector('.pillsDispensed').value) || 0,
                missedDoses: 0
            });
        });

        const regimens = JSON.parse(localStorage.getItem('artRegimens')) || [];
        const newRegimen = {
            id: regimens.length > 0 ? Math.max(...regimens.map(r => r.id)) + 1 : 1,
            patientId: parseInt(document.getElementById('patientId').value),
            startDate: document.getElementById('startDate').value,
            stopDate: null,
            status: 'active',
            drugs: drugs,
            notes: document.getElementById('notes').value,
            createdAt: new Date().toISOString()
        };

        regimens.push(newRegimen);
        localStorage.setItem('artRegimens', JSON.stringify(regimens));

        App.closeModal();
        App.showSuccess('ART regimen started successfully');
        App.loadPage('art-regimen');
    },

    // View regimen details
    viewRegimenDetails(regimenId) {
        const regimens = JSON.parse(localStorage.getItem('artRegimens')) || [];
        const regimen = regimens.find(r => r.id === regimenId);

        if (!regimen) {
            App.showError('Regimen not found');
            return;
        }

        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const patient = patients.find(p => p.id === regimen.patientId);

        const content = `
            <div class="form-group">
                <label>Patient Name</label>
                <input type="text" value="${patient ? patient.firstName + ' ' + patient.lastName : 'N/A'}" readonly>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Start Date</label>
                    <input type="date" value="${regimen.startDate}" readonly>
                </div>
                <div class="form-group">
                    <label>Status</label>
                    <input type="text" value="${regimen.status}" readonly style="text-transform: capitalize;">
                </div>
            </div>
            ${regimen.stopDate ? `
                <div class="form-row">
                    <div class="form-group">
                        <label>Stop Date</label>
                        <input type="date" value="${regimen.stopDate}" readonly>
                    </div>
                    <div class="form-group">
                        <label>Stop Reason</label>
                        <input type="text" value="${regimen.stopReason || 'N/A'}" readonly>
                    </div>
                </div>
            ` : ''}

            <h4 class="mt-3">Medications</h4>
            ${regimen.drugs.map((drug, index) => `
                <div class="card p-2 mb-2">
                    <strong>${index + 1}. ${drug.drugName}</strong>
                    <div class="form-row mt-2">
                        <div class="form-group">
                            <label>Dosage</label>
                            <input type="text" value="${drug.dose}" readonly>
                        </div>
                        <div class="form-group">
                            <label>Pills/Day</label>
                            <input type="text" value="${drug.pillsPerDay}" readonly>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Pills Remaining</label>
                            <input type="text" value="${drug.pillsRemaining || 0}" readonly>
                        </div>
                        <div class="form-group">
                            <label>Missed Doses</label>
                            <input type="text" value="${drug.missedDoses || 0}" readonly>
                        </div>
                    </div>
                </div>
            `).join('')}

            ${regimen.notes ? `
                <div class="form-group mt-3">
                    <label>Clinical Notes</label>
                    <textarea rows="3" readonly>${regimen.notes}</textarea>
                </div>
            ` : ''}
        `;

        App.showModal('ART Regimen Details', content, '');
    },

    // Show stop regimen modal
    showStopRegimenModal(regimenId) {
        const content = `
            <form id="stopRegimenForm">
                <input type="hidden" id="regimenId" value="${regimenId}">
                <div class="form-group">
                    <label class="required">Action</label>
                    <select id="action" required>
                        <option value="stopped">Stop Regimen</option>
                        <option value="changed">Change Regimen</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="required">Date</label>
                    <input type="date" id="stopDate" value="${new Date().toISOString().split('T')[0]}" required>
                </div>
                <div class="form-group">
                    <label class="required">Reason</label>
                    <textarea id="stopReason" rows="3" required placeholder="Enter reason for stopping/changing regimen..."></textarea>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="ARTRegimen.stopRegimen()">Save</button>
        `;

        App.showModal('Stop/Change ART Regimen', content, footer);
    },

    // Stop regimen
    stopRegimen() {
        const form = document.getElementById('stopRegimenForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const regimenId = parseInt(document.getElementById('regimenId').value);
        const regimens = JSON.parse(localStorage.getItem('artRegimens')) || [];
        const index = regimens.findIndex(r => r.id === regimenId);

        if (index === -1) {
            App.showError('Regimen not found');
            return;
        }

        regimens[index].status = document.getElementById('action').value;
        regimens[index].stopDate = document.getElementById('stopDate').value;
        regimens[index].stopReason = document.getElementById('stopReason').value;
        regimens[index].updatedAt = new Date().toISOString();

        localStorage.setItem('artRegimens', JSON.stringify(regimens));

        App.closeModal();
        App.showSuccess('ART regimen updated successfully');
        App.loadPage('art-regimen');
    }
};

