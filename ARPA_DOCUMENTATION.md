# MyHubCares - ARPA (Adherence Risk Prediction Algorithm)

## 📋 Overview

ARPA is the **Adherence Risk Prediction Algorithm** used by MyHubCares to identify HIV patients at risk of treatment failure, non-adherence, or poor health outcomes. It calculates a risk score (0-100) based on multiple behavioral and clinical factors.

---

## 🎯 Purpose

- **Early Intervention**: Flag patients before they become lost to follow-up
- **Resource Prioritization**: Direct case manager attention to high-risk patients
- **Clinical Decision Support**: Provide actionable recommendations
- **Outcome Tracking**: Monitor adherence trends over time

---

## 📊 Risk Score Calculation

### Formula

```
Total Risk Score = (Missed Medications × 0.35) + 
                   (Missed Appointments × 0.25) + 
                   (Lab Compliance × 0.20) + 
                   (Time Since Last Visit × 0.20)
```

### Component Weights

| Component | Weight | Data Source | What It Measures |
|-----------|--------|-------------|------------------|
| **Missed Medications** | 35% | `reminders` table | Number of missed doses in last 30 days |
| **Missed Appointments** | 25% | `appointments` table | Rate of cancelled/no-show appointments |
| **Lab Compliance** | 20% | `labTests` table | Whether patient has tests in last 6 months |
| **Time Since Last Visit** | 20% | `visits` table | Days since last clinical encounter |

### Scoring Rules

#### Missed Medications (0-100)
```javascript
missedRate = (missedDoses / expectedDoses) × 100
score = min(100, missedRate × 3)  // Amplified for sensitivity
```

#### Missed Appointments (0-100)
```javascript
missedRate = (cancelledOrNoShow / totalPastAppointments) × 100
score = min(100, missedRate × 2)  // Amplified for sensitivity
```

#### Lab Compliance (0-100)
| Condition | Score |
|-----------|-------|
| Has tests within 6 months | 10 |
| No recent tests | 75 |

#### Time Since Last Visit (0-100)
| Days Since Visit | Score |
|------------------|-------|
| < 30 days | 0 |
| 30-89 days | 20 |
| 90-179 days | 50 |
| ≥ 180 days | 90 |

---

## 🚦 Risk Level Classification

| Score Range | Level | Color | Action Required |
|-------------|-------|-------|-----------------|
| 0-24 | **Low** | 🟢 Green | Continue standard care |
| 25-49 | **Medium** | 🟡 Yellow | Enhanced monitoring |
| 50-74 | **High** | 🟠 Orange | Active intervention needed |
| 75-100 | **Critical** | 🔴 Red | Immediate case management |

---

## 🔬 Laboratory Risk Integration

ARPA also calculates risk from laboratory values using the `calculateLabRiskScore()` function.

### HIV-Specific Lab Reference Ranges

#### 1. Viral Load (HIV RNA)
| Value (copies/mL) | Risk Level | Label | Risk Score |
|-------------------|------------|-------|------------|
| < 50 | Optimal | Undetectable | 0 |
| 50-200 | Low | Controlled | 10 |
| 200-10,000 | Moderate | Moderate | 40 |
| > 10,000 | High | High Risk | **80** |

**System Action**: High viral load triggers adherence counseling flag and treatment review.

#### 2. CD4 Count
| Value (cells/μL) | Risk Level | Label | Risk Score |
|------------------|------------|-------|------------|
| 500-1500 | Normal | Normal | 0 |
| 350-499 | Mild | Mild Immunosuppression | 15 |
| 200-349 | Moderate | Moderate Immunosuppression | 45 |
| < 200 | Severe | Severe Immunosuppression | **90** |

**System Action**: CD4 < 200 triggers intensive follow-up, OI prophylaxis alert, patient prioritization.

#### 3. Creatinine (Kidney Function)
| Value (mg/dL) | Risk Level | Label | Risk Score |
|---------------|------------|-------|------------|
| 0.6-1.3 | Normal | Normal | 0 |
| 1.31-1.5 | Mild | Mild Impairment | 20 |
| 1.51-2.0 | Moderate | Moderate Impairment | 50 |
| > 2.0 | Severe | Severe Impairment | **85** |

