// ============================================================
// MyHubCares - Adherence Risk Prediction Algorithm (ARPA)
// ============================================================

const LAB_REFERENCE_RANGES = {
    'CD4 Count': {
        low: 500,
        high: 1500,
        unit: 'cells/μL',
        interpretation: 'higher_is_better'
    },
    'Viral Load': {
        max: 200,
        unit: 'copies/mL',
        interpretation: 'lower_is_better',
        note: 'Target: undetectable or <200 copies/mL'
    },
    'Hemoglobin': {
        low: 12,
        high: 16,
        unit: 'g/dL',
        interpretation: 'standard'
    }
};

const ARPA = {
    // Calculate risk score for a patient
    calculateRiskScore(patientId) {
        const weights = {
            missedMedications: 0.35,
            missedAppointments: 0.25,
            labCompliance: 0.20,
            timeSinceLastVisit: 0.20
        };

        const scores = {
            missedMedications: this.scoreMissedMedications(patientId),
            missedAppointments: this.scoreMissedAppointments(patientId),
            labCompliance: this.scoreLabCompliance(patientId),
            timeSinceLastVisit: this.scoreTimeSinceLastVisit(patientId)
        };

        // Calculate weighted total score (0-100)
        const totalScore = Math.round(
            (scores.missedMedications * weights.missedMedications) +
            (scores.missedAppointments * weights.missedAppointments) +
            (scores.labCompliance * weights.labCompliance) +
            (scores.timeSinceLastVisit * weights.timeSinceLastVisit)
        );

        // Calculate adherence rate (inverse of risk)
        const adherenceRate = 100 - totalScore;

        // Determine risk level
        let level = 'low';
        if (totalScore >= 75) level = 'critical';
        else if (totalScore >= 50) level = 'high';
        else if (totalScore >= 25) level = 'medium';

        const riskScore = {
            score: totalScore,
            level: level,
            adherenceRate: adherenceRate,
            components: scores,
            recommendations: this.generateRecommendations(level, scores)
        };

        // Save to patient_risk_scores table
        this.saveRiskScore(patientId, riskScore);

        return riskScore;
    },

    // Save risk score to patient_risk_scores table
    saveRiskScore(patientId, riskScore) {
        const riskScores = JSON.parse(localStorage.getItem('patient_risk_scores')) || [];
        const currentUser = Auth.getCurrentUser();

        const newRiskScore = {
            risk_score_id: 'risk_' + Date.now(),
            patient_id: patientId,
            score: riskScore.score,
            calculated_on: new Date().toISOString().split('T')[0],
            risk_factors: JSON.stringify(riskScore.components),
            recommendations: riskScore.recommendations,
            calculated_by: currentUser ? currentUser.userId : null
        };

        riskScores.push(newRiskScore);
        localStorage.setItem('patient_risk_scores', JSON.stringify(riskScores));
    },

    // Score missed medications (0-100, higher is worse)
    scoreMissedMedications(patientId) {
        const reminders = JSON.parse(localStorage.getItem('reminders')) || [];
        const patientReminders = reminders.filter(r => r.patientId === patientId && r.active);

        if (patientReminders.length === 0) return 0;

        const totalMissed = patientReminders.reduce((sum, r) => sum + (r.missedDoses || 0), 0);
        const expectedDoses = patientReminders.length * 30; // Assume 30 days

        if (expectedDoses === 0) return 0;

        const missedRate = (totalMissed / expectedDoses) * 100;
        return Math.min(100, missedRate * 3); // Amplify the score
    },

    // Score missed appointments (0-100, higher is worse)
    scoreMissedAppointments(patientId) {
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        const patientAppointments = appointments.filter(a => a.patientId === patientId);

        if (patientAppointments.length === 0) return 0;

        const pastAppointments = patientAppointments.filter(a => 
            new Date(a.appointmentDate) < new Date()
        );

        if (pastAppointments.length === 0) return 0;

        const missedCount = pastAppointments.filter(a => 
            a.status === 'cancelled' || a.status === 'no-show'
        ).length;

        const missedRate = (missedCount / pastAppointments.length) * 100;
        return Math.min(100, missedRate * 2); // Amplify the score
    },

    // Score lab compliance (0-100, higher is worse)
    scoreLabCompliance(patientId) {
        const labTests = JSON.parse(localStorage.getItem('labTests')) || [];
        const patientLabTests = labTests.filter(l => l.patientId === patientId);

        // Check if patient has recent lab tests (within 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const recentTests = patientLabTests.filter(l => 
            new Date(l.dateDone) >= sixMonthsAgo
        );

        if (recentTests.length === 0) {
            return 75; // High score if no recent tests
        }

        // Low score if tests are up to date
        return 10;
    },

    // Score time since last visit (0-100, higher is worse)
    scoreTimeSinceLastVisit(patientId) {
        const visits = JSON.parse(localStorage.getItem('visits')) || [];
        const patientVisits = visits.filter(v => v.patientId === patientId);

        if (patientVisits.length === 0) {
            return 80; // High score if no visits
        }

        // Sort by date descending
        patientVisits.sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate));
        const lastVisit = new Date(patientVisits[0].visitDate);
        const today = new Date();

        const daysSinceLastVisit = Math.floor((today - lastVisit) / (1000 * 60 * 60 * 24));

        // Score based on days
        if (daysSinceLastVisit < 30) return 0;
        if (daysSinceLastVisit < 90) return 20;
        if (daysSinceLastVisit < 180) return 50;
        return 90;
    },

    // Generate recommendations based on risk level and scores
    generateRecommendations(level, scores) {
        const recommendations = [];

        if (scores.missedMedications > 30) {
            recommendations.push('Schedule medication adherence counseling');
            recommendations.push('Consider simplifying medication regimen');
        }

        if (scores.missedAppointments > 30) {
            recommendations.push('Implement appointment reminder system');
            recommendations.push('Assess barriers to clinic attendance');
        }

        if (scores.labCompliance > 40) {
            recommendations.push('Schedule overdue laboratory tests');
            recommendations.push('Provide education on importance of monitoring');
        }

        if (scores.timeSinceLastVisit > 40) {
            recommendations.push('Contact patient for follow-up visit');
            recommendations.push('Assess patient engagement and barriers');
        }

        if (level === 'critical' || level === 'high') {
            recommendations.push('PRIORITY: Immediate intervention required');
            recommendations.push('Consider case management referral');
        }

        return recommendations;
    },

    // Get risk trend for a patient (simulated)
    getRiskTrend(patientId) {
        // In a real app, this would analyze historical data
        // For demo, we'll generate sample trend data
        const currentScore = this.calculateRiskScore(patientId).score;
        
        const trend = [];
        for (let i = 6; i >= 0; i--) {
            const variation = Math.random() * 20 - 10; // Random variation
            const score = Math.max(0, Math.min(100, currentScore + variation));
            trend.push({
                month: new Date(Date.now() - (i * 30 * 24 * 60 * 60 * 1000)).toLocaleDateString('en-US', { month: 'short' }),
                score: Math.round(score)
            });
        }

        return trend;
    },

    // Render latest prescription snapshot
    renderMedicationList(patientId) {
        const prescriptions = JSON.parse(localStorage.getItem('prescriptions')) || [];
        const recentPrescription = prescriptions
            .filter(rx => rx.patientId === patientId)
            .sort((a, b) => new Date(b.prescriptionDate) - new Date(a.prescriptionDate))[0];

        if (!recentPrescription || !recentPrescription.drugs || recentPrescription.drugs.length === 0) {
            return '<p class="text-muted">No active prescriptions recorded.</p>';
        }

        return `
            <ul style="list-style:none;padding-left:0;margin:0;">
                ${recentPrescription.drugs.map(drug => `
                    <li style="margin-bottom:10px;">
                        <strong>${drug.drugName}</strong><br>
                        <small>${drug.dosage || ''} ${drug.frequency ? '• ' + drug.frequency : ''} ${drug.duration ? '• ' + drug.duration : ''}</small>
                        ${drug.instructions ? `<div class="text-muted" style="font-size:12px;">${drug.instructions}</div>` : ''}
                    </li>
                `).join('')}
            </ul>
        `;
    },

    // Parse numeric value from lab string
    parseLabValue(value) {
        if (!value) return null;
        const normalized = value.toString().trim().toLowerCase();
        if (normalized.includes('undetectable')) {
            return 0;
        }
        const numeric = parseFloat(normalized.replace(/,/g, ''));
        return isNaN(numeric) ? null : numeric;
    },

    // Determine lab status against reference range
    getLabStatus(testName, resultValue) {
        const reference = LAB_REFERENCE_RANGES[testName];
        if (!reference) {
            return {
                label: 'No Range',
                color: '#6b7280',
                rangeText: 'No reference range configured',
                reference
            };
        }

        const value = this.parseLabValue(resultValue);
        const buildRangeText = () => {
            if (reference.note) return reference.note;
            if (typeof reference.low !== 'undefined' && typeof reference.high !== 'undefined') {
                return `Normal: ${reference.low} – ${reference.high} ${reference.unit || ''}`;
            }
            if (typeof reference.max !== 'undefined') {
                return `Normal: ≤ ${reference.max} ${reference.unit || ''}`;
            }
            return '';
        };

        if (value === null) {
            return {
                label: 'Unknown',
                color: '#6b7280',
                rangeText: buildRangeText(),
                reference
            };
        }

        if (typeof reference.max !== 'undefined') {
            if (value <= reference.max) {
                return { label: 'Normal', color: '#10b981', rangeText: buildRangeText(), reference };
            }
            return { label: 'High', color: '#ef4444', rangeText: buildRangeText(), reference };
        }

        const low = reference.low ?? Number.NEGATIVE_INFINITY;
        const high = reference.high ?? Number.POSITIVE_INFINITY;

        if (value < low) {
            return { label: 'Low', color: '#f59e0b', rangeText: buildRangeText(), reference };
        }
        if (value > high) {
            return { label: 'High', color: '#ef4444', rangeText: buildRangeText(), reference };
        }
        return { label: 'Normal', color: '#10b981', rangeText: buildRangeText(), reference };
    },

    // Render latest lab results snapshot
    renderLatestLabs(patientId) {
        const labTests = JSON.parse(localStorage.getItem('labTests')) || [];
        const latestLabs = labTests
            .filter(test => test.patientId === patientId)
            .sort((a, b) => new Date(b.dateDone) - new Date(a.dateDone))
            .slice(0, 3);

        if (latestLabs.length === 0) {
            return '<p class="text-muted">No laboratory results recorded.</p>';
        }

        return `
            <div>
                ${latestLabs.map(test => {
                    const status = this.getLabStatus(test.testName, test.resultValue);
                    return `
                        <div style="padding:8px 0;border-bottom:1px solid var(--border-color);">
                            <div style="display:flex;justify-content:space-between;align-items:center;">
                                <div>
                                    <strong>${test.testName}</strong>
                                    <div style="font-size:12px;" class="text-muted">${new Date(test.dateDone).toLocaleDateString()}</div>
                                </div>
                                <div style="text-align:right;">
                                    <strong>${test.resultValue} ${test.resultUnit || ''}</strong>
                                    <span style="margin-left:8px;font-weight:bold;color:${status.color};">${status.label}</span>
                                    <div class="text-muted" style="font-size:12px;">${test.labCode || ''}</div>
                                </div>
                            </div>
                            <div style="font-size:12px;color:#6b7280;margin-top:4px;">
                                ${status.rangeText}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    },

    // Display risk details modal
    showRiskDetails(patientId) {
        const patients = JSON.parse(localStorage.getItem('patients')) || [];
        const patient = patients.find(p => p.id === patientId);

        if (!patient) {
            App.showError('Patient not found');
            return;
        }

        const riskScore = this.calculateRiskScore(patientId);
        const trend = this.getRiskTrend(patientId);

        const content = `
            <div class="text-center mb-3">
                <div class="risk-indicator ${riskScore.level}">
                    ${riskScore.score}
                </div>
                <h3 class="mt-2">Risk Level: <span class="risk-badge ${riskScore.level}">${riskScore.level.toUpperCase()}</span></h3>
                <p>Adherence Rate: <strong>${riskScore.adherenceRate}%</strong></p>
            </div>

            <div class="card mb-3">
                <div class="card-header">
                    <h4>Clinical Interpretation</h4>
                </div>
                <div class="card-body">
                    <ul>
                        <li><strong>Multiple factors</strong>: Risk is never decided by only one aspect; attendance, adherence, and lifestyle indicators are always evaluated together.</li>
                        <li><strong>Lab results lead</strong>: Persistently low laboratory values flag trouble even when the patient is perfectly compliant.</li>
                        <li><strong>Possible causes</strong>: Medication may be ineffective (hindi tumatalab) or other hidden issues may be depressing outcomes, so compliance alone cannot lower the risk flag.</li>
                        <li><strong>Impact on classification</strong>: Patients remain high risk until clinical values improve because therapy goals are still unmet.</li>
                        <li><strong>Next step</strong>: Providers should reassess and consider changing or adjusting medications when labs stay low.</li>
                    </ul>
                    <p class="text-muted" style="margin-top: 12px;"><em>A patient can still be high risk even if compliant, because lab results are the clearest proof that treatment is working.</em></p>
                </div>
            </div>

            <div class="card mb-3">
                <div class="card-header">
                    <h4>Treatment & Monitoring Snapshot</h4>
                </div>
                <div class="card-body">
                    <div class="mb-3">
                        <h5 style="margin-bottom:6px;">Active Medications</h5>
                        ${this.renderMedicationList(patientId)}
                    </div>
                    <div>
                        <h5 style="margin-bottom:6px;">Recent Lab Results</h5>
                        ${this.renderLatestLabs(patientId)}
                    </div>
                </div>
            </div>

            <div class="card mb-3">
                <div class="card-header">
                    <h4>Risk Components</h4>
                </div>
                <div class="card-body">
                    <div class="mb-2">
                        <div class="d-flex justify-between mb-1">
                            <span>Missed Medications</span>
                            <strong>${Math.round(riskScore.components.missedMedications)}/100</strong>
                        </div>
                        <div style="background: var(--bg-tertiary); height: 8px; border-radius: 4px;">
                            <div style="background: ${this.getScoreColor(riskScore.components.missedMedications)}; width: ${riskScore.components.missedMedications}%; height: 100%; border-radius: 4px;"></div>
                        </div>
                    </div>
                    <div class="mb-2">
                        <div class="d-flex justify-between mb-1">
                            <span>Missed Appointments</span>
                            <strong>${Math.round(riskScore.components.missedAppointments)}/100</strong>
                        </div>
                        <div style="background: var(--bg-tertiary); height: 8px; border-radius: 4px;">
                            <div style="background: ${this.getScoreColor(riskScore.components.missedAppointments)}; width: ${riskScore.components.missedAppointments}%; height: 100%; border-radius: 4px;"></div>
                        </div>
                    </div>
                    <div class="mb-2">
                        <div class="d-flex justify-between mb-1">
                            <span>Lab Compliance</span>
                            <strong>${Math.round(riskScore.components.labCompliance)}/100</strong>
                        </div>
                        <div style="background: var(--bg-tertiary); height: 8px; border-radius: 4px;">
                            <div style="background: ${this.getScoreColor(riskScore.components.labCompliance)}; width: ${riskScore.components.labCompliance}%; height: 100%; border-radius: 4px;"></div>
                        </div>
                    </div>
                    <div class="mb-2">
                        <div class="d-flex justify-between mb-1">
                            <span>Time Since Last Visit</span>
                            <strong>${Math.round(riskScore.components.timeSinceLastVisit)}/100</strong>
                        </div>
                        <div style="background: var(--bg-tertiary); height: 8px; border-radius: 4px;">
                            <div style="background: ${this.getScoreColor(riskScore.components.timeSinceLastVisit)}; width: ${riskScore.components.timeSinceLastVisit}%; height: 100%; border-radius: 4px;"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card mb-3">
                <div class="card-header">
                    <h4>Recommendations</h4>
                </div>
                <div class="card-body">
                    ${riskScore.recommendations.length > 0 ? `
                        <ul>
                            ${riskScore.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                        </ul>
                    ` : '<p class="text-muted">No specific recommendations at this time. Continue current care plan.</p>'}
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h4>Risk Trend (Last 6 Months)</h4>
                </div>
                <div class="card-body">
                    <div style="display: flex; justify-content: space-between; align-items: flex-end; height: 150px;">
                        ${trend.map(point => `
                            <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 5px;">
                                <div style="background: ${this.getScoreColor(point.score)}; width: 80%; height: ${point.score * 1.5}px; border-radius: 4px 4px 0 0;"></div>
                                <small>${point.month}</small>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        App.showModal(`ARPA Risk Assessment - ${patient.firstName} ${patient.lastName}`, content, '');
    },

    // Get color based on score
    getScoreColor(score) {
        if (score >= 75) return '#ef4444'; // Red
        if (score >= 50) return '#f59e0b'; // Orange
        if (score >= 25) return '#eab308'; // Yellow
        return '#10b981'; // Green
    }
};

