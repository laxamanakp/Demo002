// ============================================================
// MyHubCares - Patient Management (Identifiers & Documents)
// ============================================================

const PatientManagement = {
    // Load patient identifiers page
    loadPatientIdentifiersPage(container, patientId) {
        const role = Auth.getCurrentUser().role;
        
        if (!Auth.permissions.canViewAllPatients(role)) {
            container.innerHTML = '<div class="alert alert-danger">Access denied</div>';
            return;
        }

        const identifiers = JSON.parse(localStorage.getItem('patient_identifiers')) || [];
        const patientIdentifiers = identifiers.filter(id => id.patient_id === patientId);

        let html = `
            <div class="patient-list-header">
                <div>
                    <h3>Patient Identifiers</h3>
                    <p>Manage patient identification documents</p>
                </div>
                <button class="btn btn-primary" onclick="PatientManagement.showAddIdentifierModal(${patientId})">
                    Add Identifier
                </button>
            </div>

            <div class="card mt-3">
                <div class="card-body">
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID Type</th>
                                    <th>ID Value</th>
                                    <th>Issued Date</th>
                                    <th>Expiry Date</th>
                                    <th>Verified</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="identifiersTableBody">
                                ${this.renderIdentifiersTable(patientIdentifiers)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;
    },

    renderIdentifiersTable(identifiers) {
        if (identifiers.length === 0) {
            return '<tr><td colspan="6" class="text-center text-muted">No identifiers found</td></tr>';
        }

        return identifiers.map(id => `
            <tr>
                <td><span class="badge badge-info">${id.id_type.replace('_', ' ').toUpperCase()}</span></td>
                <td><code>${id.id_value}</code></td>
                <td>${id.issued_at ? new Date(id.issued_at).toLocaleDateString() : '-'}</td>
                <td>${id.expires_at ? new Date(id.expires_at).toLocaleDateString() : '-'}</td>
                <td>${id.verified ? '<span class="badge badge-success">Verified</span>' : '<span class="badge badge-warning">Unverified</span>'}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-sm btn-outline" onclick="PatientManagement.showEditIdentifierModal('${id.identifier_id}')">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="PatientManagement.deleteIdentifier('${id.identifier_id}')">Delete</button>
                    </div>
                </td>
            </tr>
        `).join('');
    },

    showAddIdentifierModal(patientId) {
        const content = `
            <form id="addIdentifierForm">
                <input type="hidden" id="patientId" value="${patientId}">
                <div class="form-group">
                    <label class="required">ID Type</label>
                    <select id="idType" required>
                        <option value="">Select ID Type</option>
                        <option value="passport">Passport</option>
                        <option value="driver_license">Driver's License</option>
                        <option value="sss">SSS</option>
                        <option value="tin">TIN</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="required">ID Value/Number</label>
                    <input type="text" id="idValue" required placeholder="Enter ID number">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Issued Date</label>
                        <input type="date" id="issuedAt">
                    </div>
                    <div class="form-group">
                        <label>Expiry Date</label>
                        <input type="date" id="expiresAt">
                    </div>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="verified"> Verified
                    </label>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="PatientManagement.addIdentifier()">Save Identifier</button>
        `;

        App.showModal('Add Patient Identifier', content, footer);
    },

    showEditIdentifierModal(identifierId) {
        const identifiers = JSON.parse(localStorage.getItem('patient_identifiers')) || [];
        const identifier = identifiers.find(id => id.identifier_id === identifierId);
        
        if (!identifier) {
            App.showError('Identifier not found');
            return;
        }

        const content = `
            <form id="editIdentifierForm">
                <input type="hidden" id="identifierId" value="${identifierId}">
                <div class="form-group">
                    <label class="required">ID Type</label>
                    <select id="idType" required>
                        <option value="passport" ${identifier.id_type === 'passport' ? 'selected' : ''}>Passport</option>
                        <option value="driver_license" ${identifier.id_type === 'driver_license' ? 'selected' : ''}>Driver's License</option>
                        <option value="sss" ${identifier.id_type === 'sss' ? 'selected' : ''}>SSS</option>
                        <option value="tin" ${identifier.id_type === 'tin' ? 'selected' : ''}>TIN</option>
                        <option value="other" ${identifier.id_type === 'other' ? 'selected' : ''}>Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="required">ID Value/Number</label>
                    <input type="text" id="idValue" value="${identifier.id_value}" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Issued Date</label>
                        <input type="date" id="issuedAt" value="${identifier.issued_at ? identifier.issued_at.split('T')[0] : ''}">
                    </div>
                    <div class="form-group">
                        <label>Expiry Date</label>
                        <input type="date" id="expiresAt" value="${identifier.expires_at ? identifier.expires_at.split('T')[0] : ''}">
                    </div>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="verified" ${identifier.verified ? 'checked' : ''}> Verified
                    </label>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="PatientManagement.updateIdentifier()">Update Identifier</button>
        `;

        App.showModal('Edit Patient Identifier', content, footer);
    },

    addIdentifier() {
        const form = document.getElementById('addIdentifierForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const identifiers = JSON.parse(localStorage.getItem('patient_identifiers')) || [];
        const issuedAt = document.getElementById('issuedAt').value;
        const expiresAt = document.getElementById('expiresAt').value;

        const newIdentifier = {
            identifier_id: 'id_' + Date.now(),
            patient_id: parseInt(document.getElementById('patientId').value),
            id_type: document.getElementById('idType').value,
            id_value: document.getElementById('idValue').value.trim(),
            issued_at: issuedAt ? new Date(issuedAt).toISOString() : null,
            expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
            verified: document.getElementById('verified').checked
        };

        identifiers.push(newIdentifier);
        localStorage.setItem('patient_identifiers', JSON.stringify(identifiers));
        
        App.closeModal();
        App.showSuccess('Identifier added successfully');
        const patientId = newIdentifier.patient_id;
        const container = document.getElementById('identifiersTab') || document.getElementById('contentArea');
        this.loadPatientIdentifiersPage(container, patientId);
    },

    updateIdentifier() {
        const form = document.getElementById('editIdentifierForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const identifiers = JSON.parse(localStorage.getItem('patient_identifiers')) || [];
        const identifierId = document.getElementById('identifierId').value;
        const index = identifiers.findIndex(id => id.identifier_id === identifierId);
        
        if (index === -1) {
            App.showError('Identifier not found');
            return;
        }

        const issuedAt = document.getElementById('issuedAt').value;
        const expiresAt = document.getElementById('expiresAt').value;

        identifiers[index].id_type = document.getElementById('idType').value;
        identifiers[index].id_value = document.getElementById('idValue').value.trim();
        identifiers[index].issued_at = issuedAt ? new Date(issuedAt).toISOString() : null;
        identifiers[index].expires_at = expiresAt ? new Date(expiresAt).toISOString() : null;
        identifiers[index].verified = document.getElementById('verified').checked;

        localStorage.setItem('patient_identifiers', JSON.stringify(identifiers));
        
        App.closeModal();
        App.showSuccess('Identifier updated successfully');
        const patientId = identifiers[index].patient_id;
        const container = document.getElementById('identifiersTab') || document.getElementById('contentArea');
        this.loadPatientIdentifiersPage(container, patientId);
    },

    deleteIdentifier(identifierId) {
        if (!confirm('Delete this identifier?')) {
            return;
        }

        const identifiers = JSON.parse(localStorage.getItem('patient_identifiers')) || [];
        const identifier = identifiers.find(id => id.identifier_id === identifierId);
        const filtered = identifiers.filter(id => id.identifier_id !== identifierId);
        localStorage.setItem('patient_identifiers', JSON.stringify(filtered));
        
        App.showSuccess('Identifier deleted successfully');
        if (identifier) {
            const container = document.getElementById('identifiersTab') || document.getElementById('contentArea');
            this.loadPatientIdentifiersPage(container, identifier.patient_id);
        }
    },

    // ========== PATIENT DOCUMENTS ==========
    loadPatientDocumentsPage(container, patientId) {
        const role = Auth.getCurrentUser().role;
        
        if (!Auth.permissions.canViewAllPatients(role)) {
            container.innerHTML = '<div class="alert alert-danger">Access denied</div>';
            return;
        }

        const documents = JSON.parse(localStorage.getItem('patient_documents')) || [];
        const patientDocuments = documents.filter(doc => doc.patient_id === patientId);

        let html = `
            <div class="patient-list-header">
                <div>
                    <h3>Patient Documents</h3>
                    <p>Manage patient documents and files</p>
                </div>
                <button class="btn btn-primary" onclick="PatientManagement.showAddDocumentModal(${patientId})">
                    Upload Document
                </button>
            </div>

            <div class="card mt-3">
                <div class="card-header">
                    <div class="search-filter-bar">
                        <select id="documentTypeFilter">
                            <option value="all">All Types</option>
                            <option value="consent">Consent Forms</option>
                            <option value="id_copy">ID Copies</option>
                            <option value="medical_record">Medical Records</option>
                            <option value="lab_result">Lab Results</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Document Type</th>
                                    <th>File Name</th>
                                    <th>File Size</th>
                                    <th>Uploaded By</th>
                                    <th>Uploaded At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="documentsTableBody">
                                ${this.renderDocumentsTable(patientDocuments)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;
    },

    renderDocumentsTable(documents) {
        if (documents.length === 0) {
            return '<tr><td colspan="6" class="text-center text-muted">No documents found</td></tr>';
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];

        return documents.map(doc => {
            const uploadedBy = users.find(u => u.id === doc.uploaded_by);
            const fileSize = doc.file_size ? (doc.file_size / 1024).toFixed(2) + ' KB' : '-';
            
            return `
                <tr>
                    <td><span class="badge badge-info">${doc.document_type.replace('_', ' ').toUpperCase()}</span></td>
                    <td>${doc.file_name}</td>
                    <td>${fileSize}</td>
                    <td>${uploadedBy ? uploadedBy.fullName : 'Unknown'}</td>
                    <td>${new Date(doc.uploaded_at).toLocaleDateString()}</td>
                    <td>
                        <div class="table-actions">
                            <button class="btn btn-sm btn-outline" onclick="PatientManagement.viewDocument('${doc.document_id}')">View</button>
                            <button class="btn btn-sm btn-outline" onclick="PatientManagement.downloadDocument('${doc.document_id}')">Download</button>
                            <button class="btn btn-sm btn-danger" onclick="PatientManagement.deleteDocument('${doc.document_id}')">Delete</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    },

    showAddDocumentModal(patientId) {
        const content = `
            <form id="addDocumentForm">
                <input type="hidden" id="patientId" value="${patientId}">
                <div class="form-group">
                    <label class="required">Document Type</label>
                    <select id="documentType" required>
                        <option value="">Select Type</option>
                        <option value="consent">Consent Form</option>
                        <option value="id_copy">ID Copy</option>
                        <option value="medical_record">Medical Record</option>
                        <option value="lab_result">Lab Result</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="required">File</label>
                    <input type="file" id="documentFile" required>
                    <small class="text-muted">Max file size: 10MB</small>
                </div>
                <div class="form-group">
                    <label>File Name (optional)</label>
                    <input type="text" id="fileName" placeholder="Custom file name">
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="PatientManagement.addDocument()">Upload Document</button>
        `;

        App.showModal('Upload Patient Document', content, footer);
    },

    addDocument() {
        const form = document.getElementById('addDocumentForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const fileInput = document.getElementById('documentFile');
        if (!fileInput.files || fileInput.files.length === 0) {
            App.showError('Please select a file');
            return;
        }

        const file = fileInput.files[0];
        const maxSize = 10 * 1024 * 1024; // 10MB
        
        if (file.size > maxSize) {
            App.showError('File size exceeds 10MB limit');
            return;
        }

        const documents = JSON.parse(localStorage.getItem('patient_documents')) || [];
        const currentUser = Auth.getCurrentUser();
        const customFileName = document.getElementById('fileName').value.trim();

        // In a real app, this would upload to a server
        // For now, we'll simulate by storing file metadata
        const newDocument = {
            document_id: 'doc_' + Date.now(),
            patient_id: parseInt(document.getElementById('patientId').value),
            document_type: document.getElementById('documentType').value,
            file_name: customFileName || file.name,
            file_path: '/uploads/documents/' + file.name, // Simulated path
            file_size: file.size,
            mime_type: file.type,
            uploaded_at: new Date().toISOString(),
            uploaded_by: currentUser.userId
        };

        documents.push(newDocument);
        localStorage.setItem('patient_documents', JSON.stringify(documents));
        
        App.closeModal();
        App.showSuccess('Document uploaded successfully');
        const patientId = newDocument.patient_id;
        const container = document.getElementById('documentsTab') || document.getElementById('contentArea');
        this.loadPatientDocumentsPage(container, patientId);
    },

    viewDocument(documentId) {
        const documents = JSON.parse(localStorage.getItem('patient_documents')) || [];
        const doc = documents.find(d => d.document_id === documentId);
        
        if (!doc) {
            App.showError('Document not found');
            return;
        }

        const content = `
            <div class="form-group">
                <label>Document Type</label>
                <input type="text" value="${doc.document_type.replace('_', ' ').toUpperCase()}" readonly>
            </div>
            <div class="form-group">
                <label>File Name</label>
                <input type="text" value="${doc.file_name}" readonly>
            </div>
            <div class="form-group">
                <label>File Size</label>
                <input type="text" value="${(doc.file_size / 1024).toFixed(2)} KB" readonly>
            </div>
            <div class="form-group">
                <label>Uploaded At</label>
                <input type="text" value="${new Date(doc.uploaded_at).toLocaleString()}" readonly>
            </div>
            <div class="form-group">
                <label>File Path</label>
                <input type="text" value="${doc.file_path}" readonly>
            </div>
            <div class="alert alert-info">
                <strong>Note:</strong> In a production environment, this would display the actual document.
            </div>
        `;

        App.showModal('View Document', content, '');
    },

    downloadDocument(documentId) {
        const documents = JSON.parse(localStorage.getItem('patient_documents')) || [];
        const doc = documents.find(d => d.document_id === documentId);
        
        if (!doc) {
            App.showError('Document not found');
            return;
        }

        App.showSuccess('Download started (simulated)');
        // In a real app, this would trigger an actual download
    },

    deleteDocument(documentId) {
        if (!confirm('Delete this document? This action cannot be undone.')) {
            return;
        }

        const documents = JSON.parse(localStorage.getItem('patient_documents')) || [];
        const doc = documents.find(d => d.document_id === documentId);
        const filtered = documents.filter(d => d.document_id !== documentId);
        localStorage.setItem('patient_documents', JSON.stringify(filtered));
        
        App.showSuccess('Document deleted successfully');
        if (doc) {
            const container = document.getElementById('documentsTab') || document.getElementById('contentArea');
            this.loadPatientDocumentsPage(container, doc.patient_id);
        }
    }
};

