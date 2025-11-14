// ============================================================
// MyHubCares - Advanced Inventory Management
// ============================================================

const InventoryAdvanced = {
    // Load advanced inventory page
    loadAdvancedInventoryPage(container) {
        const role = Auth.getCurrentUser().role;
        
        if (!['admin', 'nurse'].includes(role)) {
            container.innerHTML = '<div class="alert alert-danger">Access denied</div>';
            return;
        }

        let html = `
            <div class="tabs">
                <div class="tab active" data-tab="transactions">Transactions</div>
                <div class="tab" data-tab="alerts">Alerts</div>
                <div class="tab" data-tab="suppliers">Suppliers</div>
                <div class="tab" data-tab="orders">Purchase Orders</div>
            </div>

            <div class="tab-content active" id="transactionsTab">
                ${this.renderTransactionsTab()}
            </div>

            <div class="tab-content" id="alertsTab">
                ${this.renderAlertsTab()}
            </div>

            <div class="tab-content" id="suppliersTab">
                ${this.renderSuppliersTab()}
            </div>

            <div class="tab-content" id="ordersTab">
                ${this.renderOrdersTab()}
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

    // ========== INVENTORY TRANSACTIONS ==========
    renderTransactionsTab() {
        const transactions = JSON.parse(localStorage.getItem('inventory_transactions')) || [];
        const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
        const medications = JSON.parse(localStorage.getItem('medications')) || [];
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const facilities = JSON.parse(localStorage.getItem('facilities')) || [];

        return `
            <div class="patient-list-header">
                <div>
                    <h2>Inventory Transactions</h2>
                    <p>View inventory transaction history</p>
                </div>
            </div>

            <div class="card mt-3">
                <div class="card-header">
                    <div class="search-filter-bar">
                        <input type="text" id="transactionSearch" placeholder="Search transactions..." class="search-input">
                        <select id="transactionTypeFilter">
                            <option value="all">All Types</option>
                            <option value="restock">Restock</option>
                            <option value="dispense">Dispense</option>
                            <option value="adjustment">Adjustment</option>
                            <option value="transfer">Transfer</option>
                            <option value="expired">Expired</option>
                        </select>
                        <input type="date" id="transactionDateFilter">
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Medication</th>
                                    <th>Type</th>
                                    <th>Quantity Change</th>
                                    <th>Before</th>
                                    <th>After</th>
                                    <th>Performed By</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="transactionsTableBody">
                                ${this.renderTransactionsTable(transactions, inventory, medications, users, facilities)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },

    renderTransactionsTable(transactions, inventory, medications, users, facilities) {
        if (transactions.length === 0) {
            return '<tr><td colspan="8" class="text-center text-muted">No transactions found</td></tr>';
        }

        return transactions.map(trans => {
            const inv = inventory.find(i => i.id === trans.inventory_id);
            const medication = inv ? medications.find(m => m.medication_id === inv.medicationId) : null;
            const performer = users.find(u => u.id === trans.performed_by);
            
            return `
                <tr>
                    <td>${new Date(trans.transaction_date).toLocaleDateString()}</td>
                    <td>${medication ? medication.name : 'Unknown'}</td>
                    <td><span class="badge badge-info">${trans.transaction_type}</span></td>
                    <td>${trans.quantity_change > 0 ? '+' : ''}${trans.quantity_change}</td>
                    <td>${trans.quantity_before}</td>
                    <td>${trans.quantity_after}</td>
                    <td>${performer ? performer.fullName : 'Unknown'}</td>
                    <td>
                        <button class="btn btn-sm btn-outline" onclick="InventoryAdvanced.viewTransaction('${trans.transaction_id}')">View</button>
                    </td>
                </tr>
            `;
        }).join('');
    },

    viewTransaction(transactionId) {
        const transactions = JSON.parse(localStorage.getItem('inventory_transactions')) || [];
        const transaction = transactions.find(t => t.transaction_id === transactionId);
        
        if (!transaction) {
            App.showError('Transaction not found');
            return;
        }

        const content = `
            <div class="form-group">
                <label>Transaction Type</label>
                <input type="text" value="${transaction.transaction_type}" readonly>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Quantity Before</label>
                    <input type="text" value="${transaction.quantity_before}" readonly>
                </div>
                <div class="form-group">
                    <label>Quantity Change</label>
                    <input type="text" value="${transaction.quantity_change > 0 ? '+' : ''}${transaction.quantity_change}" readonly>
                </div>
                <div class="form-group">
                    <label>Quantity After</label>
                    <input type="text" value="${transaction.quantity_after}" readonly>
                </div>
            </div>
            ${transaction.transaction_reason ? `
                <div class="form-group">
                    <label>Reason</label>
                    <textarea rows="2" readonly>${transaction.transaction_reason}</textarea>
                </div>
            ` : ''}
            <div class="form-group">
                <label>Transaction Date</label>
                <input type="text" value="${new Date(transaction.transaction_date).toLocaleString()}" readonly>
            </div>
        `;

        App.showModal('Transaction Details', content, '');
    },

    // ========== INVENTORY ALERTS ==========
    renderAlertsTab() {
        const alerts = JSON.parse(localStorage.getItem('inventory_alerts')) || [];
        const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
        const medications = JSON.parse(localStorage.getItem('medications')) || [];
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        return `
            <div class="patient-list-header">
                <div>
                    <h2>Inventory Alerts</h2>
                    <p>Manage stock and expiry alerts</p>
                </div>
            </div>

            <div class="card mt-3">
                <div class="card-header">
                    <div class="search-filter-bar">
                        <select id="alertTypeFilter">
                            <option value="all">All Types</option>
                            <option value="low_stock">Low Stock</option>
                            <option value="expiring_soon">Expiring Soon</option>
                            <option value="expired">Expired</option>
                            <option value="overstock">Overstock</option>
                        </select>
                        <select id="alertStatusFilter">
                            <option value="all">All Status</option>
                            <option value="acknowledged">Acknowledged</option>
                            <option value="unacknowledged">Unacknowledged</option>
                        </select>
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Medication</th>
                                    <th>Alert Type</th>
                                    <th>Level</th>
                                    <th>Current Value</th>
                                    <th>Threshold</th>
                                    <th>Message</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="alertsTableBody">
                                ${this.renderAlertsTable(alerts, inventory, medications, users)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },

    renderAlertsTable(alerts, inventory, medications, users) {
        if (alerts.length === 0) {
            return '<tr><td colspan="8" class="text-center text-muted">No alerts found</td></tr>';
        }

        return alerts.map(alert => {
            const inv = inventory.find(i => i.id === alert.inventory_id);
            const medication = inv ? medications.find(m => m.medication_id === inv.medicationId) : null;
            
            return `
                <tr>
                    <td>${medication ? medication.name : 'Unknown'}</td>
                    <td><span class="badge badge-info">${alert.alert_type.replace('_', ' ')}</span></td>
                    <td><span class="badge badge-${alert.alert_level === 'critical' ? 'danger' : alert.alert_level === 'warning' ? 'warning' : 'info'}">${alert.alert_level}</span></td>
                    <td>${alert.current_value}</td>
                    <td>${alert.threshold_value}</td>
                    <td>${alert.message}</td>
                    <td>${alert.acknowledged ? '<span class="badge badge-success">Acknowledged</span>' : '<span class="badge badge-warning">Unacknowledged</span>'}</td>
                    <td>
                        ${!alert.acknowledged ? `<button class="btn btn-sm btn-primary" onclick="InventoryAdvanced.acknowledgeAlert('${alert.alert_id}')">Acknowledge</button>` : ''}
                        <button class="btn btn-sm btn-danger" onclick="InventoryAdvanced.deleteAlert('${alert.alert_id}')">Delete</button>
                    </td>
                </tr>
            `;
        }).join('');
    },

    acknowledgeAlert(alertId) {
        const alerts = JSON.parse(localStorage.getItem('inventory_alerts')) || [];
        const alert = alerts.find(a => a.alert_id === alertId);
        const currentUser = Auth.getCurrentUser();
        
        if (alert) {
            alert.acknowledged = true;
            alert.acknowledged_by = currentUser.userId;
            alert.acknowledged_at = new Date().toISOString();
            localStorage.setItem('inventory_alerts', JSON.stringify(alerts));
            App.showSuccess('Alert acknowledged successfully');
            this.loadAdvancedInventoryPage(document.getElementById('contentArea'));
        }
    },

    deleteAlert(alertId) {
        if (!confirm('Delete this alert?')) {
            return;
        }

        const alerts = JSON.parse(localStorage.getItem('inventory_alerts')) || [];
        const filtered = alerts.filter(a => a.alert_id !== alertId);
        localStorage.setItem('inventory_alerts', JSON.stringify(filtered));
        
        App.showSuccess('Alert deleted successfully');
        this.loadAdvancedInventoryPage(document.getElementById('contentArea'));
    },

    // ========== SUPPLIERS ==========
    renderSuppliersTab() {
        const suppliers = JSON.parse(localStorage.getItem('inventory_suppliers')) || [];
        
        return `
            <div class="patient-list-header">
                <div>
                    <h2>Suppliers</h2>
                    <p>Manage medication suppliers</p>
                </div>
                <button class="btn btn-primary" onclick="InventoryAdvanced.showAddSupplierModal()">Add Supplier</button>
            </div>

            <div class="card mt-3">
                <div class="card-body">
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Supplier Name</th>
                                    <th>Contact Person</th>
                                    <th>Phone</th>
                                    <th>Email</th>
                                    <th>Active</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="suppliersTableBody">
                                ${this.renderSuppliersTable(suppliers)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },

    renderSuppliersTable(suppliers) {
        if (suppliers.length === 0) {
            return '<tr><td colspan="6" class="text-center text-muted">No suppliers found</td></tr>';
        }

        return suppliers.map(supplier => `
            <tr>
                <td><strong>${supplier.supplier_name}</strong></td>
                <td>${supplier.contact_person || '-'}</td>
                <td>${supplier.contact_phone || '-'}</td>
                <td>${supplier.contact_email || '-'}</td>
                <td>${supplier.is_active ? '<span class="badge badge-success">Active</span>' : '<span class="badge badge-secondary">Inactive</span>'}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-sm btn-outline" onclick="InventoryAdvanced.showEditSupplierModal('${supplier.supplier_id}')">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="InventoryAdvanced.deleteSupplier('${supplier.supplier_id}')">Delete</button>
                    </div>
                </td>
            </tr>
        `).join('');
    },

    showAddSupplierModal() {
        const content = `
            <form id="addSupplierForm">
                <div class="form-group">
                    <label class="required">Supplier Name</label>
                    <input type="text" id="supplierName" required>
                </div>
                <div class="form-group">
                    <label>Contact Person</label>
                    <input type="text" id="contactPerson">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Contact Phone</label>
                        <input type="text" id="contactPhone">
                    </div>
                    <div class="form-group">
                        <label>Contact Email</label>
                        <input type="email" id="contactEmail">
                    </div>
                </div>
                <div class="form-group">
                    <label>Payment Terms</label>
                    <input type="text" id="paymentTerms" placeholder="e.g., Net 30">
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
            <button class="btn btn-primary" onclick="InventoryAdvanced.addSupplier()">Save Supplier</button>
        `;

        App.showModal('Add Supplier', content, footer);
    },

    showEditSupplierModal(supplierId) {
        const suppliers = JSON.parse(localStorage.getItem('inventory_suppliers')) || [];
        const supplier = suppliers.find(s => s.supplier_id === supplierId);
        
        if (!supplier) {
            App.showError('Supplier not found');
            return;
        }

        const content = `
            <form id="editSupplierForm">
                <div class="form-group">
                    <label class="required">Supplier Name</label>
                    <input type="text" id="supplierName" value="${supplier.supplier_name}" required>
                </div>
                <div class="form-group">
                    <label>Contact Person</label>
                    <input type="text" id="contactPerson" value="${supplier.contact_person || ''}">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Contact Phone</label>
                        <input type="text" id="contactPhone" value="${supplier.contact_phone || ''}">
                    </div>
                    <div class="form-group">
                        <label>Contact Email</label>
                        <input type="email" id="contactEmail" value="${supplier.contact_email || ''}">
                    </div>
                </div>
                <div class="form-group">
                    <label>Payment Terms</label>
                    <input type="text" id="paymentTerms" value="${supplier.payment_terms || ''}">
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="isActive" ${supplier.is_active ? 'checked' : ''}> Active
                    </label>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="InventoryAdvanced.updateSupplier('${supplierId}')">Update Supplier</button>
        `;

        App.showModal('Edit Supplier', content, footer);
    },

    addSupplier() {
        const form = document.getElementById('addSupplierForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const suppliers = JSON.parse(localStorage.getItem('inventory_suppliers')) || [];

        const newSupplier = {
            supplier_id: 'supplier_' + Date.now(),
            supplier_name: document.getElementById('supplierName').value.trim(),
            contact_person: document.getElementById('contactPerson').value.trim() || null,
            contact_phone: document.getElementById('contactPhone').value.trim() || null,
            contact_email: document.getElementById('contactEmail').value.trim() || null,
            address: null,
            payment_terms: document.getElementById('paymentTerms').value.trim() || null,
            is_active: document.getElementById('isActive').checked,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        suppliers.push(newSupplier);
        localStorage.setItem('inventory_suppliers', JSON.stringify(suppliers));
        
        App.closeModal();
        App.showSuccess('Supplier added successfully');
        this.loadAdvancedInventoryPage(document.getElementById('contentArea'));
    },

    updateSupplier(supplierId) {
        const suppliers = JSON.parse(localStorage.getItem('inventory_suppliers')) || [];
        const supplierIndex = suppliers.findIndex(s => s.supplier_id === supplierId);
        
        if (supplierIndex === -1) {
            App.showError('Supplier not found');
            return;
        }

        suppliers[supplierIndex].supplier_name = document.getElementById('supplierName').value.trim();
        suppliers[supplierIndex].contact_person = document.getElementById('contactPerson').value.trim() || null;
        suppliers[supplierIndex].contact_phone = document.getElementById('contactPhone').value.trim() || null;
        suppliers[supplierIndex].contact_email = document.getElementById('contactEmail').value.trim() || null;
        suppliers[supplierIndex].payment_terms = document.getElementById('paymentTerms').value.trim() || null;
        suppliers[supplierIndex].is_active = document.getElementById('isActive').checked;
        suppliers[supplierIndex].updated_at = new Date().toISOString();

        localStorage.setItem('inventory_suppliers', JSON.stringify(suppliers));
        
        App.closeModal();
        App.showSuccess('Supplier updated successfully');
        this.loadAdvancedInventoryPage(document.getElementById('contentArea'));
    },

    deleteSupplier(supplierId) {
        if (!confirm('Delete this supplier?')) {
            return;
        }

        const suppliers = JSON.parse(localStorage.getItem('inventory_suppliers')) || [];
        const filtered = suppliers.filter(s => s.supplier_id !== supplierId);
        localStorage.setItem('inventory_suppliers', JSON.stringify(filtered));
        
        App.showSuccess('Supplier deleted successfully');
        this.loadAdvancedInventoryPage(document.getElementById('contentArea'));
    },

    // ========== PURCHASE ORDERS ==========
    renderOrdersTab() {
        const orders = JSON.parse(localStorage.getItem('inventory_orders')) || [];
        const suppliers = JSON.parse(localStorage.getItem('inventory_suppliers')) || [];
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const facilities = JSON.parse(localStorage.getItem('facilities')) || [];
        
        return `
            <div class="patient-list-header">
                <div>
                    <h2>Purchase Orders</h2>
                    <p>Manage medication purchase orders</p>
                </div>
                <button class="btn btn-primary" onclick="InventoryAdvanced.showAddOrderModal()">Create Order</button>
            </div>

            <div class="card mt-3">
                <div class="card-header">
                    <div class="search-filter-bar">
                        <select id="orderStatusFilter">
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="ordered">Ordered</option>
                            <option value="in_transit">In Transit</option>
                            <option value="received">Received</option>
                        </select>
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Order Date</th>
                                    <th>Supplier</th>
                                    <th>Facility</th>
                                    <th>Total Cost</th>
                                    <th>Status</th>
                                    <th>Expected Delivery</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="ordersTableBody">
                                ${this.renderOrdersTable(orders, suppliers, users, facilities)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },

    renderOrdersTable(orders, suppliers, users, facilities) {
        if (orders.length === 0) {
            return '<tr><td colspan="7" class="text-center text-muted">No purchase orders found</td></tr>';
        }

        return orders.map(order => {
            const supplier = suppliers.find(s => s.supplier_id === order.supplier_id);
            const facility = facilities.find(f => f.id === order.facility_id);
            
            return `
                <tr>
                    <td>${new Date(order.order_date).toLocaleDateString()}</td>
                    <td>${supplier ? supplier.supplier_name : 'Unknown'}</td>
                    <td>${facility ? facility.name : 'N/A'}</td>
                    <td>₱${order.total_cost ? parseFloat(order.total_cost).toFixed(2) : '0.00'}</td>
                    <td><span class="badge badge-${order.status === 'received' ? 'success' : order.status === 'in_transit' ? 'primary' : 'warning'}">${order.status.replace('_', ' ')}</span></td>
                    <td>${order.expected_delivery_date ? new Date(order.expected_delivery_date).toLocaleDateString() : '-'}</td>
                    <td>
                        <div class="table-actions">
                            <button class="btn btn-sm btn-outline" onclick="InventoryAdvanced.viewOrder('${order.order_id}')">View</button>
                            ${order.status === 'ordered' || order.status === 'in_transit' ? `<button class="btn btn-sm btn-primary" onclick="InventoryAdvanced.receiveOrder('${order.order_id}')">Receive</button>` : ''}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    },

    showAddOrderModal() {
        const suppliers = JSON.parse(localStorage.getItem('inventory_suppliers')) || [];
        const facilities = JSON.parse(localStorage.getItem('facilities')) || [];
        const medications = JSON.parse(localStorage.getItem('medications')) || [];
        const currentUser = Auth.getCurrentUser();

        const content = `
            <form id="addOrderForm">
                <div class="form-row">
                    <div class="form-group">
                        <label class="required">Supplier</label>
                        <select id="supplierId" required>
                            <option value="">Select Supplier</option>
                            ${suppliers.filter(s => s.is_active).map(s => `<option value="${s.supplier_id}">${s.supplier_name}</option>`).join('')}
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
                        <label>Order Date</label>
                        <input type="date" id="orderDate" value="${new Date().toISOString().split('T')[0]}">
                    </div>
                    <div class="form-group">
                        <label>Expected Delivery Date</label>
                        <input type="date" id="expectedDelivery">
                    </div>
                </div>
                <div class="form-group">
                    <label>Order Items</label>
                    <div id="orderItems">
                        <div class="order-item mb-2">
                            <div class="form-row">
                                <div class="form-group" style="flex: 2;">
                                    <select class="medication-select">
                                        <option value="">Select Medication</option>
                                        ${medications.map(m => `<option value="${m.id}">${m.name}</option>`).join('')}
                                    </select>
                                </div>
                                <div class="form-group">
                                    <input type="number" class="quantity-input" placeholder="Qty" min="1">
                                </div>
                                <div class="form-group">
                                    <input type="number" class="unit-cost-input" placeholder="Unit Cost" step="0.01">
                                </div>
                                <div class="form-group">
                                    <button type="button" class="btn btn-sm btn-danger" onclick="this.closest('.order-item').remove()">Remove</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button type="button" class="btn btn-sm btn-outline" onclick="InventoryAdvanced.addOrderItem()">Add Item</button>
                </div>
                <div class="form-group">
                    <label>Notes</label>
                    <textarea id="notes" rows="2"></textarea>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="InventoryAdvanced.createOrder()">Create Order</button>
        `;

        App.showModal('Create Purchase Order', content, footer);
    },

    addOrderItem() {
        const medications = JSON.parse(localStorage.getItem('medications')) || [];
        const itemsContainer = document.getElementById('orderItems');
        
        const newItem = document.createElement('div');
        newItem.className = 'order-item mb-2';
        newItem.innerHTML = `
            <div class="form-row">
                <div class="form-group" style="flex: 2;">
                    <select class="medication-select">
                        <option value="">Select Medication</option>
                        ${medications.map(m => `<option value="${m.id}">${m.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <input type="number" class="quantity-input" placeholder="Qty" min="1">
                </div>
                <div class="form-group">
                    <input type="number" class="unit-cost-input" placeholder="Unit Cost" step="0.01">
                </div>
                <div class="form-group">
                    <button type="button" class="btn btn-sm btn-danger" onclick="this.closest('.order-item').remove()">Remove</button>
                </div>
            </div>
        `;
        
        itemsContainer.appendChild(newItem);
    },

    createOrder() {
        const form = document.getElementById('addOrderForm');
        const supplierId = document.getElementById('supplierId').value;
        const facilityId = document.getElementById('facilityId').value;
        
        if (!supplierId || !facilityId) {
            App.showError('Please select supplier and facility');
            return;
        }

        const orderItems = Array.from(document.querySelectorAll('.order-item')).map(item => {
            const medicationSelect = item.querySelector('.medication-select');
            const quantityInput = item.querySelector('.quantity-input');
            const unitCostInput = item.querySelector('.unit-cost-input');
            
            return {
                medication_id: medicationSelect.value,
                quantity_ordered: parseInt(quantityInput.value) || 0,
                unit_cost: parseFloat(unitCostInput.value) || 0
            };
        }).filter(item => item.medication_id && item.quantity_ordered > 0);

        if (orderItems.length === 0) {
            App.showError('Please add at least one order item');
            return;
        }

        const orders = JSON.parse(localStorage.getItem('inventory_orders')) || [];
        const orderItemsData = JSON.parse(localStorage.getItem('inventory_order_items')) || [];
        const currentUser = Auth.getCurrentUser();
        const expectedDelivery = document.getElementById('expectedDelivery').value;
        const totalCost = orderItems.reduce((sum, item) => sum + (item.quantity_ordered * item.unit_cost), 0);

        const newOrder = {
            order_id: 'inv_order_' + Date.now(),
            facility_id: parseInt(facilityId),
            supplier_id: supplierId,
            order_date: document.getElementById('orderDate').value || new Date().toISOString().split('T')[0],
            expected_delivery_date: expectedDelivery || null,
            status: 'pending',
            total_cost: totalCost,
            ordered_by: currentUser.userId,
            received_by: null,
            received_at: null,
            notes: document.getElementById('notes').value.trim() || null,
            created_at: new Date().toISOString()
        };

        orders.push(newOrder);
        localStorage.setItem('inventory_orders', JSON.stringify(orders));

        // Add order items
        orderItems.forEach(item => {
            const newOrderItem = {
                order_item_id: 'item_' + Date.now(),
                order_id: newOrder.order_id,
                medication_id: item.medication_id,
                quantity_ordered: item.quantity_ordered,
                quantity_received: 0,
                unit_cost: item.unit_cost,
                batch_number: null,
                expiry_date: null,
                status: 'pending'
            };
            orderItemsData.push(newOrderItem);
        });

        localStorage.setItem('inventory_order_items', JSON.stringify(orderItemsData));
        
        App.closeModal();
        App.showSuccess('Purchase order created successfully');
        this.loadAdvancedInventoryPage(document.getElementById('contentArea'));
    },

    viewOrder(orderId) {
        const orders = JSON.parse(localStorage.getItem('inventory_orders')) || [];
        const order = orders.find(o => o.order_id === orderId);
        
        if (!order) {
            App.showError('Order not found');
            return;
        }

        const orderItems = JSON.parse(localStorage.getItem('inventory_order_items')) || [];
        const items = orderItems.filter(i => i.order_id === orderId);
        const medications = JSON.parse(localStorage.getItem('medications')) || [];
        const suppliers = JSON.parse(localStorage.getItem('inventory_suppliers')) || [];
        const facilities = JSON.parse(localStorage.getItem('facilities')) || [];
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        const supplier = suppliers.find(s => s.supplier_id === order.supplier_id);
        const facility = facilities.find(f => f.id === order.facility_id);
        const orderedBy = users.find(u => u.id === order.ordered_by);
        const receivedBy = order.received_by ? users.find(u => u.id === order.received_by) : null;

        const content = `
            <div class="form-row">
                <div class="form-group">
                    <label>Supplier</label>
                    <input type="text" value="${supplier ? supplier.supplier_name : 'Unknown'}" readonly>
                </div>
                <div class="form-group">
                    <label>Facility</label>
                    <input type="text" value="${facility ? facility.name : 'N/A'}" readonly>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Order Date</label>
                    <input type="text" value="${new Date(order.order_date).toLocaleDateString()}" readonly>
                </div>
                <div class="form-group">
                    <label>Status</label>
                    <input type="text" value="${order.status.replace('_', ' ')}" readonly>
                </div>
            </div>
            <div class="form-group">
                <label>Total Cost</label>
                <input type="text" value="₱${order.total_cost ? parseFloat(order.total_cost).toFixed(2) : '0.00'}" readonly>
            </div>
            <div class="form-group">
                <label>Order Items</label>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Medication</th>
                                <th>Quantity Ordered</th>
                                <th>Quantity Received</th>
                                <th>Unit Cost</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${items.map(item => {
                                const medication = medications.find(m => m.medication_id === item.medication_id);
                                return `
                                    <tr>
                                        <td>${medication ? medication.name : 'Unknown'}</td>
                                        <td>${item.quantity_ordered}</td>
                                        <td>${item.quantity_received}</td>
                                        <td>₱${item.unit_cost ? parseFloat(item.unit_cost).toFixed(2) : '0.00'}</td>
                                        <td><span class="badge badge-info">${item.status}</span></td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        App.showModal('Purchase Order Details', content, '');
    },

    receiveOrder(orderId) {
        const orders = JSON.parse(localStorage.getItem('inventory_orders')) || [];
        const order = orders.find(o => o.order_id === orderId);
        
        if (!order) {
            App.showError('Order not found');
            return;
        }

        const orderItems = JSON.parse(localStorage.getItem('inventory_order_items')) || [];
        const items = orderItems.filter(i => i.order_id === orderId);
        const medications = JSON.parse(localStorage.getItem('medications')) || [];
        const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
        const currentUser = Auth.getCurrentUser();

        const content = `
            <form id="receiveOrderForm">
                <div class="form-group">
                    <label>Order Items</label>
                    <div id="receiveItems">
                        ${items.map(item => {
                            const medication = medications.find(m => m.medication_id === item.medication_id);
                            return `
                                <div class="order-item mb-2 p-2" style="border: 1px solid #ddd; border-radius: 4px;">
                                    <strong>${medication ? medication.name : 'Unknown'}</strong>
                                    <div class="form-row mt-2">
                                        <div class="form-group">
                                            <label>Quantity Received</label>
                                            <input type="number" class="quantity-received" value="${item.quantity_ordered}" min="0" max="${item.quantity_ordered}">
                                        </div>
                                        <div class="form-group">
                                            <label>Batch Number</label>
                                            <input type="text" class="batch-number" placeholder="Batch #">
                                        </div>
                                        <div class="form-group">
                                            <label>Expiry Date</label>
                                            <input type="date" class="expiry-date">
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="InventoryAdvanced.saveOrderReceipt('${orderId}')">Receive Order</button>
        `;

        App.showModal('Receive Purchase Order', content, footer);
    },

    saveOrderReceipt(orderId) {
        const orders = JSON.parse(localStorage.getItem('inventory_orders')) || [];
        const order = orders.find(o => o.order_id === orderId);
        const orderItems = JSON.parse(localStorage.getItem('inventory_order_items')) || [];
        const items = orderItems.filter(i => i.order_id === orderId);
        const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
        const inventoryTransactions = JSON.parse(localStorage.getItem('inventory_transactions')) || [];
        const currentUser = Auth.getCurrentUser();

        // Update order items with received quantities
        const receiveItems = document.querySelectorAll('.order-item');
        let allReceived = true;

        receiveItems.forEach((item, index) => {
            const quantityReceived = parseInt(item.querySelector('.quantity-received').value) || 0;
            const batchNumber = item.querySelector('.batch-number').value.trim() || null;
            const expiryDate = item.querySelector('.expiry-date').value || null;
            
            const itemIndex = orderItems.findIndex(i => i.order_item_id === items[index].order_item_id);
            if (itemIndex !== -1) {
                orderItems[itemIndex].quantity_received = quantityReceived;
                orderItems[itemIndex].batch_number = batchNumber;
                orderItems[itemIndex].expiry_date = expiryDate;
                orderItems[itemIndex].status = quantityReceived === items[index].quantity_ordered ? 'received' : 'partial';
                
                if (quantityReceived < items[index].quantity_ordered) {
                    allReceived = false;
                }

                // Update inventory
                const inv = inventory.find(inv => inv.medicationId === items[index].medication_id && inv.facilityId === order.facility_id);
                if (inv) {
                    const beforeQty = inv.quantityOnHand || 0;
                    inv.quantityOnHand = (inv.quantityOnHand || 0) + quantityReceived;
                    inv.lastRestocked = new Date().toISOString().split('T')[0];
                    
                    // Create transaction
                    const transaction = {
                        transaction_id: 'trans_' + Date.now(),
                        inventory_id: inv.id,
                        transaction_type: 'restock',
                        quantity_change: quantityReceived,
                        quantity_before: beforeQty,
                        quantity_after: inv.quantityOnHand,
                        batch_number: batchNumber,
                        transaction_reason: 'Purchase order receipt',
                        performed_by: currentUser.userId,
                        facility_id: order.facility_id,
                        transaction_date: new Date().toISOString().split('T')[0],
                        reference_id: orderId,
                        reference_type: 'order',
                        notes: null,
                        created_at: new Date().toISOString()
                    };
                    inventoryTransactions.push(transaction);
                }
            }
        });

        // Update order status
        const orderIndex = orders.findIndex(o => o.order_id === orderId);
        if (orderIndex !== -1) {
            orders[orderIndex].status = allReceived ? 'received' : 'partial';
            orders[orderIndex].received_by = currentUser.userId;
            orders[orderIndex].received_at = new Date().toISOString();
        }

        localStorage.setItem('inventory_orders', JSON.stringify(orders));
        localStorage.setItem('inventory_order_items', JSON.stringify(orderItems));
        localStorage.setItem('inventory', JSON.stringify(inventory));
        localStorage.setItem('inventory_transactions', JSON.stringify(inventoryTransactions));
        
        App.closeModal();
        App.showSuccess('Order received successfully');
        this.loadAdvancedInventoryPage(document.getElementById('contentArea'));
    }
};

