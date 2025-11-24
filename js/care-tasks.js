// ============================================================
// MyHubCares - Care Tasks Management
// ============================================================

const CareTasks = {
    // Load care tasks page
    loadCareTasksPage(container) {
        const role = Auth.getCurrentUser().role;
        const currentUser = Auth.getCurrentUser();
        
        if (!['admin', 'physician', 'case_manager', 'nurse'].includes(role)) {
            container.innerHTML = '<div class="alert alert-danger">Access denied</div>';
            return;
        }

        const tasks = JSON.parse(localStorage.getItem('care_tasks')) || [];
        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const referrals = JSON.parse(localStorage.getItem('referrals')) || [];

        // Filter tasks for non-admin users
        let filteredTasks = tasks;
        if (role !== 'admin') {
            filteredTasks = tasks.filter(t => t.assignee_id === currentUser.userId || t.created_by === currentUser.userId);
        }

        let html = `
            <div class="patient-list-header">
                <div>
                    <h2>Care Tasks</h2>
                    <p>Manage care coordination tasks</p>
                </div>
                <button class="btn btn-primary" onclick="CareTasks.showAddTaskModal()">Create Task</button>
            </div>

            <div class="card mt-3">
                <div class="card-header">
                    <div class="search-filter-bar">
                        <input type="text" id="taskSearch" placeholder="Search tasks..." class="search-input">
                        <select id="taskStatusFilter">
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                        <select id="taskTypeFilter">
                            <option value="all">All Types</option>
                            <option value="follow_up">Follow-up</option>
                            <option value="referral">Referral</option>
                            <option value="counseling">Counseling</option>
                            <option value="appointment">Appointment</option>
                        </select>
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Task</th>
                                    <th>Patient</th>
                                    <th>Type</th>
                                    <th>Assigned To</th>
                                    <th>Due Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="tasksTableBody">
                                ${this.renderTasksTable(filteredTasks, patients, users, referrals)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;

        // Setup search and filters
        document.getElementById('taskSearch').addEventListener('input', (e) => {
            this.filterTasks(e.target.value);
        });

        document.getElementById('taskStatusFilter').addEventListener('change', (e) => {
            this.applyStatusFilter(e.target.value);
        });

        document.getElementById('taskTypeFilter').addEventListener('change', (e) => {
            this.applyTypeFilter(e.target.value);
        });
    },

    renderTasksTable(tasks, patients, users, referrals) {
        if (tasks.length === 0) {
            return '<tr><td colspan="7" class="text-center text-muted">No care tasks found</td></tr>';
        }

        return tasks.map(task => {
            const patient = patients.find(p => p.id === task.patient_id);
            const assignee = users.find(u => u.id === task.assignee_id);
            const creator = users.find(u => u.id === task.created_by);
            const referral = task.referral_id ? referrals.find(r => r.id === task.referral_id) : null;
            const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed';
            
            return `
                <tr class="${isOverdue ? 'table-warning' : ''}">
                    <td>
                        <strong>${task.task_description}</strong>
                        ${referral ? `<br><small class="text-muted">Related to referral #${referral.id}</small>` : ''}
                    </td>
                    <td>${patient ? patient.firstName + ' ' + patient.lastName : 'N/A'}</td>
                    <td><span class="badge badge-info">${task.task_type.replace('_', ' ')}</span></td>
                    <td>${assignee ? assignee.fullName : 'Unassigned'}</td>
                    <td>${task.due_date ? new Date(task.due_date).toLocaleDateString() : '-'} ${isOverdue ? '<span class="badge badge-danger">Overdue</span>' : ''}</td>
                    <td><span class="badge badge-${task.status === 'completed' ? 'success' : task.status === 'in_progress' ? 'primary' : 'warning'}">${task.status.replace('_', ' ')}</span></td>
                    <td>
                        <div class="table-actions">
                            <button class="btn btn-sm btn-outline" onclick="CareTasks.viewTask('${task.task_id}')">View</button>
                            ${task.status !== 'completed' ? `<button class="btn btn-sm btn-primary" onclick="CareTasks.updateTaskStatus('${task.task_id}')">Update</button>` : ''}
                            <button class="btn btn-sm btn-danger" onclick="CareTasks.deleteTask('${task.task_id}')">Delete</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    },

    showAddTaskModal() {
        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const referrals = JSON.parse(localStorage.getItem('referrals')) || [];
        const currentUser = Auth.getCurrentUser();

        const content = `
            <form id="addTaskForm">
                <div class="form-group">
                    <label class="required">Patient</label>
                    <select id="patientId" required>
                        <option value="">Select Patient</option>
                        ${patients.map(p => `<option value="${p.id}">${p.firstName} ${p.lastName}</option>`).join('')}
                    </select>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="required">Task Type</label>
                        <select id="taskType" required>
                            <option value="">Select Type</option>
                            <option value="follow_up">Follow-up</option>
                            <option value="referral">Referral</option>
                            <option value="counseling">Counseling</option>
                            <option value="appointment">Appointment</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="required">Assign To</label>
                        <select id="assigneeId" required>
                            <option value="">Select Assignee</option>
                            ${users.filter(u => ['physician', 'nurse', 'case_manager'].includes(u.role)).map(u => 
                                `<option value="${u.id}" ${u.id === currentUser.userId ? 'selected' : ''}>${u.fullName}</option>`
                            ).join('')}
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="required">Task Description</label>
                    <textarea id="taskDescription" rows="3" required placeholder="Enter task description..."></textarea>
                </div>
                <div class="form-group">
                    <label>Due Date</label>
                    <input type="date" id="dueDate">
                </div>
                <div class="form-group">
                    <label>Related Referral (Optional)</label>
                    <select id="referralId">
                        <option value="">None</option>
                        ${referrals.filter(r => r.status === 'pending' || r.status === 'accepted').map(r => 
                            `<option value="${r.id}">Referral #${r.id} - ${r.referral_reason.substring(0, 50)}...</option>`
                        ).join('')}
                    </select>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="CareTasks.addTask()">Create Task</button>
        `;

        App.showModal('Create Care Task', content, footer);
    },

    addTask() {
        const form = document.getElementById('addTaskForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const tasks = JSON.parse(localStorage.getItem('care_tasks')) || [];
        const currentUser = Auth.getCurrentUser();
        const referralId = document.getElementById('referralId').value;
        const dueDate = document.getElementById('dueDate').value;

        const newTask = {
            task_id: 'task_' + Date.now(),
            referral_id: referralId || null,
            patient_id: parseInt(document.getElementById('patientId').value),
            assignee_id: parseInt(document.getElementById('assigneeId').value),
            task_type: document.getElementById('taskType').value,
            task_description: document.getElementById('taskDescription').value.trim(),
            due_date: dueDate || null,
            status: 'pending',
            completed_at: null,
            created_at: new Date().toISOString(),
            created_by: currentUser.userId
        };

        tasks.push(newTask);
        localStorage.setItem('care_tasks', JSON.stringify(tasks));
        
        App.closeModal();
        App.showSuccess('Care task created successfully');
        this.loadCareTasksPage(document.getElementById('contentArea'));
    },

    viewTask(taskId) {
        const tasks = JSON.parse(localStorage.getItem('care_tasks')) || [];
        const task = tasks.find(t => t.task_id === taskId);
        
        if (!task) {
            App.showError('Task not found');
            return;
        }

        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const referrals = JSON.parse(localStorage.getItem('referrals')) || [];
        
        const patient = patients.find(p => p.id === task.patient_id);
        const assignee = users.find(u => u.id === task.assignee_id);
        const creator = users.find(u => u.id === task.created_by);
        const referral = task.referral_id ? referrals.find(r => r.id === task.referral_id) : null;

        const content = `
            <div class="form-group">
                <label>Patient</label>
                <input type="text" value="${patient ? patient.firstName + ' ' + patient.lastName : 'N/A'}" readonly>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Task Type</label>
                    <input type="text" value="${task.task_type.replace('_', ' ')}" readonly>
                </div>
                <div class="form-group">
                    <label>Status</label>
                    <input type="text" value="${task.status.replace('_', ' ')}" readonly>
                </div>
            </div>
            <div class="form-group">
                <label>Task Description</label>
                <textarea rows="4" readonly>${task.task_description}</textarea>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Assigned To</label>
                    <input type="text" value="${assignee ? assignee.fullName : 'Unassigned'}" readonly>
                </div>
                <div class="form-group">
                    <label>Due Date</label>
                    <input type="text" value="${task.due_date ? new Date(task.due_date).toLocaleDateString() : '-'}" readonly>
                </div>
            </div>
            ${referral ? `
                <div class="form-group">
                    <label>Related Referral</label>
                    <input type="text" value="Referral #${referral.id}: ${referral.referral_reason.substring(0, 50)}..." readonly>
                </div>
            ` : ''}
            <div class="form-row">
                <div class="form-group">
                    <label>Created By</label>
                    <input type="text" value="${creator ? creator.fullName : 'Unknown'}" readonly>
                </div>
                <div class="form-group">
                    <label>Created At</label>
                    <input type="text" value="${new Date(task.created_at).toLocaleString()}" readonly>
                </div>
            </div>
            ${task.completed_at ? `
                <div class="form-group">
                    <label>Completed At</label>
                    <input type="text" value="${new Date(task.completed_at).toLocaleString()}" readonly>
                </div>
            ` : ''}
        `;

        const footer = task.status !== 'completed' ? `
            <button class="btn btn-secondary" onclick="App.closeModal()">Close</button>
            <button class="btn btn-primary" onclick="CareTasks.updateTaskStatus('${taskId}')">Update Status</button>
        ` : '';

        App.showModal('Care Task Details', content, footer);
    },

    updateTaskStatus(taskId) {
        const tasks = JSON.parse(localStorage.getItem('care_tasks')) || [];
        const task = tasks.find(t => t.task_id === taskId);
        
        if (!task) {
            App.showError('Task not found');
            return;
        }

        const content = `
            <form id="updateTaskForm">
                <div class="form-group">
                    <label class="required">Status</label>
                    <select id="taskStatus" required>
                        <option value="pending" ${task.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="in_progress" ${task.status === 'in_progress' ? 'selected' : ''}>In Progress</option>
                        <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>Completed</option>
                        <option value="cancelled" ${task.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="CareTasks.saveTaskStatus('${taskId}')">Save</button>
        `;

        App.showModal('Update Task Status', content, footer);
    },

    saveTaskStatus(taskId) {
        const tasks = JSON.parse(localStorage.getItem('care_tasks')) || [];
        const task = tasks.find(t => t.task_id === taskId);
        
        if (task) {
            const newStatus = document.getElementById('taskStatus').value;
            task.status = newStatus;
            
            if (newStatus === 'completed') {
                task.completed_at = new Date().toISOString();
            } else if (newStatus !== 'completed' && task.completed_at) {
                task.completed_at = null;
            }
            
            localStorage.setItem('care_tasks', JSON.stringify(tasks));
            App.closeModal();
            App.showSuccess('Task status updated successfully');
            this.loadCareTasksPage(document.getElementById('contentArea'));
        }
    },

    deleteTask(taskId) {
        if (!confirm('Delete this care task?')) {
            return;
        }

        const tasks = JSON.parse(localStorage.getItem('care_tasks')) || [];
        const filtered = tasks.filter(t => t.task_id !== taskId);
        localStorage.setItem('care_tasks', JSON.stringify(filtered));
        
        App.showSuccess('Task deleted successfully');
        this.loadCareTasksPage(document.getElementById('contentArea'));
    },

    filterTasks(searchTerm) {
        const tasks = JSON.parse(localStorage.getItem('care_tasks')) || [];
        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const referrals = JSON.parse(localStorage.getItem('referrals')) || [];
        
        const filtered = tasks.filter(task => {
            const patient = patients.find(p => p.id === task.patient_id);
            const patientName = patient ? `${patient.firstName} ${patient.lastName}`.toLowerCase() : '';
            const description = task.task_description.toLowerCase();
            return patientName.includes(searchTerm.toLowerCase()) || description.includes(searchTerm.toLowerCase());
        });

        document.getElementById('tasksTableBody').innerHTML = 
            this.renderTasksTable(filtered, patients, users, referrals);
    },

    applyStatusFilter(status) {
        let tasks = JSON.parse(localStorage.getItem('care_tasks')) || [];
        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const referrals = JSON.parse(localStorage.getItem('referrals')) || [];

        if (status !== 'all') {
            tasks = tasks.filter(t => t.status === status);
        }

        document.getElementById('tasksTableBody').innerHTML = 
            this.renderTasksTable(tasks, patients, users, referrals);
    },

    applyTypeFilter(type) {
        let tasks = JSON.parse(localStorage.getItem('care_tasks')) || [];
        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const referrals = JSON.parse(localStorage.getItem('referrals')) || [];

        if (type !== 'all') {
            tasks = tasks.filter(t => t.task_type === type);
        }

        document.getElementById('tasksTableBody').innerHTML = 
            this.renderTasksTable(tasks, patients, users, referrals);
    }
};

