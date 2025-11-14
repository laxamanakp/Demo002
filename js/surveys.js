// ============================================================
// My Hub Cares - Satisfaction Surveys
// ============================================================

const Surveys = {
    // Load surveys page
    loadSurveysPage(container) {
        const role = Auth.getCurrentUser().role;
        const surveys = JSON.parse(localStorage.getItem('satisfactionSurveys')) || [];
        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const facilities = JSON.parse(localStorage.getItem('facilities')) || [];

        // Calculate average satisfaction
        const avgSatisfaction = this.calculateAverageSatisfaction(surveys);

        let html = `
            <div class="dashboard-header">
                <h2>Patient Satisfaction Surveys</h2>
                <p>Monitor and analyze patient feedback</p>
            </div>

            <div class="dashboard-grid">
                <div class="stat-card">
                    <div class="stat-card-header">
                        <div>
                            <div class="stat-value">${surveys.length}</div>
                            <div class="stat-label">Total Responses</div>
                        </div>
                        <div class="stat-card-icon primary">📝</div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-card-header">
                        <div>
                            <div class="stat-value">${avgSatisfaction.toFixed(1)}/4.0</div>
                            <div class="stat-label">Average Satisfaction</div>
                        </div>
                        <div class="stat-card-icon success">⭐</div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-card-header">
                        <div>
                            <div class="stat-value">${this.getSatisfactionRate(surveys)}%</div>
                            <div class="stat-label">Satisfaction Rate</div>
                        </div>
                        <div class="stat-card-icon success">✓</div>
                    </div>
                </div>
            </div>

            ${role !== 'patient' ? `
                <div class="card mt-3">
                    <div class="card-header">
                        <h3 class="card-title">Satisfaction Breakdown</h3>
                    </div>
                    <div class="card-body">
                        <h4>Overall Satisfaction Rate: ${this.getSatisfactionRate(surveys)}%</h4>
                        ${this.renderSatisfactionChart(surveys)}
                        ${this.renderSatisfactionBarChart(surveys)}
                    </div>
                </div>

                <div class="card mt-3">
                    <div class="card-header">
                        <h3 class="card-title">Recent Survey Responses</h3>
                    </div>
                    <div class="card-body">
                        ${this.renderSurveyList(surveys, patients, facilities)}
                    </div>
                </div>
            ` : `
                <div class="card mt-3">
                    <div class="card-header">
                        <h3 class="card-title">Submit Feedback</h3>
                    </div>
                    <div class="card-body">
                        <p>Help us improve our services by completing a satisfaction survey after your visit.</p>
                        <button class="btn btn-primary" onclick="Surveys.showSurveyForm()">
                            Complete Survey
                        </button>
                    </div>
                </div>

                <div class="card mt-3">
                    <div class="card-header">
                        <h3 class="card-title">Your Past Feedback</h3>
                    </div>
                    <div class="card-body">
                        ${this.renderPatientSurveys(surveys)}
                    </div>
                </div>
            `}
        `;

        container.innerHTML = html;
        
        // Calculate and store survey metrics
        this.calculateAndStoreMetrics();
    },

    // Calculate average satisfaction
    calculateAverageSatisfaction(surveys) {
        if (surveys.length === 0) return 0;
        
        const total = surveys.reduce((sum, survey) => {
            return sum + (survey.q1 + survey.q2 + survey.q3 + survey.q4 + survey.q5) / 5;
        }, 0);
        
        return total / surveys.length;
    },

    // Get satisfaction rate (% of 3+ ratings)
    getSatisfactionRate(surveys) {
        if (surveys.length === 0) return 0;
        
        const satisfiedCount = surveys.filter(survey => {
            const avg = (survey.q1 + survey.q2 + survey.q3 + survey.q4 + survey.q5) / 5;
            return avg >= 3;
        }).length;
        
        return Math.round((satisfiedCount / surveys.length) * 100);
    },

    // Calculate and store aggregated survey metrics
    calculateAndStoreMetrics() {
        const surveys = JSON.parse(localStorage.getItem('satisfactionSurveys')) || [];
        const existingMetrics = JSON.parse(localStorage.getItem('survey_metrics')) || [];
        
        if (surveys.length === 0) return;

        // Group surveys by facility and month
        const grouped = {};
        surveys.forEach(survey => {
            const date = new Date(survey.submittedAt || survey.date);
            const monthStart = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
            const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];
            const key = `${survey.facilityId || 'all'}_${monthStart}`;
            
            if (!grouped[key]) {
                grouped[key] = {
                    facility_id: survey.facilityId || null,
                    period_start: monthStart,
                    period_end: monthEnd,
                    surveys: []
                };
            }
            grouped[key].surveys.push(survey);
        });

        // Calculate metrics for each group
        Object.keys(grouped).forEach(key => {
            const group = grouped[key];
            const groupSurveys = group.surveys;
            
            // Check if metric already exists for this period
            const existing = existingMetrics.find(m => 
                m.facility_id === group.facility_id && 
                m.period_start === group.period_start
            );
            
            if (existing) {
                // Update existing metric
                const index = existingMetrics.indexOf(existing);
                existingMetrics[index] = this.calculateMetric(group.facility_id, group.period_start, group.period_end, groupSurveys);
            } else {
                // Add new metric
                existingMetrics.push(this.calculateMetric(group.facility_id, group.period_start, group.period_end, groupSurveys));
            }
        });

        localStorage.setItem('survey_metrics', JSON.stringify(existingMetrics));
    },

    // Calculate single metric from surveys
    calculateMetric(facilityId, periodStart, periodEnd, surveys) {
        const totalResponses = surveys.length;
        
        // Calculate averages
        const avgOverall = surveys.reduce((sum, s) => {
            return sum + (s.q1 + s.q2 + s.q3 + s.q4 + s.q5) / 5;
        }, 0) / totalResponses;
        
        const avgStaff = surveys.reduce((sum, s) => sum + s.q2, 0) / totalResponses;
        const avgWait = surveys.reduce((sum, s) => sum + s.q3, 0) / totalResponses;
        const avgCleanliness = surveys.reduce((sum, s) => sum + s.q4, 0) / totalResponses;
        
        // Calculate recommendation rate
        const recommendedCount = surveys.filter(s => {
            const avg = (s.q1 + s.q2 + s.q3 + s.q4 + s.q5) / 5;
            return avg >= 3;
        }).length;
        const recommendationRate = (recommendedCount / totalResponses) * 100;

        return {
            metric_id: 'metric_' + Date.now() + '_' + (facilityId || 'all'),
            facility_id: facilityId,
            period_start: periodStart,
            period_end: periodEnd,
            total_responses: totalResponses,
            average_overall: Math.round(avgOverall * 100) / 100,
            average_staff: Math.round(avgStaff * 100) / 100,
            average_wait: Math.round(avgWait * 100) / 100,
            average_cleanliness: Math.round(avgCleanliness * 100) / 100,
            recommendation_rate: Math.round(recommendationRate * 100) / 100,
            calculated_at: new Date().toISOString()
        };
    },

    // Render satisfaction chart
    renderSatisfactionChart(surveys) {
        if (surveys.length === 0) {
            return '<p class="text-muted">No survey data available</p>';
        }

        const questions = [
            { id: 'q1', label: 'Service Quality' },
            { id: 'q2', label: 'Staff Courtesy' },
            { id: 'q3', label: 'Wait Time' },
            { id: 'q4', label: 'Facility Cleanliness' },
            { id: 'q5', label: 'Overall Experience' }
        ];

        return questions.map(q => {
            const avg = surveys.reduce((sum, s) => sum + s[q.id], 0) / surveys.length;
            const percentage = (avg / 4) * 100;
            
            return `
                <div class="mb-3">
                    <div class="d-flex justify-between mb-1">
                        <strong>${q.label}</strong>
                        <span>${avg.toFixed(1)}/4.0</span>
                    </div>
                    <div style="background: var(--bg-tertiary); height: 24px; border-radius: 4px;">
                        <div style="background: ${this.getColorForRating(avg)}; width: ${percentage}%; height: 100%; border-radius: 4px; transition: width 0.3s;"></div>
                    </div>
                </div>
            `;
        }).join('');
    },

    // Get color for rating
    getColorForRating(rating) {
        if (rating >= 3.5) return 'var(--success-color)';
        if (rating >= 2.5) return 'var(--warning-color)';
        return 'var(--danger-color)';
    },

    // Render satisfaction bar chart
    renderSatisfactionBarChart(surveys) {
        if (surveys.length === 0) {
            return '';
        }

        const questions = [
            { id: 'q1', label: 'Service Quality' },
            { id: 'q2', label: 'Staff Courtesy' },
            { id: 'q3', label: 'Wait Time' },
            { id: 'q4', label: 'Facility Cleanliness' },
            { id: 'q5', label: 'Overall Experience' }
        ];

        const chartData = questions.map(q => {
            const avg = surveys.reduce((sum, s) => sum + s[q.id], 0) / surveys.length;
            return {
                label: q.label,
                value: Math.round((avg / 4) * 100)
            };
        });

        return `
            <div style="margin-top: 30px;">
                <h4 style="margin-bottom: 20px;">Satisfaction Scores by Category</h4>
                ${Charts.generateBarChart(chartData, {
                    width: 600,
                    height: 300,
                    barColor: '#2563eb',
                    title: 'Average Satisfaction Scores (%)'
                })}
            </div>
        `;
    },

    // Render survey list
    renderSurveyList(surveys, patients, facilities) {
        if (surveys.length === 0) {
            return '<p class="text-muted">No surveys submitted yet</p>';
        }

        return surveys.slice(-10).reverse().map(survey => {
            const patient = patients.find(p => p.id === survey.patientId);
            const facility = facilities.find(f => f.id === survey.facilityId);
            const avgRating = (survey.q1 + survey.q2 + survey.q3 + survey.q4 + survey.q5) / 5;
            
            return `
                <div class="patient-card">
                    <div class="patient-info">
                        <div>
                            <h3>${patient ? patient.firstName + ' ' + patient.lastName : 'Anonymous'}</h3>
                            <div class="patient-meta">
                                <span>🏥 ${facility ? facility.name : 'N/A'}</span>
                                <span>📅 ${new Date(survey.submittedAt).toLocaleDateString()}</span>
                                <span>⭐ ${avgRating.toFixed(1)}/4.0</span>
                            </div>
                            ${survey.remarks ? `<p class="mt-1"><em>"${survey.remarks}"</em></p>` : ''}
                        </div>
                    </div>
                    <div class="patient-actions">
                        <button class="btn btn-sm btn-primary" onclick="Surveys.viewSurveyDetails(${survey.id})">
                            View Details
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    },

    // Render patient surveys
    renderPatientSurveys(surveys) {
        const currentUser = Auth.getCurrentUser();
        const patientSurveys = surveys.filter(s => s.patientId === currentUser.patientId);

        if (patientSurveys.length === 0) {
            return '<p class="text-muted">You haven\'t submitted any feedback yet</p>';
        }

        return patientSurveys.map(survey => {
            const avgRating = (survey.q1 + survey.q2 + survey.q3 + survey.q4 + survey.q5) / 5;
            
            return `
                <div class="card mb-2">
                    <div class="card-body">
                        <div class="d-flex justify-between align-center">
                            <div>
                                <strong>Survey submitted on ${new Date(survey.submittedAt).toLocaleDateString()}</strong>
                                <div class="mt-1">Average Rating: ⭐ ${avgRating.toFixed(1)}/4.0</div>
                            </div>
                            <button class="btn btn-sm btn-outline" onclick="Surveys.viewSurveyDetails(${survey.id})">
                                View
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    // Show survey form
    showSurveyForm() {
        const facilities = JSON.parse(localStorage.getItem('facilities')) || [];
        const currentUser = Auth.getCurrentUser();

        const content = `
            <form id="surveyForm">
                <div class="alert alert-info">
                    Please rate your experience on a scale of 1 to 4:<br>
                    1 = Poor, 2 = Fair, 3 = Good, 4 = Excellent
                </div>

                <div class="form-group">
                    <label class="required">MyHubCares Branch</label>
                    <select id="facilityId" required>
                        <option value="">Select MyHubCares Branch</option>
                        ${facilities.map(f => `<option value="${f.id}" ${f.id === currentUser.facilityId ? 'selected' : ''}>${f.name}</option>`).join('')}
                    </select>
                </div>

                <div class="form-group">
                    <label class="required">1. How would you rate the quality of service?</label>
                    <div class="d-flex gap-2">
                        ${[1, 2, 3, 4].map(val => `
                            <label class="radio-option">
                                <input type="radio" name="q1" value="${val}" required> ${val}
                            </label>
                        `).join('')}
                    </div>
                </div>

                <div class="form-group">
                    <label class="required">2. How courteous and helpful was the staff?</label>
                    <div class="d-flex gap-2">
                        ${[1, 2, 3, 4].map(val => `
                            <label class="radio-option">
                                <input type="radio" name="q2" value="${val}" required> ${val}
                            </label>
                        `).join('')}
                    </div>
                </div>

                <div class="form-group">
                    <label class="required">3. How satisfied are you with the wait time?</label>
                    <div class="d-flex gap-2">
                        ${[1, 2, 3, 4].map(val => `
                            <label class="radio-option">
                                <input type="radio" name="q3" value="${val}" required> ${val}
                            </label>
                        `).join('')}
                    </div>
                </div>

                <div class="form-group">
                    <label class="required">4. How would you rate the cleanliness of the facility?</label>
                    <div class="d-flex gap-2">
                        ${[1, 2, 3, 4].map(val => `
                            <label class="radio-option">
                                <input type="radio" name="q4" value="${val}" required> ${val}
                            </label>
                        `).join('')}
                    </div>
                </div>

                <div class="form-group">
                    <label class="required">5. Overall, how satisfied are you with your experience?</label>
                    <div class="d-flex gap-2">
                        ${[1, 2, 3, 4].map(val => `
                            <label class="radio-option">
                                <input type="radio" name="q5" value="${val}" required> ${val}
                            </label>
                        `).join('')}
                    </div>
                </div>

                <div class="form-group">
                    <label>Additional Comments (Optional)</label>
                    <textarea id="remarks" rows="3" placeholder="Share any additional feedback..."></textarea>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="Surveys.submitSurvey()">Submit Survey</button>
        `;

        App.showModal('Patient Satisfaction Survey', content, footer);
    },

    // Submit survey
    submitSurvey() {
        const form = document.getElementById('surveyForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const surveys = JSON.parse(localStorage.getItem('satisfactionSurveys')) || [];
        const currentUser = Auth.getCurrentUser();

        const newSurvey = {
            id: surveys.length > 0 ? Math.max(...surveys.map(s => s.id)) + 1 : 1,
            patientId: currentUser.patientId,
            facilityId: parseInt(document.getElementById('facilityId').value),
            q1: parseInt(document.querySelector('input[name="q1"]:checked').value),
            q2: parseInt(document.querySelector('input[name="q2"]:checked').value),
            q3: parseInt(document.querySelector('input[name="q3"]:checked').value),
            q4: parseInt(document.querySelector('input[name="q4"]:checked').value),
            q5: parseInt(document.querySelector('input[name="q5"]:checked').value),
            remarks: document.getElementById('remarks').value,
            submittedAt: new Date().toISOString()
        };

        surveys.push(newSurvey);
        localStorage.setItem('satisfactionSurveys', JSON.stringify(surveys));

        App.closeModal();
        App.showSuccess('Thank you for your feedback!');
        App.loadPage('surveys');
    },

    // View survey details
    viewSurveyDetails(surveyId) {
        const surveys = JSON.parse(localStorage.getItem('satisfactionSurveys')) || [];
        const survey = surveys.find(s => s.id === surveyId);

        if (!survey) {
            App.showError('Survey not found');
            return;
        }

        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const facilities = JSON.parse(localStorage.getItem('facilities')) || [];
        const patient = patients.find(p => p.id === survey.patientId);
        const facility = facilities.find(f => f.id === survey.facilityId);

        const questions = [
            'Quality of Service',
            'Staff Courtesy',
            'Wait Time',
            'Facility Cleanliness',
            'Overall Experience'
        ];

        const avgRating = (survey.q1 + survey.q2 + survey.q3 + survey.q4 + survey.q5) / 5;

        const content = `
            <div class="form-group">
                <label>Patient</label>
                <input type="text" value="${patient ? patient.firstName + ' ' + patient.lastName : 'Anonymous'}" readonly>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>MyHubCares Branch</label>
                    <input type="text" value="${facility ? facility.name : 'N/A'}" readonly>
                </div>
                <div class="form-group">
                    <label>Date Submitted</label>
                    <input type="text" value="${new Date(survey.submittedAt).toLocaleDateString()}" readonly>
                </div>
            </div>
            <div class="form-group">
                <label>Average Rating</label>
                <input type="text" value="⭐ ${avgRating.toFixed(1)}/4.0" readonly>
            </div>

            <h4 class="mt-3">Detailed Ratings</h4>
            ${questions.map((q, i) => `
                <div class="form-group">
                    <label>${i + 1}. ${q}</label>
                    <input type="text" value="${survey['q' + (i + 1)]}/4" readonly>
                </div>
            `).join('')}

            ${survey.remarks ? `
                <div class="form-group mt-3">
                    <label>Additional Comments</label>
                    <textarea rows="3" readonly>${survey.remarks}</textarea>
                </div>
            ` : ''}
        `;

        App.showModal('Survey Response Details', content, '');
    }
};

