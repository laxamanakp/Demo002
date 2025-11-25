// ============================================================
// MyHubCares - Medication Refill Request & Approval Workflow
// ============================================================
// This module handles the patient medication refill request flow
// with Case Manager approval process.
// ============================================================

const RefillRequests = {
    // Status constants
    STATUS: {
        PENDING: 'pending',
        APPROVED: 'approved',
        DECLINED: 'declined',
        CANCELLED: 'cancelled',
        READY: 'ready',
        DISPENSED: 'dispensed'
    },

    // ========== PAGE LOADERS ==========

    // Load Refill Requests Page (Case Manager / Admin view)
    loadRequestsPage(container) {
        const role = Auth.getCurrentUser().role;
        
        if (!this.canReviewRequests(role)) {
            container.innerHTML = '<div class="alert alert-danger">Access denied. Only Case Managers and Admins can review refill requests.</div>';
            return;
        }

        const requests = this.getAllRequests();
        const pendingCount = requests.filter(r => r.status === this.STATUS.PENDING).length;

        let html = `
            <div class="patient-list-header">
                <div>
                    <h2>💊 Medication Refill Requests</h2>
                    <p>Review and manage patient medication refill requests</p>
                </div>
                <div class="d-flex gap-2">
                    <span class="badge badge-warning" style="font-size: 1rem; padding: 0.5rem 1rem;">
                        ${pendingCount} Pending
                    </span>
                </div>
            </div>

            <div class="card mt-3">
                <div class="card-header">
                    <div class="search-filter-bar">
                        <input type="text" id="refillSearch" placeholder="Search by patient name..." class="search-input">
                        <select id="refillStatusFilter" onchange="RefillRequests.filterByStatus(this.value)">
                            <option value="all">All Status</option>
                            <option value="pending" selected>Pending</option>
                            <option value="approved">Approved</option>
                            <option value="ready">Ready for Pickup</option>
                            <option value="dispensed">Dispensed</option>
                            <option value="declined">Declined</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>
                <div class="card-body">
                    <div id="refillRequestsList">
                        ${this.renderRequestsList(requests.filter(r => r.status === this.STATUS.PENDING))}
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;

        // Setup search
        const searchInput = document.getElementById('refillSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterRequests(e.target.value);
            });
        }
    },

    // Load Patient's Own Refill Requests Page
    loadMyRefillsPage(container) {
        const currentUser = Auth.getCurrentUser();
        const patientId = currentUser.patientId || currentUser.userId;
        const requests = this.getRequestsByPatient(patientId);

        let html = `
            <div class="patient-list-header">
                <div>
                    <h2>💊 My Refill Requests</h2>
                    <p>Track the status of your medication refill requests</p>
                </div>
                <button class="btn btn-primary" onclick="RefillRequests.showRequestModal()">
                    ➕ Request Refill
                </button>
            </div>

            <div class="card mt-3">
                <div class="card-body">
                    ${requests.length > 0 ? this.renderPatientRequestsList(requests) : 
                        '<p class="text-muted text-center py-4">No refill requests yet. Click "Request Refill" to get started.</p>'}
                </div>
            </div>
        `;

        container.innerHTML = html;
    },

    // ========== RENDER FUNCTIONS ==========

    // Render requests list for Treatment Partner (Case Manager)
    renderRequestsList(requests) {
        if (requests.length === 0) {
            return '<p class="text-muted text-center py-4">No refill requests found.</p>';
        }

        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const facilities = JSON.parse(localStorage.getItem('facilities')) || [];
        const prescriptions = JSON.parse(localStorage.getItem('prescriptions')) || [];

        // Sort: newest on top (per requirements)
        const sortedRequests = [...requests].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        return sortedRequests.map(req => {
            const patient = patients.find(p => p.id === req.patient_id);
            const facility = facilities.find(f => f.id === req.pickup_facility_id);
            const prescription = prescriptions.find(p => p.id === req.prescription_id);
            
            // Calculate patient info
            const adherenceInfo = this.getPatientAdherenceInfo(req.patient_id);
            const lastPickup = this.getLastPickupDate(req.patient_id, req.medication_name);

            let statusBadge = this.getStatusBadge(req.status);
            let actionButtons = '';

            if (req.status === this.STATUS.PENDING) {
                actionButtons = `
                    <button class="btn btn-sm btn-success" onclick="RefillRequests.showApproveModal('${req.request_id}')">
                        ✅ Approve
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="RefillRequests.showDeclineModal('${req.request_id}')">
                        ❌ Decline
                    </button>
                `;
            } else if (req.status === this.STATUS.APPROVED || req.status === this.STATUS.READY) {
                actionButtons = `
                    <button class="btn btn-sm btn-primary" onclick="RefillRequests.markAsDispensed('${req.request_id}')">
                        📦 Mark Dispensed
                    </button>
                `;
            }

            // Pill status badge
            let pillStatusBadge = '';
            if (req.pill_status) {
                const pillStatusColors = {
                    'kulang': 'danger',
                    'sakto': 'success',
                    'sobra': 'warning'
                };
                const pillStatusLabels = {
                    'kulang': '📉 KULANG',
                    'sakto': '✅ SAKTO',
                    'sobra': '📈 SOBRA'
                };
                pillStatusBadge = `<span class="badge badge-${pillStatusColors[req.pill_status] || 'secondary'}">${pillStatusLabels[req.pill_status] || req.pill_status}</span>`;
            }

            // Eligibility badge
            let eligibilityBadge = '';
            if (req.remaining_pill_count !== undefined) {
                if (req.is_eligible_for_refill) {
                    eligibilityBadge = '<span class="badge badge-success">✅ Eligible (≤10 pills)</span>';
                } else {
                    eligibilityBadge = '<span class="badge badge-warning">⚠️ Early Request</span>';
                }
            }

            return `
                <div class="patient-card request-card" data-status="${req.status}" data-patient="${patient ? (patient.firstName + ' ' + patient.lastName).toLowerCase() : ''}" style="${req.pill_status === 'kulang' ? 'border-left: 4px solid var(--danger-color);' : ''}">
                    <div class="patient-info">
                        <div>
                            <div class="d-flex align-center gap-2 mb-1">
                                <h3>${patient ? patient.firstName + ' ' + patient.lastName : 'Unknown Patient'}</h3>
                                ${statusBadge}
                                ${pillStatusBadge}
                            </div>
                            <div class="patient-meta">
                                <span>💊 ${req.medication_name}</span>
                                <span>📦 ${req.quantity_requested} ${req.unit || 'tablets'}</span>
                            </div>
                            <div class="patient-meta mt-1">
                                <span>📅 Pickup: ${new Date(req.preferred_pickup_date).toLocaleDateString()}${req.preferred_pickup_time ? ' @ ' + req.preferred_pickup_time : ''}</span>
                                <span>🏥 ${facility ? facility.name : 'N/A'}</span>
                            </div>
                            
                            <div class="mt-2 p-2" style="background: var(--bg-secondary); border-radius: var(--border-radius-sm);">
                                <strong>📊 Pill Count & Eligibility:</strong>
                                <div class="patient-meta mt-1">
                                    <span>🔢 Remaining: <strong>${req.remaining_pill_count !== undefined ? req.remaining_pill_count + ' pills' : 'Not reported'}</strong></span>
                                    ${eligibilityBadge}
                                </div>
                                ${req.pill_status === 'kulang' && req.kulang_explanation ? `
                                    <div class="mt-1" style="color: var(--danger-color);">
                                        <strong>⚠️ Kulang Reason:</strong> ${req.kulang_explanation}
                                    </div>
                                ` : ''}
                                <div class="patient-meta mt-1">
                                    <span>Last Pickup: ${lastPickup}</span>
                                    <span>Adherence: ${adherenceInfo.rate}% ${adherenceInfo.rate >= 80 ? '✓' : '⚠️'}</span>
                                </div>
                                <div class="patient-meta">
                                    <span>Rx Valid: ${prescription ? (new Date(prescription.nextRefill) > new Date() ? '✓ Yes' : '⚠️ Check') : 'N/A'}</span>
                                </div>
                            </div>

                            ${req.patient_notes ? `<p class="mt-2 text-muted"><em>"${req.patient_notes}"</em></p>` : ''}
                            <p class="text-muted mt-1" style="font-size: 0.85rem;">
                                Submitted: ${new Date(req.created_at).toLocaleString()}
                            </p>
                        </div>
                    </div>
                    <div class="patient-actions">
                        <button class="btn btn-sm btn-outline" onclick="Patients.viewPatient(${req.patient_id})">
                            👤 View Patient
                        </button>
                        ${actionButtons}
                    </div>
                </div>
            `;
        }).join('');
    },

    // Render patient's own requests list
    renderPatientRequestsList(requests) {
        const facilities = JSON.parse(localStorage.getItem('facilities')) || [];

        return requests.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map(req => {
            const facility = facilities.find(f => f.id === req.pickup_facility_id);

            let statusBadge = this.getStatusBadge(req.status);
            let statusMessage = '';
            let cancelButton = '';

            // Pill status info
            let pillStatusInfo = '';
            if (req.remaining_pill_count !== undefined) {
                const pillStatusLabels = {
                    'kulang': '📉 Insufficient',
                    'sakto': '✅ Correct',
                    'sobra': '📈 Excess'
                };
                pillStatusInfo = `
                    <div class="patient-meta mt-1">
                        <span>🔢 Reported: ${req.remaining_pill_count} pills remaining</span>
                        <span>${pillStatusLabels[req.pill_status] || ''}</span>
                    </div>
                `;
            }

            if (req.status === this.STATUS.PENDING) {
                statusMessage = '<p class="text-warning mt-2">⏳ Waiting for Treatment Partner approval...</p>';
                cancelButton = `
                    <button class="btn btn-sm btn-outline" onclick="RefillRequests.cancelRequest('${req.request_id}')">
                        Cancel Request
                    </button>
                `;
            } else if (req.status === this.STATUS.APPROVED || req.status === this.STATUS.READY) {
                statusMessage = `
                    <p class="text-success mt-2">✅ Approved! Ready for pickup.</p>
                    <p class="text-muted">📅 Pickup: ${new Date(req.ready_for_pickup_date || req.preferred_pickup_date).toLocaleDateString()}${req.preferred_pickup_time ? ' @ ' + req.preferred_pickup_time : ''}</p>
                    <p class="text-muted">🏥 Location: ${facility ? facility.name : 'N/A'}</p>
                `;
                if (req.review_notes) {
                    statusMessage += `<p class="text-muted"><em>Note: ${req.review_notes}</em></p>`;
                }
            } else if (req.status === this.STATUS.DISPENSED) {
                statusMessage = `<p class="text-success mt-2">📦 Dispensed on ${new Date(req.dispensed_at).toLocaleDateString()}</p>`;
            } else if (req.status === this.STATUS.DECLINED) {
                statusMessage = `<p class="text-danger mt-2">❌ Request was declined.</p>`;
                if (req.decline_reason) {
                    statusMessage += `<p class="text-muted"><em>Reason: ${req.decline_reason}</em></p>`;
                }
            }

            return `
                <div class="patient-card">
                    <div class="patient-info">
                        <div>
                            <div class="d-flex align-center gap-2 mb-1">
                                <strong>💊 ${req.medication_name}</strong>
                                ${statusBadge}
                            </div>
                            <div class="patient-meta">
                                <span>📦 ${req.quantity_requested} ${req.unit || 'tablets'}</span>
                                <span>📅 Requested: ${new Date(req.preferred_pickup_date).toLocaleDateString()}${req.preferred_pickup_time ? ' @ ' + req.preferred_pickup_time : ''}</span>
                            </div>
                            ${pillStatusInfo}
                            ${statusMessage}
                        </div>
                    </div>
                    <div class="patient-actions">
                        ${cancelButton}
                    </div>
                </div>
            `;
        }).join('');
    },

    // Get status badge HTML
    getStatusBadge(status) {
        const badges = {
            pending: '<span class="badge badge-warning">🟡 Pending</span>',
            approved: '<span class="badge badge-success">✅ Approved</span>',
            ready: '<span class="badge badge-info">📦 Ready for Pickup</span>',
            dispensed: '<span class="badge badge-success">✓ Dispensed</span>',
            declined: '<span class="badge badge-danger">❌ Declined</span>',
            cancelled: '<span class="badge badge-secondary">⚪ Cancelled</span>'
        };
        return badges[status] || '<span class="badge badge-secondary">Unknown</span>';
    },

    // ========== MODAL FUNCTIONS ==========

    // Pill status constants
    PILL_STATUS: {
        KULANG: 'kulang',      // Insufficient - less than expected
        SAKTO: 'sakto',        // Just right - matches expected
        SOBRA: 'sobra'         // Excess - more than expected
    },

    // Minimum pills for refill eligibility (per requirements: 10 pills or less)
    MIN_PILLS_FOR_REFILL: 10,

    // Show refill request modal (for patients)
    showRequestModal() {
        const currentUser = Auth.getCurrentUser();
        const patientId = currentUser.patientId || currentUser.userId;
        const facilities = JSON.parse(localStorage.getItem('facilities')) || [];
        
        // Get patient's active prescriptions/medications
        const medications = this.getPatientMedications(patientId);

        if (medications.length === 0) {
            App.showError('No active prescriptions found. Please contact your healthcare provider.');
            return;
        }

        // Get minimum booking date (tomorrow - no same-day per requirements)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const minDate = tomorrow.toISOString().split('T')[0];

        const content = `
            <form id="refillRequestForm">
                <input type="hidden" id="refillPatientId" value="${patientId}">
                
                <div class="alert alert-info">
                    ℹ️ <strong>Important:</strong> You can request a refill when you have <strong>10 pills or less</strong> remaining to ensure continuous medication intake.
                </div>
                
                <div class="form-group">
                    <label class="required">Select Medication to Refill</label>
                    <div id="medicationsList">
                        ${medications.map((med, index) => `
                            <div class="medication-option p-2 mb-2" style="border: 1px solid var(--border-color); border-radius: var(--border-radius-sm); cursor: pointer;" onclick="RefillRequests.selectMedication(${index})">
                                <input type="radio" name="selectedMed" id="med_${index}" value="${index}" ${index === 0 ? 'checked' : ''} style="margin-right: 10px;">
                                <label for="med_${index}" style="cursor: pointer; margin: 0; flex: 1;">
                                    <strong>${med.name}</strong><br>
                                    <span class="text-muted">Dosage: ${med.dosage} ${med.frequency}</span><br>
                                    <span class="text-muted">Daily Dose: ${med.pillsPerDay || 1} pill(s)/day</span>
                                    ${med.remaining !== null && med.remaining <= 10 ? '<span class="badge badge-success ml-2">✅ Eligible for Refill</span>' : ''}
                                    ${med.remaining !== null && med.remaining > 10 ? '<span class="badge badge-warning ml-2">⚠️ ' + med.remaining + ' pills remaining</span>' : ''}
                                </label>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="card mb-3" style="background: var(--bg-secondary);">
                    <div class="card-body">
                        <h4 class="mb-2">📊 Current Pill Count</h4>
                        <div class="form-group mb-2">
                            <label class="required">How many pills do you currently have remaining?</label>
                            <input type="number" id="remainingPillCount" min="0" max="999" required 
                                   placeholder="Enter your current pill count" 
                                   onchange="RefillRequests.validatePillCount()" 
                                   oninput="RefillRequests.validatePillCount()">
                            <small class="text-muted">Be accurate - this helps ensure continuous medication supply</small>
                        </div>
                        <div id="pillStatusDisplay" style="display: none;"></div>
                    </div>
                </div>

                <div id="kulangExplanationSection" style="display: none;">
                    <div class="form-group">
                        <label class="required" style="color: var(--danger-color);">⚠️ Why are your pills insufficient (kulang)?</label>
                        <select id="kulangReason" onchange="RefillRequests.toggleOtherKulangReason()">
                            <option value="">Select a reason</option>
                            <option value="missed_pickup">Missed previous pickup schedule</option>
                            <option value="lost_pills">Some pills were lost</option>
                            <option value="damaged_pills">Some pills were damaged</option>
                            <option value="shared_medication">Shared medication with family member</option>
                            <option value="dosage_changed">Doctor changed dosage</option>
                            <option value="other">Other (please explain)</option>
                        </select>
                    </div>
                    <div id="kulangOtherReasonGroup" class="form-group" style="display: none;">
                        <label class="required">Please explain</label>
                        <textarea id="kulangOtherReason" rows="2" placeholder="Explain why pills are insufficient..."></textarea>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label class="required">Quantity Requested</label>
                        <select id="refillQuantity" required>
                            <option value="30">30 tablets (30-day supply)</option>
                            <option value="60">60 tablets (60-day supply)</option>
                            <option value="90">90 tablets (90-day supply)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="required">Preferred Pickup Date</label>
                        <input type="date" id="refillPickupDate" required min="${minDate}">
                        <small class="text-muted">⚠️ Schedule in advance only</small>
                    </div>
                </div>

                <div class="form-group">
                    <label class="required">Preferred Pickup Time (Hourly)</label>
                    <select id="refillPickupTime" required>
                        <option value="">Select Time</option>
                        <option value="08:00">8:00 AM</option>
                        <option value="09:00">9:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="13:00">1:00 PM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="15:00">3:00 PM</option>
                        <option value="16:00">4:00 PM</option>
                        <option value="17:00">5:00 PM</option>
                    </select>
                    <small class="text-muted">Note: Refills do NOT involve doctor selection - processed by Treatment Partner</small>
                </div>

                <div class="form-group">
                    <label class="required">Pickup Location</label>
                    <select id="refillFacilityId" required>
                        <option value="">Select MyHubCares Branch</option>
                        ${facilities.map(f => `<option value="${f.id}">${f.name}</option>`).join('')}
                    </select>
                </div>

                <div class="form-group">
                    <label>Additional Notes (Optional)</label>
                    <textarea id="refillNotes" rows="2" placeholder="Any special requests or notes..."></textarea>
                </div>

                <div id="eligibilityWarning" class="alert alert-warning" style="display: none;">
                    ⚠️ <strong>Note:</strong> You have more than 10 pills remaining. Refill requests are typically processed when you have 10 or fewer pills to ensure continuous intake without penalty.
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="RefillRequests.submitRequest()">📤 Submit Request</button>
        `;

        App.showModal('💊 Request Medication Refill', content, footer);

        // Store medications data for form submission
        this._tempMedications = medications;
    },

    // Validate pill count and show status (kulang/sakto/sobra)
    validatePillCount() {
        const remainingPills = parseInt(document.getElementById('remainingPillCount').value) || 0;
        const selectedMedIndex = document.querySelector('input[name="selectedMed"]:checked')?.value;
        const medication = this._tempMedications ? this._tempMedications[selectedMedIndex] : null;
        
        const pillStatusDisplay = document.getElementById('pillStatusDisplay');
        const kulangSection = document.getElementById('kulangExplanationSection');
        const eligibilityWarning = document.getElementById('eligibilityWarning');
        
        if (!pillStatusDisplay) return;
        
        // Calculate expected remaining based on last pickup and daily dose
        const expectedRemaining = medication ? (medication.remaining || 0) : 0;
        const pillsPerDay = medication ? (medication.pillsPerDay || 1) : 1;
        
        // Determine pill status
        let status, statusClass, statusMessage;
        const tolerance = pillsPerDay * 2; // 2 days tolerance
        
        if (remainingPills < expectedRemaining - tolerance) {
            status = this.PILL_STATUS.KULANG;
            statusClass = 'danger';
            statusMessage = `<strong>📉 KULANG (Insufficient)</strong><br>
                            You have fewer pills than expected. Expected: ~${expectedRemaining}, Actual: ${remainingPills}<br>
                            <em>Please explain why below.</em>`;
            if (kulangSection) kulangSection.style.display = 'block';
        } else if (remainingPills > expectedRemaining + tolerance) {
            status = this.PILL_STATUS.SOBRA;
            statusClass = 'warning';
            statusMessage = `<strong>📈 SOBRA (Excess)</strong><br>
                            You have more pills than expected. This may indicate missed doses.<br>
                            Please ensure you're taking medication as prescribed.`;
            if (kulangSection) kulangSection.style.display = 'none';
        } else {
            status = this.PILL_STATUS.SAKTO;
            statusClass = 'success';
            statusMessage = `<strong>✅ SAKTO (Just Right)</strong><br>
                            Your pill count matches the expected amount. Good adherence!`;
            if (kulangSection) kulangSection.style.display = 'none';
        }

        // Show pill status
        pillStatusDisplay.style.display = 'block';
        pillStatusDisplay.innerHTML = `<div class="alert alert-${statusClass}">${statusMessage}</div>`;
        
        // Store status for submission
        this._currentPillStatus = status;
        
        // Show eligibility warning if more than 10 pills
        if (eligibilityWarning) {
            if (remainingPills > this.MIN_PILLS_FOR_REFILL) {
                eligibilityWarning.style.display = 'block';
            } else {
                eligibilityWarning.style.display = 'none';
            }
        }
        
        // Check eligibility (10 pills or less)
        return remainingPills <= this.MIN_PILLS_FOR_REFILL;
    },

    // Toggle other kulang reason field
    toggleOtherKulangReason() {
        const reason = document.getElementById('kulangReason').value;
        const otherGroup = document.getElementById('kulangOtherReasonGroup');
        if (otherGroup) {
            otherGroup.style.display = reason === 'other' ? 'block' : 'none';
        }
    },

    // Select medication helper
    selectMedication(index) {
        document.getElementById(`med_${index}`).checked = true;
    },

    // Get patient's active medications
    getPatientMedications(patientId) {
        const prescriptions = JSON.parse(localStorage.getItem('prescriptions')) || [];
        const artRegimens = JSON.parse(localStorage.getItem('artRegimens')) || [];
        const reminders = JSON.parse(localStorage.getItem('reminders')) || [];

        const medications = [];

        // Get from prescriptions
        prescriptions.filter(p => p.patientId === patientId).forEach(rx => {
            if (rx.drugs && rx.drugs.length > 0) {
                rx.drugs.forEach(drug => {
                    // Calculate pills per day from frequency
                    let pillsPerDay = 1;
                    if (drug.frequency) {
                        if (drug.frequency.toLowerCase().includes('twice') || drug.frequency.toLowerCase().includes('bid') || drug.frequency.includes('2x')) {
                            pillsPerDay = 2;
                        } else if (drug.frequency.toLowerCase().includes('three') || drug.frequency.toLowerCase().includes('tid') || drug.frequency.includes('3x')) {
                            pillsPerDay = 3;
                        }
                    }
                    
                    medications.push({
                        prescriptionId: rx.id,
                        name: drug.drugName,
                        dosage: drug.dosage,
                        frequency: drug.frequency,
                        lastPickup: rx.prescriptionDate,
                        remaining: this.calculateRemainingPills(rx, drug),
                        pillsPerDay: pillsPerDay,
                        unit: 'tablets'
                    });
                });
            }
        });

        // Get from ART regimens
        artRegimens.filter(r => r.patientId === patientId && r.status === 'active').forEach(regimen => {
            if (regimen.drugs && regimen.drugs.length > 0) {
                regimen.drugs.forEach(drug => {
                    // Check if not already added from prescriptions
                    if (!medications.find(m => m.name === drug.drugName)) {
                        medications.push({
                            regimenId: regimen.id,
                            name: drug.drugName,
                            dosage: drug.dose,
                            frequency: `${drug.pillsPerDay} pill(s)/day`,
                            lastPickup: regimen.startDate,
                            remaining: drug.pillsRemaining || 0,
                            pillsPerDay: drug.pillsPerDay || 1,
                            unit: 'tablets'
                        });
                    }
                });
            }
        });

        // If no medications found, add sample based on reminders
        if (medications.length === 0) {
            reminders.filter(r => r.patientId === patientId && r.active).forEach(rem => {
                medications.push({
                    name: rem.drugName,
                    dosage: '1 tablet',
                    frequency: rem.frequency,
                    lastPickup: rem.lastTaken,
                    remaining: 10, // Estimate
                    pillsPerDay: 1,
                    unit: 'tablets'
                });
            });
        }

        // Add a default if still empty
        if (medications.length === 0) {
            medications.push({
                name: 'TLD (Tenofovir/Lamivudine/Dolutegravir)',
                dosage: '1 tablet',
                frequency: 'Once daily',
                lastPickup: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                remaining: 5,
                pillsPerDay: 1,
                unit: 'tablets'
            });
        }

        return medications;
    },

    // Calculate remaining pills
    calculateRemainingPills(prescription, drug) {
        if (!prescription.prescriptionDate) return null;
        
        const startDate = new Date(prescription.prescriptionDate);
        const today = new Date();
        const daysPassed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
        const duration = parseInt(drug.duration) || 30;
        const remaining = duration - daysPassed;
        
        return Math.max(0, remaining);
    },

    // Submit refill request
    submitRequest() {
        const form = document.getElementById('refillRequestForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const currentUser = Auth.getCurrentUser();
        const patientId = parseInt(document.getElementById('refillPatientId').value);
        const selectedMedIndex = document.querySelector('input[name="selectedMed"]:checked').value;
        const medication = this._tempMedications[selectedMedIndex];
        const quantity = parseInt(document.getElementById('refillQuantity').value);
        const pickupDate = document.getElementById('refillPickupDate').value;
        const pickupTime = document.getElementById('refillPickupTime').value;
        const facilityId = parseInt(document.getElementById('refillFacilityId').value);
        const notes = document.getElementById('refillNotes').value;
        const remainingPills = parseInt(document.getElementById('remainingPillCount').value) || 0;
        
        // Get pill status and kulang explanation if applicable
        const pillStatus = this._currentPillStatus || this.PILL_STATUS.SAKTO;
        let kulangExplanation = null;
        
        if (pillStatus === this.PILL_STATUS.KULANG) {
            const kulangReason = document.getElementById('kulangReason').value;
            if (!kulangReason) {
                App.showError('Please explain why your pills are insufficient (kulang)');
                return;
            }
            if (kulangReason === 'other') {
                const otherReason = document.getElementById('kulangOtherReason').value;
                if (!otherReason.trim()) {
                    App.showError('Please provide an explanation for insufficient pills');
                    return;
                }
                kulangExplanation = otherReason;
            } else {
                const reasonLabels = {
                    'missed_pickup': 'Missed previous pickup schedule',
                    'lost_pills': 'Some pills were lost',
                    'damaged_pills': 'Some pills were damaged',
                    'shared_medication': 'Shared medication with family member',
                    'dosage_changed': 'Doctor changed dosage'
                };
                kulangExplanation = reasonLabels[kulangReason] || kulangReason;
            }
        }

        // Check refill eligibility (10 pills or less per requirements)
        const isEligible = remainingPills <= this.MIN_PILLS_FOR_REFILL;
        
        // Warn if not eligible but allow submission with note
        if (!isEligible) {
            if (!confirm(`⚠️ You have ${remainingPills} pills remaining, which is more than the recommended 10 pills for refill eligibility.\n\nThis request will be flagged for review. The Treatment Partner may adjust the pickup date to ensure continuous intake.\n\nDo you want to proceed?`)) {
                return;
            }
        }

        const newRequest = {
            request_id: 'refill_' + Date.now(),
            patient_id: patientId,
            prescription_id: medication.prescriptionId || null,
            regimen_id: medication.regimenId || null,
            medication_name: medication.name,
            quantity_requested: quantity,
            unit: medication.unit || 'tablets',
            preferred_pickup_date: pickupDate,
            preferred_pickup_time: pickupTime, // NEW: Added pickup time
            pickup_facility_id: facilityId,
            patient_notes: notes,
            // NEW: Pill count tracking fields
            remaining_pill_count: remainingPills,
            pill_status: pillStatus, // kulang, sakto, or sobra
            kulang_explanation: kulangExplanation,
            is_eligible_for_refill: isEligible,
            pills_per_day: medication.pillsPerDay || 1,
            // Status fields
            status: this.STATUS.PENDING,
            reviewed_by: null,
            reviewed_at: null,
            review_notes: null,
            decline_reason: null,
            approved_quantity: null,
            ready_for_pickup_date: null,
            dispensed_by: null,
            dispensed_at: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            created_by: currentUser.userId
        };

        // Save request
        const requests = this.getAllRequests();
        requests.push(newRequest);
        localStorage.setItem('refill_requests', JSON.stringify(requests));

        // Create notification for Treatment Partners (Case Managers)
        this.createNotification({
            type: 'new_refill_request',
            request_id: newRequest.request_id,
            message: `New refill request for ${medication.name} (${remainingPills} pills remaining - ${pillStatus.toUpperCase()})`,
            for_role: 'case_manager',
            priority: pillStatus === this.PILL_STATUS.KULANG ? 'high' : 'normal'
        });

        // Log audit
        if (typeof logAudit === 'function') {
            logAudit('create', 'refill_requests', `Patient submitted refill request (${remainingPills} pills, ${pillStatus})`, newRequest.request_id);
        }

        App.closeModal();
        
        // Show appropriate success message
        let successMsg = '✅ Refill request submitted successfully! A Treatment Partner will review your request shortly.';
        if (!isEligible) {
            successMsg += '\n\n⚠️ Note: Your request has been flagged since you have more than 10 pills remaining.';
        }
        if (pillStatus === this.PILL_STATUS.KULANG) {
            successMsg += '\n\n📋 Your explanation for insufficient pills has been noted.';
        }
        
        App.showSuccess(successMsg);
        
        // Reload appropriate page
        if (currentUser.role === 'patient') {
            this.loadMyRefillsPage(document.getElementById('contentArea'));
        } else {
            App.loadPage('prescriptions');
        }
    },

    // Show approve modal
    showApproveModal(requestId) {
        const request = this.getRequestById(requestId);
        if (!request) {
            App.showError('Request not found');
            return;
        }

        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const facilities = JSON.parse(localStorage.getItem('facilities')) || [];

        const patient = patients.find(p => p.id === request.patient_id);
        const facility = facilities.find(f => f.id === request.pickup_facility_id);
        const adherenceInfo = this.getPatientAdherenceInfo(request.patient_id);
        const lastPickup = this.getLastPickupDate(request.patient_id, request.medication_name);

        // Pill status display
        const pillStatusLabels = {
            'kulang': '📉 KULANG (Insufficient)',
            'sakto': '✅ SAKTO (Correct)',
            'sobra': '📈 SOBRA (Excess)'
        };
        const pillStatusColors = {
            'kulang': 'danger',
            'sakto': 'success',
            'sobra': 'warning'
        };

        // Minimum date for pickup (tomorrow)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const minDate = tomorrow.toISOString().split('T')[0];

        const content = `
            <div class="alert alert-info">
                You are about to approve this refill request. No doctor selection needed - processed by Treatment Partner.
            </div>
            
            <div class="card mb-3">
                <div class="card-body">
                    <p><strong>Patient:</strong> ${patient ? patient.firstName + ' ' + patient.lastName : 'N/A'}</p>
                    <p><strong>Medication:</strong> ${request.medication_name}</p>
                    <p><strong>Quantity Requested:</strong> ${request.quantity_requested} ${request.unit || 'tablets'}</p>
                    <p><strong>Preferred Pickup:</strong> ${new Date(request.preferred_pickup_date).toLocaleDateString()}${request.preferred_pickup_time ? ' @ ' + request.preferred_pickup_time : ''}</p>
                    <p><strong>Pickup Location:</strong> ${facility ? facility.name : 'N/A'}</p>
                </div>
            </div>

            ${request.remaining_pill_count !== undefined ? `
            <div class="card mb-3" style="background: var(--bg-secondary); border-left: 4px solid var(--${pillStatusColors[request.pill_status] || 'primary'}-color);">
                <div class="card-body">
                    <strong>📊 Pill Count Information:</strong>
                    <ul class="mt-2" style="margin-left: 20px;">
                        <li>Pills Remaining: <strong>${request.remaining_pill_count}</strong></li>
                        <li>Status: <span class="badge badge-${pillStatusColors[request.pill_status] || 'secondary'}">${pillStatusLabels[request.pill_status] || request.pill_status}</span></li>
                        <li>Refill Eligibility: ${request.is_eligible_for_refill ? '<span class="badge badge-success">✅ Eligible (≤10 pills)</span>' : '<span class="badge badge-warning">⚠️ Early Request (>' + this.MIN_PILLS_FOR_REFILL + ' pills)</span>'}</li>
                        ${request.kulang_explanation ? `<li style="color: var(--danger-color);"><strong>Kulang Reason:</strong> ${request.kulang_explanation}</li>` : ''}
                    </ul>
                </div>
            </div>
            ` : ''}

            <div class="card mb-3" style="background: var(--bg-secondary);">
                <div class="card-body">
                    <strong>✓ Verification Checklist:</strong>
                    <ul class="mt-2" style="margin-left: 20px;">
                        <li>Last Pickup: ${lastPickup}</li>
                        <li>Adherence Rate: ${adherenceInfo.rate}% ${adherenceInfo.rate >= 80 ? '✓' : '⚠️'}</li>
                        <li>Prescription Status: Active ✓</li>
                    </ul>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Approved Quantity</label>
                    <input type="number" id="approvedQuantity" value="${request.quantity_requested}" min="1">
                </div>
                <div class="form-group">
                    <label>Ready for Pickup Date</label>
                    <input type="date" id="readyDate" value="${request.preferred_pickup_date}" min="${minDate}">
                </div>
            </div>

            <div class="form-group">
                <label>Ready for Pickup Time</label>
                <select id="readyTime">
                    <option value="">Same as requested</option>
                    <option value="08:00">8:00 AM</option>
                    <option value="09:00">9:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="13:00">1:00 PM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="16:00">4:00 PM</option>
                    <option value="17:00">5:00 PM</option>
                </select>
            </div>

            <div class="form-group">
                <label>Notes to Patient (Optional)</label>
                <textarea id="approvalNotes" rows="3" placeholder="e.g., Please bring your ID when picking up..."></textarea>
            </div>

            <div class="form-group">
                <label>
                    <input type="checkbox" id="notifyPatient" checked> Send notification to patient
                </label>
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="notifyPharmacy" checked> Notify pharmacy/nurse to prepare
                </label>
            </div>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-success" onclick="RefillRequests.approveRequest('${requestId}')">✅ Confirm Approval</button>
        `;

        App.showModal('✅ Approve Refill Request', content, footer);
    },

    // Approve request
    approveRequest(requestId) {
        const currentUser = Auth.getCurrentUser();
        const approvedQuantity = parseInt(document.getElementById('approvedQuantity').value);
        const readyDate = document.getElementById('readyDate').value;
        const readyTime = document.getElementById('readyTime')?.value || null;
        const notes = document.getElementById('approvalNotes').value;
        const notifyPatient = document.getElementById('notifyPatient').checked;

        const requests = this.getAllRequests();
        const index = requests.findIndex(r => r.request_id === requestId);
        
        if (index === -1) {
            App.showError('Request not found');
            return;
        }

        const request = requests[index];

        // Update request status
        requests[index] = {
            ...request,
            status: this.STATUS.READY,
            reviewed_by: currentUser.userId,
            reviewed_at: new Date().toISOString(),
            review_notes: notes,
            approved_quantity: approvedQuantity,
            ready_for_pickup_date: readyDate,
            ready_for_pickup_time: readyTime || request.preferred_pickup_time,
            updated_at: new Date().toISOString()
        };

        localStorage.setItem('refill_requests', JSON.stringify(requests));

        // Send notification
        if (notifyPatient) {
            const pickupTimeStr = readyTime || request.preferred_pickup_time;
            this.createNotification({
                type: 'refill_approved',
                request_id: requestId,
                patient_id: request.patient_id,
                message: `Your refill for ${request.medication_name} is ready for pickup on ${new Date(readyDate).toLocaleDateString()}${pickupTimeStr ? ' at ' + pickupTimeStr : ''}!`
            });
        }

        // Log audit
        if (typeof logAudit === 'function') {
            logAudit('update', 'refill_requests', 'Refill request approved by Treatment Partner', requestId);
        }

        App.closeModal();
        App.showSuccess('✅ Refill request approved! Patient has been notified.');
        this.loadRequestsPage(document.getElementById('contentArea'));
    },

    // Show decline modal
    showDeclineModal(requestId) {
        const request = this.getRequestById(requestId);
        if (!request) {
            App.showError('Request not found');
            return;
        }

        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const patient = patients.find(p => p.id === request.patient_id);

        const content = `
            <div class="alert alert-warning">
                You are about to decline this refill request for ${patient ? patient.firstName + ' ' + patient.lastName : 'the patient'}.
            </div>

            <div class="form-group">
                <label class="required">Reason for Declining</label>
                <select id="declineReasonSelect" required onchange="RefillRequests.toggleOtherReason()">
                    <option value="">Select a reason</option>
                    <option value="Too early for refill">Too early for refill - previous supply not exhausted</option>
                    <option value="Prescription expired">Prescription has expired - needs renewal</option>
                    <option value="Low adherence">Low adherence rate - counseling required</option>
                    <option value="Appointment required">Appointment required before refill</option>
                    <option value="Out of stock">Medication temporarily out of stock</option>
                    <option value="Insurance/coverage issue">Insurance or coverage verification needed</option>
                    <option value="other">Other (specify below)</option>
                </select>
            </div>

            <div class="form-group" id="otherReasonGroup" style="display: none;">
                <label class="required">Specify Reason</label>
                <textarea id="otherReasonText" rows="2" placeholder="Please specify the reason..."></textarea>
            </div>

            <div class="form-group">
                <label>Next Steps for Patient</label>
                <textarea id="nextSteps" rows="3" placeholder="e.g., Please schedule an appointment with your physician..."></textarea>
            </div>

            <div class="form-group">
                <label>
                    <input type="checkbox" id="notifyPatientDecline" checked> Send notification to patient
                </label>
            </div>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-danger" onclick="RefillRequests.declineRequest('${requestId}')">❌ Confirm Decline</button>
        `;

        App.showModal('❌ Decline Refill Request', content, footer);
    },

    // Toggle other reason textarea
    toggleOtherReason() {
        const select = document.getElementById('declineReasonSelect');
        const otherGroup = document.getElementById('otherReasonGroup');
        otherGroup.style.display = select.value === 'other' ? 'block' : 'none';
    },

    // Decline request
    declineRequest(requestId) {
        const currentUser = Auth.getCurrentUser();
        const reasonSelect = document.getElementById('declineReasonSelect').value;
        const otherReason = document.getElementById('otherReasonText').value;
        const nextSteps = document.getElementById('nextSteps').value;
        const notifyPatient = document.getElementById('notifyPatientDecline').checked;

        if (!reasonSelect) {
            App.showError('Please select a reason for declining');
            return;
        }

        const declineReason = reasonSelect === 'other' ? otherReason : reasonSelect;

        if (reasonSelect === 'other' && !otherReason.trim()) {
            App.showError('Please specify the reason');
            return;
        }

        const requests = this.getAllRequests();
        const index = requests.findIndex(r => r.request_id === requestId);
        
        if (index === -1) {
            App.showError('Request not found');
            return;
        }

        const request = requests[index];

        // Update request status
        requests[index] = {
            ...request,
            status: this.STATUS.DECLINED,
            reviewed_by: currentUser.userId,
            reviewed_at: new Date().toISOString(),
            decline_reason: declineReason + (nextSteps ? ` Next steps: ${nextSteps}` : ''),
            updated_at: new Date().toISOString()
        };

        localStorage.setItem('refill_requests', JSON.stringify(requests));

        // Send notification
        if (notifyPatient) {
            this.createNotification({
                type: 'refill_declined',
                request_id: requestId,
                patient_id: request.patient_id,
                message: `Your refill request for ${request.medication_name} was declined. Reason: ${declineReason}`
            });
        }

        // Log audit
        if (typeof logAudit === 'function') {
            logAudit('update', 'refill_requests', 'Refill request declined', requestId);
        }

        App.closeModal();
        App.showSuccess('Request has been declined and patient notified.');
        this.loadRequestsPage(document.getElementById('contentArea'));
    },

    // Mark as dispensed
    markAsDispensed(requestId) {
        if (!confirm('Mark this refill as dispensed? This confirms the patient has picked up their medication.')) {
            return;
        }

        const currentUser = Auth.getCurrentUser();
        const requests = this.getAllRequests();
        const index = requests.findIndex(r => r.request_id === requestId);
        
        if (index === -1) {
            App.showError('Request not found');
            return;
        }

        requests[index].status = this.STATUS.DISPENSED;
        requests[index].dispensed_by = currentUser.userId;
        requests[index].dispensed_at = new Date().toISOString();
        requests[index].updated_at = new Date().toISOString();

        localStorage.setItem('refill_requests', JSON.stringify(requests));

        // Log audit
        if (typeof logAudit === 'function') {
            logAudit('update', 'refill_requests', 'Medication dispensed', requestId);
        }

        App.showSuccess('✅ Medication marked as dispensed.');
        this.loadRequestsPage(document.getElementById('contentArea'));
    },

    // Cancel request (patient)
    cancelRequest(requestId) {
        if (!confirm('Are you sure you want to cancel this refill request?')) {
            return;
        }

        const requests = this.getAllRequests();
        const index = requests.findIndex(r => r.request_id === requestId);
        
        if (index === -1) {
            App.showError('Request not found');
            return;
        }

        requests[index].status = this.STATUS.CANCELLED;
        requests[index].updated_at = new Date().toISOString();

        localStorage.setItem('refill_requests', JSON.stringify(requests));

        App.showSuccess('Refill request cancelled');
        
        // Reload the appropriate page
        const contentArea = document.getElementById('contentArea');
        if (typeof Reminders !== 'undefined' && App.currentPage === 'my-medications') {
            Reminders.loadMedicationsPage(contentArea);
        } else {
            this.loadMyRefillsPage(contentArea);
        }
    },

    // ========== FILTER FUNCTIONS ==========

    filterByStatus(status) {
        const requests = this.getAllRequests();
        const filtered = status === 'all' ? requests : requests.filter(r => r.status === status);
        document.getElementById('refillRequestsList').innerHTML = this.renderRequestsList(filtered);
    },

    filterRequests(searchTerm) {
        const statusFilter = document.getElementById('refillStatusFilter').value;
        let requests = this.getAllRequests();
        
        if (statusFilter !== 'all') {
            requests = requests.filter(r => r.status === statusFilter);
        }

        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        
        if (searchTerm.trim()) {
            requests = requests.filter(req => {
                const patient = patients.find(p => p.id === req.patient_id);
                const patientName = patient ? `${patient.firstName} ${patient.lastName}`.toLowerCase() : '';
                const medName = req.medication_name.toLowerCase();
                return patientName.includes(searchTerm.toLowerCase()) || medName.includes(searchTerm.toLowerCase());
            });
        }

        document.getElementById('refillRequestsList').innerHTML = this.renderRequestsList(requests);
    },

    // ========== HELPER FUNCTIONS ==========

    getAllRequests() {
        return JSON.parse(localStorage.getItem('refill_requests')) || [];
    },

    getRequestById(requestId) {
        const requests = this.getAllRequests();
        return requests.find(r => r.request_id === requestId);
    },

    getRequestsByPatient(patientId) {
        const requests = this.getAllRequests();
        return requests.filter(r => r.patient_id === patientId);
    },

    getPendingCount() {
        const requests = this.getAllRequests();
        return requests.filter(r => r.status === this.STATUS.PENDING).length;
    },

    canReviewRequests(role) {
        return ['admin', 'case_manager'].includes(role);
    },

    getPatientAdherenceInfo(patientId) {
        const adherence = JSON.parse(localStorage.getItem('medication_adherence')) || [];
        const patientAdherence = adherence.filter(a => a.patient_id === patientId);
        
        if (patientAdherence.length === 0) {
            return { rate: 95, taken: 0, missed: 0 }; // Default good adherence
        }

        const taken = patientAdherence.filter(a => a.taken).length;
        const total = patientAdherence.length;
        const rate = Math.round((taken / total) * 100);

        return { rate, taken, missed: total - taken };
    },

    getLastPickupDate(patientId, medicationName) {
        const dispenses = JSON.parse(localStorage.getItem('dispense_events')) || [];
        const refills = this.getAllRequests().filter(r => 
            r.patient_id === patientId && 
            r.medication_name === medicationName &&
            r.status === this.STATUS.DISPENSED
        );

        if (refills.length > 0) {
            const lastRefill = refills.sort((a, b) => new Date(b.dispensed_at) - new Date(a.dispensed_at))[0];
            return new Date(lastRefill.dispensed_at).toLocaleDateString();
        }

        if (dispenses.length > 0) {
            const last = dispenses.sort((a, b) => new Date(b.dispensed_date) - new Date(a.dispensed_date))[0];
            return new Date(last.dispensed_date).toLocaleDateString();
        }

        // Default to 30 days ago
        const date = new Date();
        date.setDate(date.getDate() - 30);
        return date.toLocaleDateString();
    },

    createNotification(notification) {
        const notifications = JSON.parse(localStorage.getItem('refill_notifications')) || [];
        notifications.push({
            id: 'refill_notif_' + Date.now(),
            ...notification,
            read: false,
            created_at: new Date().toISOString()
        });
        localStorage.setItem('refill_notifications', JSON.stringify(notifications));
    },

    // Get Case Manager dashboard widget
    getCaseManagerWidget() {
        const pendingCount = this.getPendingCount();
        if (pendingCount === 0) return '';

        const requests = this.getAllRequests().filter(r => r.status === this.STATUS.PENDING).slice(0, 3);
        const patients = JSON.parse(localStorage.getItem('patients')) || [];

        return `
            <div class="card mt-3">
                <div class="card-header">
                    <h3 class="card-title">💊 Pending Refill Requests</h3>
                    <span class="badge badge-warning">${pendingCount} Pending</span>
                </div>
                <div class="card-body">
                    ${requests.map(req => {
                        const patient = patients.find(p => p.id === req.patient_id);
                        return `
                            <div class="d-flex justify-between align-center mb-2 p-2" style="border-bottom: 1px solid var(--border-color);">
                                <div>
                                    <strong>${patient ? patient.firstName + ' ' + patient.lastName : 'Unknown'}</strong><br>
                                    <span class="text-muted">${req.medication_name} - ${req.quantity_requested} ${req.unit || 'tablets'}</span>
                                </div>
                                <button class="btn btn-sm btn-primary" onclick="App.loadPage('refill-requests')">Review</button>
                            </div>
                        `;
                    }).join('')}
                    <div class="text-center mt-2">
                        <button class="btn btn-outline" onclick="App.loadPage('refill-requests')">View All Requests</button>
                    </div>
                </div>
            </div>
        `;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RefillRequests;
}