**System Action**: Elevated creatinine alerts for Tenofovir dose adjustment or nephrology referral.

#### 4. HBsAg (Hepatitis B)
| Value | Risk Level | Label | Risk Score |
|-------|------------|-------|------------|
| Negative | Normal | Negative | 0 |
| Positive | Positive | HBV Co-infection | 35 |

**System Action**: Modifies ARV selection (requires TDF/TAF-containing regimen).

#### 5. GeneXpert MTB/RIF (TB)
| Value | Risk Level | Label | Risk Score |
|-------|------------|-------|------------|
| MTB Not Detected | Normal | Negative | 0 |
| MTB Detected, RIF Sensitive | TB Sensitive | TB (Drug Sensitive) | 50 |
| MTB Detected, RIF Resistant | TB Resistant | TB (Drug Resistant) | **85** |

**System Action**: Positive triggers TB treatment protocol. RIF resistance requires MDR-TB regimen.

#### 6. HIVDR (Drug Resistance Genotype)
| Value | Risk Level | Label | Risk Score |
|-------|------------|-------|------------|
| No Mutations | Normal | No Resistance | 0 |
| NRTI Mutations | Resistance | NRTI Resistance | 45 |
| NNRTI Mutations | Resistance | NNRTI Resistance | 45 |
| PI Mutations | Resistance | PI Resistance | 50 |
| INSTI Mutations | Resistance | INSTI Resistance | 60 |
| Multi-class | High Resistance | Multi-class Resistance | **80** |

**System Action**: Resistance mutations guide ARV regimen adjustment.

#### 7. ALT/AST (Liver Function)
| Value (U/L) | Risk Level | Label | Risk Score |
|-------------|------------|-------|------------|
| ≤ 40 | Normal | Normal | 0 |
| 41-80 | Mild | Mild Elevation | 15 |
| 81-200 | Moderate | Moderate Elevation | 40 |
| > 200 | Severe | Severe Elevation | 70 |

#### 8. Hemoglobin
| Value (g/dL) | Risk Level | Label | Risk Score |
|--------------|------------|-------|------------|
| 12-18 | Normal | Normal | 0 |
| 10-11.9 | Mild | Mild Anemia | 15 |
| 8-9.9 | Moderate | Moderate Anemia | 35 |
| < 8 | Severe | Severe Anemia | 70 |

**System Action**: Severe anemia may contraindicate AZT.

---

## 🔗 Module Integration Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              ARPA MODULE                                     │
│                           (js/arpa.js)                                       │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
        ┌───────────────┬───────────┼───────────┬───────────────┐
        │               │           │           │               │
        ▼               ▼           ▼           ▼               ▼
┌───────────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐
│   REMINDERS   │ │APPOINTMENTS│ │ LAB TESTS │ │  VISITS   │ │PRESCRIPTIONS│
│               │ │           │ │           │ │           │ │           │
│ missedDoses   │ │ status:   │ │ testName  │ │ visitDate │ │ drugs[]   │
│ lastTaken     │ │ cancelled │ │ resultVal │ │ vitals    │ │ dosage    │
│ frequency     │ │ no-show   │ │ dateDone  │ │ diagnosis │ │ frequency │
└───────────────┘ └───────────┘ └───────────┘ └───────────┘ └───────────┘
        │               │           │           │               │
        └───────────────┴───────────┴───────────┴───────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │      RISK SCORE OUTPUT        │
                    │                               │
                    │  • score (0-100)              │
                    │  • level (low/med/high/crit)  │
                    │  • adherenceRate (%)          │
                    │  • components breakdown       │
                    │  • recommendations[]          │
                    └───────────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        ▼                           ▼                           ▼
