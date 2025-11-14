// ============================================================
// MyHubCares - Reporting & Analytics (Report Builder)
// ============================================================

const Reporting = {
    // Load reporting page
    loadReportingPage(container) {
        const role = Auth.getCurrentUser().role;
        
        if (!['admin', 'physician'].includes(role)) {
            container.innerHTML = '<div class="alert alert-danger">Access denied</div>';
            return;
        }

        let html = `
            <div class="tabs">
                <div class="tab active" data-tab="queries">Report Queries</div>
                <div class="tab" data-tab="runs">Report Runs</div>
                <div class="tab" data-tab="builder">Report Builder</div>
            </div>

            <div class="tab-content active" id="queriesTab">
                ${this.renderReportQueriesTab()}
            </div>

            <div class="tab-content" id="runsTab">
                ${this.renderReportRunsTab()}
            </div>

            <div class="tab-content" id="builderTab">
                ${this.renderReportBuilderTab()}
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

    renderReportQueriesTab() {
        const queries = JSON.parse(localStorage.getItem('report_queries')) || [];
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        return `
            <div class="patient-list-header">
                <div>
                    <h2>Report Queries</h2>
                    <p>Manage saved report definitions</p>
                </div>
                <button class="btn btn-primary" onclick="Reporting.showAddQueryModal()">Create Report Query</button>
            </div>

            <div class="card mt-3">
                <div class="card-header">
                    <div class="search-filter-bar">
                        <input type="text" id="querySearch" placeholder="Search reports..." class="search-input">
                        <select id="queryTypeFilter">
                            <option value="all">All Types</option>
                            <option value="patient">Patient</option>
                            <option value="clinical">Clinical</option>
                            <option value="inventory">Inventory</option>
                            <option value="survey">Survey</option>
                        </select>
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Report Name</th>
                                    <th>Type</th>
                                    <th>Description</th>
                                    <th>Owner</th>
                                    <th>Public</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="queriesTableBody">
                                ${this.renderQueriesTable(queries, users)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },

    renderQueriesTable(queries, users) {
        if (queries.length === 0) {
            return '<tr><td colspan="6" class="text-center text-muted">No report queries found</td></tr>';
        }

        return queries.map(query => {
            const owner = users.find(u => u.id === query.owner_id);
            
            return `
                <tr>
                    <td><strong>${query.report_name}</strong></td>
                    <td><span class="badge badge-info">${query.report_type}</span></td>
                    <td>${query.report_description || '-'}</td>
                    <td>${owner ? owner.fullName : 'Unknown'}</td>
                    <td>${query.is_public ? '<span class="badge badge-success">Public</span>' : '<span class="badge badge-secondary">Private</span>'}</td>
                    <td>
                        <div class="table-actions">
                            <button class="btn btn-sm btn-outline" onclick="Reporting.runReport('${query.report_id}')">Run</button>
                            <button class="btn btn-sm btn-outline" onclick="Reporting.viewQuery('${query.report_id}')">View</button>
                            <button class="btn btn-sm btn-danger" onclick="Reporting.deleteQuery('${query.report_id}')">Delete</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    },

    renderReportRunsTab() {
        const runs = JSON.parse(localStorage.getItem('report_runs')) || [];
        const queries = JSON.parse(localStorage.getItem('report_queries')) || [];
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        return `
            <div class="patient-list-header">
                <div>
                    <h2>Report Execution History</h2>
                    <p>View report execution history and results</p>
                </div>
            </div>

            <div class="card mt-3">
                <div class="card-header">
                    <div class="search-filter-bar">
                        <select id="runStatusFilter">
                            <option value="all">All Status</option>
                            <option value="completed">Completed</option>
                            <option value="running">Running</option>
                            <option value="failed">Failed</option>
                        </select>
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Report</th>
                                    <th>Started At</th>
                                    <th>Finished At</th>
                                    <th>Status</th>
                                    <th>Run By</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="runsTableBody">
                                ${this.renderRunsTable(runs, queries, users)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },

    renderRunsTable(runs, queries, users) {
        if (runs.length === 0) {
            return '<tr><td colspan="6" class="text-center text-muted">No report runs found</td></tr>';
        }

        return runs.map(run => {
            const query = queries.find(q => q.report_id === run.report_id);
            const runBy = users.find(u => u.id === run.run_by);
            
            return `
                <tr>
                    <td>${query ? query.report_name : 'Unknown Report'}</td>
                    <td>${new Date(run.started_at).toLocaleString()}</td>
                    <td>${run.finished_at ? new Date(run.finished_at).toLocaleString() : '-'}</td>
                    <td><span class="badge badge-${run.status === 'completed' ? 'success' : run.status === 'failed' ? 'danger' : 'warning'}">${run.status}</span></td>
                    <td>${runBy ? runBy.fullName : 'Unknown'}</td>
                    <td>
                        ${run.status === 'completed' && run.output_ref ? `
                            <button class="btn btn-sm btn-outline" onclick="Reporting.downloadReport('${run.run_id}')">Download</button>
                        ` : ''}
                        ${run.status === 'failed' ? `
                            <button class="btn btn-sm btn-outline" onclick="Reporting.viewError('${run.run_id}')">View Error</button>
                        ` : ''}
                    </td>
                </tr>
            `;
        }).join('');
    },

    renderReportBuilderTab() {
        return `
            <div class="patient-list-header">
                <div>
                    <h2>Report Builder</h2>
                    <p>Create custom reports with query builder</p>
                </div>
            </div>

            <div class="card mt-3">
                <div class="card-body">
                    <form id="reportBuilderForm">
                        <div class="form-group">
                            <label class="required">Report Name</label>
                            <input type="text" id="reportName" required placeholder="e.g., Monthly Patient Statistics">
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label class="required">Report Type</label>
                                <select id="reportType" required>
                                    <option value="">Select Type</option>
                                    <option value="patient">Patient</option>
                                    <option value="clinical">Clinical</option>
                                    <option value="inventory">Inventory</option>
                                    <option value="survey">Survey</option>
                                    <option value="custom">Custom</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Description</label>
                                <input type="text" id="reportDescription" placeholder="Report description...">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="required">Data Source</label>
                            <select id="dataSource" required>
                                <option value="">Select Data Source</option>
                                <option value="patients">Patients</option>
                                <option value="visits">Clinical Visits</option>
                                <option value="prescriptions">Prescriptions</option>
                                <option value="lab_results">Lab Results</option>
                                <option value="appointments">Appointments</option>
                                <option value="inventory">Inventory</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Date Range</label>
                            <div class="form-row">
                                <div class="form-group">
                                    <input type="date" id="dateFrom" placeholder="From">
                                </div>
                                <div class="form-group">
                                    <input type="date" id="dateTo" placeholder="To">
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="isPublic"> Make this report public
                            </label>
                        </div>
                    </form>
                    <div class="mt-3">
                        <button class="btn btn-primary" onclick="Reporting.createReport()">Create Report</button>
                        <button class="btn btn-outline" onclick="Reporting.previewReport()">Preview</button>
                    </div>
                </div>
            </div>
        `;
    },

    showAddQueryModal() {
        const content = `
            <form id="addQueryForm">
                <div class="form-group">
                    <label class="required">Report Name</label>
                    <input type="text" id="reportName" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="required">Report Type</label>
                        <select id="reportType" required>
                            <option value="patient">Patient</option>
                            <option value="clinical">Clinical</option>
                            <option value="inventory">Inventory</option>
                            <option value="survey">Survey</option>
                            <option value="custom">Custom</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="isPublic"> Public Report
                        </label>
                    </div>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea id="reportDescription" rows="2"></textarea>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="Reporting.addQuery()">Save Query</button>
        `;

        App.showModal('Create Report Query', content, footer);
    },

    addQuery() {
        const form = document.getElementById('addQueryForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const queries = JSON.parse(localStorage.getItem('report_queries')) || [];
        const currentUser = Auth.getCurrentUser();

        const newQuery = {
            report_id: 'query_' + Date.now(),
            report_name: document.getElementById('reportName').value.trim(),
            report_description: document.getElementById('reportDescription').value.trim() || null,
            report_type: document.getElementById('reportType').value,
            query_definition: JSON.stringify({ dataSource: 'patients', filters: {} }),
            parameters: JSON.stringify({}),
            schedule: null,
            owner_id: currentUser.userId,
            is_public: document.getElementById('isPublic').checked,
            created_at: new Date().toISOString()
        };

        queries.push(newQuery);
        localStorage.setItem('report_queries', JSON.stringify(queries));
        
        App.closeModal();
        App.showSuccess('Report query created successfully');
        this.loadReportingPage(document.getElementById('contentArea'));
    },

    runReport(reportId) {
        const queries = JSON.parse(localStorage.getItem('report_queries')) || [];
        const query = queries.find(q => q.report_id === reportId);
        
        if (!query) {
            App.showError('Report query not found');
            return;
        }

        const runs = JSON.parse(localStorage.getItem('report_runs')) || [];
        const currentUser = Auth.getCurrentUser();

        const newRun = {
            run_id: 'run_' + Date.now(),
            report_id: reportId,
            started_at: new Date().toISOString(),
            finished_at: null,
            status: 'running',
            parameters_used: query.parameters || '{}',
            output_ref: null,
            error_message: null,
            run_by: currentUser.userId
        };

        runs.push(newRun);
        localStorage.setItem('report_runs', JSON.stringify(runs));

        // Simulate report execution
        setTimeout(() => {
            const runIndex = runs.length - 1;
            runs[runIndex].status = 'completed';
            runs[runIndex].finished_at = new Date().toISOString();
            runs[runIndex].output_ref = '/reports/' + newRun.run_id + '.pdf';
            localStorage.setItem('report_runs', JSON.stringify(runs));
            
            App.showSuccess('Report generated successfully');
            this.loadReportingPage(document.getElementById('contentArea'));
        }, 2000);

        App.showSuccess('Report generation started...');
        this.loadReportingPage(document.getElementById('contentArea'));
    },

    viewQuery(reportId) {
        const queries = JSON.parse(localStorage.getItem('report_queries')) || [];
        const query = queries.find(q => q.report_id === reportId);
        
        if (!query) {
            App.showError('Report query not found');
            return;
        }

        const content = `
            <div class="form-group">
                <label>Report Name</label>
                <input type="text" value="${query.report_name}" readonly>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Report Type</label>
                    <input type="text" value="${query.report_type}" readonly>
                </div>
                <div class="form-group">
                    <label>Public</label>
                    <input type="text" value="${query.is_public ? 'Yes' : 'No'}" readonly>
                </div>
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea rows="2" readonly>${query.report_description || '-'}</textarea>
            </div>
            <div class="form-group">
                <label>Query Definition</label>
                <textarea rows="4" readonly>${JSON.stringify(JSON.parse(query.query_definition), null, 2)}</textarea>
            </div>
        `;

        App.showModal('Report Query Details', content, '');
    },

    deleteQuery(reportId) {
        if (!confirm('Delete this report query?')) {
            return;
        }

        const queries = JSON.parse(localStorage.getItem('report_queries')) || [];
        const filtered = queries.filter(q => q.report_id !== reportId);
        localStorage.setItem('report_queries', JSON.stringify(filtered));
        
        App.showSuccess('Report query deleted successfully');
        this.loadReportingPage(document.getElementById('contentArea'));
    },

    createReport() {
        const form = document.getElementById('reportBuilderForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const queries = JSON.parse(localStorage.getItem('report_queries')) || [];
        const currentUser = Auth.getCurrentUser();
        const dateFrom = document.getElementById('dateFrom').value;
        const dateTo = document.getElementById('dateTo').value;

        const queryDefinition = {
            dataSource: document.getElementById('dataSource').value,
            dateRange: {
                from: dateFrom || null,
                to: dateTo || null
            },
            filters: {}
        };

        const newQuery = {
            report_id: 'query_' + Date.now(),
            report_name: document.getElementById('reportName').value.trim(),
            report_description: document.getElementById('reportDescription').value.trim() || null,
            report_type: document.getElementById('reportType').value,
            query_definition: JSON.stringify(queryDefinition),
            parameters: JSON.stringify({ dateFrom, dateTo }),
            schedule: null,
            owner_id: currentUser.userId,
            is_public: document.getElementById('isPublic').checked,
            created_at: new Date().toISOString()
        };

        queries.push(newQuery);
        localStorage.setItem('report_queries', JSON.stringify(queries));
        
        App.showSuccess('Report created successfully');
        // Switch to queries tab
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelector('[data-tab="queries"]').classList.add('active');
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        document.getElementById('queriesTab').classList.add('active');
        this.loadReportingPage(document.getElementById('contentArea'));
    },

    previewReport() {
        App.showSuccess('Report preview (simulated)');
    },

    downloadReport(runId) {
        const runs = JSON.parse(localStorage.getItem('report_runs')) || [];
        const run = runs.find(r => r.run_id === runId);
        
        if (run && run.output_ref) {
            App.showSuccess('Download started (simulated)');
        }
    },

    viewError(runId) {
        const runs = JSON.parse(localStorage.getItem('report_runs')) || [];
        const run = runs.find(r => r.run_id === runId);
        
        if (run && run.error_message) {
            App.showModal('Report Error', `<p>${run.error_message}</p>`, '');
        }
    }
};

