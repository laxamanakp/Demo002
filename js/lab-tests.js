// ============================================================
// MyHubCares - Lab Test Management (Complete Module)
// ============================================================

const LabTests = {
    // Load lab tests page
    loadLabTestsPage(container) {
        const role = Auth.getCurrentUser().role;
        
        if (!['admin', 'physician', 'lab_personnel', 'nurse'].includes(role)) {
            container.innerHTML = '<div class="alert alert-danger">Access denied</div>';
            return;
        }

        const labOrders = JSON.parse(localStorage.getItem('lab_orders')) || [];
        const labResults = JSON.parse(localStorage.getItem('lab_results')) || [];
        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const users = JSON.parse(localStorage.getItem('users')) || [];

        let html = `
            <div class="tabs">
                <div class="tab active" data-tab="orders">Lab Orders</div>
                <div class="tab" data-tab="results">Lab Results</div>
                <div class="tab" data-tab="files">Lab Files</div>
            </div>

            <div class="tab-content active" id="ordersTab">
                ${this.renderLabOrdersTab(labOrders, patients, users)}
            </div>

            <div class="tab-content" id="resultsTab">
                ${this.renderLabResultsTab(labResults, labOrders, patients, users)}
            </div>

            <div class="tab-content" id="filesTab">
                ${this.renderLabFilesTab()}
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

    renderLabOrdersTab(labOrders, patients, users) {
        return `
            <div class="patient-list-header">
                <div>
                    <h2>Lab Orders</h2>
                    <p>Manage laboratory test orders</p>
                </div>
                <button class="btn btn-primary" onclick="LabTests.showAddOrderModal()">Create Order</button>
            </div>

            <div class="card mt-3">
                <div class="card-header">
                    <div class="search-filter-bar">
                        <input type="text" id="orderSearch" placeholder="Search orders..." class="search-input">
                        <select id="orderStatusFilter">
                            <option value="all">All Status</option>
                            <option value="ordered">Ordered</option>
                            <option value="collected">Collected</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Order Date</th>
                                    <th>Patient</th>
                                    <th>Test Panel</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                    <th>Ordered By</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="ordersTableBody">
                                ${this.renderOrdersTable(labOrders, patients, users)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },

    renderOrdersTable(orders, patients, users) {
        if (orders.length === 0) {
            return '<tr><td colspan="7" class="text-center text-muted">No lab orders found</td></tr>';
        }

        return orders.map(order => {
            const patient = patients.find(p => p.id === order.patient_id);
            const provider = users.find(u => u.id === order.ordering_provider_id);
            
            return `
                <tr>
                    <td>${new Date(order.order_date).toLocaleDateString()}</td>
                    <td>${patient ? patient.firstName + ' ' + patient.lastName : 'N/A'}</td>
                    <td><strong>${order.test_panel}</strong></td>
                    <td><span class="badge badge-${order.priority === 'urgent' ? 'danger' : order.priority === 'stat' ? 'warning' : 'info'}">${order.priority}</span></td>
                    <td><span class="badge badge-primary">${order.status}</span></td>
                    <td>${provider ? provider.fullName : 'Unknown'}</td>
                    <td>
                        <div class="table-actions">
                            <button class="btn btn-sm btn-outline" onclick="LabTests.viewOrder('${order.order_id}')">View</button>
                            ${order.status === 'ordered' ? `<button class="btn btn-sm btn-primary" onclick="LabTests.enterResult('${order.order_id}')">Enter Result</button>` : ''}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    },

    renderLabResultsTab(labResults, labOrders, patients, users) {
        return `
            <div class="patient-list-header">
                <div>
                    <h2>Lab Results</h2>
                    <p>View and manage laboratory test results</p>
                </div>
            </div>

            <div class="card mt-3">
                <div class="card-header">
                    <div class="search-filter-bar">
                        <input type="text" id="resultSearch" placeholder="Search results..." class="search-input">
                        <select id="resultTestFilter">
                            <option value="all">All Tests</option>
                            <option value="CD4">CD4</option>
                            <option value="VL">Viral Load</option>
                            <option value="CBC">CBC</option>
                        </select>
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Reported Date</th>
                                    <th>Patient</th>
                                    <th>Test</th>
                                    <th>Result</th>
                                    <th>Unit</th>
                                    <th>Reference Range</th>
                                    <th>Critical</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="resultsTableBody">
                                ${this.renderResultsTable(labResults, patients)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },

    renderResultsTable(results, patients) {
        if (results.length === 0) {
            return '<tr><td colspan="8" class="text-center text-muted">No lab results found</td></tr>';
        }

        return results.map(result => {
            const patient = patients.find(p => p.id === result.patient_id);
            
            return `
                <tr>
                    <td>${new Date(result.reported_at).toLocaleDateString()}</td>
                    <td>${patient ? patient.firstName + ' ' + patient.lastName : 'N/A'}</td>
                    <td><strong>${result.test_name}</strong></td>
                    <td>${result.result_value}</td>
                    <td>${result.unit || '-'}</td>
                    <td>${result.reference_range_text || (result.reference_range_min && result.reference_range_max ? `${result.reference_range_min}-${result.reference_range_max}` : '-')}</td>
                    <td>${result.is_critical ? '<span class="badge badge-danger">Critical</span>' : '-'}</td>
                    <td>
                        <button class="btn btn-sm btn-outline" onclick="LabTests.viewResult('${result.result_id}')">View</button>
                        <button class="btn btn-sm btn-outline" onclick="LabTests.uploadFile('${result.result_id}')">Upload File</button>
                    </td>
                </tr>
            `;
        }).join('');
    },

    renderLabFilesTab() {
        const labFiles = JSON.parse(localStorage.getItem('lab_files')) || [];
        const labResults = JSON.parse(localStorage.getItem('lab_results')) || [];
        
        return `
            <div class="patient-list-header">
                <div>
                    <h2>Lab Files</h2>
                    <p>Manage lab result file attachments</p>
                </div>
            </div>

            <div class="card mt-3">
                <div class="card-body">
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>File Name</th>
                                    <th>Result</th>
                                    <th>File Size</th>
                                    <th>Uploaded At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${labFiles.length === 0 ? '<tr><td colspan="5" class="text-center text-muted">No lab files found</td></tr>' : 
                                labFiles.map(file => {
                                    const result = labResults.find(r => r.result_id === file.result_id);
                                    return `
                                        <tr>
                                            <td>${file.file_name}</td>
                                            <td>${result ? result.test_name : 'N/A'}</td>
                                            <td>${file.file_size ? (file.file_size / 1024).toFixed(2) + ' KB' : '-'}</td>
                                            <td>${new Date(file.uploaded_at).toLocaleDateString()}</td>
                                            <td>
                                                <button class="btn btn-sm btn-outline" onclick="LabTests.downloadFile('${file.file_id}')">Download</button>
                                                <button class="btn btn-sm btn-danger" onclick="LabTests.deleteFile('${file.file_id}')">Delete</button>
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
    },

    showAddOrderModal() {
        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const currentUser = Auth.getCurrentUser();

        const content = `
            <form id="addOrderForm">
                <div class="form-group">
                    <label class="required">Patient</label>
                    <select id="patientId" required>
                        <option value="">Select Patient</option>
                        ${patients.map(p => `<option value="${p.id}">${p.firstName} ${p.lastName}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label class="required">Test Panel</label>
                    <select id="testPanel" required>
                        <option value="">Select Test</option>
                        <option value="CD4 Count">CD4 Count</option>
                        <option value="Viral Load">Viral Load</option>
                        <option value="CBC">Complete Blood Count (CBC)</option>
                        <option value="Liver Function">Liver Function Tests</option>
                        <option value="Kidney Function">Kidney Function Tests</option>
                        <option value="Lipid Panel">Lipid Panel</option>
                        <option value="Hepatitis B">Hepatitis B</option>
                        <option value="Hepatitis C">Hepatitis C</option>
                        <option value="Syphilis">Syphilis</option>
                    </select>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="required">Priority</label>
                        <select id="priority" required>
                            <option value="routine">Routine</option>
                            <option value="urgent">Urgent</option>
                            <option value="stat">STAT</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Order Date</label>
                        <input type="date" id="orderDate" value="${new Date().toISOString().split('T')[0]}">
                    </div>
                </div>
                <div class="form-group">
                    <label>Notes</label>
                    <textarea id="notes" rows="2" placeholder="Order notes..."></textarea>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="LabTests.addOrder()">Create Order</button>
        `;

        App.showModal('Create Lab Order', content, footer);
    },

    addOrder() {
        const form = document.getElementById('addOrderForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const labOrders = JSON.parse(localStorage.getItem('lab_orders')) || [];
        const currentUser = Auth.getCurrentUser();

        const newOrder = {
            order_id: 'order_' + Date.now(),
            patient_id: parseInt(document.getElementById('patientId').value),
            ordering_provider_id: currentUser.userId,
            facility_id: currentUser.facilityId || 1,
            order_date: document.getElementById('orderDate').value || new Date().toISOString().split('T')[0],
            test_panel: document.getElementById('testPanel').value,
            priority: document.getElementById('priority').value,
            status: 'ordered',
            collection_date: null,
            notes: document.getElementById('notes').value.trim() || null,
            created_at: new Date().toISOString()
        };

        labOrders.push(newOrder);
        localStorage.setItem('lab_orders', JSON.stringify(labOrders));
        
        App.closeModal();
        App.showSuccess('Lab order created successfully');
        this.loadLabTestsPage(document.getElementById('contentArea'));
    },

    enterResult(orderId) {
        const labOrders = JSON.parse(localStorage.getItem('lab_orders')) || [];
        const order = labOrders.find(o => o.order_id === orderId);
        
        if (!order) {
            App.showError('Order not found');
            return;
        }

        const content = `
            <form id="enterResultForm">
                <input type="hidden" id="orderId" value="${orderId}">
                <input type="hidden" id="patientId" value="${order.patient_id}">
                <div class="form-group">
                    <label class="required">Test Code</label>
                    <input type="text" id="testCode" required placeholder="e.g., CD4, VL, CBC">
                </div>
                <div class="form-group">
                    <label class="required">Test Name</label>
                    <input type="text" id="testName" value="${order.test_panel}" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="required">Result Value</label>
                        <input type="text" id="resultValue" required placeholder="e.g., 450, <20">
                    </div>
                    <div class="form-group">
                        <label>Unit</label>
                        <input type="text" id="unit" placeholder="e.g., cells/μL, copies/mL">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Reference Range Min</label>
                        <input type="number" id="refMin" step="0.01">
                    </div>
                    <div class="form-group">
                        <label>Reference Range Max</label>
                        <input type="number" id="refMax" step="0.01">
                    </div>
                </div>
                <div class="form-group">
                    <label>Reference Range (Text)</label>
                    <input type="text" id="refText" placeholder="e.g., < 20 copies/mL">
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="isCritical"> Critical Value
                    </label>
                </div>
                <div class="form-group">
                    <label>Collection Date</label>
                    <input type="date" id="collectedAt" value="${new Date().toISOString().split('T')[0]}">
                </div>
                <div class="form-group">
                    <label>Notes</label>
                    <textarea id="notes" rows="2" placeholder="Result notes..."></textarea>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="LabTests.saveResult()">Save Result</button>
        `;

        App.showModal('Enter Lab Result', content, footer);
    },

    saveResult() {
        const form = document.getElementById('enterResultForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const labResults = JSON.parse(localStorage.getItem('lab_results')) || [];
        const labOrders = JSON.parse(localStorage.getItem('lab_orders')) || [];
        const currentUser = Auth.getCurrentUser();
        const orderId = document.getElementById('orderId').value;
        const order = labOrders.find(o => o.order_id === orderId);
        
        const refMin = document.getElementById('refMin').value;
        const refMax = document.getElementById('refMax').value;
        const collectedAt = document.getElementById('collectedAt').value;

        const newResult = {
            result_id: 'result_' + Date.now(),
            order_id: orderId,
            patient_id: parseInt(document.getElementById('patientId').value),
            test_code: document.getElementById('testCode').value.trim(),
            test_name: document.getElementById('testName').value.trim(),
            result_value: document.getElementById('resultValue').value.trim(),
            unit: document.getElementById('unit').value.trim() || null,
            reference_range_min: refMin ? parseFloat(refMin) : null,
            reference_range_max: refMax ? parseFloat(refMax) : null,
            reference_range_text: document.getElementById('refText').value.trim() || null,
            is_critical: document.getElementById('isCritical').checked,
            critical_alert_sent: false,
            collected_at: collectedAt || null,
            reported_at: new Date().toISOString().split('T')[0],
            reviewed_at: null,
            reviewer_id: null,
            notes: document.getElementById('notes').value.trim() || null,
            created_at: new Date().toISOString(),
            created_by: currentUser.userId
        };

        labResults.push(newResult);
        localStorage.setItem('lab_results', JSON.stringify(labResults));

        // Update order status
        if (order) {
            order.status = 'completed';
            order.collection_date = collectedAt || new Date().toISOString().split('T')[0];
            localStorage.setItem('lab_orders', JSON.stringify(labOrders));
        }
        
        App.closeModal();
        App.showSuccess('Lab result saved successfully');
        this.loadLabTestsPage(document.getElementById('contentArea'));
    },

    viewOrder(orderId) {
        const labOrders = JSON.parse(localStorage.getItem('lab_orders')) || [];
        const order = labOrders.find(o => o.order_id === orderId);
        
        if (!order) {
            App.showError('Order not found');
            return;
        }

        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const patient = patients.find(p => p.id === order.patient_id);
        const provider = users.find(u => u.id === order.ordering_provider_id);

        const content = `
            <div class="form-group">
                <label>Patient</label>
                <input type="text" value="${patient ? patient.firstName + ' ' + patient.lastName : 'N/A'}" readonly>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Test Panel</label>
                    <input type="text" value="${order.test_panel}" readonly>
                </div>
                <div class="form-group">
                    <label>Priority</label>
                    <input type="text" value="${order.priority}" readonly>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Status</label>
                    <input type="text" value="${order.status}" readonly>
                </div>
                <div class="form-group">
                    <label>Ordered By</label>
                    <input type="text" value="${provider ? provider.fullName : 'Unknown'}" readonly>
                </div>
            </div>
            ${order.notes ? `
                <div class="form-group">
                    <label>Notes</label>
                    <textarea rows="2" readonly>${order.notes}</textarea>
                </div>
            ` : ''}
        `;

        App.showModal('Lab Order Details', content, '');
    },

    viewResult(resultId) {
        const labResults = JSON.parse(localStorage.getItem('lab_results')) || [];
        const result = labResults.find(r => r.result_id === resultId);
        
        if (!result) {
            App.showError('Result not found');
            return;
        }

        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const patient = patients.find(p => p.id === result.patient_id);

        const content = `
            <div class="form-group">
                <label>Patient</label>
                <input type="text" value="${patient ? patient.firstName + ' ' + patient.lastName : 'N/A'}" readonly>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Test Name</label>
                    <input type="text" value="${result.test_name}" readonly>
                </div>
                <div class="form-group">
                    <label>Test Code</label>
                    <input type="text" value="${result.test_code}" readonly>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Result Value</label>
                    <input type="text" value="${result.result_value}" readonly>
                </div>
                <div class="form-group">
                    <label>Unit</label>
                    <input type="text" value="${result.unit || '-'}" readonly>
                </div>
            </div>
            <div class="form-group">
                <label>Reference Range</label>
                <input type="text" value="${result.reference_range_text || (result.reference_range_min && result.reference_range_max ? `${result.reference_range_min}-${result.reference_range_max}` : '-')}" readonly>
            </div>
            <div class="form-group">
                <label>Critical Value</label>
                <input type="text" value="${result.is_critical ? 'Yes' : 'No'}" readonly>
            </div>
            ${result.notes ? `
                <div class="form-group">
                    <label>Notes</label>
                    <textarea rows="2" readonly>${result.notes}</textarea>
                </div>
            ` : ''}
        `;

        App.showModal('Lab Result Details', content, '');
    },

    uploadFile(resultId) {
        const content = `
            <form id="uploadFileForm">
                <input type="hidden" id="resultId" value="${resultId}">
                <div class="form-group">
                    <label class="required">File</label>
                    <input type="file" id="labFile" required>
                    <small class="text-muted">Max file size: 10MB</small>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="LabTests.saveFile()">Upload File</button>
        `;

        App.showModal('Upload Lab File', content, footer);
    },

    saveFile() {
        const form = document.getElementById('uploadFileForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const fileInput = document.getElementById('labFile');
        if (!fileInput.files || fileInput.files.length === 0) {
            App.showError('Please select a file');
            return;
        }

        const file = fileInput.files[0];
        const maxSize = 10 * 1024 * 1024;
        
        if (file.size > maxSize) {
            App.showError('File size exceeds 10MB limit');
            return;
        }

        const labFiles = JSON.parse(localStorage.getItem('lab_files')) || [];
        const currentUser = Auth.getCurrentUser();
        const resultId = document.getElementById('resultId').value;

        const newFile = {
            file_id: 'labfile_' + Date.now(),
            result_id: resultId,
            file_name: file.name,
            file_path: '/uploads/lab/' + file.name,
            file_size: file.size,
            mime_type: file.type,
            uploaded_at: new Date().toISOString(),
            uploaded_by: currentUser.userId
        };

        labFiles.push(newFile);
        localStorage.setItem('lab_files', JSON.stringify(labFiles));
        
        App.closeModal();
        App.showSuccess('File uploaded successfully');
        this.loadLabTestsPage(document.getElementById('contentArea'));
    },

    downloadFile(fileId) {
        const labFiles = JSON.parse(localStorage.getItem('lab_files')) || [];
        const file = labFiles.find(f => f.file_id === fileId);
        
        if (!file) {
            App.showError('File not found');
            return;
        }

        App.showSuccess('Download started (simulated)');
    },

    deleteFile(fileId) {
        if (!confirm('Delete this file?')) {
            return;
        }

        const labFiles = JSON.parse(localStorage.getItem('lab_files')) || [];
        const filtered = labFiles.filter(f => f.file_id !== fileId);
        localStorage.setItem('lab_files', JSON.stringify(filtered));
        
        App.showSuccess('File deleted successfully');
        this.loadLabTestsPage(document.getElementById('contentArea'));
    }
};