┌───────────────┐         ┌───────────────┐         ┌───────────────┐
│   DASHBOARD   │         │   PATIENTS    │         │   LAB TESTS   │
│               │         │               │         │               │
│ High-risk     │         │ Risk badge    │         │ Lab interpret │
│ patient count │         │ on cards      │         │ risk colors   │
│ alerts panel  │         │ ARPA details  │         │ clinical note │
└───────────────┘         └───────────────┘         └───────────────┘
```

---

## 📍 Where ARPA Is Used

### 1. Patient List (`js/patients.js`)
- Shows risk badge on each patient card
- Color-coded: 🟢 Low | 🟡 Medium | 🟠 High | 🔴 Critical
- "ARPA" button opens detailed risk modal

### 2. Dashboard (`js/dashboard.js`)
- Counts patients by risk level for pie chart
- Generates alerts for high/critical risk patients
- Displays "High-Risk Patients" panel for physicians

### 3. Lab Tests (`js/lab-tests.js`)
- `getLabInterpretation()` shows risk level for each result
- Color-coded badges: ✓ Normal | ⚠️ Warning | 🔴 Critical
- Clinical notes and system actions displayed in detail view

### 4. Patient Profile
- ARPA risk details modal shows:
  - Overall risk score with visual indicator
  - Component breakdown with progress bars
  - Active medications snapshot
  - Recent lab results with interpretation
  - Automated recommendations

---

## 💡 ARPA Recommendations

Based on risk levels, ARPA automatically generates recommendations:

### High Missed Medications (>30)
- Schedule medication adherence counseling
- Consider simplifying medication regimen

### High Missed Appointments (>30)
- Implement appointment reminder system
- Assess barriers to clinic attendance

### Poor Lab Compliance (>40)
- Schedule overdue laboratory tests
- Provide education on importance of monitoring

### Long Time Since Visit (>40)
- Contact patient for follow-up visit
- Assess patient engagement and barriers

### Critical/High Risk Level
- **PRIORITY**: Immediate intervention required
- Consider case management referral

---

## 🔧 Key Functions

### `calculateRiskScore(patientId)`
Main function that computes the weighted risk score.

```javascript
const riskScore = ARPA.calculateRiskScore(patientId);
// Returns: { score, level, adherenceRate, components, recommendations }
```

### `getLabInterpretation(testName, resultValue)`
Interprets a lab result against reference ranges.

```javascript
const interpretation = ARPA.getLabInterpretation('Viral Load', '45000');
// Returns: { level, label, color, riskScore, rangeText, systemAction, clinicalNote }
```

### `calculateLabRiskScore(patientId)`
Computes risk score based on lab values only.

```javascript
const labRisk = ARPA.calculateLabRiskScore(patientId);
// Returns: { score, details[], hasData }
```

### `getCriticalLabAlerts(patientId)`
Returns critical lab alerts (riskScore ≥ 45).

```javascript
const alerts = ARPA.getCriticalLabAlerts(patientId);
// Returns: [{ testName, value, label, color, action, date }]
```

### `showRiskDetails(patientId)`
Opens the ARPA risk assessment modal for a patient.

---

## 📝 Clinical Interpretation Notes

> **A patient can still be HIGH RISK even if fully compliant.**

This happens when:
1. **Lab values remain poor** despite adherence (treatment may not be working)
2. **Medication may be ineffective** (resistance, drug interactions)
3. **Underlying conditions** affecting treatment response

### Key Principle
> Lab results are the clearest proof that treatment is working. Risk classification considers both behavior (adherence) AND outcomes (lab values).

### Action Required
When a compliant patient has high risk:
- Reassess current ARV regimen
- Check for drug resistance (HIVDR genotype)
- Evaluate for drug interactions
- Consider treatment switch

---

## 🗂️ Data Storage

ARPA stores calculated risk scores in localStorage:

```javascript
// patient_risk_scores table
{
    risk_score_id: 'risk_1732500000',
    patient_id: 1,
    score: 45,
    calculated_on: '2025-11-25',
    risk_factors: '{"missedMedications":20,"missedAppointments":30,...}',
    recommendations: ['Schedule adherence counseling', ...],
    calculated_by: 2
}
```

---

## 🔄 Future Enhancements

1. **Integrate lab values into main risk score** - Currently separate
2. **Machine learning model** - Predict risk based on historical patterns
3. **Trend analysis** - Track risk changes over time
4. **SMS/Push alerts** - Notify providers of critical risk changes
5. **Custom weights** - Allow facility-specific weight configuration

---

*Document Version: 1.0*  
*Last Updated: November 25, 2025*  
*Module Location: `js/arpa.js`*

