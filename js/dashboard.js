// ============================================================
// My Hub Cares - Healthcare Worker Dashboard
// ============================================================

const Dashboard = {
    // Cache management
    getCache(widgetId, parameters) {
        const cache = JSON.parse(localStorage.getItem('dashboard_cache')) || [];
        const now = new Date();
        
        const cached = cache.find(c => 
            c.widget_id === widgetId &&
            JSON.stringify(c.parameters) === JSON.stringify(parameters) &&
            new Date(c.expires_at) > now
        );
        
        return cached ? JSON.parse(cached.cached_data) : null;
    },

    setCache(widgetId, parameters, data, expiresInHours = 12) {
        const cache = JSON.parse(localStorage.getItem('dashboard_cache')) || [];
        const now = new Date();
        const expiresAt = new Date(now.getTime() + expiresInHours * 60 * 60 * 1000);
        
        // Remove expired entries
        const activeCache = cache.filter(c => new Date(c.expires_at) > now);
        
        // Remove existing entry for same widget/parameters
        const filtered = activeCache.filter(c => 
            !(c.widget_id === widgetId && JSON.stringify(c.parameters) === JSON.stringify(parameters))
        );
        
        // Add new cache entry
        filtered.push({
            cache_id: 'cache_' + Date.now(),
            widget_id: widgetId,
            parameters: typeof parameters === 'string' ? JSON.parse(parameters) : parameters,
            cached_data: typeof data === 'string' ? data : JSON.stringify(data),
            cached_at: now.toISOString(),
            expires_at: expiresAt.toISOString()
        });
        
        localStorage.setItem('dashboard_cache', JSON.stringify(filtered));
    },

    clearCache(widgetId = null) {
        if (widgetId) {
            const cache = JSON.parse(localStorage.getItem('dashboard_cache')) || [];
            const filtered = cache.filter(c => c.widget_id !== widgetId);
            localStorage.setItem('dashboard_cache', JSON.stringify(filtered));
        } else {
            localStorage.removeItem('dashboard_cache');
        }
    },

    // Load worker dashboard
    loadWorkerDashboard(container) {
        const role = Auth.getCurrentUser().role;
        const stats = this.calculateStatistics();
        const alerts = this.generateAlerts();

        // Get pending appointment requests widget for case manager/admin
        let appointmentRequestsWidget = '';
        if ((role === 'case_manager' || role === 'admin') && typeof AppointmentRequests !== 'undefined') {
            appointmentRequestsWidget = AppointmentRequests.getCaseManagerWidget();
        }

        // Get pending refill requests widget for case manager/admin
        let refillRequestsWidget = '';
        if ((role === 'case_manager' || role === 'admin') && typeof RefillRequests !== 'undefined') {
            refillRequestsWidget = RefillRequests.getCaseManagerWidget();
        }

        let html = `
            <div class="dashboard-header">
                <h2>Dashboard Overview</h2>
                <p>Real-time system statistics and alerts</p>
            </div>

            ${this.renderStatistics(stats)}

            ${appointmentRequestsWidget}
            ${refillRequestsWidget}

            <div class="dashboard-grid mt-3" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Patient Enrollment Trend</h3>
                    </div>
                    <div class="card-body">
                        ${this.renderPatientEnrollmentChart()}
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Monthly Appointments</h3>
                    </div>
                    <div class="card-body">
                        ${this.renderAppointmentChart()}
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Risk Distribution</h3>
                    </div>
                    <div class="card-body">
                        ${this.renderRiskDistributionChart()}
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Monthly Prescriptions</h3>
                    </div>
                    <div class="card-body">
                        ${this.renderPrescriptionChart()}
                    </div>
                </div>
            </div>

            <div class="card mt-3">
                <div class="card-header">
                    <h3 class="card-title">System Alerts</h3>
                </div>
                <div class="card-body">
                    ${alerts.length > 0 ? this.renderAlerts(alerts) : '<p class="text-muted">No alerts at this time</p>'}
                </div>
            </div>

            ${role === 'physician' ? this.renderPatientRiskPanel() : ''}

            <div class="card mt-3">
                <div class="card-header">
                    <h3 class="card-title">Recent Activity</h3>
                </div>
                <div class="card-body">
                    ${this.renderRecentActivity()}
                </div>
            </div>
        `;

        container.innerHTML = html;
    },

    // Calculate statistics
    calculateStatistics() {
        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
        const prescriptions = JSON.parse(localStorage.getItem('prescriptions')) || [];

        const today = new Date();
        const todayAppointments = appointments.filter(apt => 
            apt.appointmentDate === today.toISOString().split('T')[0] &&
            apt.status === 'scheduled'
        );

        const lowStockItems = inventory.filter(item => 
            item.stockQuantity <= item.reorderLevel
        );

        const thisMonthPrescriptions = prescriptions.filter(rx => {
            const rxDate = new Date(rx.prescriptionDate);
            return rxDate.getMonth() === today.getMonth() &&
                   rxDate.getFullYear() === today.getFullYear();
        });

        return {
            totalPatients: patients.length,
            todayAppointments: todayAppointments.length,
            lowStockItems: lowStockItems.length,
            monthlyPrescriptions: thisMonthPrescriptions.length
        };
    },

    // Render statistics
    renderStatistics(stats) {
        return `
            <div class="dashboard-grid">
                <div class="stat-card">
                    <div class="stat-card-header">
                        <div>
                            <div class="stat-value">${stats.totalPatients}</div>
                            <div class="stat-label">Total Patients</div>
                        </div>
                        <div class="stat-card-icon primary">👥</div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-card-header">
                        <div>
                            <div class="stat-value">${stats.todayAppointments}</div>
                            <div class="stat-label">Today's Appointments</div>
                        </div>
                        <div class="stat-card-icon success">📅</div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-card-header">
                        <div>
                            <div class="stat-value">${stats.lowStockItems}</div>
                            <div class="stat-label">Low Stock Alerts</div>
                        </div>
                        <div class="stat-card-icon warning">⚠️</div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-card-header">
                        <div>
                            <div class="stat-value">${stats.monthlyPrescriptions}</div>
                            <div class="stat-label">Prescriptions This Month</div>
                        </div>
                        <div class="stat-card-icon info">💊</div>
                    </div>
                </div>
            </div>
        `;
    },

    // Generate alerts
    generateAlerts() {
        const alerts = [];
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
        const patients = JSON.parse(localStorage.getItem('patients')) || [];

        // Check for today's appointments
        const today = new Date().toISOString().split('T')[0];
        const todayAppointments = appointments.filter(apt => 
            apt.appointmentDate === today &&
            apt.status === 'scheduled'
        );

        if (todayAppointments.length > 0) {
            alerts.push({
                type: 'info',
                message: `${todayAppointments.length} appointment(s) scheduled for today`,
                action: 'appointments'
            });
        }

        // Check for low stock
        const lowStockItems = inventory.filter(item => 
            item.stockQuantity <= item.reorderLevel
        );

        if (lowStockItems.length > 0) {
            alerts.push({
                type: 'warning',
                message: `${lowStockItems.length} medication(s) are low in stock`,
                action: 'inventory'
            });
        }

        // Check for expired items
        const today_date = new Date();
        const expiredItems = inventory.filter(item => {
            const expiryDate = new Date(item.expiryDate);
            return expiryDate < today_date;
        });

        if (expiredItems.length > 0) {
            alerts.push({
                type: 'danger',
                message: `${expiredItems.length} medication(s) have expired`,
                action: 'inventory'
            });
        }

        // Add ARPA high-risk alerts
        const highRiskPatients = this.getHighRiskPatients();
        if (highRiskPatients.length > 0) {
            alerts.push({
                type: 'danger',
                message: `${highRiskPatients.length} patient(s) flagged as high-risk by ARPA`,
                action: 'patients'
            });
        }

        return alerts;
    },

    // Render alerts
    renderAlerts(alerts) {
        return alerts.map(alert => `
            <div class="alert alert-${alert.type}">
                <div class="d-flex justify-between align-center">
                    <span>${alert.message}</span>
                    <button class="btn btn-sm btn-outline" onclick="window.location.hash='${alert.action}'">
                        View
                    </button>
                </div>
            </div>
        `).join('');
    },

    // Get high-risk patients
    getHighRiskPatients() {
        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        return patients.filter(patient => {
            const riskScore = ARPA.calculateRiskScore(patient.id);
            return riskScore.level === 'high' || riskScore.level === 'critical';
        });
    },

    // Render patient risk panel
    renderPatientRiskPanel() {
        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const riskyPatients = patients.map(patient => {
            return {
                ...patient,
                riskScore: ARPA.calculateRiskScore(patient.id)
            };
        }).filter(p => p.riskScore.level === 'high' || p.riskScore.level === 'critical')
          .sort((a, b) => b.riskScore.score - a.riskScore.score)
          .slice(0, 5);

        if (riskyPatients.length === 0) {
            return '';
        }

        return `
            <div class="card mt-3">
                <div class="card-header">
                    <h3 class="card-title">High-Risk Patients (ARPA)</h3>
                </div>
                <div class="card-body">
                    ${riskyPatients.map(patient => `
                        <div class="patient-card">
                            <div class="patient-info">
                                <div>
                                    <h3>${patient.firstName} ${patient.lastName}</h3>
                                    <div class="patient-meta">
                                        <span>Risk Score: ${patient.riskScore.score}</span>
                                        <span>Adherence: ${patient.riskScore.adherenceRate}%</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <span class="risk-badge ${patient.riskScore.level}">${patient.riskScore.level.toUpperCase()}</span>
                                <button class="btn btn-sm btn-primary" onclick="Patients.viewPatient(${patient.id})">
                                    View
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    // Render recent activity
    renderRecentActivity() {
        const visits = JSON.parse(localStorage.getItem('visits')) || [];
        const prescriptions = JSON.parse(localStorage.getItem('prescriptions')) || [];
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        const patients = JSON.parse(localStorage.getItem('patients')) || [];

        const activities = [];

        // Add recent visits
        visits.slice(0, 3).forEach(visit => {
            const patient = patients.find(p => p.id === visit.patientId);
            activities.push({
                type: 'visit',
                date: new Date(visit.visitDate),
                description: `${patient ? patient.firstName + ' ' + patient.lastName : 'Patient'} - ${visit.visitType}`,
                icon: '🏥'
            });
        });

        // Add recent prescriptions
        prescriptions.slice(0, 3).forEach(rx => {
            const patient = patients.find(p => p.id === rx.patientId);
            activities.push({
                type: 'prescription',
                date: new Date(rx.prescriptionDate),
                description: `New prescription for ${patient ? patient.firstName + ' ' + patient.lastName : 'Patient'}`,
                icon: '💊'
            });
        });

        // Sort by date
        activities.sort((a, b) => b.date - a.date);

        if (activities.length === 0) {
            return '<p class="text-muted">No recent activity</p>';
        }

        return activities.slice(0, 5).map(activity => `
            <div class="d-flex gap-2 mb-2 p-2" style="border-bottom: 1px solid var(--border-color);">
                <div style="font-size: 24px;">${activity.icon}</div>
                <div>
                    <strong>${activity.description}</strong><br>
                    <span class="text-muted">${activity.date.toLocaleString()}</span>
                </div>
            </div>
        `).join('');
    },

    // Render patient enrollment chart
    renderPatientEnrollmentChart() {
        const params = { period: 'monthly' };
        const cached = this.getCache('patient_enrollment', params);
        if (cached) {
            return this.renderCachedChart(cached, 'Patient Enrollment');
        }
        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const months = [];
        const now = new Date();
        
        // Get last 6 months
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            months.push({
                label: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                value: 0
            });
        }

        // Count patients per month
        patients.forEach(patient => {
            const enrollDate = new Date(patient.enrollmentDate || patient.createdAt || new Date());
            const monthIndex = months.findIndex(m => {
                const mDate = new Date(m.label);
                return mDate.getMonth() === enrollDate.getMonth() && 
                       mDate.getFullYear() === enrollDate.getFullYear();
            });
            if (monthIndex >= 0) {
                months[monthIndex].value++;
            }
        });

        // Add some mock data for demo if empty
        if (months.every(m => m.value === 0)) {
            months.forEach((m, i) => {
                m.value = Math.floor(Math.random() * 8) + 2;
            });
        }

        return Charts.generateLineChart(months, {
            width: 550,
            height: 250,
            title: 'Last 6 Months'
        });
    },

    // Render appointment chart
    renderAppointmentChart() {
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        const months = [];
        const now = new Date();
        
        // Get last 6 months
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            months.push({
                label: date.toLocaleDateString('en-US', { month: 'short' }),
                value: 0
            });
        }

        // Count appointments per month
        appointments.forEach(apt => {
            const aptDate = new Date(apt.appointmentDate);
            const monthIndex = months.findIndex(m => {
                const mDate = new Date(`1 ${m.label} ${now.getFullYear()}`);
                return mDate.getMonth() === aptDate.getMonth() && 
                       mDate.getFullYear() === aptDate.getFullYear();
            });
            if (monthIndex >= 0) {
                months[monthIndex].value++;
            }
        });

        // Add mock data if empty
        if (months.every(m => m.value === 0)) {
            months.forEach((m, i) => {
                m.value = Math.floor(Math.random() * 15) + 5;
            });
        }

        return Charts.generateBarChart(months, {
            width: 550,
            height: 250,
            barColor: '#10b981',
            title: 'Last 6 Months'
        });
    },

    // Render risk distribution chart
    renderRiskDistributionChart() {
        const params = {};
        const cached = this.getCache('risk_distribution', params);
        if (cached) {
            const data = [
                { label: 'Low', value: cached.low || 5 },
                { label: 'Medium', value: cached.medium || 3 },
                { label: 'High', value: cached.high || 2 },
                { label: 'Critical', value: cached.critical || 1 }
            ].filter(d => d.value > 0);
            return Charts.generatePieChart(data, {
                width: 300,
                height: 300,
                colors: ['#10b981', '#f59e0b', '#ef4444', '#dc2626'],
                showLegend: true
            });
        }

        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const riskCounts = { low: 0, medium: 0, high: 0, critical: 0 };

        patients.forEach(patient => {
            const riskScore = ARPA.calculateRiskScore(patient.id);
            riskCounts[riskScore.level] = (riskCounts[riskScore.level] || 0) + 1;
        });

        // Cache the result
        this.setCache('risk_distribution', params, riskCounts, 12);

        const data = [
            { label: 'Low', value: riskCounts.low || 5 },
            { label: 'Medium', value: riskCounts.medium || 3 },
            { label: 'High', value: riskCounts.high || 2 },
            { label: 'Critical', value: riskCounts.critical || 1 }
        ].filter(d => d.value > 0);

        return Charts.generatePieChart(data, {
            width: 300,
            height: 300,
            colors: ['#10b981', '#f59e0b', '#ef4444', '#dc2626'],
            showLegend: true
        });
    },

    // Render prescription chart
    renderPrescriptionChart() {
        const prescriptions = JSON.parse(localStorage.getItem('prescriptions')) || [];
        const months = [];
        const now = new Date();
        
        // Get last 6 months
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            months.push({
                label: date.toLocaleDateString('en-US', { month: 'short' }),
                value: 0
            });
        }

        // Count prescriptions per month
        prescriptions.forEach(rx => {
            const rxDate = new Date(rx.prescriptionDate);
            const monthIndex = months.findIndex(m => {
                const mDate = new Date(`1 ${m.label} ${now.getFullYear()}`);
                return mDate.getMonth() === rxDate.getMonth() && 
                       mDate.getFullYear() === rxDate.getFullYear();
            });
            if (monthIndex >= 0) {
                months[monthIndex].value++;
            }
        });

        // Add mock data if empty
        if (months.every(m => m.value === 0)) {
            months.forEach((m, i) => {
                m.value = Math.floor(Math.random() * 12) + 3;
            });
        }

        return Charts.generateLineChart(months, {
            width: 550,
            height: 250,
            lineColor: '#8b5cf6',
            fillColor: '#f3e8ff',
            title: 'Last 6 Months'
        });
    }
};

