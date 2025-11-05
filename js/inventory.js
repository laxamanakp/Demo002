// ============================================================
// MyHubCares - Inventory Management CRUD
// ============================================================

const Inventory = {
    // Load inventory page
    loadInventoryPage(container) {
        const role = Auth.getCurrentUser().role;
        
        if (!Auth.permissions.canViewInventory(role)) {
            container.innerHTML = '<div class="alert alert-danger">Access denied</div>';
            return;
        }

        const inventory = JSON.parse(localStorage.getItem('inventory')) || [];

        let html = `
            <div class="inventory-header">
                <div>
                    <h2>Inventory Management</h2>
                    <p>Manage medication stock and supplies</p>
                </div>
                ${Auth.permissions.canManageInventory(role) ? 
                    '<button class="btn btn-primary" onclick="Inventory.showAddItemModal()">Add New Item</button>' :
                    ''}
            </div>

            <div class="card mt-3">
                <div class="card-header">
                    <div class="search-filter-bar">
                        <div class="search-bar">
                            <input type="text" id="inventorySearch" class="search-input" placeholder="Search inventory...">
                        </div>
                        <select id="inventoryFilter">
                            <option value="all">All Items</option>
                            <option value="low">Low Stock</option>
                            <option value="expiring">Expiring Soon</option>
                        </select>
                    </div>
                </div>
                <div class="card-body">
                    <div class="inventory-grid" id="inventoryGrid">
                        ${this.renderInventoryGrid(inventory, role)}
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;

        // Setup search and filter
        document.getElementById('inventorySearch').addEventListener('input', (e) => {
            this.filterInventory(e.target.value);
        });

        document.getElementById('inventoryFilter').addEventListener('change', (e) => {
            this.applyFilter(e.target.value);
        });
    },

    // Render inventory grid
    renderInventoryGrid(inventory, role) {
        if (inventory.length === 0) {
            return '<p class="text-muted">No inventory items found</p>';
        }

        return inventory.map(item => {
            const isLowStock = item.stockQuantity <= item.reorderLevel;
            const expiryDate = new Date(item.expiryDate);
            const monthsUntilExpiry = (expiryDate - new Date()) / (1000 * 60 * 60 * 24 * 30);
            const isExpiringSoon = monthsUntilExpiry < 3;

            return `
                <div class="inventory-item" data-id="${item.id}">
                    <div class="inventory-item-header">
                        <h3>${item.drugName}</h3>
                        ${isLowStock ? '<span class="badge badge-danger">Low Stock</span>' : ''}
                        ${isExpiringSoon ? '<span class="badge badge-warning">Expiring Soon</span>' : ''}
                    </div>
                    <div class="inventory-stock ${isLowStock ? 'low' : ''}">
                        ${item.stockQuantity} ${item.unit}
                    </div>
                    <div class="inventory-info">
                        <strong>Reorder Level:</strong> ${item.reorderLevel} ${item.unit}
                    </div>
                    <div class="inventory-info">
                        <strong>Expiry:</strong> ${expiryDate.toLocaleDateString()}
                    </div>
                    <div class="inventory-info">
                        <strong>Supplier:</strong> ${item.supplier}
                    </div>
                    ${Auth.permissions.canManageInventory(role) ? `
                        <div class="inventory-actions">
                            <button class="btn btn-sm btn-primary" onclick="Inventory.showEditItemModal(${item.id})">
                                Edit
                            </button>
                            <button class="btn btn-sm btn-success" onclick="Inventory.showRestockModal(${item.id})">
                                Restock
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="Inventory.deleteItem(${item.id})">
                                Delete
                            </button>
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
    },

    // Filter inventory by search term
    filterInventory(searchTerm) {
        const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
        const filtered = inventory.filter(item => 
            item.drugName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        const role = Auth.getCurrentUser().role;
        document.getElementById('inventoryGrid').innerHTML = this.renderInventoryGrid(filtered, role);
    },

    // Apply filter to inventory
    applyFilter(filterType) {
        let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
        
        if (filterType === 'low') {
            inventory = inventory.filter(item => item.stockQuantity <= item.reorderLevel);
        } else if (filterType === 'expiring') {
            inventory = inventory.filter(item => {
                const expiryDate = new Date(item.expiryDate);
                const monthsUntilExpiry = (expiryDate - new Date()) / (1000 * 60 * 60 * 24 * 30);
                return monthsUntilExpiry < 3;
            });
        }

        const role = Auth.getCurrentUser().role;
        document.getElementById('inventoryGrid').innerHTML = this.renderInventoryGrid(inventory, role);
    },

    // Show add item modal
    showAddItemModal() {
        const content = `
            <form id="addInventoryForm">
                <div class="form-group">
                    <label class="required">Drug Name</label>
                    <input type="text" id="drugName" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="required">Stock Quantity</label>
                        <input type="number" id="stockQuantity" required min="0">
                    </div>
                    <div class="form-group">
                        <label class="required">Unit</label>
                        <select id="unit" required>
                            <option value="tablets">Tablets</option>
                            <option value="capsules">Capsules</option>
                            <option value="bottles">Bottles</option>
                            <option value="vials">Vials</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="required">Expiry Date</label>
                        <input type="date" id="expiryDate" required>
                    </div>
                    <div class="form-group">
                        <label class="required">Reorder Level</label>
                        <input type="number" id="reorderLevel" required min="0">
                    </div>
                </div>
                <div class="form-group">
                    <label class="required">Supplier</label>
                    <input type="text" id="supplier" required>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="Inventory.addItem()">Add Item</button>
        `;

        App.showModal('Add Inventory Item', content, footer);
    },

    // Add inventory item
    addItem() {
        const form = document.getElementById('addInventoryForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
        const newItem = {
            id: inventory.length > 0 ? Math.max(...inventory.map(i => i.id)) + 1 : 1,
            drugName: document.getElementById('drugName').value,
            stockQuantity: parseInt(document.getElementById('stockQuantity').value),
            unit: document.getElementById('unit').value,
            expiryDate: document.getElementById('expiryDate').value,
            reorderLevel: parseInt(document.getElementById('reorderLevel').value),
            supplier: document.getElementById('supplier').value,
            lastRestocked: new Date().toISOString().split('T')[0]
        };

        inventory.push(newItem);
        localStorage.setItem('inventory', JSON.stringify(inventory));

        App.closeModal();
        App.showSuccess('Inventory item added successfully');
        App.loadPage('inventory');
    },

    // Show edit item modal
    showEditItemModal(itemId) {
        const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
        const item = inventory.find(i => i.id === itemId);

        if (!item) {
            App.showError('Item not found');
            return;
        }

        const content = `
            <form id="editInventoryForm">
                <input type="hidden" id="itemId" value="${item.id}">
                <div class="form-group">
                    <label class="required">Drug Name</label>
                    <input type="text" id="drugName" value="${item.drugName}" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="required">Stock Quantity</label>
                        <input type="number" id="stockQuantity" value="${item.stockQuantity}" required min="0">
                    </div>
                    <div class="form-group">
                        <label class="required">Unit</label>
                        <select id="unit" required>
                            <option value="tablets" ${item.unit === 'tablets' ? 'selected' : ''}>Tablets</option>
                            <option value="capsules" ${item.unit === 'capsules' ? 'selected' : ''}>Capsules</option>
                            <option value="bottles" ${item.unit === 'bottles' ? 'selected' : ''}>Bottles</option>
                            <option value="vials" ${item.unit === 'vials' ? 'selected' : ''}>Vials</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="required">Expiry Date</label>
                        <input type="date" id="expiryDate" value="${item.expiryDate}" required>
                    </div>
                    <div class="form-group">
                        <label class="required">Reorder Level</label>
                        <input type="number" id="reorderLevel" value="${item.reorderLevel}" required min="0">
                    </div>
                </div>
                <div class="form-group">
                    <label class="required">Supplier</label>
                    <input type="text" id="supplier" value="${item.supplier}" required>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="Inventory.updateItem()">Update Item</button>
        `;

        App.showModal('Edit Inventory Item', content, footer);
    },

    // Update inventory item
    updateItem() {
        const form = document.getElementById('editInventoryForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const itemId = parseInt(document.getElementById('itemId').value);
        const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
        const index = inventory.findIndex(i => i.id === itemId);

        if (index === -1) {
            App.showError('Item not found');
            return;
        }

        inventory[index] = {
            ...inventory[index],
            drugName: document.getElementById('drugName').value,
            stockQuantity: parseInt(document.getElementById('stockQuantity').value),
            unit: document.getElementById('unit').value,
            expiryDate: document.getElementById('expiryDate').value,
            reorderLevel: parseInt(document.getElementById('reorderLevel').value),
            supplier: document.getElementById('supplier').value
        };

        localStorage.setItem('inventory', JSON.stringify(inventory));

        App.closeModal();
        App.showSuccess('Inventory item updated successfully');
        App.loadPage('inventory');
    },

    // Show restock modal
    showRestockModal(itemId) {
        const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
        const item = inventory.find(i => i.id === itemId);

        if (!item) {
            App.showError('Item not found');
            return;
        }

        const content = `
            <form id="restockForm">
                <input type="hidden" id="itemId" value="${item.id}">
                <div class="form-group">
                    <label>Drug Name</label>
                    <input type="text" value="${item.drugName}" readonly>
                </div>
                <div class="form-group">
                    <label>Current Stock</label>
                    <input type="text" value="${item.stockQuantity} ${item.unit}" readonly>
                </div>
                <div class="form-group">
                    <label class="required">Quantity to Add</label>
                    <input type="number" id="restockQuantity" required min="1">
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="Inventory.restockItem()">Restock</button>
        `;

        App.showModal('Restock Item', content, footer);
    },

    // Restock inventory item
    restockItem() {
        const form = document.getElementById('restockForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const itemId = parseInt(document.getElementById('itemId').value);
        const quantity = parseInt(document.getElementById('restockQuantity').value);
        const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
        const index = inventory.findIndex(i => i.id === itemId);

        if (index === -1) {
            App.showError('Item not found');
            return;
        }

        inventory[index].stockQuantity += quantity;
        inventory[index].lastRestocked = new Date().toISOString().split('T')[0];

        localStorage.setItem('inventory', JSON.stringify(inventory));

        App.closeModal();
        App.showSuccess(`Successfully added ${quantity} units to inventory`);
        App.loadPage('inventory');
    },

    // Delete inventory item
    deleteItem(itemId) {
        if (!confirm('Are you sure you want to delete this item?')) {
            return;
        }

        let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
        inventory = inventory.filter(i => i.id !== itemId);
        localStorage.setItem('inventory', JSON.stringify(inventory));

        App.showSuccess('Inventory item deleted successfully');
        App.loadPage('inventory');
    }
};

