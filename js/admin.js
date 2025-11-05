// ============================================================
// MyHubCares - Admin Dashboard
// ============================================================

const Admin = {
    // Load users page
    loadUsersPage(container) {
        const role = Auth.getCurrentUser().role;
        
        if (!Auth.permissions.canManageUsers(role)) {
            container.innerHTML = '<div class="alert alert-danger">Access denied</div>';
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];

        let html = `
            <div class="patient-list-header">
                <div>
                    <h2>User Management</h2>
                    <p>Manage system users and roles</p>
                </div>
                <button class="btn btn-primary" onclick="Admin.showAddUserModal()">
                    Add New User
                </button>
            </div>

            <div class="card">
                <div class="card-header">
                    <div class="search-filter-bar">
                        <input type="text" id="userSearch" placeholder="Search users..." class="search-input">
                        <select id="roleFilter">
                            <option value="all">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="physician">Physician</option>
                            <option value="nurse">Nurse</option>
                            <option value="case_manager">Case Manager</option>
                            <option value="lab_personnel">Lab Personnel</option>
                            <option value="patient">Patient</option>
                        </select>
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Full Name</th>
                                    <th>Role</th>
                                    <th>Email</th>
                                    <th>Facility</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="userTableBody">
                                ${this.renderUserTable(users)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;

        // Setup search and filter
        document.getElementById('userSearch').addEventListener('input', (e) => {
            this.filterUsers(e.target.value);
        });

        document.getElementById('roleFilter').addEventListener('change', (e) => {
            this.applyRoleFilter(e.target.value);
        });
    },

    // Render user table
    renderUserTable(users) {
        if (users.length === 0) {
            return '<tr><td colspan="6" class="text-center text-muted">No users found</td></tr>';
        }

        const facilities = JSON.parse(localStorage.getItem('facilities')) || [];

        return users.map(user => {
            const facility = facilities.find(f => f.id === user.facilityId);
            return `
                <tr>
                    <td>${user.username}</td>
                    <td>${user.fullName}</td>
                    <td><span class="badge badge-primary">${user.role.replace('_', ' ')}</span></td>
                    <td>${user.email}</td>
                    <td>${facility ? facility.name : 'N/A'}</td>
                    <td>
                        <div class="table-actions">
                            <button class="btn btn-sm btn-outline" onclick="Admin.showEditUserModal(${user.id})">
                                Edit
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="Admin.deleteUser(${user.id})">
                                Delete
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    },

    // Filter users
    filterUsers(searchTerm) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const filtered = users.filter(u => 
            u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase())
        );

        document.getElementById('userTableBody').innerHTML = this.renderUserTable(filtered);
    },

    // Apply role filter
    applyRoleFilter(role) {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        
        if (role !== 'all') {
            users = users.filter(u => u.role === role);
        }

        document.getElementById('userTableBody').innerHTML = this.renderUserTable(users);
    },

    // Show add user modal
    showAddUserModal() {
        const facilities = JSON.parse(localStorage.getItem('facilities')) || [];

        const content = `
            <form id="addUserForm">
                <div class="form-row">
                    <div class="form-group">
                        <label class="required">Username</label>
                        <input type="text" id="username" required>
                    </div>
                    <div class="form-group">
                        <label class="required">Password</label>
                        <input type="password" id="password" required>
                    </div>
                </div>
                <div class="form-group">
                    <label class="required">Full Name</label>
                    <input type="text" id="fullName" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="required">Role</label>
                        <select id="role" required>
                            <option value="">Select Role</option>
                            <option value="admin">Admin</option>
                            <option value="physician">Physician</option>
                            <option value="nurse">Nurse</option>
                            <option value="case_manager">Case Manager</option>
                            <option value="lab_personnel">Lab Personnel</option>
                            <option value="patient">Patient</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="required">Facility</label>
                        <select id="facilityId" required>
                            <option value="">Select Facility</option>
                            ${facilities.map(f => `<option value="${f.id}">${f.name}</option>`).join('')}
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="email">
                    </div>
                    <div class="form-group">
                        <label>Phone</label>
                        <input type="tel" id="phone">
                    </div>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="Admin.addUser()">Add User</button>
        `;

        App.showModal('Add New User', content, footer);
    },

    // Add user
    addUser() {
        const form = document.getElementById('addUserForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const newUser = {
            id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
            username: document.getElementById('username').value,
            password: document.getElementById('password').value,
            fullName: document.getElementById('fullName').value,
            role: document.getElementById('role').value,
            facilityId: parseInt(document.getElementById('facilityId').value),
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        App.closeModal();
        App.showSuccess('User added successfully');
        App.loadPage('users');
    },

    // Show edit user modal
    showEditUserModal(userId) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.id === userId);

        if (!user) {
            App.showError('User not found');
            return;
        }

        const facilities = JSON.parse(localStorage.getItem('facilities')) || [];

        const content = `
            <form id="editUserForm">
                <input type="hidden" id="userId" value="${user.id}">
                <div class="form-group">
                    <label>Username</label>
                    <input type="text" value="${user.username}" readonly>
                </div>
                <div class="form-group">
                    <label class="required">Full Name</label>
                    <input type="text" id="fullName" value="${user.fullName}" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="required">Role</label>
                        <select id="role" required>
                            <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                            <option value="physician" ${user.role === 'physician' ? 'selected' : ''}>Physician</option>
                            <option value="nurse" ${user.role === 'nurse' ? 'selected' : ''}>Nurse</option>
                            <option value="case_manager" ${user.role === 'case_manager' ? 'selected' : ''}>Case Manager</option>
                            <option value="lab_personnel" ${user.role === 'lab_personnel' ? 'selected' : ''}>Lab Personnel</option>
                            <option value="patient" ${user.role === 'patient' ? 'selected' : ''}>Patient</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="required">Facility</label>
                        <select id="facilityId" required>
                            ${facilities.map(f => `<option value="${f.id}" ${f.id === user.facilityId ? 'selected' : ''}>${f.name}</option>`).join('')}
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="email" value="${user.email || ''}">
                    </div>
                    <div class="form-group">
                        <label>Phone</label>
                        <input type="tel" id="phone" value="${user.phone || ''}">
                    </div>
                </div>
                <div class="form-group">
                    <label>New Password (leave blank to keep current)</label>
                    <input type="password" id="newPassword">
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="Admin.updateUser()">Update User</button>
        `;

        App.showModal('Edit User', content, footer);
    },

    // Update user
    updateUser() {
        const form = document.getElementById('editUserForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const userId = parseInt(document.getElementById('userId').value);
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const index = users.findIndex(u => u.id === userId);

        if (index === -1) {
            App.showError('User not found');
            return;
        }

        const newPassword = document.getElementById('newPassword').value;
        users[index] = {
            ...users[index],
            fullName: document.getElementById('fullName').value,
            role: document.getElementById('role').value,
            facilityId: parseInt(document.getElementById('facilityId').value),
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value
        };

        if (newPassword) {
            users[index].password = newPassword;
        }

        localStorage.setItem('users', JSON.stringify(users));

        App.closeModal();
        App.showSuccess('User updated successfully');
        App.loadPage('users');
    },

    // Delete user
    deleteUser(userId) {
        if (!confirm('Are you sure you want to delete this user?')) {
            return;
        }

        let users = JSON.parse(localStorage.getItem('users')) || [];
        users = users.filter(u => u.id !== userId);
        localStorage.setItem('users', JSON.stringify(users));

        App.showSuccess('User deleted successfully');
        App.loadPage('users');
    },

    // Load facilities page
    loadFacilitiesPage(container) {
        const role = Auth.getCurrentUser().role;
        
        if (!Auth.permissions.canManageFacilities(role)) {
            container.innerHTML = '<div class="alert alert-danger">Access denied</div>';
            return;
        }

        const facilities = JSON.parse(localStorage.getItem('facilities')) || [];
        const regions = JSON.parse(localStorage.getItem('regions')) || [];

        let html = `
            <div class="patient-list-header">
                <div>
                    <h2>Facility Management</h2>
                    <p>Manage healthcare facilities</p>
                </div>
                <button class="btn btn-primary" onclick="Admin.showAddFacilityModal()">
                    Add New Facility
                </button>
            </div>

            <div class="card">
                <div class="card-body">
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Facility Name</th>
                                    <th>Address</th>
                                    <th>Region</th>
                                    <th>Contact Person</th>
                                    <th>Contact Number</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${facilities.map(facility => {
                                    const region = regions.find(r => r.id === facility.regionId);
                                    return `
                                        <tr>
                                            <td><strong>${facility.name}</strong></td>
                                            <td>${facility.address}</td>
                                            <td>${region ? region.name : 'N/A'}</td>
                                            <td>${facility.contactPerson}</td>
                                            <td>${facility.contactNumber}</td>
                                            <td>
                                                <div class="table-actions">
                                                    <button class="btn btn-sm btn-outline" onclick="Admin.showEditFacilityModal(${facility.id})">
                                                        Edit
                                                    </button>
                                                    <button class="btn btn-sm btn-danger" onclick="Admin.deleteFacility(${facility.id})">
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;
    },

    // Show add facility modal
    showAddFacilityModal() {
        const regions = JSON.parse(localStorage.getItem('regions')) || [];

        const content = `
            <form id="addFacilityForm">
                <div class="form-group">
                    <label class="required">Facility Name</label>
                    <input type="text" id="facilityName" required>
                </div>
                <div class="form-group">
                    <label class="required">Address</label>
                    <input type="text" id="address" required>
                </div>
                <div class="form-group">
                    <label class="required">Region</label>
                    <select id="regionId" required>
                        <option value="">Select Region</option>
                        ${regions.map(r => `<option value="${r.id}">${r.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Contact Person</label>
                        <input type="text" id="contactPerson">
                    </div>
                    <div class="form-group">
                        <label>Contact Number</label>
                        <input type="tel" id="contactNumber">
                    </div>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="email">
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="Admin.addFacility()">Add Facility</button>
        `;

        App.showModal('Add New Facility', content, footer);
    },

    // Add facility
    addFacility() {
        const form = document.getElementById('addFacilityForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const facilities = JSON.parse(localStorage.getItem('facilities')) || [];
        const newFacility = {
            id: facilities.length > 0 ? Math.max(...facilities.map(f => f.id)) + 1 : 1,
            name: document.getElementById('facilityName').value,
            address: document.getElementById('address').value,
            regionId: parseInt(document.getElementById('regionId').value),
            contactPerson: document.getElementById('contactPerson').value,
            contactNumber: document.getElementById('contactNumber').value,
            email: document.getElementById('email').value
        };

        facilities.push(newFacility);
        localStorage.setItem('facilities', JSON.stringify(facilities));

        App.closeModal();
        App.showSuccess('Facility added successfully');
        App.loadPage('facilities');
    },

    // Show edit facility modal
    showEditFacilityModal(facilityId) {
        const facilities = JSON.parse(localStorage.getItem('facilities')) || [];
        const facility = facilities.find(f => f.id === facilityId);

        if (!facility) {
            App.showError('Facility not found');
            return;
        }

        const regions = JSON.parse(localStorage.getItem('regions')) || [];

        const content = `
            <form id="editFacilityForm">
                <input type="hidden" id="facilityId" value="${facility.id}">
                <div class="form-group">
                    <label class="required">Facility Name</label>
                    <input type="text" id="facilityName" value="${facility.name}" required>
                </div>
                <div class="form-group">
                    <label class="required">Address</label>
                    <input type="text" id="address" value="${facility.address}" required>
                </div>
                <div class="form-group">
                    <label class="required">Region</label>
                    <select id="regionId" required>
                        ${regions.map(r => `<option value="${r.id}" ${r.id === facility.regionId ? 'selected' : ''}>${r.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Contact Person</label>
                        <input type="text" id="contactPerson" value="${facility.contactPerson || ''}">
                    </div>
                    <div class="form-group">
                        <label>Contact Number</label>
                        <input type="tel" id="contactNumber" value="${facility.contactNumber || ''}">
                    </div>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="email" value="${facility.email || ''}">
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="Admin.updateFacility()">Update Facility</button>
        `;

        App.showModal('Edit Facility', content, footer);
    },

    // Update facility
    updateFacility() {
        const form = document.getElementById('editFacilityForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const facilityId = parseInt(document.getElementById('facilityId').value);
        const facilities = JSON.parse(localStorage.getItem('facilities')) || [];
        const index = facilities.findIndex(f => f.id === facilityId);

        if (index === -1) {
            App.showError('Facility not found');
            return;
        }

        facilities[index] = {
            ...facilities[index],
            name: document.getElementById('facilityName').value,
            address: document.getElementById('address').value,
            regionId: parseInt(document.getElementById('regionId').value),
            contactPerson: document.getElementById('contactPerson').value,
            contactNumber: document.getElementById('contactNumber').value,
            email: document.getElementById('email').value
        };

        localStorage.setItem('facilities', JSON.stringify(facilities));

        App.closeModal();
        App.showSuccess('Facility updated successfully');
        App.loadPage('facilities');
    },

    // Delete facility
    deleteFacility(facilityId) {
        if (!confirm('Are you sure you want to delete this facility?')) {
            return;
        }

        let facilities = JSON.parse(localStorage.getItem('facilities')) || [];
        facilities = facilities.filter(f => f.id !== facilityId);
        localStorage.setItem('facilities', JSON.stringify(facilities));

        App.showSuccess('Facility deleted successfully');
        App.loadPage('facilities');
    }
};

