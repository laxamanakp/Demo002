// ============================================================
// MyHubCares - System Administration (Settings & Reference Data)
// ============================================================

const SystemAdmin = {
    // Load system admin page
    loadSystemAdminPage(container) {
        const role = Auth.getCurrentUser().role;
        
        if (role !== 'admin') {
            container.innerHTML = '<div class="alert alert-danger">Access denied. Admin only.</div>';
            return;
        }

        let html = `
            <div class="tabs">
                <div class="tab active" data-tab="settings">System Settings</div>
                <div class="tab" data-tab="facility-assignments">Facility Assignments</div>
                <div class="tab" data-tab="regions">Regions</div>
                <div class="tab" data-tab="client-types">Client Types</div>
            </div>

            <div class="tab-content active" id="settingsTab">
                ${this.renderSettingsTab()}
            </div>

            <div class="tab-content" id="facility-assignmentsTab">
                ${this.renderFacilityAssignmentsTab()}
            </div>

            <div class="tab-content" id="regionsTab">
                ${this.renderRegionsTab()}
            </div>

            <div class="tab-content" id="client-typesTab">
                ${this.renderClientTypesTab()}
            </div>
        `;

        container.innerHTML = html;
        this.setupTabs();
    },

    setupTabs() {
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.getAttribute('data-tab');
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                document.getElementById(tabName + 'Tab').classList.add('active');
            });
        });
    },

    // ========== SYSTEM SETTINGS ==========
    renderSettingsTab() {
        const settings = JSON.parse(localStorage.getItem('system_settings')) || [];
        
        return `
            <div class="patient-list-header">
                <div>
                    <h2>System Settings</h2>
                    <p>Manage system configuration</p>
                </div>
                <button class="btn btn-primary" onclick="SystemAdmin.showAddSettingModal()">Add Setting</button>
            </div>

            <div class="card mt-3">
                <div class="card-body">
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Setting Key</th>
                                    <th>Value</th>
                                    <th>Description</th>
                                    <th>Updated</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="settingsTableBody">
                                ${this.renderSettingsTable(settings)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },

    renderSettingsTable(settings) {
        if (settings.length === 0) {
            return '<tr><td colspan="5" class="text-center text-muted">No settings found</td></tr>';
        }

        return settings.map(setting => {
            const value = typeof setting.setting_value === 'string' ? 
                setting.setting_value : 
                JSON.stringify(setting.setting_value);
            
            return `
                <tr>
                    <td><code>${setting.setting_key}</code></td>
                    <td>${value.length > 50 ? value.substring(0, 50) + '...' : value}</td>
                    <td>${setting.description || '-'}</td>
                    <td>${new Date(setting.updated_at).toLocaleDateString()}</td>
                    <td>
                        <div class="table-actions">
                            <button class="btn btn-sm btn-outline" onclick="SystemAdmin.showEditSettingModal('${setting.setting_key}')">Edit</button>
                            <button class="btn btn-sm btn-danger" onclick="SystemAdmin.deleteSetting('${setting.setting_key}')">Delete</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    },

    showAddSettingModal() {
        const content = `
            <form id="addSettingForm">
                <div class="form-group">
                    <label class="required">Setting Key</label>
                    <input type="text" id="settingKey" required placeholder="e.g., system.name">
                    <small class="text-muted">Format: category.key</small>
                </div>
                <div class="form-group">
                    <label class="required">Setting Value</label>
                    <textarea id="settingValue" rows="3" required placeholder='Enter value (string, number, or JSON)'></textarea>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea id="settingDescription" rows="2" placeholder="Setting description..."></textarea>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="SystemAdmin.addSetting()">Save Setting</button>
        `;

        App.showModal('Add System Setting', content, footer);
    },

    showEditSettingModal(settingKey) {
        const settings = JSON.parse(localStorage.getItem('system_settings')) || [];
        const setting = settings.find(s => s.setting_key === settingKey);
        
        if (!setting) {
            App.showError('Setting not found');
            return;
        }

        const value = typeof setting.setting_value === 'string' ? 
            setting.setting_value : 
            JSON.stringify(setting.setting_value, null, 2);

        const content = `
            <form id="editSettingForm">
                <div class="form-group">
                    <label>Setting Key</label>
                    <input type="text" value="${setting.setting_key}" readonly>
                    <small class="text-muted">Setting key cannot be changed</small>
                </div>
                <div class="form-group">
                    <label class="required">Setting Value</label>
                    <textarea id="settingValue" rows="3" required>${value}</textarea>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea id="settingDescription" rows="2">${setting.description || ''}</textarea>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="SystemAdmin.updateSetting('${settingKey}')">Update Setting</button>
        `;

        App.showModal('Edit System Setting', content, footer);
    },

    addSetting() {
        const form = document.getElementById('addSettingForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const settings = JSON.parse(localStorage.getItem('system_settings')) || [];
        const settingKey = document.getElementById('settingKey').value.trim();
        const valueText = document.getElementById('settingValue').value.trim();
        const currentUser = Auth.getCurrentUser();

        // Try to parse as JSON, otherwise use as string
        let settingValue;
        try {
            settingValue = JSON.parse(valueText);
        } catch (e) {
            settingValue = valueText;
        }

        if (settings.find(s => s.setting_key === settingKey)) {
            App.showError('Setting key already exists');
            return;
        }

        const newSetting = {
            setting_key: settingKey,
            setting_value: settingValue,
            description: document.getElementById('settingDescription').value.trim() || null,
            updated_at: new Date().toISOString(),
            updated_by: currentUser.userId
        };

        settings.push(newSetting);
        localStorage.setItem('system_settings', JSON.stringify(settings));
        
        App.closeModal();
        App.showSuccess('Setting added successfully');
        this.loadSystemAdminPage(document.getElementById('contentArea'));
    },

    updateSetting(settingKey) {
        const settings = JSON.parse(localStorage.getItem('system_settings')) || [];
        const settingIndex = settings.findIndex(s => s.setting_key === settingKey);
        
        if (settingIndex === -1) {
            App.showError('Setting not found');
            return;
        }

        const valueText = document.getElementById('settingValue').value.trim();
        const currentUser = Auth.getCurrentUser();

        // Try to parse as JSON, otherwise use as string
        let settingValue;
        try {
            settingValue = JSON.parse(valueText);
        } catch (e) {
            settingValue = valueText;
        }

        settings[settingIndex].setting_value = settingValue;
        settings[settingIndex].description = document.getElementById('settingDescription').value.trim() || null;
        settings[settingIndex].updated_at = new Date().toISOString();
        settings[settingIndex].updated_by = currentUser.userId;

        localStorage.setItem('system_settings', JSON.stringify(settings));
        
        App.closeModal();
        App.showSuccess('Setting updated successfully');
        this.loadSystemAdminPage(document.getElementById('contentArea'));
    },

    deleteSetting(settingKey) {
        if (!confirm('Delete this system setting?')) {
            return;
        }

        const settings = JSON.parse(localStorage.getItem('system_settings')) || [];
        const filtered = settings.filter(s => s.setting_key !== settingKey);
        localStorage.setItem('system_settings', JSON.stringify(filtered));
        
        App.showSuccess('Setting deleted successfully');
        this.loadSystemAdminPage(document.getElementById('contentArea'));
    },

    // ========== FACILITY ASSIGNMENTS ==========
    renderFacilityAssignmentsTab() {
        const assignments = JSON.parse(localStorage.getItem('user_facility_assignments')) || [];
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const facilities = JSON.parse(localStorage.getItem('facilities')) || [];
        
        return `
            <div class="patient-list-header">
                <div>
                    <h2>User Facility Assignments</h2>
                    <p>Manage user assignments to facilities</p>
                </div>
                <button class="btn btn-primary" onclick="SystemAdmin.showAddAssignmentModal()">Assign Facility</button>
            </div>

            <div class="card mt-3">
                <div class="card-body">
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Facility</th>
                                    <th>Primary</th>
                                    <th>Assigned At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="assignmentsTableBody">
                                ${this.renderAssignmentsTable(assignments, users, facilities)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },

    renderAssignmentsTable(assignments, users, facilities) {
        if (assignments.length === 0) {
            return '<tr><td colspan="5" class="text-center text-muted">No facility assignments found</td></tr>';
        }

        return assignments.map(assignment => {
            const user = users.find(u => u.id === assignment.user_id);
            const facility = facilities.find(f => f.id === assignment.facility_id);
            
            return `
                <tr>
                    <td>${user ? user.fullName : 'Unknown'}</td>
                    <td>${facility ? facility.name : 'N/A'}</td>
                    <td>${assignment.is_primary ? '<span class="badge badge-success">Primary</span>' : 'No'}</td>
                    <td>${new Date(assignment.assigned_at).toLocaleDateString()}</td>
                    <td>
                        <button class="btn btn-sm btn-danger" onclick="SystemAdmin.removeAssignment('${assignment.assignment_id}')">Remove</button>
                    </td>
                </tr>
            `;
        }).join('');
    },

    showAddAssignmentModal() {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const facilities = JSON.parse(localStorage.getItem('facilities')) || [];
        const currentUser = Auth.getCurrentUser();

        const content = `
            <form id="addAssignmentForm">
                <div class="form-group">
                    <label class="required">User</label>
                    <select id="userId" required>
                        <option value="">Select User</option>
                        ${users.map(u => `<option value="${u.id}">${u.fullName} (${u.username})</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label class="required">Facility</label>
                    <select id="facilityId" required>
                        <option value="">Select Facility</option>
                        ${facilities.map(f => `<option value="${f.id}">${f.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="isPrimary"> Primary Facility
                    </label>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="SystemAdmin.addAssignment()">Assign Facility</button>
        `;

        App.showModal('Assign Facility to User', content, footer);
    },

    addAssignment() {
        const form = document.getElementById('addAssignmentForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const assignments = JSON.parse(localStorage.getItem('user_facility_assignments')) || [];
        const userId = parseInt(document.getElementById('userId').value);
        const facilityId = parseInt(document.getElementById('facilityId').value);
        const isPrimary = document.getElementById('isPrimary').checked;
        const currentUser = Auth.getCurrentUser();

        // Check if already assigned
        if (assignments.find(a => a.user_id === userId && a.facility_id === facilityId)) {
            App.showError('User is already assigned to this facility');
            return;
        }

        // If primary, unset other primary assignments
        if (isPrimary) {
            assignments.forEach(a => {
                if (a.user_id === userId && a.is_primary) {
                    a.is_primary = false;
                }
            });
        }

        const newAssignment = {
            assignment_id: 'assign_' + Date.now(),
            user_id: userId,
            facility_id: facilityId,
            is_primary: isPrimary,
            assigned_at: new Date().toISOString(),
            assigned_by: currentUser.userId
        };

        assignments.push(newAssignment);
        localStorage.setItem('user_facility_assignments', JSON.stringify(assignments));
        
        App.closeModal();
        App.showSuccess('Facility assigned successfully');
        this.loadSystemAdminPage(document.getElementById('contentArea'));
    },

    removeAssignment(assignmentId) {
        if (!confirm('Remove this facility assignment?')) {
            return;
        }

        const assignments = JSON.parse(localStorage.getItem('user_facility_assignments')) || [];
        const filtered = assignments.filter(a => a.assignment_id !== assignmentId);
        localStorage.setItem('user_facility_assignments', JSON.stringify(filtered));
        
        App.showSuccess('Assignment removed successfully');
        this.loadSystemAdminPage(document.getElementById('contentArea'));
    },

    // ========== REGIONS ==========
    renderRegionsTab() {
        const regions = JSON.parse(localStorage.getItem('regions')) || [];
        
        return `
            <div class="patient-list-header">
                <div>
                    <h2>Regions</h2>
                    <p>Manage Philippines administrative regions</p>
                </div>
                <button class="btn btn-primary" onclick="SystemAdmin.showAddRegionModal()">Add Region</button>
            </div>

            <div class="card mt-3">
                <div class="card-body">
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Region ID</th>
                                    <th>Region Name</th>
                                    <th>Region Code</th>
                                    <th>Active</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="regionsTableBody">
                                ${this.renderRegionsTable(regions)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },

    renderRegionsTable(regions) {
        if (regions.length === 0) {
            return '<tr><td colspan="5" class="text-center text-muted">No regions found</td></tr>';
        }

        return regions.map(region => `
            <tr>
                <td>${region.region_id}</td>
                <td><strong>${region.region_name}</strong></td>
                <td>${region.region_code || '-'}</td>
                <td>${region.is_active ? '<span class="badge badge-success">Active</span>' : '<span class="badge badge-secondary">Inactive</span>'}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-sm btn-outline" onclick="SystemAdmin.showEditRegionModal(${region.region_id})">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="SystemAdmin.deleteRegion(${region.region_id})">Delete</button>
                    </div>
                </td>
            </tr>
        `).join('');
    },

    showAddRegionModal() {
        const content = `
            <form id="addRegionForm">
                <div class="form-group">
                    <label class="required">Region ID</label>
                    <input type="number" id="regionId" required>
                </div>
                <div class="form-group">
                    <label class="required">Region Name</label>
                    <input type="text" id="regionName" required>
                </div>
                <div class="form-group">
                    <label>Region Code</label>
                    <input type="text" id="regionCode" placeholder="e.g., NCR, I, II">
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="isActive" checked> Active
                    </label>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="SystemAdmin.addRegion()">Save Region</button>
        `;

        App.showModal('Add Region', content, footer);
    },

    showEditRegionModal(regionId) {
        const regions = JSON.parse(localStorage.getItem('regions')) || [];
        const region = regions.find(r => r.region_id === regionId);
        
        if (!region) {
            App.showError('Region not found');
            return;
        }

        const content = `
            <form id="editRegionForm">
                <div class="form-group">
                    <label>Region ID</label>
                    <input type="number" value="${region.region_id}" readonly>
                </div>
                <div class="form-group">
                    <label class="required">Region Name</label>
                    <input type="text" id="regionName" value="${region.region_name}" required>
                </div>
                <div class="form-group">
                    <label>Region Code</label>
                    <input type="text" id="regionCode" value="${region.region_code || ''}">
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="isActive" ${region.is_active ? 'checked' : ''}> Active
                    </label>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="SystemAdmin.updateRegion(${regionId})">Update Region</button>
        `;

        App.showModal('Edit Region', content, footer);
    },

    addRegion() {
        const form = document.getElementById('addRegionForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const regions = JSON.parse(localStorage.getItem('regions')) || [];
        const regionId = parseInt(document.getElementById('regionId').value);
        
        if (regions.find(r => r.region_id === regionId)) {
            App.showError('Region ID already exists');
            return;
        }

        const newRegion = {
            region_id: regionId,
            region_name: document.getElementById('regionName').value.trim(),
            region_code: document.getElementById('regionCode').value.trim() || null,
            is_active: document.getElementById('isActive').checked,
            created_at: new Date().toISOString()
        };

        regions.push(newRegion);
        localStorage.setItem('regions', JSON.stringify(regions));
        
        App.closeModal();
        App.showSuccess('Region added successfully');
        this.loadSystemAdminPage(document.getElementById('contentArea'));
    },

    updateRegion(regionId) {
        const regions = JSON.parse(localStorage.getItem('regions')) || [];
        const regionIndex = regions.findIndex(r => r.region_id === regionId);
        
        if (regionIndex === -1) {
            App.showError('Region not found');
            return;
        }

        regions[regionIndex].region_name = document.getElementById('regionName').value.trim();
        regions[regionIndex].region_code = document.getElementById('regionCode').value.trim() || null;
        regions[regionIndex].is_active = document.getElementById('isActive').checked;

        localStorage.setItem('regions', JSON.stringify(regions));
        
        App.closeModal();
        App.showSuccess('Region updated successfully');
        this.loadSystemAdminPage(document.getElementById('contentArea'));
    },

    deleteRegion(regionId) {
        if (!confirm('Delete this region?')) {
            return;
        }

        const regions = JSON.parse(localStorage.getItem('regions')) || [];
        const filtered = regions.filter(r => r.region_id !== regionId);
        localStorage.setItem('regions', JSON.stringify(filtered));
        
        App.showSuccess('Region deleted successfully');
        this.loadSystemAdminPage(document.getElementById('contentArea'));
    },

    // ========== CLIENT TYPES ==========
    renderClientTypesTab() {
        const clientTypes = JSON.parse(localStorage.getItem('client_types')) || [];
        
        return `
            <div class="patient-list-header">
                <div>
                    <h2>Client Types</h2>
                    <p>Manage patient/client type classifications</p>
                </div>
                <button class="btn btn-primary" onclick="SystemAdmin.showAddClientTypeModal()">Add Client Type</button>
            </div>

            <div class="card mt-3">
                <div class="card-body">
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Type ID</th>
                                    <th>Type Name</th>
                                    <th>Type Code</th>
                                    <th>Description</th>
                                    <th>Active</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="clientTypesTableBody">
                                ${this.renderClientTypesTable(clientTypes)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },

    renderClientTypesTable(clientTypes) {
        if (clientTypes.length === 0) {
            return '<tr><td colspan="6" class="text-center text-muted">No client types found</td></tr>';
        }

        return clientTypes.map(type => `
            <tr>
                <td>${type.client_type_id}</td>
                <td><strong>${type.type_name}</strong></td>
                <td>${type.type_code || '-'}</td>
                <td>${type.description || '-'}</td>
                <td>${type.is_active ? '<span class="badge badge-success">Active</span>' : '<span class="badge badge-secondary">Inactive</span>'}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-sm btn-outline" onclick="SystemAdmin.showEditClientTypeModal(${type.client_type_id})">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="SystemAdmin.deleteClientType(${type.client_type_id})">Delete</button>
                    </div>
                </td>
            </tr>
        `).join('');
    },

    showAddClientTypeModal() {
        const content = `
            <form id="addClientTypeForm">
                <div class="form-group">
                    <label class="required">Type Name</label>
                    <input type="text" id="typeName" required placeholder="e.g., Males having Sex with Males">
                </div>
                <div class="form-group">
                    <label>Type Code</label>
                    <input type="text" id="typeCode" placeholder="e.g., MSM">
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea id="description" rows="2" placeholder="Type description..."></textarea>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="isActive" checked> Active
                    </label>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="SystemAdmin.addClientType()">Save Client Type</button>
        `;

        App.showModal('Add Client Type', content, footer);
    },

    showEditClientTypeModal(clientTypeId) {
        const clientTypes = JSON.parse(localStorage.getItem('client_types')) || [];
        const type = clientTypes.find(t => t.client_type_id === clientTypeId);
        
        if (!type) {
            App.showError('Client type not found');
            return;
        }

        const content = `
            <form id="editClientTypeForm">
                <div class="form-group">
                    <label>Type ID</label>
                    <input type="number" value="${type.client_type_id}" readonly>
                </div>
                <div class="form-group">
                    <label class="required">Type Name</label>
                    <input type="text" id="typeName" value="${type.type_name}" required>
                </div>
                <div class="form-group">
                    <label>Type Code</label>
                    <input type="text" id="typeCode" value="${type.type_code || ''}">
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea id="description" rows="2">${type.description || ''}</textarea>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="isActive" ${type.is_active ? 'checked' : ''}> Active
                    </label>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="SystemAdmin.updateClientType(${clientTypeId})">Update Client Type</button>
        `;

        App.showModal('Edit Client Type', content, footer);
    },

    addClientType() {
        const form = document.getElementById('addClientTypeForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const clientTypes = JSON.parse(localStorage.getItem('client_types')) || [];
        const typeCode = document.getElementById('typeCode').value.trim();
        
        if (typeCode && clientTypes.find(t => t.type_code === typeCode)) {
            App.showError('Type code already exists');
            return;
        }

        const maxId = clientTypes.length > 0 ? Math.max(...clientTypes.map(t => t.client_type_id)) : 0;

        const newType = {
            client_type_id: maxId + 1,
            type_name: document.getElementById('typeName').value.trim(),
            type_code: typeCode || null,
            description: document.getElementById('description').value.trim() || null,
            is_active: document.getElementById('isActive').checked,
            created_at: new Date().toISOString()
        };

        clientTypes.push(newType);
        localStorage.setItem('client_types', JSON.stringify(clientTypes));
        
        App.closeModal();
        App.showSuccess('Client type added successfully');
        this.loadSystemAdminPage(document.getElementById('contentArea'));
    },

    updateClientType(clientTypeId) {
        const clientTypes = JSON.parse(localStorage.getItem('client_types')) || [];
        const typeIndex = clientTypes.findIndex(t => t.client_type_id === clientTypeId);
        
        if (typeIndex === -1) {
            App.showError('Client type not found');
            return;
        }

        clientTypes[typeIndex].type_name = document.getElementById('typeName').value.trim();
        clientTypes[typeIndex].type_code = document.getElementById('typeCode').value.trim() || null;
        clientTypes[typeIndex].description = document.getElementById('description').value.trim() || null;
        clientTypes[typeIndex].is_active = document.getElementById('isActive').checked;

        localStorage.setItem('client_types', JSON.stringify(clientTypes));
        
        App.closeModal();
        App.showSuccess('Client type updated successfully');
        this.loadSystemAdminPage(document.getElementById('contentArea'));
    },

    deleteClientType(clientTypeId) {
        if (!confirm('Delete this client type?')) {
            return;
        }

        const clientTypes = JSON.parse(localStorage.getItem('client_types')) || [];
        const filtered = clientTypes.filter(t => t.client_type_id !== clientTypeId);
        localStorage.setItem('client_types', JSON.stringify(filtered));
        
        App.showSuccess('Client type deleted successfully');
        this.loadSystemAdminPage(document.getElementById('contentArea'));
    }
};

