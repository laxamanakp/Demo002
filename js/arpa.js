// ============================================================
// MyHubCares - Adherence Risk Prediction Algorithm (ARPA)
// ============================================================

// ============================================================
// HIV Lab Reference Ranges with Risk Stratification
// ============================================================

const LAB_REFERENCE_RANGES = {
    // 1. Viral Load (HIV RNA)
    'Viral Load': {
        unit: 'copies/mL',
        interpretation: 'lower_is_better',
        ranges: [
            { max: 50, level: 'optimal', label: 'Undetectable', color: '#10b981', riskScore: 0 },
            { max: 200, level: 'low', label: 'Controlled', color: '#22c55e', riskScore: 10 },
            { max: 10000, level: 'moderate', label: 'Moderate', color: '#f59e0b', riskScore: 40 },
            { max: Infinity, level: 'high', label: 'High Risk', color: '#ef4444', riskScore: 80 }
        ],
        systemAction: 'High viral load increases ARPA risk score, flags for adherence counseling or treatment review',
        clinicalNote: 'Target: Undetectable (<50 copies/mL). Sustained viremia may indicate treatment failure or non-adherence.'
    },

    // 2. CD4 Count
    'CD4 Count': {
        unit: 'cells/μL',
        interpretation: 'higher_is_better',
        ranges: [
            { min: 500, max: 1500, level: 'normal', label: 'Normal', color: '#10b981', riskScore: 0 },
            { min: 350, max: 499, level: 'mild', label: 'Mild Immunosuppression', color: '#22c55e', riskScore: 15 },
            { min: 200, max: 349, level: 'moderate', label: 'Moderate Immunosuppression', color: '#f59e0b', riskScore: 45 },
            { min: 0, max: 199, level: 'severe', label: 'Severe Immunosuppression', color: '#ef4444', riskScore: 90 }
        ],
        systemAction: 'CD4 <200 triggers intensive follow-up, opportunistic infection alert, and patient prioritization',
        clinicalNote: 'CD4 <200 = AIDS-defining. Requires OI prophylaxis and urgent intervention.'
    },

    // 3. Creatinine (Kidney Function)
    'Creatinine': {
        unit: 'mg/dL',
        interpretation: 'standard',
        ranges: [
            { min: 0.6, max: 1.3, level: 'normal', label: 'Normal', color: '#10b981', riskScore: 0 },
            { min: 1.31, max: 1.5, level: 'mild', label: 'Mild Impairment', color: '#eab308', riskScore: 20 },
            { min: 1.51, max: 2.0, level: 'moderate', label: 'Moderate Impairment', color: '#f59e0b', riskScore: 50 },
            { min: 2.01, max: Infinity, level: 'severe', label: 'Severe Impairment', color: '#ef4444', riskScore: 85 }
        ],
        systemAction: 'Elevated creatinine triggers alerts for ARV dose adjustment or nephrology referral',
        clinicalNote: 'Critical for Tenofovir (TDF) monitoring. Consider switch to TAF if impaired.'
    },

    // 4. HBsAg (Hepatitis B Surface Antigen)
    'HBsAg': {
        unit: '',
        interpretation: 'qualitative',
        ranges: [
            { value: 'Negative', level: 'normal', label: 'Negative', color: '#10b981', riskScore: 0 },
            { value: 'Positive', level: 'positive', label: 'HBV Co-infection', color: '#ef4444', riskScore: 35 }
        ],
        systemAction: 'Positive HBsAg modifies ARV selection (requires TDF/TAF-containing regimen)',
        clinicalNote: 'HBV co-infection requires Tenofovir + Lamivudine/Emtricitabine. Monitor HBV DNA and liver enzymes.'
    },

    // 5. Hepatitis C (Anti-HCV)
    'Anti-HCV': {
        unit: '',
        interpretation: 'qualitative',
        ranges: [
            { value: 'Negative', level: 'normal', label: 'Negative', color: '#10b981', riskScore: 0 },
            { value: 'Positive', level: 'positive', label: 'HCV Exposure', color: '#f59e0b', riskScore: 25 }
        ],
        systemAction: 'Positive Anti-HCV requires HCV RNA confirmation and liver evaluation',
        clinicalNote: 'If HCV RNA positive, consider DAA treatment. Monitor for liver fibrosis.'
    },

    // 6. Chest X-Ray (CXR)
    'Chest X-Ray': {
        unit: '',
        interpretation: 'qualitative',
        ranges: [
            { value: 'Normal', level: 'normal', label: 'Normal', color: '#10b981', riskScore: 0 },
            { value: 'Abnormal', level: 'abnormal', label: 'Abnormal', color: '#ef4444', riskScore: 60 }
        ],
        findings: ['Infiltrates', 'Cavitation', 'Fibrosis', 'Effusion', 'Lymphadenopathy'],
        systemAction: 'Abnormal CXR triggers TB workup (GeneXpert), pulmonary evaluation, ARPA risk escalation',
        clinicalNote: 'Any abnormality in HIV+ patient warrants TB investigation.'
    },

    // 7. GeneXpert MTB/RIF
    'GeneXpert': {
        unit: '',
        interpretation: 'qualitative',
        ranges: [
            { value: 'MTB Not Detected', level: 'normal', label: 'Negative', color: '#10b981', riskScore: 0 },
            { value: 'Negative', level: 'normal', label: 'Negative', color: '#10b981', riskScore: 0 },
            { value: 'MTB Detected, RIF Sensitive', level: 'tb_sensitive', label: 'TB (Drug Sensitive)', color: '#f59e0b', riskScore: 50 },
            { value: 'MTB Detected, RIF Resistant', level: 'tb_resistant', label: 'TB (Drug Resistant)', color: '#ef4444', riskScore: 85 }
        ],
        quantitative: ['Trace', 'Very Low', 'Low', 'Medium', 'High'],
        systemAction: 'Positive result triggers TB treatment protocol. RIF resistance requires MDR-TB regimen.',
        clinicalNote: 'Drug-resistant TB requires specialist referral and extended treatment.'
    },

    // 8. HIV Drug Resistance (Genotype)
    'HIVDR': {
        unit: '',
        interpretation: 'qualitative',
        ranges: [
            { value: 'No Mutations', level: 'normal', label: 'No Resistance', color: '#10b981', riskScore: 0 },
            { value: 'NRTI Mutations', level: 'resistance', label: 'NRTI Resistance', color: '#f59e0b', riskScore: 45 },
            { value: 'NNRTI Mutations', level: 'resistance', label: 'NNRTI Resistance', color: '#f59e0b', riskScore: 45 },
            { value: 'PI Mutations', level: 'resistance', label: 'PI Resistance', color: '#f59e0b', riskScore: 50 },
            { value: 'INSTI Mutations', level: 'resistance', label: 'INSTI Resistance', color: '#ef4444', riskScore: 60 },
            { value: 'Multi-class Resistance', level: 'high_resistance', label: 'Multi-class Resistance', color: '#ef4444', riskScore: 80 }
        ],
        systemAction: 'Resistance mutations guide ARV regimen adjustment. Critical for viral suppression.',
        clinicalNote: 'Genotype results guide selection of active ARV agents.'
    },

    // 9. ALT (Liver Function)
    'ALT': {
        unit: 'U/L',
        interpretation: 'lower_is_better',
        ranges: [
            { max: 40, level: 'normal', label: 'Normal', color: '#10b981', riskScore: 0 },
            { max: 80, level: 'mild', label: 'Mild Elevation', color: '#eab308', riskScore: 15 },
            { max: 200, level: 'moderate', label: 'Moderate Elevation', color: '#f59e0b', riskScore: 40 },
            { max: Infinity, level: 'severe', label: 'Severe Elevation', color: '#ef4444', riskScore: 70 }
        ],
        systemAction: 'Elevated ALT may require ARV adjustment. Monitor for hepatotoxicity.',
        clinicalNote: 'Common with NVP, EFV. Rule out viral hepatitis if persistently elevated.'
    },

    // 10. AST (Liver Function)
    'AST': {
        unit: 'U/L',
        interpretation: 'lower_is_better',
        ranges: [
            { max: 40, level: 'normal', label: 'Normal', color: '#10b981', riskScore: 0 },
            { max: 80, level: 'mild', label: 'Mild Elevation', color: '#eab308', riskScore: 15 },
            { max: 200, level: 'moderate', label: 'Moderate Elevation', color: '#f59e0b', riskScore: 40 },
            { max: Infinity, level: 'severe', label: 'Severe Elevation', color: '#ef4444', riskScore: 70 }
        ],
        systemAction: 'Elevated AST may indicate liver damage. Evaluate with ALT ratio.',
        clinicalNote: 'AST:ALT ratio >2 may suggest alcoholic liver disease.'
    },

    // 11. Hemoglobin
    'Hemoglobin': {
        unit: 'g/dL',
        interpretation: 'standard',
        ranges: [
            { min: 12, max: 18, level: 'normal', label: 'Normal', color: '#10b981', riskScore: 0 },
            { min: 10, max: 11.9, level: 'mild', label: 'Mild Anemia', color: '#eab308', riskScore: 15 },
            { min: 8, max: 9.9, level: 'moderate', label: 'Moderate Anemia', color: '#f59e0b', riskScore: 35 },
            { min: 0, max: 7.9, level: 'severe', label: 'Severe Anemia', color: '#ef4444', riskScore: 70 }
        ],
        systemAction: 'Severe anemia may contraindicate AZT. Investigate cause.',
        clinicalNote: 'AZT can cause bone marrow suppression. Switch to TDF/TAF if needed.'
    },

    // 12. Platelet Count
    'Platelet Count': {
        unit: 'x10³/μL',
        interpretation: 'standard',
        ranges: [
            { min: 150, max: 400, level: 'normal', label: 'Normal', color: '#10b981', riskScore: 0 },
            { min: 100, max: 149, level: 'mild', label: 'Mild Thrombocytopenia', color: '#eab308', riskScore: 15 },
            { min: 50, max: 99, level: 'moderate', label: 'Moderate Thrombocytopenia', color: '#f59e0b', riskScore: 40 },
            { min: 0, max: 49, level: 'severe', label: 'Severe Thrombocytopenia', color: '#ef4444', riskScore: 70 }
        ],
        systemAction: 'Low platelets may indicate bone marrow suppression or ITP.',
        clinicalNote: 'HIV-associated thrombocytopenia often improves with ART.'
    },

    // 13. Blood Glucose (Fasting)
    'Blood Glucose': {
        unit: 'mg/dL',
        interpretation: 'standard',
        ranges: [
            { min: 70, max: 99, level: 'normal', label: 'Normal', color: '#10b981', riskScore: 0 },
            { min: 100, max: 125, level: 'prediabetes', label: 'Prediabetes', color: '#eab308', riskScore: 20 },
            { min: 126, max: Infinity, level: 'diabetes', label: 'Diabetes Range', color: '#ef4444', riskScore: 45 }
        ],
        systemAction: 'Elevated glucose requires metabolic screening. Some ARVs affect glucose metabolism.',
        clinicalNote: 'PIs and some NRTIs can cause insulin resistance.'
    },

    // 14. Total Cholesterol
    'Cholesterol': {
        unit: 'mg/dL',
        interpretation: 'lower_is_better',
        ranges: [
            { max: 200, level: 'normal', label: 'Desirable', color: '#10b981', riskScore: 0 },
            { max: 239, level: 'borderline', label: 'Borderline High', color: '#eab308', riskScore: 15 },
            { max: Infinity, level: 'high', label: 'High', color: '#ef4444', riskScore: 35 }
        ],
        systemAction: 'Elevated cholesterol may require lipid-lowering therapy or ARV switch.',
        clinicalNote: 'EFV and PIs can cause dyslipidemia. Consider INSTI-based regimen.'
    },

    // 15. RPR/VDRL (Syphilis)
    'RPR': {
        unit: '',
        interpretation: 'qualitative',
        ranges: [
            { value: 'Non-reactive', level: 'normal', label: 'Negative', color: '#10b981', riskScore: 0 },
            { value: 'Negative', level: 'normal', label: 'Negative', color: '#10b981', riskScore: 0 },
            { value: 'Reactive', level: 'positive', label: 'Syphilis Detected', color: '#ef4444', riskScore: 30 },
            { value: 'Positive', level: 'positive', label: 'Syphilis Detected', color: '#ef4444', riskScore: 30 }
        ],
        systemAction: 'Reactive RPR requires confirmatory testing and treatment.',
        clinicalNote: 'Syphilis co-infection common in HIV. Treat with Penicillin G.'
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

    // Determine lab status against reference range (legacy compatibility)
    getLabStatus(testName, resultValue) {
        return this.getLabInterpretation(testName, resultValue);
    },

    // Get comprehensive lab interpretation with risk level
    getLabInterpretation(testName, resultValue) {
        const reference = LAB_REFERENCE_RANGES[testName];
        if (!reference) {
            return {
                level: 'unknown',
                label: 'No Reference',
                color: '#6b7280',
                riskScore: 0,
                rangeText: 'No reference range configured',
                systemAction: null,
                clinicalNote: null
            };
        }

        // Handle qualitative tests (HBsAg, GeneXpert, RPR, etc.)
        if (reference.interpretation === 'qualitative') {
            const normalizedValue = (resultValue || '').toString().trim().toLowerCase();
            for (const range of reference.ranges) {
                if (normalizedValue.includes(range.value.toLowerCase())) {
                    return {
                        level: range.level,
                        label: range.label,
                        color: range.color,
                        riskScore: range.riskScore,
                        rangeText: `Expected: ${reference.ranges[0].value}`,
                        systemAction: reference.systemAction,
                        clinicalNote: reference.clinicalNote
                    };
                }
            }
            // Default for unmatched qualitative
            return {
                level: 'unknown',
                label: resultValue || 'Unknown',
                color: '#6b7280',
                riskScore: 0,
                rangeText: '',
                systemAction: reference.systemAction,
                clinicalNote: reference.clinicalNote
            };
        }

        // Handle quantitative tests
        const value = this.parseLabValue(resultValue);
        if (value === null) {
            // Check for special values like "Undetectable"
            const normalizedValue = (resultValue || '').toString().trim().toLowerCase();
            if (normalizedValue.includes('undetectable') || normalizedValue.includes('<20') || normalizedValue.includes('< 20')) {
                const optimalRange = reference.ranges.find(r => r.level === 'optimal' || r.level === 'normal');
                if (optimalRange) {
                    return {
                        level: optimalRange.level,
                        label: optimalRange.label,
                        color: optimalRange.color,
                        riskScore: optimalRange.riskScore,
                        rangeText: this.buildRangeText(reference),
                        systemAction: reference.systemAction,
                        clinicalNote: reference.clinicalNote,
                        value: 0
                    };
                }
            }
            return {
                level: 'unknown',
                label: 'Unable to parse',
                color: '#6b7280',
                riskScore: 0,
                rangeText: this.buildRangeText(reference),
                systemAction: reference.systemAction,
                clinicalNote: reference.clinicalNote
            };
        }

        // Find matching range based on interpretation type
        for (const range of reference.ranges) {
            let matches = false;
            
            if (reference.interpretation === 'lower_is_better') {
                // For viral load, ALT, cholesterol - check max only
                if (value <= (range.max || Infinity)) {
                    matches = true;
                }
            } else if (reference.interpretation === 'higher_is_better') {
                // For CD4 - higher values in range are better
                const min = range.min ?? 0;
                const max = range.max ?? Infinity;
                if (value >= min && value <= max) {
                    matches = true;
                }
            } else {
                // Standard range check (both min and max matter)
                const min = range.min ?? 0;
                const max = range.max ?? Infinity;
                if (value >= min && value <= max) {
                    matches = true;
                }
            }

            if (matches) {
                return {
                    level: range.level,
                    label: range.label,
                    color: range.color,
                    riskScore: range.riskScore,
                    rangeText: this.buildRangeText(reference),
                    systemAction: reference.systemAction,
                    clinicalNote: reference.clinicalNote,
                    value: value
                };
            }
        }

        // Fallback - check if value is below all ranges or above all ranges
        const lowestRange = reference.ranges[reference.ranges.length - 1];
        return {
            level: lowestRange.level || 'unknown',
            label: lowestRange.label || 'Out of range',
            color: lowestRange.color || '#ef4444',
            riskScore: lowestRange.riskScore || 50,
            rangeText: this.buildRangeText(reference),
            systemAction: reference.systemAction,
            clinicalNote: reference.clinicalNote,
            value: value
        };
    },

    // Build range text for display
    buildRangeText(reference) {
        if (!reference) return '';
        
        const normalRange = reference.ranges ? reference.ranges.find(r => r.level === 'normal' || r.level === 'optimal') : null;
        if (normalRange) {
            if (normalRange.min !== undefined && normalRange.max !== undefined && normalRange.max !== Infinity) {
                return `Normal: ${normalRange.min} – ${normalRange.max} ${reference.unit || ''}`;
            }
            if (normalRange.max !== undefined && normalRange.max !== Infinity) {
                return `Target: < ${normalRange.max} ${reference.unit || ''}`;
            }
            if (normalRange.min !== undefined) {
                return `Target: > ${normalRange.min} ${reference.unit || ''}`;
            }
        }
        
        if (reference.clinicalNote) {
            return reference.clinicalNote.substring(0, 60) + (reference.clinicalNote.length > 60 ? '...' : '');
        }
        
        return '';
    },

    // Calculate lab-based risk score for ARPA integration
    calculateLabRiskScore(patientId) {
        const labTests = JSON.parse(localStorage.getItem('labTests')) || [];
        const patientLabs = labTests.filter(l => l.patientId === patientId);

        if (patientLabs.length === 0) return { score: 50, details: [], hasData: false };

        // Get most recent result for each test type
        const latestByType = {};
        patientLabs.forEach(lab => {
            if (!latestByType[lab.testName] || new Date(lab.dateDone) > new Date(latestByType[lab.testName].dateDone)) {
                latestByType[lab.testName] = lab;
            }
        });

        let totalRisk = 0;
        let testCount = 0;
        const details = [];

        // Priority tests for HIV care (weighted more heavily)
        const priorityTests = ['Viral Load', 'CD4 Count', 'Creatinine', 'HBsAg', 'GeneXpert', 'HIVDR'];
        
        Object.values(latestByType).forEach(lab => {
            const interpretation = this.getLabInterpretation(lab.testName, lab.resultValue);
            const isPriority = priorityTests.includes(lab.testName);
            const weight = isPriority ? 1.5 : 1;
            
            totalRisk += interpretation.riskScore * weight;
            testCount += weight;

            details.push({
                testName: lab.testName,
                value: lab.resultValue,
                unit: lab.resultUnit,
                level: interpretation.level,
                label: interpretation.label,
                riskScore: interpretation.riskScore,
                color: interpretation.color,
                date: lab.dateDone,
                systemAction: interpretation.systemAction,
                clinicalNote: interpretation.clinicalNote
            });
        });

        const averageRisk = testCount > 0 ? Math.round(totalRisk / testCount) : 50;

        return {
            score: averageRisk,
            details: details.sort((a, b) => b.riskScore - a.riskScore),
            hasData: true
        };
    },

    // Get critical lab alerts for a patient
    getCriticalLabAlerts(patientId) {
        const labRisk = this.calculateLabRiskScore(patientId);
        const alerts = [];

        labRisk.details.forEach(lab => {
            if (lab.riskScore >= 45) {
                alerts.push({
                    testName: lab.testName,
                    value: lab.value,
                    label: lab.label,
                    color: lab.color,
                    action: lab.systemAction,
                    date: lab.date
                });
            }
        });

        return alerts;
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

