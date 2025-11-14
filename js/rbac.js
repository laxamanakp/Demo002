// ============================================================
// MyHubCares - Role-Based Access Control Management
// ============================================================

const RBAC = {
    // Load RBAC management page
    loadRBACPage(container) {
        const role = Auth.getCurrentUser().role;
        
        if (role !== 'admin') {
            container.innerHTML = '<div class="alert alert-danger">Access denied. Admin only.</div>';
            return;
        }

        let html = `
            <div class="tabs">
                <div class="tab active" data-tab="roles">Roles</div>
                <div class="tab" data-tab="permissions">Permissions</div>
                <div class="tab" data-tab="role-permissions">Role Permissions</div>
                <div class="tab" data-tab="user-roles">User Roles</div>
                <div class="tab" data-tab="sessions">Active Sessions</div>
                <div class="tab" data-tab="mfa">MFA Tokens</div>
            </div>

            <div class="tab-content active" id="rolesTab">
                ${this.renderRolesTab()}
            </div>

            <div class="tab-content" id="permissionsTab">
                ${this.renderPermissionsTab()}
            </div>

            <div class="tab-content" id="role-permissionsTab">
                ${this.renderRolePermissionsTab()}
            </div>

            <div class="tab-content" id="user-rolesTab">
                ${this.renderUserRolesTab()}
            </div>

            <div class="tab-content" id="sessionsTab">
                ${this.renderSessionsTab()}
            </div>

            <div class="tab-content" id="mfaTab">
                ${this.renderMFATab()}
            </div>
        `;

        container.innerHTML = html;
        this.setupTabs();
    },

    // Setup tab switching
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

    // ========== ROLES MANAGEMENT ==========
    renderRolesTab() {
        const roles = JSON.parse(localStorage.getItem('roles')) || [];
        
        return `
            <div class="patient-list-header">
                <div>
                    <h2>Role Management</h2>
                    <p>Manage system roles and their definitions</p>
                </div>
                <button class="btn btn-primary" onclick="RBAC.showAddRoleModal()">Add New Role</button>
            </div>

            <div class="card mt-3">
                <div class="card-header">
                    <div class="search-filter-bar">
                        <input type="text" id="roleSearch" placeholder="Search roles..." class="search-input">
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Role Code</th>
                                    <th>Role Name</th>
                                    <th>Description</th>
                                    <th>System Role</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="rolesTableBody">
                                ${this.renderRolesTable(roles)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },

    renderRolesTable(roles) {
        if (roles.length === 0) {
            return '<tr><td colspan="6" class="text-center text-muted">No roles found</td></tr>';
        }

        return roles.map(role => `
            <tr>
                <td><code>${role.role_code}</code></td>
                <td><strong>${role.role_name}</strong></td>
                <td>${role.description || '-'}</td>
                <td>${role.is_system_role ? '<span class="badge badge-warning">System</span>' : '<span class="badge badge-info">Custom</span>'}</td>
                <td>${new Date(role.created_at).toLocaleDateString()}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-sm btn-outline" onclick="RBAC.showEditRoleModal('${role.role_id}')">Edit</button>
                        ${!role.is_system_role ? `<button class="btn btn-sm btn-danger" onclick="RBAC.deleteRole('${role.role_id}')">Delete</button>` : ''}
                    </div>
                </td>
            </tr>
        `).join('');
    },

    showAddRoleModal() {
        const content = `
            <form id="addRoleForm">
                <div class="form-group">
                    <label class="required">Role Code</label>
                    <input type="text" id="roleCode" placeholder="e.g., custom_role" required>
                    <small class="text-muted">Unique identifier (lowercase, underscores)</small>
                </div>
                <div class="form-group">
                    <label class="required">Role Name</label>
                    <input type="text" id="roleName" placeholder="e.g., Custom Role" required>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea id="roleDescription" rows="3" placeholder="Role description..."></textarea>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="isSystemRole"> System Role (cannot be deleted)
                    </label>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="RBAC.addRole()">Save Role</button>
        `;

        App.showModal('Add New Role', content, footer);
    },

    showEditRoleModal(roleId) {
        const roles = JSON.parse(localStorage.getItem('roles')) || [];
        const role = roles.find(r => r.role_id === roleId);
        
        if (!role) {
            App.showError('Role not found');
            return;
        }

        const content = `
            <form id="editRoleForm">
                <div class="form-group">
                    <label class="required">Role Code</label>
                    <input type="text" id="roleCode" value="${role.role_code}" readonly>
                    <small class="text-muted">Role code cannot be changed</small>
                </div>
                <div class="form-group">
                    <label class="required">Role Name</label>
                    <input type="text" id="roleName" value="${role.role_name}" required>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea id="roleDescription" rows="3">${role.description || ''}</textarea>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="isSystemRole" ${role.is_system_role ? 'checked' : ''} ${role.is_system_role ? 'disabled' : ''}>
                        System Role (cannot be deleted)
                    </label>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="RBAC.updateRole('${roleId}')">Update Role</button>
        `;

        App.showModal('Edit Role', content, footer);
    },

    addRole() {
        const form = document.getElementById('addRoleForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const roles = JSON.parse(localStorage.getItem('roles')) || [];
        const roleCode = document.getElementById('roleCode').value.trim().toLowerCase().replace(/\s+/g, '_');
        
        if (roles.find(r => r.role_code === roleCode)) {
            App.showError('Role code already exists');
            return;
        }

        const newRole = {
            role_id: 'role_' + Date.now(),
            role_code: roleCode,
            role_name: document.getElementById('roleName').value.trim(),
            description: document.getElementById('roleDescription').value.trim() || null,
            is_system_role: document.getElementById('isSystemRole').checked,
            created_at: new Date().toISOString()
        };

        roles.push(newRole);
        localStorage.setItem('roles', JSON.stringify(roles));
        
        App.closeModal();
        App.showSuccess('Role added successfully');
        this.loadRBACPage(document.getElementById('contentArea'));
    },

    updateRole(roleId) {
        const roles = JSON.parse(localStorage.getItem('roles')) || [];
        const roleIndex = roles.findIndex(r => r.role_id === roleId);
        
        if (roleIndex === -1) {
            App.showError('Role not found');
            return;
        }

        roles[roleIndex].role_name = document.getElementById('roleName').value.trim();
        roles[roleIndex].description = document.getElementById('roleDescription').value.trim() || null;
        
        localStorage.setItem('roles', JSON.stringify(roles));
        
        App.closeModal();
        App.showSuccess('Role updated successfully');
        this.loadRBACPage(document.getElementById('contentArea'));
    },

    deleteRole(roleId) {
        if (!confirm('Are you sure you want to delete this role? This action cannot be undone.')) {
            return;
        }

        const roles = JSON.parse(localStorage.getItem('roles')) || [];
        const filtered = roles.filter(r => r.role_id !== roleId);
        
        // Also remove from role_permissions and user_roles
        const rolePermissions = JSON.parse(localStorage.getItem('role_permissions')) || [];
        const filteredRP = rolePermissions.filter(rp => rp.role_id !== roleId);
        localStorage.setItem('role_permissions', JSON.stringify(filteredRP));

        const userRoles = JSON.parse(localStorage.getItem('user_roles')) || [];
        const filteredUR = userRoles.filter(ur => ur.role_id !== roleId);
        localStorage.setItem('user_roles', JSON.stringify(filteredUR));
        
        localStorage.setItem('roles', JSON.stringify(filtered));
        
        App.showSuccess('Role deleted successfully');
        this.loadRBACPage(document.getElementById('contentArea'));
    },

    // ========== PERMISSIONS MANAGEMENT ==========
    renderPermissionsTab() {
        const permissions = JSON.parse(localStorage.getItem('permissions')) || [];
        
        return `
            <div class="patient-list-header">
                <div>
                    <h2>Permission Management</h2>
                    <p>Manage system permissions and access controls</p>
                </div>
                <button class="btn btn-primary" onclick="RBAC.showAddPermissionModal()">Add New Permission</button>
            </div>

            <div class="card mt-3">
                <div class="card-header">
                    <div class="search-filter-bar">
                        <input type="text" id="permissionSearch" placeholder="Search permissions..." class="search-input">
                        <select id="moduleFilter">
                            <option value="all">All Modules</option>
                            <option value="patients">Patients</option>
                            <option value="prescriptions">Prescriptions</option>
                            <option value="appointments">Appointments</option>
                            <option value="inventory">Inventory</option>
                            <option value="lab">Lab Tests</option>
                            <option value="visits">Clinical Visits</option>
                            <option value="reports">Reports</option>
                            <option value="users">Users</option>
                        </select>
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Permission Code</th>
                                    <th>Permission Name</th>
                                    <th>Module</th>
                                    <th>Action</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="permissionsTableBody">
                                ${this.renderPermissionsTable(permissions)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },

    renderPermissionsTable(permissions) {
        if (permissions.length === 0) {
            return '<tr><td colspan="6" class="text-center text-muted">No permissions found</td></tr>';
        }

        return permissions.map(perm => `
            <tr>
                <td><code>${perm.permission_code}</code></td>
                <td><strong>${perm.permission_name}</strong></td>
                <td><span class="badge badge-info">${perm.module}</span></td>
                <td><span class="badge badge-primary">${perm.action}</span></td>
                <td>${perm.description || '-'}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-sm btn-outline" onclick="RBAC.showEditPermissionModal('${perm.permission_id}')">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="RBAC.deletePermission('${perm.permission_id}')">Delete</button>
                    </div>
                </td>
            </tr>
        `).join('');
    },

    showAddPermissionModal() {
        const content = `
            <form id="addPermissionForm">
                <div class="form-group">
                    <label class="required">Permission Code</label>
                    <input type="text" id="permissionCode" placeholder="e.g., patients.create" required>
                    <small class="text-muted">Format: module.action</small>
                </div>
                <div class="form-group">
                    <label class="required">Permission Name</label>
                    <input type="text" id="permissionName" placeholder="e.g., Create Patients" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="required">Module</label>
                        <select id="permissionModule" required>
                            <option value="">Select Module</option>
                            <option value="patients">Patients</option>
                            <option value="prescriptions">Prescriptions</option>
                            <option value="appointments">Appointments</option>
                            <option value="inventory">Inventory</option>
                            <option value="lab">Lab Tests</option>
                            <option value="visits">Clinical Visits</option>
                            <option value="reports">Reports</option>
                            <option value="users">Users</option>
                            <option value="system">System</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="required">Action</label>
                        <select id="permissionAction" required>
                            <option value="">Select Action</option>
                            <option value="create">Create</option>
                            <option value="read">Read</option>
                            <option value="update">Update</option>
                            <option value="delete">Delete</option>
                            <option value="view">View</option>
                            <option value="export">Export</option>
                            <option value="print">Print</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea id="permissionDescription" rows="2" placeholder="Permission description..."></textarea>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="RBAC.addPermission()">Save Permission</button>
        `;

        App.showModal('Add New Permission', content, footer);
    },

    showEditPermissionModal(permissionId) {
        const permissions = JSON.parse(localStorage.getItem('permissions')) || [];
        const perm = permissions.find(p => p.permission_id === permissionId);
        
        if (!perm) {
            App.showError('Permission not found');
            return;
        }

        const content = `
            <form id="editPermissionForm">
                <div class="form-group">
                    <label class="required">Permission Code</label>
                    <input type="text" id="permissionCode" value="${perm.permission_code}" readonly>
                    <small class="text-muted">Permission code cannot be changed</small>
                </div>
                <div class="form-group">
                    <label class="required">Permission Name</label>
                    <input type="text" id="permissionName" value="${perm.permission_name}" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="required">Module</label>
                        <select id="permissionModule" required>
                            <option value="patients" ${perm.module === 'patients' ? 'selected' : ''}>Patients</option>
                            <option value="prescriptions" ${perm.module === 'prescriptions' ? 'selected' : ''}>Prescriptions</option>
                            <option value="appointments" ${perm.module === 'appointments' ? 'selected' : ''}>Appointments</option>
                            <option value="inventory" ${perm.module === 'inventory' ? 'selected' : ''}>Inventory</option>
                            <option value="lab" ${perm.module === 'lab' ? 'selected' : ''}>Lab Tests</option>
                            <option value="visits" ${perm.module === 'visits' ? 'selected' : ''}>Clinical Visits</option>
                            <option value="reports" ${perm.module === 'reports' ? 'selected' : ''}>Reports</option>
                            <option value="users" ${perm.module === 'users' ? 'selected' : ''}>Users</option>
                            <option value="system" ${perm.module === 'system' ? 'selected' : ''}>System</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="required">Action</label>
                        <select id="permissionAction" required>
                            <option value="create" ${perm.action === 'create' ? 'selected' : ''}>Create</option>
                            <option value="read" ${perm.action === 'read' ? 'selected' : ''}>Read</option>
                            <option value="update" ${perm.action === 'update' ? 'selected' : ''}>Update</option>
                            <option value="delete" ${perm.action === 'delete' ? 'selected' : ''}>Delete</option>
                            <option value="view" ${perm.action === 'view' ? 'selected' : ''}>View</option>
                            <option value="export" ${perm.action === 'export' ? 'selected' : ''}>Export</option>
                            <option value="print" ${perm.action === 'print' ? 'selected' : ''}>Print</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea id="permissionDescription" rows="2">${perm.description || ''}</textarea>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="RBAC.updatePermission('${permissionId}')">Update Permission</button>
        `;

        App.showModal('Edit Permission', content, footer);
    },

    addPermission() {
        const form = document.getElementById('addPermissionForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const permissions = JSON.parse(localStorage.getItem('permissions')) || [];
        const permissionCode = document.getElementById('permissionCode').value.trim().toLowerCase();
        
        if (permissions.find(p => p.permission_code === permissionCode)) {
            App.showError('Permission code already exists');
            return;
        }

        const newPermission = {
            permission_id: 'perm_' + Date.now(),
            permission_code: permissionCode,
            permission_name: document.getElementById('permissionName').value.trim(),
            module: document.getElementById('permissionModule').value,
            action: document.getElementById('permissionAction').value,
            description: document.getElementById('permissionDescription').value.trim() || null
        };

        permissions.push(newPermission);
        localStorage.setItem('permissions', JSON.stringify(permissions));
        
        App.closeModal();
        App.showSuccess('Permission added successfully');
        this.loadRBACPage(document.getElementById('contentArea'));
    },

    updatePermission(permissionId) {
        const permissions = JSON.parse(localStorage.getItem('permissions')) || [];
        const permIndex = permissions.findIndex(p => p.permission_id === permissionId);
        
        if (permIndex === -1) {
            App.showError('Permission not found');
            return;
        }

        permissions[permIndex].permission_name = document.getElementById('permissionName').value.trim();
        permissions[permIndex].module = document.getElementById('permissionModule').value;
        permissions[permIndex].action = document.getElementById('permissionAction').value;
        permissions[permIndex].description = document.getElementById('permissionDescription').value.trim() || null;
        
        localStorage.setItem('permissions', JSON.stringify(permissions));
        
        App.closeModal();
        App.showSuccess('Permission updated successfully');
        this.loadRBACPage(document.getElementById('contentArea'));
    },

    deletePermission(permissionId) {
        if (!confirm('Are you sure you want to delete this permission? This will remove it from all roles.')) {
            return;
        }

        const permissions = JSON.parse(localStorage.getItem('permissions')) || [];
        const filtered = permissions.filter(p => p.permission_id !== permissionId);
        
        // Remove from role_permissions
        const rolePermissions = JSON.parse(localStorage.getItem('role_permissions')) || [];
        const filteredRP = rolePermissions.filter(rp => rp.permission_id !== permissionId);
        localStorage.setItem('role_permissions', JSON.stringify(filteredRP));
        
        localStorage.setItem('permissions', JSON.stringify(filtered));
        
        App.showSuccess('Permission deleted successfully');
        this.loadRBACPage(document.getElementById('contentArea'));
    },

    // ========== ROLE PERMISSIONS MANAGEMENT ==========
    renderRolePermissionsTab() {
        const rolePermissions = JSON.parse(localStorage.getItem('role_permissions')) || [];
        const roles = JSON.parse(localStorage.getItem('roles')) || [];
        const permissions = JSON.parse(localStorage.getItem('permissions')) || [];
        
        return `
            <div class="patient-list-header">
                <div>
                    <h2>Role Permissions Assignment</h2>
                    <p>Assign permissions to roles</p>
                </div>
                <button class="btn btn-primary" onclick="RBAC.showAddRolePermissionModal()">Assign Permission</button>
            </div>

            <div class="card mt-3">
                <div class="card-header">
                    <div class="search-filter-bar">
                        <select id="roleFilterRP">
                            <option value="all">All Roles</option>
                            ${roles.map(r => `<option value="${r.role_id}">${r.role_name}</option>`).join('')}
                        </select>
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Role</th>
                                    <th>Permission</th>
                                    <th>Module</th>
                                    <th>Action</th>
                                    <th>Granted</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="rolePermissionsTableBody">
                                ${this.renderRolePermissionsTable(rolePermissions, roles, permissions)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },

    renderRolePermissionsTable(rolePermissions, roles, permissions) {
        if (rolePermissions.length === 0) {
            return '<tr><td colspan="6" class="text-center text-muted">No role permissions assigned</td></tr>';
        }

        return rolePermissions.map(rp => {
            const role = roles.find(r => r.role_id === rp.role_id);
            const perm = permissions.find(p => p.permission_id === rp.permission_id);
            
            if (!role || !perm) return '';
            
            return `
                <tr>
                    <td><strong>${role.role_name}</strong></td>
                    <td>${perm.permission_name}</td>
                    <td><span class="badge badge-info">${perm.module}</span></td>
                    <td><span class="badge badge-primary">${perm.action}</span></td>
                    <td>${new Date(rp.granted_at).toLocaleDateString()}</td>
                    <td>
                        <button class="btn btn-sm btn-danger" onclick="RBAC.removeRolePermission('${rp.role_permission_id}')">Remove</button>
                    </td>
                </tr>
            `;
        }).join('');
    },

    showAddRolePermissionModal() {
        const roles = JSON.parse(localStorage.getItem('roles')) || [];
        const permissions = JSON.parse(localStorage.getItem('permissions')) || [];
        const rolePermissions = JSON.parse(localStorage.getItem('role_permissions')) || [];
        
        const content = `
            <form id="addRolePermissionForm">
                <div class="form-group">
                    <label class="required">Role</label>
                    <select id="roleIdRP" required>
                        <option value="">Select Role</option>
                        ${roles.map(r => `<option value="${r.role_id}">${r.role_name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label class="required">Permission</label>
                    <select id="permissionIdRP" required>
                        <option value="">Select Permission</option>
                        ${permissions.map(p => `<option value="${p.permission_id}">${p.permission_name} (${p.module}.${p.action})</option>`).join('')}
                    </select>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="RBAC.addRolePermission()">Assign Permission</button>
        `;

        App.showModal('Assign Permission to Role', content, footer);
    },

    addRolePermission() {
        const form = document.getElementById('addRolePermissionForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const rolePermissions = JSON.parse(localStorage.getItem('role_permissions')) || [];
        const roleId = document.getElementById('roleIdRP').value;
        const permissionId = document.getElementById('permissionIdRP').value;
        
        // Check if already assigned
        if (rolePermissions.find(rp => rp.role_id === roleId && rp.permission_id === permissionId)) {
            App.showError('This permission is already assigned to this role');
            return;
        }

        const newRP = {
            role_permission_id: 'rp_' + Date.now(),
            role_id: roleId,
            permission_id: permissionId,
            granted_at: new Date().toISOString()
        };

        rolePermissions.push(newRP);
        localStorage.setItem('role_permissions', JSON.stringify(rolePermissions));
        
        App.closeModal();
        App.showSuccess('Permission assigned successfully');
        this.loadRBACPage(document.getElementById('contentArea'));
    },

    removeRolePermission(rolePermissionId) {
        if (!confirm('Remove this permission from the role?')) {
            return;
        }

        const rolePermissions = JSON.parse(localStorage.getItem('role_permissions')) || [];
        const filtered = rolePermissions.filter(rp => rp.role_permission_id !== rolePermissionId);
        localStorage.setItem('role_permissions', JSON.stringify(filtered));
        
        App.showSuccess('Permission removed successfully');
        this.loadRBACPage(document.getElementById('contentArea'));
    },

    // ========== USER ROLES MANAGEMENT ==========
    renderUserRolesTab() {
        const userRoles = JSON.parse(localStorage.getItem('user_roles')) || [];
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const roles = JSON.parse(localStorage.getItem('roles')) || [];
        
        return `
            <div class="patient-list-header">
                <div>
                    <h2>User Role Assignments</h2>
                    <p>Assign roles to users</p>
                </div>
                <button class="btn btn-primary" onclick="RBAC.showAddUserRoleModal()">Assign Role</button>
            </div>

            <div class="card mt-3">
                <div class="card-header">
                    <div class="search-filter-bar">
                        <input type="text" id="userRoleSearch" placeholder="Search users..." class="search-input">
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Role</th>
                                    <th>Assigned By</th>
                                    <th>Assigned At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="userRolesTableBody">
                                ${this.renderUserRolesTable(userRoles, users, roles)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },

    renderUserRolesTable(userRoles, users, roles) {
        if (userRoles.length === 0) {
            return '<tr><td colspan="5" class="text-center text-muted">No user roles assigned</td></tr>';
        }

        return userRoles.map(ur => {
            const user = users.find(u => u.id === ur.user_id);
            const role = roles.find(r => r.role_id === ur.role_id);
            const assignedBy = users.find(u => u.id === ur.assigned_by);
            
            if (!user || !role) return '';
            
            return `
                <tr>
                    <td><strong>${user.fullName}</strong> (${user.username})</td>
                    <td><span class="badge badge-primary">${role.role_name}</span></td>
                    <td>${assignedBy ? assignedBy.fullName : 'System'}</td>
                    <td>${new Date(ur.assigned_at).toLocaleDateString()}</td>
                    <td>
                        <button class="btn btn-sm btn-danger" onclick="RBAC.removeUserRole('${ur.user_role_id}')">Remove</button>
                    </td>
                </tr>
            `;
        }).join('');
    },

    showAddUserRoleModal() {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const roles = JSON.parse(localStorage.getItem('roles')) || [];
        const userRoles = JSON.parse(localStorage.getItem('user_roles')) || [];
        
        const content = `
            <form id="addUserRoleForm">
                <div class="form-group">
                    <label class="required">User</label>
                    <select id="userIdUR" required>
                        <option value="">Select User</option>
                        ${users.map(u => `<option value="${u.id}">${u.fullName} (${u.username})</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label class="required">Role</label>
                    <select id="roleIdUR" required>
                        <option value="">Select Role</option>
                        ${roles.map(r => `<option value="${r.role_id}">${r.role_name}</option>`).join('')}
                    </select>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="RBAC.addUserRole()">Assign Role</button>
        `;

        App.showModal('Assign Role to User', content, footer);
    },

    addUserRole() {
        const form = document.getElementById('addUserRoleForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const userRoles = JSON.parse(localStorage.getItem('user_roles')) || [];
        const userId = parseInt(document.getElementById('userIdUR').value);
        const roleId = document.getElementById('roleIdUR').value;
        const currentUser = Auth.getCurrentUser();
        
        // Check if already assigned
        if (userRoles.find(ur => ur.user_id === userId && ur.role_id === roleId)) {
            App.showError('This role is already assigned to this user');
            return;
        }

        const newUR = {
            user_role_id: 'ur_' + Date.now(),
            user_id: userId,
            role_id: roleId,
            assigned_at: new Date().toISOString(),
            assigned_by: currentUser.userId || null
        };

        userRoles.push(newUR);
        localStorage.setItem('user_roles', JSON.stringify(userRoles));
        
        App.closeModal();
        App.showSuccess('Role assigned successfully');
        this.loadRBACPage(document.getElementById('contentArea'));
    },

    removeUserRole(userRoleId) {
        if (!confirm('Remove this role from the user?')) {
            return;
        }

        const userRoles = JSON.parse(localStorage.getItem('user_roles')) || [];
        const filtered = userRoles.filter(ur => ur.user_role_id !== userRoleId);
        localStorage.setItem('user_roles', JSON.stringify(filtered));
        
        App.showSuccess('Role removed successfully');
        this.loadRBACPage(document.getElementById('contentArea'));
    },

    // ========== SESSIONS MANAGEMENT ==========
    renderSessionsTab() {
        const sessions = JSON.parse(localStorage.getItem('auth_sessions')) || [];
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        return `
            <div class="patient-list-header">
                <div>
                    <h2>Active Sessions</h2>
                    <p>View and manage user authentication sessions</p>
                </div>
            </div>

            <div class="card mt-3">
                <div class="card-header">
                    <div class="search-filter-bar">
                        <input type="text" id="sessionSearch" placeholder="Search sessions..." class="search-input">
                        <select id="sessionStatusFilter">
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="revoked">Revoked</option>
                        </select>
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Issued At</th>
                                    <th>Expires At</th>
                                    <th>IP Address</th>
                                    <th>Device</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="sessionsTableBody">
                                ${this.renderSessionsTable(sessions, users)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },

    renderSessionsTable(sessions, users) {
        if (sessions.length === 0) {
            return '<tr><td colspan="7" class="text-center text-muted">No sessions found</td></tr>';
        }

        return sessions.map(session => {
            const user = users.find(u => u.id === session.user_id);
            const isExpired = new Date(session.expires_at) < new Date();
            const isActive = session.is_active && !isExpired;
            
            return `
                <tr>
                    <td>${user ? user.fullName : 'Unknown'}</td>
                    <td>${new Date(session.issued_at).toLocaleString()}</td>
                    <td>${new Date(session.expires_at).toLocaleString()}</td>
                    <td>${session.ip_address || '-'}</td>
                    <td>${session.user_agent ? session.user_agent.substring(0, 50) + '...' : '-'}</td>
                    <td>
                        ${isActive ? '<span class="badge badge-success">Active</span>' : 
                          session.revoked_at ? '<span class="badge badge-danger">Revoked</span>' : 
                          '<span class="badge badge-warning">Expired</span>'}
                    </td>
                    <td>
                        ${isActive ? `<button class="btn btn-sm btn-danger" onclick="RBAC.revokeSession('${session.session_id}')">Revoke</button>` : ''}
                    </td>
                </tr>
            `;
        }).join('');
    },

    revokeSession(sessionId) {
        if (!confirm('Revoke this session? The user will be logged out.')) {
            return;
        }

        const sessions = JSON.parse(localStorage.getItem('auth_sessions')) || [];
        const sessionIndex = sessions.findIndex(s => s.session_id === sessionId);
        
        if (sessionIndex !== -1) {
            sessions[sessionIndex].is_active = false;
            sessions[sessionIndex].revoked_at = new Date().toISOString();
            localStorage.setItem('auth_sessions', JSON.stringify(sessions));
            
            App.showSuccess('Session revoked successfully');
            this.loadRBACPage(document.getElementById('contentArea'));
        }
    },

    // ========== MFA TOKENS MANAGEMENT ==========
    renderMFATab() {
        const mfaTokens = JSON.parse(localStorage.getItem('mfa_tokens')) || [];
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        return `
            <div class="patient-list-header">
                <div>
                    <h2>MFA Tokens</h2>
                    <p>View multi-factor authentication tokens</p>
                </div>
            </div>

            <div class="card mt-3">
                <div class="card-header">
                    <div class="search-filter-bar">
                        <input type="text" id="mfaSearch" placeholder="Search tokens..." class="search-input">
                        <select id="mfaMethodFilter">
                            <option value="all">All Methods</option>
                            <option value="totp">TOTP</option>
                            <option value="sms">SMS</option>
                            <option value="email">Email</option>
                        </select>
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Method</th>
                                    <th>Issued At</th>
                                    <th>Expires At</th>
                                    <th>Consumed</th>
                                    <th>Attempts</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody id="mfaTableBody">
                                ${this.renderMFATable(mfaTokens, users)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },

    renderMFATable(mfaTokens, users) {
        if (mfaTokens.length === 0) {
            return '<tr><td colspan="7" class="text-center text-muted">No MFA tokens found</td></tr>';
        }

        return mfaTokens.map(token => {
            const user = users.find(u => u.id === token.user_id);
            const isExpired = new Date(token.expires_at) < new Date();
            const isConsumed = !!token.consumed_at;
            
            return `
                <tr>
                    <td>${user ? user.fullName : 'Unknown'}</td>
                    <td><span class="badge badge-info">${token.method.toUpperCase()}</span></td>
                    <td>${new Date(token.issued_at).toLocaleString()}</td>
                    <td>${new Date(token.expires_at).toLocaleString()}</td>
                    <td>${isConsumed ? new Date(token.consumed_at).toLocaleString() : '-'}</td>
                    <td>${token.attempts}</td>
                    <td>
                        ${isConsumed ? '<span class="badge badge-success">Consumed</span>' : 
                          isExpired ? '<span class="badge badge-warning">Expired</span>' : 
                          '<span class="badge badge-primary">Active</span>'}
                    </td>
                </tr>
            `;
        }).join('');
    }
};

