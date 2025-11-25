// ============================================================
// My Hub Cares - Mock Data
// ============================================================

const MockData = {
    // User accounts for authentication
    users: [
        {
            id: 1,
            username: 'admin',
            password: 'admin123',
            role: 'admin',
            fullName: 'Admin User',
            email: 'admin@myhubcares.com',
            facilityId: 1
        },
        {
            id: 2,
            username: 'physician',
            password: 'doc123',
            role: 'physician',
            fullName: 'Dr. Maria Santos',
            email: 'msantos@myhubcares.com',
            facilityId: 1
        },
        {
            id: 3,
            username: 'nurse',
            password: 'nurse123',
            role: 'nurse',
            fullName: 'Nurse Juan dela Cruz',
            email: 'jdelacruz@myhubcares.com',
            facilityId: 1
        },
        {
            id: 4,
            username: 'case_manager',
            password: 'case123',
            role: 'case_manager',
            fullName: 'Anna Reyes',
            email: 'areyes@myhubcares.com',
            facilityId: 1
        },
        {
            id: 5,
            username: 'lab_personnel',
            password: 'lab123',
            role: 'lab_personnel',
            fullName: 'Lab Tech Roberto Cruz',
            email: 'rcruz@myhubcares.com',
            facilityId: 1
        },
        {
            id: 6,
            username: 'patient',
            password: 'pat123',
            role: 'patient',
            fullName: 'John Doe',
            email: 'patient@email.com',
            patientId: 1
        }
    ],

    // Facilities
    facilities: [
        {
            id: 1,
            name: 'My Hub Cares Ortigas Main',
            address: 'Unit 607 Tycoon Corporate Center Building, Pearl Drive, Ortigas Center, Pasig City 1605',
            regionId: 1,
            contactPerson: 'Dr. Maria Santos',
            contactNumber: '0917-187-CARE (2273)',
            email: 'ortigas@myhubcares.com'
        },
        {
            id: 2,
            name: 'My Hub Cares Pasay',
            address: 'EDSA Corner Taft Avenue, Pasay City',
            regionId: 1,
            contactPerson: 'Dr. Jose Cruz',
            contactNumber: '0898-700-1267',
            email: 'pasay@myhubcares.com'
        },
        {
            id: 3,
            name: 'My Hub Cares Alabang',
            address: 'Alabang-Zapote Road, Muntinlupa City',
            regionId: 1,
            contactPerson: 'Dr. Ana Reyes',
            contactNumber: '0954-468-1630',
            email: 'alabang@myhubcares.com'
        }
    ],

    // Regions
    regions: [
        { id: 1, name: 'National Capital Region (NCR)' },
        { id: 2, name: 'Region I - Ilocos Region' },
        { id: 3, name: 'Region II - Cagayan Valley' },
        { id: 4, name: 'Region III - Central Luzon' },
        { id: 5, name: 'Region IV-A - CALABARZON' },
        { id: 7, name: 'Region VII - Central Visayas' },
        { id: 11, name: 'Region XI - Davao Region' }
    ],

    // Patients
    patients: [
        {
            id: 1,
            uic: 'AB051519950101',
            philhealthNo: 'PH123456789',
            firstName: 'John',
            middleName: 'Smith',
            lastName: 'Doe',
            birthDate: '1995-01-15',
            sex: 'M',
            civilStatus: 'Single',
            nationality: 'Filipino',
            currentCity: 'Manila',
            currentProvince: 'Metro Manila',
            contactPhone: '09171234567',
            email: 'patient@email.com'
        },
        {
            id: 2,
            uic: 'CD101019920305',
            philhealthNo: 'PH987654321',
            firstName: 'Maria',
            middleName: 'Cruz',
            lastName: 'Santos',
            birthDate: '1992-03-10',
            sex: 'F',
            civilStatus: 'Married',
            nationality: 'Filipino',
            currentCity: 'Quezon City',
            currentProvince: 'Metro Manila',
            contactPhone: '09189876543',
            email: 'maria.santos@email.com'
        },
        {
            id: 3,
            uic: 'EF201519880520',
            firstName: 'Carlos',
            middleName: 'Garcia',
            lastName: 'Rodriguez',
            birthDate: '1988-05-20',
            sex: 'M',
            civilStatus: 'Single',
            nationality: 'Filipino',
            currentCity: 'Makati',
            currentProvince: 'Metro Manila',
            contactPhone: '09201234567',
            email: 'carlos.rod@email.com'
        }
    ],

    // Appointments
    appointments: [
        {
            id: 1,
            patientId: 1,
            facilityId: 1,
            providerId: 2,
            appointmentDate: '2025-11-10',
            appointmentTime: '10:00',
            type: 'Follow-up Consultation',
            status: 'scheduled',
            notes: 'Regular check-up and viral load test'
        },
        {
            id: 2,
            patientId: 2,
            facilityId: 1,
            providerId: 2,
            appointmentDate: '2025-11-08',
            appointmentTime: '14:00',
            type: 'ART Pickup',
            status: 'scheduled',
            notes: 'Monthly medication refill'
        },
        {
            id: 3,
            patientId: 3,
            facilityId: 1,
            providerId: 2,
            appointmentDate: '2025-11-05',
            appointmentTime: '09:00',
            type: 'Initial Consultation',
            status: 'completed',
            notes: 'New patient intake'
        }
    ],

    // Appointment Requests (for Case Manager approval workflow)
    appointment_requests: [
        // ===== PENDING REQUESTS (5) =====
        {
            request_id: 'req_1732500000001',
            patient_id: 1,
            facility_id: 1,
            provider_id: 2,
            requested_date: '2025-12-01',
            requested_time: '10:00',
            appointment_type: 'Follow-up Consultation',
            patient_notes: 'Regular quarterly check-up and medication review. Feeling good overall.',
            status: 'pending',
            reviewed_by: null,
            reviewed_at: null,
            review_notes: null,
            decline_reason: null,
            created_at: '2025-11-24T09:30:00Z',
            updated_at: '2025-11-24T09:30:00Z',
            created_by: 6,
            appointment_id: null
        },
        {
            request_id: 'req_1732500000002',
            patient_id: 2,
            facility_id: 1,
            provider_id: 3,
            requested_date: '2025-12-02',
            requested_time: '14:30',
            appointment_type: 'ART Pickup',
            patient_notes: 'Monthly medication refill - running low on TLD. Need 30-day supply.',
            status: 'pending',
            reviewed_by: null,
            reviewed_at: null,
            review_notes: null,
            decline_reason: null,
            created_at: '2025-11-23T14:15:00Z',
            updated_at: '2025-11-23T14:15:00Z',
            created_by: 2,
            appointment_id: null
        },
        {
            request_id: 'req_1732500000005',
            patient_id: 3,
            facility_id: 2,
            provider_id: 2,
            requested_date: '2025-12-03',
            requested_time: '09:30',
            appointment_type: 'Initial Consultation',
            patient_notes: 'First visit after transfer from another facility. Bringing medical records.',
            status: 'pending',
            reviewed_by: null,
            reviewed_at: null,
            review_notes: null,
            decline_reason: null,
            created_at: '2025-11-25T08:00:00Z',
            updated_at: '2025-11-25T08:00:00Z',
            created_by: 3,
            appointment_id: null
        },
        {
            request_id: 'req_1732500000006',
            patient_id: 1,
            facility_id: 1,
            provider_id: 3,
            requested_date: '2025-12-05',
            requested_time: '11:00',
            appointment_type: 'Lab Test',
            patient_notes: 'Due for viral load monitoring. Last test was 3 months ago.',
            status: 'pending',
            reviewed_by: null,
            reviewed_at: null,
            review_notes: null,
            decline_reason: null,
            created_at: '2025-11-25T10:45:00Z',
            updated_at: '2025-11-25T10:45:00Z',
            created_by: 6,
            appointment_id: null
        },
        {
            request_id: 'req_1732500000007',
            patient_id: 2,
            facility_id: 3,
            provider_id: 2,
            requested_date: '2025-12-04',
            requested_time: '15:00',
            appointment_type: 'Counseling',
            patient_notes: 'Need to discuss disclosure to family members. Feeling anxious about it.',
            status: 'pending',
            reviewed_by: null,
            reviewed_at: null,
            review_notes: null,
            decline_reason: null,
            created_at: '2025-11-24T16:20:00Z',
            updated_at: '2025-11-24T16:20:00Z',
            created_by: 2,
            appointment_id: null
        },

        // ===== APPROVED REQUESTS (4) =====
        {
            request_id: 'req_1732500000003',
            patient_id: 3,
            facility_id: 2,
            provider_id: 2,
            requested_date: '2025-11-28',
            requested_time: '11:00',
            appointment_type: 'Lab Test',
            patient_notes: 'Need CD4 count and viral load test',
            status: 'approved',
            reviewed_by: 4,
            reviewed_at: '2025-11-22T10:00:00Z',
            review_notes: 'Approved. Please fast for 8 hours before the lab test. Arrive 15 minutes early.',
            decline_reason: null,
            created_at: '2025-11-21T16:00:00Z',
            updated_at: '2025-11-22T10:00:00Z',
            created_by: 3,
            appointment_id: 4
        },
        {
            request_id: 'req_1732500000008',
            patient_id: 1,
            facility_id: 1,
            provider_id: 2,
            requested_date: '2025-11-26',
            requested_time: '10:30',
            appointment_type: 'Follow-up Consultation',
            patient_notes: 'Follow up on previous lab results',
            status: 'approved',
            reviewed_by: 4,
            reviewed_at: '2025-11-20T14:30:00Z',
            review_notes: 'Approved. Dr. Santos will discuss your lab results with you.',
            decline_reason: null,
            created_at: '2025-11-19T09:00:00Z',
            updated_at: '2025-11-20T14:30:00Z',
            created_by: 6,
            appointment_id: 5
        },
        {
            request_id: 'req_1732500000009',
            patient_id: 2,
            facility_id: 1,
            provider_id: 3,
            requested_date: '2025-11-27',
            requested_time: '14:00',
            appointment_type: 'ART Pickup',
            patient_notes: 'Regular medication refill',
            status: 'approved',
            reviewed_by: 4,
            reviewed_at: '2025-11-21T09:15:00Z',
            review_notes: 'Approved. Your 30-day medication supply will be ready for pickup.',
            decline_reason: null,
            created_at: '2025-11-20T11:30:00Z',
            updated_at: '2025-11-21T09:15:00Z',
            created_by: 2,
            appointment_id: 6
        },
        {
            request_id: 'req_1732500000010',
            patient_id: 3,
            facility_id: 1,
            provider_id: 2,
            requested_date: '2025-11-29',
            requested_time: '09:00',
            appointment_type: 'Counseling',
            patient_notes: 'Mental health support session',
            status: 'approved',
            reviewed_by: 4,
            reviewed_at: '2025-11-23T11:00:00Z',
            review_notes: 'Approved. Case Manager Anna Reyes will be available for your counseling session.',
            decline_reason: null,
            created_at: '2025-11-22T08:45:00Z',
            updated_at: '2025-11-23T11:00:00Z',
            created_by: 3,
            appointment_id: 7
        },

        // ===== DECLINED REQUESTS (3) =====
        {
            request_id: 'req_1732500000004',
            patient_id: 1,
            facility_id: 1,
            provider_id: 2,
            requested_date: '2025-11-20',
            requested_time: '09:00',
            appointment_type: 'Counseling',
            patient_notes: 'Would like to discuss treatment adherence strategies',
            status: 'declined',
            reviewed_by: 4,
            reviewed_at: '2025-11-19T11:30:00Z',
            review_notes: null,
            decline_reason: 'Provider not available on selected date. Dr. Santos is attending a medical conference. Please select another date or provider.',
            created_at: '2025-11-18T08:00:00Z',
            updated_at: '2025-11-19T11:30:00Z',
            created_by: 6,
            appointment_id: null
        },
        {
            request_id: 'req_1732500000011',
            patient_id: 2,
            facility_id: 2,
            provider_id: 2,
            requested_date: '2025-11-15',
            requested_time: '16:00',
            appointment_type: 'Follow-up Consultation',
            patient_notes: 'Need to discuss side effects',
            status: 'declined',
            reviewed_by: 4,
            reviewed_at: '2025-11-14T10:00:00Z',
            review_notes: null,
            decline_reason: 'Requested time (4:00 PM) is outside clinic hours. Our Pasay branch closes at 3:00 PM. Please select an earlier time slot.',
            created_at: '2025-11-13T14:00:00Z',
            updated_at: '2025-11-14T10:00:00Z',
            created_by: 2,
            appointment_id: null
        },
        {
            request_id: 'req_1732500000012',
            patient_id: 3,
            facility_id: 1,
            provider_id: 3,
            requested_date: '2025-11-18',
            requested_time: '10:00',
            appointment_type: 'Lab Test',
            patient_notes: 'Routine blood work',
            status: 'declined',
            reviewed_by: 4,
            reviewed_at: '2025-11-17T09:30:00Z',
            review_notes: null,
            decline_reason: 'Lab equipment under maintenance on this date. Lab services will resume on Nov 20. Please reschedule.',
            created_at: '2025-11-16T11:00:00Z',
            updated_at: '2025-11-17T09:30:00Z',
            created_by: 3,
            appointment_id: null
        },

        // ===== CANCELLED REQUESTS (2) =====
        {
            request_id: 'req_1732500000013',
            patient_id: 1,
            facility_id: 1,
            provider_id: 2,
            requested_date: '2025-11-22',
            requested_time: '11:00',
            appointment_type: 'Follow-up Consultation',
            patient_notes: 'Check-up appointment',
            status: 'cancelled',
            reviewed_by: null,
            reviewed_at: null,
            review_notes: null,
            decline_reason: null,
            created_at: '2025-11-10T10:00:00Z',
            updated_at: '2025-11-12T15:30:00Z',
            created_by: 6,
            appointment_id: null
        },
        {
            request_id: 'req_1732500000014',
            patient_id: 2,
            facility_id: 3,
            provider_id: 2,
            requested_date: '2025-11-21',
            requested_time: '13:00',
            appointment_type: 'Counseling',
            patient_notes: 'Support session',
            status: 'cancelled',
            reviewed_by: null,
            reviewed_at: null,
            review_notes: null,
            decline_reason: null,
            created_at: '2025-11-08T09:00:00Z',
            updated_at: '2025-11-09T11:00:00Z',
            created_by: 2,
            appointment_id: null
        }
    ],

    // Inventory
    inventory: [
        {
            id: 1,
            drugName: 'Tenofovir/Lamivudine/Dolutegravir (TLD)',
            stockQuantity: 500,
            unit: 'tablets',
            expiryDate: '2026-12-31',
            supplier: 'MyHubCares Pharmacy',
            reorderLevel: 100,
            lastRestocked: '2025-10-01'
        },
        {
            id: 2,
            drugName: 'Efavirenz 600mg',
            stockQuantity: 250,
            unit: 'tablets',
            expiryDate: '2026-08-15',
            supplier: 'MyHubCares Pharmacy',
            reorderLevel: 50,
            lastRestocked: '2025-09-15'
        },
        {
            id: 3,
            drugName: 'Atazanavir 300mg',
            stockQuantity: 80,
            unit: 'tablets',
            expiryDate: '2026-06-30',
            supplier: 'MyHubCares Pharmacy',
            reorderLevel: 100,
            lastRestocked: '2025-08-20'
        },
        {
            id: 4,
            drugName: 'Ritonavir 100mg',
            stockQuantity: 150,
            unit: 'tablets',
            expiryDate: '2027-03-15',
            supplier: 'MyHubCares Pharmacy',
            reorderLevel: 75,
            lastRestocked: '2025-10-10'
        },
        {
            id: 5,
            drugName: 'Cotrimoxazole 960mg',
            stockQuantity: 800,
            unit: 'tablets',
            expiryDate: '2026-11-30',
            supplier: 'MyHubCares Pharmacy',
            reorderLevel: 200,
            lastRestocked: '2025-10-05'
        }
    ],

    // Prescriptions
    prescriptions: [
        {
            id: 1,
            patientId: 1,
            physicianId: 2,
            facilityId: 1,
            prescriptionDate: '2025-10-15',
            drugs: [
                {
                    drugName: 'Tenofovir/Lamivudine/Dolutegravir (TLD)',
                    dosage: '1 tablet',
                    frequency: 'Once daily',
                    duration: '30 days',
                    instructions: 'Take with or without food'
                }
            ],
            notes: 'Continue current regimen. Monitor for side effects.',
            nextRefill: '2025-11-15'
        },
        {
            id: 2,
            patientId: 2,
            physicianId: 2,
            facilityId: 1,
            prescriptionDate: '2025-10-10',
            drugs: [
                {
                    drugName: 'Efavirenz 600mg',
                    dosage: '1 tablet',
                    frequency: 'Once daily at bedtime',
                    duration: '30 days',
                    instructions: 'Take on an empty stomach, preferably at bedtime'
                },
                {
                    drugName: 'Cotrimoxazole 960mg',
                    dosage: '1 tablet',
                    frequency: 'Once daily',
                    duration: '30 days',
                    instructions: 'Take with food'
                }
            ],
            notes: 'Prophylaxis for opportunistic infections',
            nextRefill: '2025-11-10'
        }
    ],

    // Lab Tests
    labTests: [
        // ===== PATIENT 1 (John Doe) - Well controlled, good adherence =====
        {
            id: 1,
            patientId: 1,
            testName: 'CD4 Count',
            resultValue: '620',
            resultUnit: 'cells/μL',
            dateDone: '2025-11-01',
            performedBy: 'Lab Tech Roberto Cruz',
            labCode: 'LAB-2025-001'
        },
        {
            id: 2,
            patientId: 1,
            testName: 'Viral Load',
            resultValue: 'Undetectable (<20)',
            resultUnit: 'copies/mL',
            dateDone: '2025-11-01',
            performedBy: 'Lab Tech Roberto Cruz',
            labCode: 'LAB-2025-002'
        },
        {
            id: 3,
            patientId: 1,
            testName: 'Creatinine',
            resultValue: '0.9',
            resultUnit: 'mg/dL',
            dateDone: '2025-11-01',
            performedBy: 'Lab Tech Roberto Cruz',
            labCode: 'LAB-2025-003'
        },
        {
            id: 4,
            patientId: 1,
            testName: 'HBsAg',
            resultValue: 'Negative',
            resultUnit: '',
            dateDone: '2025-11-01',
            performedBy: 'Lab Tech Roberto Cruz',
            labCode: 'LAB-2025-004'
        },
        {
            id: 5,
            patientId: 1,
            testName: 'ALT',
            resultValue: '28',
            resultUnit: 'U/L',
            dateDone: '2025-11-01',
            performedBy: 'Lab Tech Roberto Cruz',
            labCode: 'LAB-2025-005'
        },
        {
            id: 6,
            patientId: 1,
            testName: 'Hemoglobin',
            resultValue: '14.2',
            resultUnit: 'g/dL',
            dateDone: '2025-11-01',
            performedBy: 'Lab Tech Roberto Cruz',
            labCode: 'LAB-2025-006'
        },
        {
            id: 7,
            patientId: 1,
            testName: 'GeneXpert',
            resultValue: 'MTB Not Detected',
            resultUnit: '',
            dateDone: '2025-10-15',
            performedBy: 'Lab Tech Roberto Cruz',
            labCode: 'LAB-2025-007'
        },

        // ===== PATIENT 2 (Maria Santos) - Moderate immunosuppression =====
        {
            id: 8,
            patientId: 2,
            testName: 'CD4 Count',
            resultValue: '280',
            resultUnit: 'cells/μL',
            dateDone: '2025-11-05',
            performedBy: 'Lab Tech Roberto Cruz',
            labCode: 'LAB-2025-008'
        },
        {
            id: 9,
            patientId: 2,
            testName: 'Viral Load',
            resultValue: '150',
            resultUnit: 'copies/mL',
            dateDone: '2025-11-05',
            performedBy: 'Lab Tech Roberto Cruz',
            labCode: 'LAB-2025-009'
        },
        {
            id: 10,
            patientId: 2,
            testName: 'Creatinine',
            resultValue: '1.4',
            resultUnit: 'mg/dL',
            dateDone: '2025-11-05',
            performedBy: 'Lab Tech Roberto Cruz',
            labCode: 'LAB-2025-010'
        },
        {
            id: 11,
            patientId: 2,
            testName: 'ALT',
            resultValue: '65',
            resultUnit: 'U/L',
            dateDone: '2025-11-05',
            performedBy: 'Lab Tech Roberto Cruz',
            labCode: 'LAB-2025-011'
        },
        {
            id: 12,
            patientId: 2,
            testName: 'HBsAg',
            resultValue: 'Positive',
            resultUnit: '',
            dateDone: '2025-11-05',
            performedBy: 'Lab Tech Roberto Cruz',
            labCode: 'LAB-2025-012'
        },

        // ===== PATIENT 3 (Carlos Rodriguez) - High risk, treatment failure =====
        {
            id: 13,
            patientId: 3,
            testName: 'CD4 Count',
            resultValue: '145',
            resultUnit: 'cells/μL',
            dateDone: '2025-11-10',
            performedBy: 'Lab Tech Roberto Cruz',
            labCode: 'LAB-2025-013'
        },
        {
            id: 14,
            patientId: 3,
            testName: 'Viral Load',
            resultValue: '45000',
            resultUnit: 'copies/mL',
            dateDone: '2025-11-10',
            performedBy: 'Lab Tech Roberto Cruz',
            labCode: 'LAB-2025-014'
        },
        {
            id: 15,
            patientId: 3,
            testName: 'HIVDR',
            resultValue: 'NNRTI Mutations',
            resultUnit: '',
            dateDone: '2025-11-10',
            performedBy: 'Lab Tech Roberto Cruz',
            labCode: 'LAB-2025-015'
        },
        {
            id: 16,
            patientId: 3,
            testName: 'Chest X-Ray',
            resultValue: 'Abnormal',
            resultUnit: '',
            dateDone: '2025-11-08',
            performedBy: 'Radiology Dept',
            labCode: 'RAD-2025-001'
        },
        {
            id: 17,
            patientId: 3,
            testName: 'GeneXpert',
            resultValue: 'MTB Detected, RIF Sensitive',
            resultUnit: '',
            dateDone: '2025-11-09',
            performedBy: 'Lab Tech Roberto Cruz',
            labCode: 'LAB-2025-016'
        },
        {
            id: 18,
            patientId: 3,
            testName: 'Hemoglobin',
            resultValue: '9.2',
            resultUnit: 'g/dL',
            dateDone: '2025-11-10',
            performedBy: 'Lab Tech Roberto Cruz',
            labCode: 'LAB-2025-017'
        },

        // ===== PATIENT 4 - Various test results =====
        {
            id: 19,
            patientId: 4,
            testName: 'CD4 Count',
            resultValue: '410',
            resultUnit: 'cells/μL',
            dateDone: '2025-10-25',
            performedBy: 'Lab Tech Roberto Cruz',
            labCode: 'LAB-2025-018'
        },
        {
            id: 20,
            patientId: 4,
            testName: 'Viral Load',
            resultValue: '85',
            resultUnit: 'copies/mL',
            dateDone: '2025-10-25',
            performedBy: 'Lab Tech Roberto Cruz',
            labCode: 'LAB-2025-019'
        },
        {
            id: 21,
            patientId: 4,
            testName: 'RPR',
            resultValue: 'Reactive',
            resultUnit: '',
            dateDone: '2025-10-25',
            performedBy: 'Lab Tech Roberto Cruz',
            labCode: 'LAB-2025-020'
        },
        {
            id: 22,
            patientId: 4,
            testName: 'Blood Glucose',
            resultValue: '112',
            resultUnit: 'mg/dL',
            dateDone: '2025-10-25',
            performedBy: 'Lab Tech Roberto Cruz',
            labCode: 'LAB-2025-021'
        },
        {
            id: 23,
            patientId: 4,
            testName: 'Cholesterol',
            resultValue: '245',
            resultUnit: 'mg/dL',
            dateDone: '2025-10-25',
            performedBy: 'Lab Tech Roberto Cruz',
            labCode: 'LAB-2025-022'
        },

        // ===== PATIENT 5 - Severe case requiring intervention =====
        {
            id: 24,
            patientId: 5,
            testName: 'CD4 Count',
            resultValue: '78',
            resultUnit: 'cells/μL',
            dateDone: '2025-11-15',
            performedBy: 'Lab Tech Roberto Cruz',
            labCode: 'LAB-2025-023'
        },
        {
            id: 25,
            patientId: 5,
            testName: 'Viral Load',
            resultValue: '125000',
            resultUnit: 'copies/mL',
            dateDone: '2025-11-15',
            performedBy: 'Lab Tech Roberto Cruz',
            labCode: 'LAB-2025-024'
        },
        {
            id: 26,
            patientId: 5,
            testName: 'Creatinine',
            resultValue: '2.3',
            resultUnit: 'mg/dL',
            dateDone: '2025-11-15',
            performedBy: 'Lab Tech Roberto Cruz',
            labCode: 'LAB-2025-025'
        },
        {
            id: 27,
            patientId: 5,
            testName: 'Hemoglobin',
            resultValue: '7.5',
            resultUnit: 'g/dL',
            dateDone: '2025-11-15',
            performedBy: 'Lab Tech Roberto Cruz',
            labCode: 'LAB-2025-026'
        },
        {
            id: 28,
            patientId: 5,
            testName: 'GeneXpert',
            resultValue: 'MTB Detected, RIF Resistant',
            resultUnit: '',
            dateDone: '2025-11-14',
            performedBy: 'Lab Tech Roberto Cruz',
            labCode: 'LAB-2025-027'
        },
        {
            id: 29,
            patientId: 5,
            testName: 'HIVDR',
            resultValue: 'Multi-class Resistance',
            resultUnit: '',
            dateDone: '2025-11-15',
            performedBy: 'Lab Tech Roberto Cruz',
            labCode: 'LAB-2025-028'
        },

        // ===== PATIENT 6 - Anti-HCV positive =====
        {
            id: 30,
            patientId: 6,
            testName: 'CD4 Count',
            resultValue: '520',
            resultUnit: 'cells/μL',
            dateDone: '2025-10-20',
            performedBy: 'Lab Tech Roberto Cruz',
            labCode: 'LAB-2025-029'
        },
        {
            id: 31,
            patientId: 6,
            testName: 'Viral Load',
            resultValue: '<20',
            resultUnit: 'copies/mL',
            dateDone: '2025-10-20',
            performedBy: 'Lab Tech Roberto Cruz',
            labCode: 'LAB-2025-030'
        },
        {
            id: 32,
            patientId: 6,
            testName: 'Anti-HCV',
            resultValue: 'Positive',
            resultUnit: '',
            dateDone: '2025-10-20',
            performedBy: 'Lab Tech Roberto Cruz',
            labCode: 'LAB-2025-031'
        },
        {
            id: 33,
            patientId: 6,
            testName: 'ALT',
            resultValue: '95',
            resultUnit: 'U/L',
            dateDone: '2025-10-20',
            performedBy: 'Lab Tech Roberto Cruz',
            labCode: 'LAB-2025-032'
        },
        {
            id: 34,
            patientId: 6,
            testName: 'AST',
            resultValue: '88',
            resultUnit: 'U/L',
            dateDone: '2025-10-20',
            performedBy: 'Lab Tech Roberto Cruz',
            labCode: 'LAB-2025-033'
        }
    ],

    // Medication Reminders
    reminders: [
        {
            id: 1,
            patientId: 1,
            prescriptionId: 1,
            drugName: 'TLD',
            time: '20:00',
            frequency: 'daily',
            active: true,
            lastTaken: '2025-11-03',
            missedDoses: 0
        },
        {
            id: 2,
            patientId: 2,
            prescriptionId: 2,
            drugName: 'Efavirenz',
            time: '21:00',
            frequency: 'daily',
            active: true,
            lastTaken: '2025-11-03',
            missedDoses: 2
        }
    ],

    // Health Education Modules
    educationModules: [
        {
            id: 1,
            title: 'Understanding HIV',
            description: 'Learn about HIV, how it affects the immune system, and transmission routes.',
            category: 'basics',
            content: 'HIV (Human Immunodeficiency Virus) is a virus that attacks the body\'s immune system...',
            readTime: '10 min'
        },
        {
            id: 2,
            title: 'Living with HIV',
            description: 'Daily life management, stigma reduction, and maintaining quality of life.',
            category: 'lifestyle',
            content: 'Living with HIV requires understanding, self-care, and proper medical management...',
            readTime: '15 min'
        },
        {
            id: 3,
            title: 'Antiretroviral Therapy (ART)',
            description: 'Understanding your medications, adherence importance, and managing side effects.',
            category: 'treatment',
            content: 'ART is the cornerstone of HIV treatment. Taking medications as prescribed is crucial...',
            readTime: '12 min'
        },
        {
            id: 4,
            title: 'Prevention and Safety',
            description: 'Preventing HIV transmission and protecting others.',
            category: 'prevention',
            content: 'Learn about safer sex practices, PrEP, and how to prevent HIV transmission...',
            readTime: '8 min'
        }
    ],

    // FAQ
    faqs: [
        {
            id: 1,
            question: 'What is the difference between HIV and AIDS?',
            answer: 'HIV is the virus that causes the infection. AIDS (Acquired Immunodeficiency Syndrome) is the most advanced stage of HIV infection, where the immune system is severely damaged.'
        },
        {
            id: 2,
            question: 'How effective is ART?',
            answer: 'When taken as prescribed, ART is highly effective. It can reduce the viral load to undetectable levels, allowing people with HIV to live long, healthy lives.'
        },
        {
            id: 3,
            question: 'What does undetectable = untransmittable mean?',
            answer: 'When HIV treatment reduces the viral load to undetectable levels, the virus cannot be transmitted to sexual partners. This is called U=U.'
        },
        {
            id: 4,
            question: 'What should I do if I miss a dose?',
            answer: 'Take the missed dose as soon as you remember. If it\'s almost time for your next dose, skip the missed dose and take the next one at the regular time. Contact your healthcare provider for guidance.'
        }
    ],

    // Client Types
    clientTypes: [
        { id: 1, name: 'Males having Sex with Males' },
        { id: 2, name: 'Registered Female Sex Worker' },
        { id: 3, name: 'Freelance Female Sex Worker' },
        { id: 4, name: 'Transgender' },
        { id: 5, name: 'Drug Users' },
        { id: 6, name: 'Person Who Inject Drugs (PWID)' },
        { id: 7, name: 'Pregnant' },
        { id: 8, name: 'TB Clients' },
        { id: 9, name: 'Others' }
    ],

    // Visit History
    visits: [
        {
            id: 1,
            patientId: 1,
            facilityId: 1,
            physicianId: 2,
            visitDate: '2025-10-15',
            visitType: 'Follow-up',
            whoStage: 'Stage 1',
            notes: 'Patient doing well on current regimen. No complaints.'
        },
        {
            id: 2,
            patientId: 2,
            facilityId: 1,
            physicianId: 2,
            visitDate: '2025-10-10',
            visitType: 'Follow-up',
            whoStage: 'Stage 1',
            notes: 'Discussed importance of adherence. Patient reports occasional missed doses.'
        }
    ],

    // Referrals
    referrals: [
        {
            id: 1,
            patientId: 1,
            fromFacilityId: 1,
            toFacilityId: 2,
            referralDate: '2025-10-20',
            reason: 'Requires specialized treatment for co-infection management',
            urgency: 'urgent',
            notes: 'Patient has developed hepatitis B co-infection',
            status: 'pending',
            createdBy: 4,
            createdAt: '2025-10-20T08:30:00Z'
        },
        {
            id: 2,
            patientId: 3,
            fromFacilityId: 2,
            toFacilityId: 3,
            referralDate: '2025-10-15',
            reason: 'Transfer request by patient - moving to Cebu',
            urgency: 'routine',
            notes: 'Patient relocating for work',
            status: 'accepted',
            createdBy: 4,
            createdAt: '2025-10-15T14:00:00Z',
            updatedAt: '2025-10-16T10:00:00Z'
        }
    ],

    // ART Regimens
    artRegimens: [
        {
            id: 1,
            patientId: 1,
            startDate: '2024-06-01',
            stopDate: null,
            status: 'active',
            drugs: [
                {
                    drugName: 'Tenofovir/Lamivudine/Dolutegravir (TLD)',
                    dose: '1 tablet',
                    pillsPerDay: 1,
                    pillsDispensed: 90,
                    pillsRemaining: 45,
                    missedDoses: 2
                }
            ],
            notes: 'Patient tolerating regimen well',
            createdAt: '2024-06-01T09:00:00Z'
        },
        {
            id: 2,
            patientId: 2,
            startDate: '2023-12-15',
            stopDate: null,
            status: 'active',
            drugs: [
                {
                    drugName: 'Efavirenz 600mg',
                    dose: '1 tablet',
                    pillsPerDay: 1,
                    pillsDispensed: 60,
                    pillsRemaining: 20,
                    missedDoses: 5
                }
            ],
            notes: 'Monitor for CNS side effects',
            createdAt: '2023-12-15T10:30:00Z'
        }
    ],

    // Satisfaction Surveys
    satisfactionSurveys: [
        {
            id: 1,
            patientId: 1,
            facilityId: 1,
            q1: 4,
            q2: 4,
            q3: 3,
            q4: 4,
            q5: 4,
            remarks: 'Excellent service, very professional staff',
            submittedAt: '2025-10-20T15:30:00Z'
        },
        {
            id: 2,
            patientId: 2,
            facilityId: 1,
            q1: 3,
            q2: 4,
            q3: 2,
            q4: 3,
            q5: 3,
            remarks: 'Wait time was a bit long but staff was helpful',
            submittedAt: '2025-10-18T11:00:00Z'
        },
        {
            id: 3,
            patientId: 3,
            facilityId: 2,
            q1: 4,
            q2: 4,
            q3: 4,
            q4: 4,
            q5: 4,
            remarks: 'Very satisfied with the care received',
            submittedAt: '2025-10-15T14:45:00Z'
        }
    ],

    // HTS Sessions
    htsSessions: [
        {
            id: 1,
            patientId: 1,
            facilityId: 1,
            counselorId: 4,
            sessionDate: '2024-05-15',
            sessionType: 'Facility-based',
            pretestCounseling: true,
            consentGiven: true,
            testResult: 'Positive',
            posttestCounseling: true,
            linkageReferred: true,
            referralDestination: 'ART Clinic',
            remarks: 'Patient well-informed and prepared for results',
            createdAt: '2024-05-15T09:00:00Z'
        },
        {
            id: 2,
            patientId: 2,
            facilityId: 1,
            counselorId: 4,
            sessionDate: '2023-11-20',
            sessionType: 'Community-based',
            pretestCounseling: true,
            consentGiven: true,
            testResult: 'Positive',
            posttestCounseling: true,
            linkageReferred: true,
            referralDestination: 'Treatment Hub',
            remarks: 'Referred to nearest treatment facility',
            createdAt: '2023-11-20T14:30:00Z'
        }
    ],

    // Counseling Sessions
    counselingSessions: [
        {
            id: 1,
            patientId: 1,
            counselorId: 4,
            sessionDate: '2025-10-22',
            sessionType: 'Adherence Counseling',
            duration: 45,
            topics: ['Medication Adherence', 'Side Effect Management', 'Lifestyle Modifications'],
            notes: 'Patient discussed challenges with remembering doses. Set up medication reminders.',
            followUpRequired: true,
            followUpDate: '2025-11-22',
            createdAt: '2025-10-22T10:00:00Z'
        },
        {
            id: 2,
            patientId: 2,
            counselorId: 4,
            sessionDate: '2025-10-18',
            sessionType: 'Mental Health Support',
            duration: 60,
            topics: ['Coping Strategies', 'Stigma Management', 'Family Disclosure'],
            notes: 'Patient experiencing anxiety about diagnosis. Provided coping techniques.',
            followUpRequired: true,
            followUpDate: '2025-11-01',
            createdAt: '2025-10-18T14:00:00Z'
        }
    ],

    // Vaccinations
    vaccinations: [
        {
            id: 1,
            patientId: 1,
            vaccineName: 'Hepatitis B',
            manufacturer: 'GlaxoSmithKline',
            doseNumber: 3,
            totalDoses: 3,
            dateGiven: '2024-10-15',
            nextDoseDate: null,
            lotNumber: 'HB2024-12345',
            administrationSite: 'Left arm',
            notes: 'Final dose completed. No adverse reactions.',
            providerId: 3,
            recordedDate: '2024-10-15T10:30:00Z'
        },
        {
            id: 2,
            patientId: 1,
            vaccineName: 'Influenza',
            manufacturer: 'Sanofi',
            doseNumber: 1,
            totalDoses: 1,
            dateGiven: '2024-11-01',
            nextDoseDate: null,
            lotNumber: 'FLU2024-67890',
            administrationSite: 'Right arm',
            notes: 'Annual flu shot. Patient tolerated well.',
            providerId: 5,
            recordedDate: '2024-11-01T14:00:00Z'
        },
        {
            id: 3,
            patientId: 2,
            vaccineName: 'HPV (Human Papillomavirus)',
            manufacturer: 'Merck',
            doseNumber: 2,
            totalDoses: 3,
            dateGiven: '2024-09-10',
            nextDoseDate: '2025-03-10',
            lotNumber: 'HPV2024-ABC123',
            administrationSite: 'Left arm',
            notes: 'Second dose administered. Next dose due in 6 months.',
            providerId: 5,
            recordedDate: '2024-09-10T11:00:00Z'
        },
        {
            id: 4,
            patientId: 3,
            vaccineName: 'Hepatitis A',
            manufacturer: 'GSK',
            doseNumber: 1,
            totalDoses: 2,
            dateGiven: '2024-10-20',
            nextDoseDate: '2025-04-20',
            lotNumber: 'HA2024-XYZ789',
            administrationSite: 'Right arm',
            notes: 'First dose. Patient advised to return in 6 months.',
            providerId: 3,
            recordedDate: '2024-10-20T15:30:00Z'
        },
        {
            id: 5,
            patientId: 4,
            vaccineName: 'Pneumococcal',
            manufacturer: 'Pfizer',
            doseNumber: 1,
            totalDoses: 1,
            dateGiven: '2024-08-05',
            nextDoseDate: null,
            lotNumber: 'PNEU2024-456',
            administrationSite: 'Left arm',
            notes: 'Single dose vaccine for high-risk patient.',
            providerId: 5,
            recordedDate: '2024-08-05T09:15:00Z'
        }
    ],

    // Audit Logs
    auditLogs: [
        {
            id: 1699876543210,
            userId: 1,
            action: 'login',
            module: 'system',
            details: 'User logged in successfully',
            recordId: null,
            oldValue: null,
            newValue: null,
            timestamp: '2025-11-05T08:00:00Z',
            ipAddress: '192.168.1.100',
            device: 'Desktop',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            remarks: 'First login of the day',
            status: 'success'
        },
        {
            id: 1699876543211,
            userId: 2,
            action: 'create',
            module: 'patients',
            details: 'New patient registered',
            recordId: 5,
            oldValue: null,
            newValue: null,
            timestamp: '2025-11-05T09:15:00Z',
            ipAddress: '192.168.1.101',
            device: 'Desktop',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            remarks: 'Walk-in registration',
            status: 'success'
        },
        {
            id: 1699876543212,
            userId: 2,
            action: 'update',
            module: 'appointments',
            details: 'Appointment status changed',
            recordId: 3,
            oldValue: 'scheduled',
            newValue: 'completed',
            timestamp: '2025-11-05T10:30:00Z',
            ipAddress: '192.168.1.101',
            device: 'Desktop',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            remarks: 'Patient attended appointment',
            status: 'success'
        },
        {
            id: 1699876543213,
            userId: 3,
            action: 'create',
            module: 'prescriptions',
            details: 'Digital prescription issued',
            recordId: 4,
            oldValue: null,
            newValue: null,
            timestamp: '2025-11-05T11:00:00Z',
            ipAddress: '192.168.1.102',
            device: 'Desktop',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            remarks: 'ART medication prescribed',
            status: 'success'
        },
        {
            id: 1699876543214,
            userId: 5,
            action: 'update',
            module: 'inventory',
            details: 'Stock level updated',
            recordId: 2,
            oldValue: '50 units',
            newValue: '100 units',
            timestamp: '2025-11-05T13:45:00Z',
            ipAddress: '192.168.1.103',
            device: 'Desktop',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            remarks: 'Restock completed',
            status: 'success'
        },
        {
            id: 1699876543215,
            userId: 1,
            action: 'delete',
            module: 'users',
            details: 'User account deleted',
            recordId: 99,
            oldValue: null,
            newValue: null,
            timestamp: '2025-11-05T14:20:00Z',
            ipAddress: '192.168.1.100',
            device: 'Desktop',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            remarks: 'Inactive account removed',
            status: 'success'
        },
        {
            id: 1699876543216,
            userId: 2,
            action: 'create',
            module: 'vaccinations',
            details: 'Vaccination record added',
            recordId: 6,
            oldValue: null,
            newValue: null,
            timestamp: '2025-11-05T15:10:00Z',
            ipAddress: '192.168.1.101',
            device: 'Desktop',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            remarks: 'HPV vaccine dose 1 administered',
            status: 'success'
        },
        {
            id: 1699876543217,
            userId: 6,
            action: 'login',
            module: 'system',
            details: 'Patient logged in from mobile',
            recordId: null,
            oldValue: null,
            newValue: null,
            timestamp: '2025-11-05T16:00:00Z',
            ipAddress: '192.168.1.150',
            device: 'Mobile',
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
            remarks: 'Accessed via mobile app',
            status: 'success'
        },
        {
            id: 1699876543218,
            userId: 1,
            action: 'export',
            module: 'reports',
            details: 'Patient statistics report exported',
            recordId: null,
            oldValue: null,
            newValue: null,
            timestamp: '2025-11-05T17:00:00Z',
            ipAddress: '192.168.1.100',
            device: 'Desktop',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            remarks: 'Monthly report generation',
            status: 'success'
        },
        {
            id: 1699876543219,
            userId: 3,
            action: 'update',
            module: 'patients',
            details: 'Patient contact information updated',
            recordId: 2,
            oldValue: '0917-111-2222',
            newValue: '0917-123-4567',
            timestamp: '2025-11-04T10:30:00Z',
            ipAddress: '192.168.1.102',
            device: 'Desktop',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            remarks: 'Patient requested phone number change',
            status: 'success'
        }
    ],

    // Roles
    roles: [
        {
            role_id: 'role_admin',
            role_code: 'admin',
            role_name: 'Administrator',
            description: 'Full system access and administration',
            is_system_role: true,
            created_at: '2024-01-01T00:00:00Z'
        },
        {
            role_id: 'role_physician',
            role_code: 'physician',
            role_name: 'Physician',
            description: 'Medical provider with clinical access',
            is_system_role: true,
            created_at: '2024-01-01T00:00:00Z'
        },
        {
            role_id: 'role_nurse',
            role_code: 'nurse',
            role_name: 'Nurse',
            description: 'Nursing staff with patient care access',
            is_system_role: true,
            created_at: '2024-01-01T00:00:00Z'
        },
        {
            role_id: 'role_case_manager',
            role_code: 'case_manager',
            role_name: 'Case Manager',
            description: 'Patient care coordination and counseling',
            is_system_role: true,
            created_at: '2024-01-01T00:00:00Z'
        },
        {
            role_id: 'role_lab_personnel',
            role_code: 'lab_personnel',
            role_name: 'Lab Personnel',
            description: 'Laboratory test management',
            is_system_role: true,
            created_at: '2024-01-01T00:00:00Z'
        },
        {
            role_id: 'role_patient',
            role_code: 'patient',
            role_name: 'Patient',
            description: 'Patient portal access',
            is_system_role: true,
            created_at: '2024-01-01T00:00:00Z'
        }
    ],

    // Permissions
    permissions: [
        { permission_id: 'perm_1', permission_code: 'patients.create', permission_name: 'Create Patients', module: 'patients', action: 'create', description: 'Register new patients' },
        { permission_id: 'perm_2', permission_code: 'patients.read', permission_name: 'View Patients', module: 'patients', action: 'read', description: 'View patient records' },
        { permission_id: 'perm_3', permission_code: 'patients.update', permission_name: 'Update Patients', module: 'patients', action: 'update', description: 'Edit patient information' },
        { permission_id: 'perm_4', permission_code: 'patients.delete', permission_name: 'Delete Patients', module: 'patients', action: 'delete', description: 'Remove patient records' },
        { permission_id: 'perm_5', permission_code: 'prescriptions.create', permission_name: 'Create Prescriptions', module: 'prescriptions', action: 'create', description: 'Write prescriptions' },
        { permission_id: 'perm_6', permission_code: 'prescriptions.read', permission_name: 'View Prescriptions', module: 'prescriptions', action: 'read', description: 'View prescription history' },
        { permission_id: 'perm_7', permission_code: 'prescriptions.update', permission_name: 'Update Prescriptions', module: 'prescriptions', action: 'update', description: 'Modify prescriptions' },
        { permission_id: 'perm_8', permission_code: 'appointments.create', permission_name: 'Create Appointments', module: 'appointments', action: 'create', description: 'Book appointments' },
        { permission_id: 'perm_9', permission_code: 'appointments.read', permission_name: 'View Appointments', module: 'appointments', action: 'read', description: 'View appointment calendar' },
        { permission_id: 'perm_10', permission_code: 'appointments.update', permission_name: 'Update Appointments', module: 'appointments', action: 'update', description: 'Modify appointments' },
        { permission_id: 'perm_11', permission_code: 'appointments.delete', permission_name: 'Cancel Appointments', module: 'appointments', action: 'delete', description: 'Cancel appointments' },
        { permission_id: 'perm_12', permission_code: 'inventory.view', permission_name: 'View Inventory', module: 'inventory', action: 'view', description: 'View medication inventory' },
        { permission_id: 'perm_13', permission_code: 'inventory.manage', permission_name: 'Manage Inventory', module: 'inventory', action: 'update', description: 'Update inventory levels' },
        { permission_id: 'perm_14', permission_code: 'lab.create', permission_name: 'Enter Lab Results', module: 'lab', action: 'create', description: 'Record lab test results' },
        { permission_id: 'perm_15', permission_code: 'lab.read', permission_name: 'View Lab Results', module: 'lab', action: 'read', description: 'View lab test history' },
        { permission_id: 'perm_16', permission_code: 'visits.create', permission_name: 'Record Visits', module: 'visits', action: 'create', description: 'Record clinical visits' },
        { permission_id: 'perm_17', permission_code: 'visits.read', permission_name: 'View Visits', module: 'visits', action: 'read', description: 'View visit history' },
        { permission_id: 'perm_18', permission_code: 'reports.generate', permission_name: 'Generate Reports', module: 'reports', action: 'create', description: 'Create and run reports' },
        { permission_id: 'perm_19', permission_code: 'reports.export', permission_name: 'Export Reports', module: 'reports', action: 'export', description: 'Export report data' },
        { permission_id: 'perm_20', permission_code: 'users.create', permission_name: 'Create Users', module: 'users', action: 'create', description: 'Add new system users' },
        { permission_id: 'perm_21', permission_code: 'users.update', permission_name: 'Update Users', module: 'users', action: 'update', description: 'Edit user accounts' },
        { permission_id: 'perm_22', permission_code: 'users.delete', permission_name: 'Delete Users', module: 'users', action: 'delete', description: 'Remove user accounts' },
        { permission_id: 'perm_23', permission_code: 'system.settings', permission_name: 'Manage Settings', module: 'system', action: 'update', description: 'Configure system settings' },
        { permission_id: 'perm_24', permission_code: 'rbac.manage', permission_name: 'Manage RBAC', module: 'system', action: 'update', description: 'Manage roles and permissions' }
    ],

    // Role Permissions
    role_permissions: [
        { role_permission_id: 'rp_1', role_id: 'role_admin', permission_id: 'perm_1', granted_at: '2024-01-01T00:00:00Z' },
        { role_permission_id: 'rp_2', role_id: 'role_admin', permission_id: 'perm_2', granted_at: '2024-01-01T00:00:00Z' },
        { role_permission_id: 'rp_3', role_id: 'role_admin', permission_id: 'perm_3', granted_at: '2024-01-01T00:00:00Z' },
        { role_permission_id: 'rp_4', role_id: 'role_admin', permission_id: 'perm_4', granted_at: '2024-01-01T00:00:00Z' },
        { role_permission_id: 'rp_5', role_id: 'role_physician', permission_id: 'perm_1', granted_at: '2024-01-01T00:00:00Z' },
        { role_permission_id: 'rp_6', role_id: 'role_physician', permission_id: 'perm_2', granted_at: '2024-01-01T00:00:00Z' },
        { role_permission_id: 'rp_7', role_id: 'role_physician', permission_id: 'perm_3', granted_at: '2024-01-01T00:00:00Z' },
        { role_permission_id: 'rp_8', role_id: 'role_physician', permission_id: 'perm_5', granted_at: '2024-01-01T00:00:00Z' },
        { role_permission_id: 'rp_9', role_id: 'role_physician', permission_id: 'perm_6', granted_at: '2024-01-01T00:00:00Z' },
        { role_permission_id: 'rp_10', role_id: 'role_physician', permission_id: 'perm_16', granted_at: '2024-01-01T00:00:00Z' },
        { role_permission_id: 'rp_11', role_id: 'role_physician', permission_id: 'perm_17', granted_at: '2024-01-01T00:00:00Z' },
        { role_permission_id: 'rp_12', role_id: 'role_nurse', permission_id: 'perm_2', granted_at: '2024-01-01T00:00:00Z' },
        { role_permission_id: 'rp_13', role_id: 'role_nurse', permission_id: 'perm_3', granted_at: '2024-01-01T00:00:00Z' },
        { role_permission_id: 'rp_14', role_id: 'role_nurse', permission_id: 'perm_6', granted_at: '2024-01-01T00:00:00Z' },
        { role_permission_id: 'rp_15', role_id: 'role_nurse', permission_id: 'perm_12', granted_at: '2024-01-01T00:00:00Z' },
        { role_permission_id: 'rp_16', role_id: 'role_nurse', permission_id: 'perm_13', granted_at: '2024-01-01T00:00:00Z' },
        { role_permission_id: 'rp_17', role_id: 'role_patient', permission_id: 'perm_2', granted_at: '2024-01-01T00:00:00Z' },
        { role_permission_id: 'rp_18', role_id: 'role_patient', permission_id: 'perm_6', granted_at: '2024-01-01T00:00:00Z' },
        { role_permission_id: 'rp_19', role_id: 'role_patient', permission_id: 'perm_9', granted_at: '2024-01-01T00:00:00Z' },
        { role_permission_id: 'rp_20', role_id: 'role_patient', permission_id: 'perm_15', granted_at: '2024-01-01T00:00:00Z' }
    ],

    // User Roles
    user_roles: [
        { user_role_id: 'ur_1', user_id: 1, role_id: 'role_admin', assigned_at: '2024-01-01T00:00:00Z', assigned_by: null },
        { user_role_id: 'ur_2', user_id: 2, role_id: 'role_physician', assigned_at: '2024-01-01T00:00:00Z', assigned_by: 1 },
        { user_role_id: 'ur_3', user_id: 3, role_id: 'role_nurse', assigned_at: '2024-01-01T00:00:00Z', assigned_by: 1 },
        { user_role_id: 'ur_4', user_id: 4, role_id: 'role_case_manager', assigned_at: '2024-01-01T00:00:00Z', assigned_by: 1 },
        { user_role_id: 'ur_5', user_id: 5, role_id: 'role_lab_personnel', assigned_at: '2024-01-01T00:00:00Z', assigned_by: 1 },
        { user_role_id: 'ur_6', user_id: 6, role_id: 'role_patient', assigned_at: '2024-01-01T00:00:00Z', assigned_by: null }
    ],

    // Auth Sessions
    auth_sessions: [
        {
            session_id: 'sess_1',
            user_id: 1,
            token_hash: 'hashed_token_abc123',
            issued_at: '2024-11-05T08:00:00Z',
            expires_at: '2024-11-05T20:00:00Z',
            ip_address: '192.168.1.100',
            user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            is_active: true,
            revoked_at: null
        },
        {
            session_id: 'sess_2',
            user_id: 2,
            token_hash: 'hashed_token_def456',
            issued_at: '2024-11-05T09:00:00Z',
            expires_at: '2024-11-05T21:00:00Z',
            ip_address: '192.168.1.101',
            user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            is_active: true,
            revoked_at: null
        },
        {
            session_id: 'sess_3',
            user_id: 6,
            token_hash: 'hashed_token_ghi789',
            issued_at: '2024-11-04T10:00:00Z',
            expires_at: '2024-11-04T22:00:00Z',
            ip_address: '192.168.1.150',
            user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
            is_active: false,
            revoked_at: '2024-11-04T15:00:00Z'
        }
    ],

    // MFA Tokens
    mfa_tokens: [
        {
            mfa_token_id: 'mfa_1',
            user_id: 1,
            method: 'totp',
            secret: 'encrypted_secret_123',
            phone_number: null,
            code_hash: null,
            issued_at: '2024-11-05T08:00:00Z',
            expires_at: '2024-11-05T08:10:00Z',
            consumed_at: '2024-11-05T08:02:00Z',
            attempts: 1
        },
        {
            mfa_token_id: 'mfa_2',
            user_id: 2,
            method: 'sms',
            secret: null,
            phone_number: '+639171234567',
            code_hash: 'hashed_code_456',
            issued_at: '2024-11-05T09:00:00Z',
            expires_at: '2024-11-05T09:10:00Z',
            consumed_at: null,
            attempts: 0
        },
        {
            mfa_token_id: 'mfa_3',
            user_id: 6,
            method: 'email',
            secret: null,
            phone_number: null,
            code_hash: 'hashed_code_789',
            issued_at: '2024-11-04T10:00:00Z',
            expires_at: '2024-11-04T10:10:00Z',
            consumed_at: '2024-11-04T10:05:00Z',
            attempts: 2
        }
    ],

    // Patient Identifiers
    patient_identifiers: [
        {
            identifier_id: 'pid_1',
            patient_id: 1,
            id_type: 'passport',
            id_value: 'P123456789',
            issued_at: '2020-01-15T00:00:00Z',
            expires_at: '2030-01-15T00:00:00Z',
            verified: true
        },
        {
            identifier_id: 'pid_2',
            patient_id: 1,
            id_type: 'sss',
            id_value: '34-1234567-8',
            issued_at: '2018-05-20T00:00:00Z',
            expires_at: null,
            verified: true
        },
        {
            identifier_id: 'pid_3',
            patient_id: 2,
            id_type: 'driver_license',
            id_value: 'D01-23-456789',
            issued_at: '2022-03-10T00:00:00Z',
            expires_at: '2027-03-10T00:00:00Z',
            verified: true
        },
        {
            identifier_id: 'pid_4',
            patient_id: 2,
            id_type: 'tin',
            id_value: '123-456-789-000',
            issued_at: null,
            expires_at: null,
            verified: false
        }
    ],

    // Patient Documents
    patient_documents: [
        {
            document_id: 'pdoc_1',
            patient_id: 1,
            document_type: 'consent',
            file_name: 'Informed_Consent_Form.pdf',
            file_path: '/uploads/documents/Informed_Consent_Form.pdf',
            file_size: 245760,
            mime_type: 'application/pdf',
            uploaded_at: '2024-10-01T10:00:00Z',
            uploaded_by: 2
        },
        {
            document_id: 'pdoc_2',
            patient_id: 1,
            document_type: 'id_copy',
            file_name: 'Passport_Copy.jpg',
            file_path: '/uploads/documents/Passport_Copy.jpg',
            file_size: 512000,
            mime_type: 'image/jpeg',
            uploaded_at: '2024-10-01T10:05:00Z',
            uploaded_by: 2
        },
        {
            document_id: 'pdoc_3',
            patient_id: 1,
            document_type: 'medical_record',
            file_name: 'Previous_Medical_Records.pdf',
            file_path: '/uploads/documents/Previous_Medical_Records.pdf',
            file_size: 1024000,
            mime_type: 'application/pdf',
            uploaded_at: '2024-10-15T14:30:00Z',
            uploaded_by: 2
        },
        {
            document_id: 'pdoc_4',
            patient_id: 2,
            document_type: 'lab_result',
            file_name: 'CD4_Test_Results.pdf',
            file_path: '/uploads/documents/CD4_Test_Results.pdf',
            file_size: 128000,
            mime_type: 'application/pdf',
            uploaded_at: '2024-11-01T09:00:00Z',
            uploaded_by: 5
        }
    ],

    // Diagnoses
    diagnoses: [
        {
            diagnosis_id: 'diag_1',
            visit_id: 1,
            icd10_code: 'B20',
            diagnosis_description: 'HIV disease',
            diagnosis_type: 'primary',
            is_chronic: true,
            onset_date: '2023-06-15T00:00:00Z',
            resolved_date: null
        },
        {
            diagnosis_id: 'diag_2',
            visit_id: 1,
            icd10_code: 'E11.9',
            diagnosis_description: 'Type 2 diabetes mellitus without complications',
            diagnosis_type: 'secondary',
            is_chronic: true,
            onset_date: '2022-01-10T00:00:00Z',
            resolved_date: null
        },
        {
            diagnosis_id: 'diag_3',
            visit_id: 2,
            icd10_code: 'B20',
            diagnosis_description: 'HIV disease',
            diagnosis_type: 'primary',
            is_chronic: true,
            onset_date: '2023-08-20T00:00:00Z',
            resolved_date: null
        },
        {
            diagnosis_id: 'diag_4',
            visit_id: 3,
            icd10_code: 'J06.9',
            diagnosis_description: 'Acute upper respiratory infection, unspecified',
            diagnosis_type: 'primary',
            is_chronic: false,
            onset_date: '2024-10-25T00:00:00Z',
            resolved_date: '2024-11-01T00:00:00Z'
        }
    ],

    // Procedures
    procedures: [
        {
            procedure_id: 'proc_1',
            visit_id: 1,
            cpt_code: '99213',
            procedure_name: 'Office or other outpatient visit',
            procedure_description: 'Routine follow-up examination',
            outcome: 'Patient stable, continue current treatment',
            performed_at: '2024-10-01T10:30:00Z'
        },
        {
            procedure_id: 'proc_2',
            visit_id: 1,
            cpt_code: '36415',
            procedure_name: 'Routine venipuncture for collection of specimen',
            procedure_description: 'Blood draw for CD4 and viral load',
            outcome: 'Specimen collected successfully',
            performed_at: '2024-10-01T10:45:00Z'
        },
        {
            procedure_id: 'proc_3',
            visit_id: 2,
            cpt_code: '99214',
            procedure_name: 'Office or other outpatient visit',
            procedure_description: 'Comprehensive examination',
            outcome: 'Patient doing well on ART',
            performed_at: '2024-10-15T14:00:00Z'
        },
        {
            procedure_id: 'proc_4',
            visit_id: 3,
            cpt_code: '99212',
            procedure_name: 'Office or other outpatient visit',
            procedure_description: 'Brief examination for respiratory symptoms',
            outcome: 'Symptoms resolved',
            performed_at: '2024-10-25T09:15:00Z'
        }
    ],

    // Dispense Events
    dispense_events: [
        {
            dispense_id: 'disp_1',
            prescription_id: 1,
            prescription_item_id: null,
            nurse_id: 3,
            facility_id: 1,
            dispensed_date: '2024-10-01T11:00:00Z',
            quantity_dispensed: 30,
            batch_number: 'BATCH-2024-001',
            notes: 'Patient received 30-day supply',
            created_at: '2024-10-01T11:00:00Z'
        },
        {
            dispense_id: 'disp_2',
            prescription_id: 2,
            prescription_item_id: null,
            nurse_id: 3,
            facility_id: 1,
            dispensed_date: '2024-10-15T14:30:00Z',
            quantity_dispensed: 60,
            batch_number: 'BATCH-2024-002',
            notes: 'Two-month supply dispensed',
            created_at: '2024-10-15T14:30:00Z'
        },
        {
            dispense_id: 'disp_3',
            prescription_id: 1,
            prescription_item_id: null,
            nurse_id: 3,
            facility_id: 1,
            dispensed_date: '2024-11-01T10:00:00Z',
            quantity_dispensed: 30,
            batch_number: 'BATCH-2024-003',
            notes: 'Monthly refill',
            created_at: '2024-11-01T10:00:00Z'
        }
    ],

    // Medication Adherence
    medication_adherence: [
        {
            adherence_id: 'adh_1',
            prescription_id: 1,
            patient_id: 1,
            adherence_date: '2024-10-01',
            taken: true,
            missed_reason: null,
            adherence_percentage: 100.00,
            recorded_at: '2024-10-01T20:00:00Z'
        },
        {
            adherence_id: 'adh_2',
            prescription_id: 1,
            patient_id: 1,
            adherence_date: '2024-10-02',
            taken: true,
            missed_reason: null,
            adherence_percentage: 100.00,
            recorded_at: '2024-10-02T20:00:00Z'
        },
        {
            adherence_id: 'adh_3',
            prescription_id: 1,
            patient_id: 1,
            adherence_date: '2024-10-03',
            taken: false,
            missed_reason: 'Forgot to take medication',
            adherence_percentage: 66.67,
            recorded_at: '2024-10-03T20:00:00Z'
        },
        {
            adherence_id: 'adh_4',
            prescription_id: 1,
            patient_id: 1,
            adherence_date: '2024-10-04',
            taken: true,
            missed_reason: null,
            adherence_percentage: 75.00,
            recorded_at: '2024-10-04T20:00:00Z'
        },
        {
            adherence_id: 'adh_5',
            prescription_id: 2,
            patient_id: 2,
            adherence_date: '2024-10-15',
            taken: true,
            missed_reason: null,
            adherence_percentage: 100.00,
            recorded_at: '2024-10-15T20:00:00Z'
        }
    ],

    // Lab Orders
    lab_orders: [
        {
            order_id: 'order_1',
            patient_id: 1,
            ordering_provider_id: 2,
            facility_id: 1,
            order_date: '2024-10-01',
            test_panel: 'CD4 Count',
            priority: 'routine',
            status: 'completed',
            collection_date: '2024-10-01',
            notes: 'Routine CD4 monitoring',
            created_at: '2024-10-01T09:00:00Z'
        },
        {
            order_id: 'order_2',
            patient_id: 1,
            ordering_provider_id: 2,
            facility_id: 1,
            order_date: '2024-10-01',
            test_panel: 'Viral Load',
            priority: 'routine',
            status: 'completed',
            collection_date: '2024-10-01',
            notes: null,
            created_at: '2024-10-01T09:00:00Z'
        },
        {
            order_id: 'order_3',
            patient_id: 2,
            ordering_provider_id: 2,
            facility_id: 1,
            order_date: '2024-10-15',
            test_panel: 'CBC',
            priority: 'routine',
            status: 'completed',
            collection_date: '2024-10-15',
            notes: 'Baseline CBC',
            created_at: '2024-10-15T10:00:00Z'
        },
        {
            order_id: 'order_4',
            patient_id: 1,
            ordering_provider_id: 2,
            facility_id: 1,
            order_date: '2024-11-05',
            test_panel: 'CD4 Count',
            priority: 'routine',
            status: 'ordered',
            collection_date: null,
            notes: null,
            created_at: '2024-11-05T08:00:00Z'
        }
    ],

    // Lab Results
    lab_results: [
        {
            result_id: 'result_1',
            order_id: 'order_1',
            patient_id: 1,
            test_code: 'CD4',
            test_name: 'CD4 Count',
            result_value: '450',
            unit: 'cells/μL',
            reference_range_min: 500,
            reference_range_max: 1200,
            reference_range_text: null,
            is_critical: false,
            critical_alert_sent: false,
            collected_at: '2024-10-01',
            reported_at: '2024-10-02',
            reviewed_at: '2024-10-02T10:00:00Z',
            reviewer_id: 2,
            notes: 'CD4 count stable',
            created_at: '2024-10-02T09:00:00Z',
            created_by: 5
        },
        {
            result_id: 'result_2',
            order_id: 'order_2',
            patient_id: 1,
            test_code: 'VL',
            test_name: 'Viral Load',
            result_value: '< 20',
            unit: 'copies/mL',
            reference_range_min: null,
            reference_range_max: null,
            reference_range_text: '< 20 copies/mL',
            is_critical: false,
            critical_alert_sent: false,
            collected_at: '2024-10-01',
            reported_at: '2024-10-02',
            reviewed_at: '2024-10-02T10:00:00Z',
            reviewer_id: 2,
            notes: 'Undetectable viral load',
            created_at: '2024-10-02T09:30:00Z',
            created_by: 5
        },
        {
            result_id: 'result_3',
            order_id: 'order_3',
            patient_id: 2,
            test_code: 'CBC',
            test_name: 'Complete Blood Count',
            result_value: 'Normal',
            unit: null,
            reference_range_min: null,
            reference_range_max: null,
            reference_range_text: 'Within normal limits',
            is_critical: false,
            critical_alert_sent: false,
            collected_at: '2024-10-15',
            reported_at: '2024-10-16',
            reviewed_at: null,
            reviewer_id: null,
            notes: null,
            created_at: '2024-10-16T08:00:00Z',
            created_by: 5
        }
    ],

    // Lab Files
    lab_files: [
        {
            file_id: 'labfile_1',
            result_id: 'result_1',
            file_name: 'CD4_Result_Report.pdf',
            file_path: '/uploads/lab/CD4_Result_Report.pdf',
            file_size: 256000,
            mime_type: 'application/pdf',
            uploaded_at: '2024-10-02T10:00:00Z',
            uploaded_by: 5
        },
        {
            file_id: 'labfile_2',
            result_id: 'result_2',
            file_name: 'Viral_Load_Report.pdf',
            file_path: '/uploads/lab/Viral_Load_Report.pdf',
            file_size: 192000,
            mime_type: 'application/pdf',
            uploaded_at: '2024-10-02T10:30:00Z',
            uploaded_by: 5
        }
    ],

    // Availability Slots
    availability_slots: [
        // Dr. Maria Santos (provider_id: 2) - Ortigas Main
        {
            slot_id: 'slot_1',
            provider_id: 2,
            facility_id: 1,
            slot_date: '2025-12-01',
            start_time: '09:00',
            end_time: '12:00',
            slot_status: 'available',
            appointment_id: null,
            created_at: '2025-11-01T08:00:00Z'
        },
        {
            slot_id: 'slot_2',
            provider_id: 2,
            facility_id: 1,
            slot_date: '2025-12-01',
            start_time: '13:00',
            end_time: '17:00',
            slot_status: 'available',
            appointment_id: null,
            created_at: '2025-11-01T08:00:00Z'
        },
        {
            slot_id: 'slot_3',
            provider_id: 2,
            facility_id: 1,
            slot_date: '2025-12-02',
            start_time: '09:00',
            end_time: '17:00',
            slot_status: 'available',
            appointment_id: null,
            created_at: '2025-11-01T08:00:00Z'
        },
        {
            slot_id: 'slot_4',
            provider_id: 2,
            facility_id: 1,
            slot_date: '2025-12-03',
            start_time: '09:00',
            end_time: '12:00',
            slot_status: 'available',
            appointment_id: null,
            created_at: '2025-11-01T08:00:00Z'
        },
        {
            slot_id: 'slot_5',
            provider_id: 2,
            facility_id: 1,
            slot_date: '2025-12-04',
            start_time: '09:00',
            end_time: '17:00',
            slot_status: 'available',
            appointment_id: null,
            created_at: '2025-11-01T08:00:00Z'
        },
        {
            slot_id: 'slot_6',
            provider_id: 2,
            facility_id: 1,
            slot_date: '2025-12-05',
            start_time: '09:00',
            end_time: '15:00',
            slot_status: 'available',
            appointment_id: null,
            created_at: '2025-11-01T08:00:00Z'
        },
        // Nurse Juan dela Cruz (provider_id: 3) - Ortigas Main
        {
            slot_id: 'slot_7',
            provider_id: 3,
            facility_id: 1,
            slot_date: '2025-12-01',
            start_time: '08:00',
            end_time: '16:00',
            slot_status: 'available',
            appointment_id: null,
            created_at: '2025-11-01T08:00:00Z'
        },
        {
            slot_id: 'slot_8',
            provider_id: 3,
            facility_id: 1,
            slot_date: '2025-12-02',
            start_time: '08:00',
            end_time: '16:00',
            slot_status: 'available',
            appointment_id: null,
            created_at: '2025-11-01T08:00:00Z'
        },
        {
            slot_id: 'slot_9',
            provider_id: 3,
            facility_id: 1,
            slot_date: '2025-12-03',
            start_time: '10:00',
            end_time: '18:00',
            slot_status: 'available',
            appointment_id: null,
            created_at: '2025-11-01T08:00:00Z'
        },
        {
            slot_id: 'slot_10',
            provider_id: 3,
            facility_id: 1,
            slot_date: '2025-12-04',
            start_time: '08:00',
            end_time: '16:00',
            slot_status: 'available',
            appointment_id: null,
            created_at: '2025-11-01T08:00:00Z'
        },
        {
            slot_id: 'slot_11',
            provider_id: 3,
            facility_id: 1,
            slot_date: '2025-12-05',
            start_time: '08:00',
            end_time: '14:00',
            slot_status: 'available',
            appointment_id: null,
            created_at: '2025-11-01T08:00:00Z'
        },
        // Dr. Maria Santos - Pasay Branch (facility_id: 2)
        {
            slot_id: 'slot_12',
            provider_id: 2,
            facility_id: 2,
            slot_date: '2025-12-02',
            start_time: '09:00',
            end_time: '15:00',
            slot_status: 'available',
            appointment_id: null,
            created_at: '2025-11-01T08:00:00Z'
        },
        {
            slot_id: 'slot_13',
            provider_id: 2,
            facility_id: 2,
            slot_date: '2025-12-03',
            start_time: '09:00',
            end_time: '15:00',
            slot_status: 'available',
            appointment_id: null,
            created_at: '2025-11-01T08:00:00Z'
        },
        // Dr. Maria Santos - Alabang Branch (facility_id: 3)
        {
            slot_id: 'slot_14',
            provider_id: 2,
            facility_id: 3,
            slot_date: '2025-12-04',
            start_time: '10:00',
            end_time: '16:00',
            slot_status: 'available',
            appointment_id: null,
            created_at: '2025-11-01T08:00:00Z'
        },
        {
            slot_id: 'slot_15',
            provider_id: 2,
            facility_id: 3,
            slot_date: '2025-12-05',
            start_time: '10:00',
            end_time: '16:00',
            slot_status: 'available',
            appointment_id: null,
            created_at: '2025-11-01T08:00:00Z'
        },
        // Already booked slots (for existing appointments)
        {
            slot_id: 'slot_16',
            provider_id: 2,
            facility_id: 1,
            slot_date: '2025-11-26',
            start_time: '10:00',
            end_time: '11:00',
            slot_status: 'booked',
            appointment_id: 5,
            created_at: '2025-11-01T08:00:00Z'
        },
        {
            slot_id: 'slot_17',
            provider_id: 3,
            facility_id: 1,
            slot_date: '2025-11-27',
            start_time: '14:00',
            end_time: '15:00',
            slot_status: 'booked',
            appointment_id: 6,
            created_at: '2025-11-01T08:00:00Z'
        }
    ],

    // Appointment Request Notifications
    appointment_notifications: [
        {
            id: 'notif_1732500001',
            type: 'request_approved',
            request_id: 'req_1732500000003',
            patient_id: 3,
            message: 'Your appointment for Nov 28, 2025 at 11:00 AM has been approved!',
            read: false,
            created_at: '2025-11-22T10:00:00Z'
        },
        {
            id: 'notif_1732500002',
            type: 'request_approved',
            request_id: 'req_1732500000008',
            patient_id: 1,
            message: 'Your appointment for Nov 26, 2025 at 10:30 AM has been approved!',
            read: true,
            created_at: '2025-11-20T14:30:00Z'
        },
        {
            id: 'notif_1732500003',
            type: 'request_declined',
            request_id: 'req_1732500000004',
            patient_id: 1,
            message: 'Your appointment request for Nov 20, 2025 was declined. Reason: Provider not available.',
            read: true,
            created_at: '2025-11-19T11:30:00Z'
        },
        {
            id: 'notif_1732500004',
            type: 'new_request',
            request_id: 'req_1732500000001',
            for_role: 'case_manager',
            message: 'New appointment request from John Doe for Dec 1, 2025',
            read: false,
            created_at: '2025-11-24T09:30:00Z'
        },
        {
            id: 'notif_1732500005',
            type: 'new_request',
            request_id: 'req_1732500000002',
            for_role: 'case_manager',
            message: 'New appointment request from Maria Santos for Dec 2, 2025',
            read: false,
            created_at: '2025-11-23T14:15:00Z'
        },
        {
            id: 'notif_1732500006',
            type: 'new_request',
            request_id: 'req_1732500000005',
            for_role: 'case_manager',
            message: 'New appointment request from Carlos Rodriguez for Dec 3, 2025',
            read: false,
            created_at: '2025-11-25T08:00:00Z'
        }
    ],

    // Appointment Reminders
    appointment_reminders: [
        {
            reminder_id: 'rem_1',
            appointment_id: 1,
            reminder_type: 'sms',
            reminder_scheduled_at: '2024-11-06T08:00:00Z',
            reminder_sent_at: '2024-11-06T08:00:00Z',
            status: 'sent',
            created_at: '2024-11-01T10:00:00Z'
        },
        {
            reminder_id: 'rem_2',
            appointment_id: 2,
            reminder_type: 'email',
            reminder_scheduled_at: '2024-11-07T08:00:00Z',
            reminder_sent_at: null,
            status: 'pending',
            created_at: '2024-11-02T10:00:00Z'
        },
        {
            reminder_id: 'rem_3',
            appointment_id: 3,
            reminder_type: 'push',
            reminder_scheduled_at: '2024-11-08T08:00:00Z',
            reminder_sent_at: null,
            status: 'pending',
            created_at: '2024-11-03T10:00:00Z'
        }
    ],

    // Care Tasks
    care_tasks: [
        {
            task_id: 'task_1',
            referral_id: null,
            patient_id: 1,
            assignee_id: 4,
            task_type: 'follow_up',
            task_description: 'Follow up on medication adherence after missed doses',
            due_date: '2024-11-10',
            status: 'pending',
            completed_at: null,
            created_at: '2024-11-01T10:00:00Z',
            created_by: 2
        },
        {
            task_id: 'task_2',
            referral_id: 1,
            patient_id: 2,
            assignee_id: 4,
            task_type: 'referral',
            task_description: 'Coordinate referral acceptance and patient transfer',
            due_date: '2024-11-08',
            status: 'in_progress',
            completed_at: null,
            created_at: '2024-10-28T14:00:00Z',
            created_by: 2
        },
        {
            task_id: 'task_3',
            referral_id: null,
            patient_id: 1,
            assignee_id: 4,
            task_type: 'counseling',
            task_description: 'Schedule adherence counseling session',
            due_date: '2024-11-12',
            status: 'pending',
            completed_at: null,
            created_at: '2024-11-02T09:00:00Z',
            created_by: 2
        },
        {
            task_id: 'task_4',
            referral_id: null,
            patient_id: 2,
            assignee_id: 3,
            task_type: 'appointment',
            task_description: 'Remind patient about upcoming appointment',
            due_date: '2024-11-07',
            status: 'completed',
            completed_at: '2024-11-05T15:00:00Z',
            created_at: '2024-11-01T10:00:00Z',
            created_by: 2
        }
    ],

    // Report Queries
    report_queries: [
        {
            report_id: 'query_1',
            report_name: 'Monthly Patient Statistics',
            report_description: 'Monthly patient registration and activity statistics',
            report_type: 'patient',
            query_definition: JSON.stringify({ dataSource: 'patients', dateRange: { from: '2024-10-01', to: '2024-10-31' } }),
            parameters: JSON.stringify({ dateFrom: '2024-10-01', dateTo: '2024-10-31' }),
            schedule: '0 0 1 * *',
            owner_id: 1,
            is_public: true,
            created_at: '2024-10-01T00:00:00Z'
        },
        {
            report_id: 'query_2',
            report_name: 'Clinical Visit Summary',
            report_description: 'Summary of all clinical visits',
            report_type: 'clinical',
            query_definition: JSON.stringify({ dataSource: 'visits', filters: {} }),
            parameters: JSON.stringify({}),
            schedule: null,
            owner_id: 2,
            is_public: false,
            created_at: '2024-10-15T00:00:00Z'
        }
    ],

    // Report Runs
    report_runs: [
        {
            run_id: 'run_1',
            report_id: 'query_1',
            started_at: '2024-11-01T08:00:00Z',
            finished_at: '2024-11-01T08:05:00Z',
            status: 'completed',
            parameters_used: JSON.stringify({ dateFrom: '2024-10-01', dateTo: '2024-10-31' }),
            output_ref: '/reports/run_1.pdf',
            error_message: null,
            run_by: 1
        },
        {
            run_id: 'run_2',
            report_id: 'query_2',
            started_at: '2024-11-02T10:00:00Z',
            finished_at: null,
            status: 'running',
            parameters_used: JSON.stringify({}),
            output_ref: null,
            error_message: null,
            run_by: 2
        }
    ],

    // System Settings
    system_settings: [
        {
            setting_key: 'system.name',
            setting_value: 'MyHubCares',
            description: 'System name',
            updated_at: '2024-01-01T00:00:00Z',
            updated_by: 1
        },
        {
            setting_key: 'system.timezone',
            setting_value: 'Asia/Manila',
            description: 'System timezone',
            updated_at: '2024-01-01T00:00:00Z',
            updated_by: 1
        },
        {
            setting_key: 'appointment.reminder_hours',
            setting_value: 24,
            description: 'Hours before appointment to send reminder',
            updated_at: '2024-01-01T00:00:00Z',
            updated_by: 1
        },
        {
            setting_key: 'inventory.low_stock_threshold',
            setting_value: 10,
            description: 'Low stock alert threshold',
            updated_at: '2024-01-01T00:00:00Z',
            updated_by: 1
        }
    ],

    // User Facility Assignments
    user_facility_assignments: [
        {
            assignment_id: 'assign_1',
            user_id: 1,
            facility_id: 1,
            is_primary: true,
            assigned_at: '2024-01-01T00:00:00Z',
            assigned_by: null
        },
        {
            assignment_id: 'assign_2',
            user_id: 2,
            facility_id: 1,
            is_primary: true,
            assigned_at: '2024-01-01T00:00:00Z',
            assigned_by: 1
        },
        {
            assignment_id: 'assign_3',
            user_id: 2,
            facility_id: 2,
            is_primary: false,
            assigned_at: '2024-06-01T00:00:00Z',
            assigned_by: 1
        }
    ],

    // Client Types
    client_types: [
        {
            client_type_id: 1,
            type_name: 'Males having Sex with Males',
            type_code: 'MSM',
            description: 'Men who have sex with men',
            is_active: true,
            created_at: '2024-01-01T00:00:00Z'
        },
        {
            client_type_id: 2,
            type_name: 'Female Sex Workers',
            type_code: 'FSW',
            description: 'Women engaged in sex work',
            is_active: true,
            created_at: '2024-01-01T00:00:00Z'
        },
        {
            client_type_id: 3,
            type_name: 'People Who Inject Drugs',
            type_code: 'PWID',
            description: 'Individuals who inject drugs',
            is_active: true,
            created_at: '2024-01-01T00:00:00Z'
        },
        {
            client_type_id: 4,
            type_name: 'Transgender Women',
            type_code: 'TGW',
            description: 'Transgender women',
            is_active: true,
            created_at: '2024-01-01T00:00:00Z'
        }
    ],

    // Vaccine Catalog
    vaccine_catalog: [
        {
            vaccine_id: 'vacc_1',
            vaccine_name: 'Hepatitis B',
            manufacturer: 'GlaxoSmithKline',
            series_length: 3,
            dose_intervals: JSON.stringify([0, 30, 180]),
            is_active: true,
            created_at: '2024-01-01T00:00:00Z'
        },
        {
            vaccine_id: 'vacc_2',
            vaccine_name: 'Influenza',
            manufacturer: 'Sanofi',
            series_length: 1,
            dose_intervals: JSON.stringify([0]),
            is_active: true,
            created_at: '2024-01-01T00:00:00Z'
        },
        {
            vaccine_id: 'vacc_3',
            vaccine_name: 'HPV',
            manufacturer: 'Merck',
            series_length: 3,
            dose_intervals: JSON.stringify([0, 60, 180]),
            is_active: true,
            created_at: '2024-01-01T00:00:00Z'
        }
    ],

    // Forum Categories
    forum_categories: [
        {
            category_id: 'cat_1',
            category_name: 'General Discussion',
            category_code: 'general',
            description: 'General health and wellness discussions',
            icon: '💬',
            is_active: true,
            created_at: '2024-01-01T00:00:00Z'
        },
        {
            category_id: 'cat_2',
            category_name: 'Treatment & Medication',
            category_code: 'treatment',
            description: 'Discussions about treatment and medications',
            icon: '💊',
            is_active: true,
            created_at: '2024-01-01T00:00:00Z'
        },
        {
            category_id: 'cat_3',
            category_name: 'Support & Counseling',
            category_code: 'support',
            description: 'Peer support and counseling discussions',
            icon: '🤝',
            is_active: true,
            created_at: '2024-01-01T00:00:00Z'
        }
    ],

    // Forum Posts
    forum_posts: [
        {
            post_id: 'post_1',
            patient_id: 1,
            category_id: 'cat_1',
            title: 'Welcome to MyHubCares Community',
            content: 'This is a welcoming post for new members of the community.',
            is_anonymous: false,
            reply_count: 3,
            view_count: 45,
            is_pinned: true,
            is_locked: false,
            status: 'approved',
            created_at: '2024-10-01T10:00:00Z',
            updated_at: '2024-10-01T10:00:00Z'
        },
        {
            post_id: 'post_2',
            patient_id: null,
            category_id: 'cat_2',
            title: 'ART Medication Side Effects',
            content: 'I\'ve been experiencing some side effects from my ART medication. Has anyone else experienced this?',
            is_anonymous: true,
            reply_count: 5,
            view_count: 78,
            is_pinned: false,
            is_locked: false,
            status: 'approved',
            created_at: '2024-10-15T14:00:00Z',
            updated_at: '2024-10-15T14:00:00Z'
        }
    ],

    // Forum Replies
    forum_replies: [
        {
            reply_id: 'reply_1',
            post_id: 'post_1',
            patient_id: 2,
            content: 'Thank you for the warm welcome!',
            is_anonymous: false,
            status: 'approved',
            created_at: '2024-10-01T11:00:00Z'
        },
        {
            reply_id: 'reply_2',
            post_id: 'post_2',
            patient_id: null,
            content: 'I experienced similar side effects. They usually subside after a few weeks.',
            is_anonymous: true,
            status: 'approved',
            created_at: '2024-10-15T15:00:00Z'
        }
    ],

    // Inventory Transactions
    inventory_transactions: [
        {
            transaction_id: 'trans_1',
            inventory_id: 1,
            transaction_type: 'restock',
            quantity_change: 100,
            quantity_before: 50,
            quantity_after: 150,
            batch_number: 'BATCH-2024-001',
            transaction_reason: 'Initial stock',
            performed_by: 3,
            facility_id: 1,
            transaction_date: '2024-10-01',
            reference_id: null,
            reference_type: null,
            notes: null,
            created_at: '2024-10-01T08:00:00Z'
        },
        {
            transaction_id: 'trans_2',
            inventory_id: 1,
            transaction_type: 'dispense',
            quantity_change: -30,
            quantity_before: 150,
            quantity_after: 120,
            batch_number: 'BATCH-2024-001',
            transaction_reason: 'Prescription dispensing',
            performed_by: 3,
            facility_id: 1,
            transaction_date: '2024-10-01',
            reference_id: 'disp_1',
            reference_type: 'prescription',
            notes: null,
            created_at: '2024-10-01T11:00:00Z'
        }
    ],

    // Inventory Alerts
    inventory_alerts: [
        {
            alert_id: 'alert_1',
            inventory_id: 2,
            alert_type: 'low_stock',
            alert_level: 'warning',
            current_value: 5,
            threshold_value: 10,
            message: 'Medication stock is below reorder level',
            acknowledged: false,
            acknowledged_by: null,
            acknowledged_at: null,
            created_at: '2024-11-05T08:00:00Z'
        },
        {
            alert_id: 'alert_2',
            inventory_id: 3,
            alert_type: 'expiring_soon',
            alert_level: 'warning',
            current_value: 30,
            threshold_value: 60,
            message: 'Medication expiring within 30 days',
            acknowledged: false,
            acknowledged_by: null,
            acknowledged_at: null,
            created_at: '2024-11-05T08:00:00Z'
        }
    ],

    // Inventory Suppliers
    inventory_suppliers: [
        {
            supplier_id: 'supplier_1',
            supplier_name: 'PharmaCorp Philippines',
            contact_person: 'Juan dela Cruz',
            contact_phone: '+63-2-1234-5678',
            contact_email: 'orders@pharmacorp.ph',
            address: JSON.stringify({ street: '123 Business Ave', city: 'Makati', province: 'Metro Manila' }),
            payment_terms: 'Net 30',
            is_active: true,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z'
        },
        {
            supplier_id: 'supplier_2',
            supplier_name: 'MedSupply Inc.',
            contact_person: 'Maria Santos',
            contact_phone: '+63-2-9876-5432',
            contact_email: 'sales@medsupply.ph',
            address: JSON.stringify({ street: '456 Medical St', city: 'Quezon City', province: 'Metro Manila' }),
            payment_terms: 'Net 45',
            is_active: true,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z'
        }
    ],

    // Inventory Orders
    inventory_orders: [
        {
            order_id: 'inv_order_1',
            facility_id: 1,
            supplier_id: 'supplier_1',
            order_date: '2024-10-20',
            expected_delivery_date: '2024-11-05',
            status: 'in_transit',
            total_cost: 50000.00,
            ordered_by: 3,
            received_by: null,
            received_at: null,
            notes: 'Monthly medication order',
            created_at: '2024-10-20T10:00:00Z'
        },
        {
            order_id: 'inv_order_2',
            facility_id: 1,
            supplier_id: 'supplier_2',
            order_date: '2024-11-01',
            expected_delivery_date: '2024-11-15',
            status: 'ordered',
            total_cost: 35000.00,
            ordered_by: 3,
            received_by: null,
            received_at: null,
            notes: null,
            created_at: '2024-11-01T09:00:00Z'
        }
    ],

    // Inventory Order Items
    inventory_order_items: [
        {
            order_item_id: 'item_1',
            order_id: 'inv_order_1',
            medication_id: 1,
            quantity_ordered: 200,
            quantity_received: 0,
            unit_cost: 250.00,
            batch_number: null,
            expiry_date: null,
            status: 'pending'
        },
        {
            order_item_id: 'item_2',
            order_id: 'inv_order_1',
            medication_id: 2,
            quantity_ordered: 150,
            quantity_received: 0,
            unit_cost: 300.00,
            batch_number: null,
            expiry_date: null,
            status: 'pending'
        },
        {
            order_item_id: 'item_3',
            order_id: 'inv_order_2',
            medication_id: 3,
            quantity_ordered: 100,
            quantity_received: 0,
            unit_cost: 350.00,
            batch_number: null,
            expiry_date: null,
            status: 'pending'
        }
    ],

    // ART Regimen History
    art_regimen_history: [
        {
            history_id: 'hist_1',
            regimen_id: 'regimen_1',
            action_type: 'started',
            action_date: '2024-09-01',
            previous_status: null,
            new_status: 'active',
            details: JSON.stringify({ drugs: ['Tenofovir/Lamivudine/Dolutegravir'] }),
            performed_by: 2,
            notes: 'ART regimen initiated',
            created_at: '2024-09-01T10:00:00Z'
        },
        {
            history_id: 'hist_2',
            regimen_id: 'regimen_1',
            action_type: 'pills_dispensed',
            action_date: '2024-10-01',
            previous_status: null,
            new_status: null,
            details: JSON.stringify({ quantity: 30, drug_id: 'drug_1' }),
            performed_by: 3,
            notes: 'Monthly refill',
            created_at: '2024-10-01T11:00:00Z'
        },
        {
            history_id: 'hist_3',
            regimen_id: 'regimen_1',
            action_type: 'dose_missed',
            action_date: '2024-10-03',
            previous_status: null,
            new_status: null,
            details: JSON.stringify({ drug_id: 'drug_1', reason: 'Forgot to take' }),
            performed_by: 1,
            notes: 'Patient reported missed dose',
            created_at: '2024-10-03T20:00:00Z'
        }
    ],

    // Medications Catalog
    medications: [
        {
            medication_id: 'med_1',
            medication_name: 'Tenofovir/Lamivudine/Dolutegravir (TLD)',
            generic_name: 'TLD',
            form: 'tablet',
            strength: '300mg/300mg/50mg',
            atc_code: 'J05AR10',
            is_art: true,
            is_controlled: false,
            active: true
        },
        {
            medication_id: 'med_2',
            medication_name: 'Efavirenz',
            generic_name: 'Efavirenz',
            form: 'tablet',
            strength: '600mg',
            atc_code: 'J05AG03',
            is_art: true,
            is_controlled: false,
            active: true
        },
        {
            medication_id: 'med_3',
            medication_name: 'Tenofovir Disoproxil Fumarate',
            generic_name: 'TDF',
            form: 'tablet',
            strength: '300mg',
            atc_code: 'J05AF07',
            is_art: true,
            is_controlled: false,
            active: true
        },
        {
            medication_id: 'med_4',
            medication_name: 'Lamivudine',
            generic_name: '3TC',
            form: 'tablet',
            strength: '300mg',
            atc_code: 'J05AF05',
            is_art: true,
            is_controlled: false,
            active: true
        },
        {
            medication_id: 'med_5',
            medication_name: 'Dolutegravir',
            generic_name: 'DTG',
            form: 'tablet',
            strength: '50mg',
            atc_code: 'J05AJ02',
            is_art: true,
            is_controlled: false,
            active: true
        },
        {
            medication_id: 'med_6',
            medication_name: 'Raltegravir',
            generic_name: 'RAL',
            form: 'tablet',
            strength: '400mg',
            atc_code: 'J05AJ01',
            is_art: true,
            is_controlled: false,
            active: true
        },
        {
            medication_id: 'med_7',
            medication_name: 'Atazanavir',
            generic_name: 'ATV',
            form: 'capsule',
            strength: '300mg',
            atc_code: 'J05AE08',
            is_art: true,
            is_controlled: false,
            active: true
        },
        {
            medication_id: 'med_8',
            medication_name: 'Lopinavir/Ritonavir',
            generic_name: 'LPV/r',
            form: 'tablet',
            strength: '200mg/50mg',
            atc_code: 'J05AR06',
            is_art: true,
            is_controlled: false,
            active: true
        },
        {
            medication_id: 'med_9',
            medication_name: 'Cotrimoxazole',
            generic_name: 'Sulfamethoxazole/Trimethoprim',
            form: 'tablet',
            strength: '960mg',
            atc_code: 'J01EE01',
            is_art: false,
            is_controlled: false,
            active: true
        },
        {
            medication_id: 'med_10',
            medication_name: 'Azithromycin',
            generic_name: 'Azithromycin',
            form: 'tablet',
            strength: '500mg',
            atc_code: 'J01FA10',
            is_art: false,
            is_controlled: false,
            active: true
        },
        {
            medication_id: 'med_11',
            medication_name: 'Isoniazid',
            generic_name: 'INH',
            form: 'tablet',
            strength: '300mg',
            atc_code: 'J04AC01',
            is_art: false,
            is_controlled: false,
            active: true
        },
        {
            medication_id: 'med_12',
            medication_name: 'Rifampicin',
            generic_name: 'RIF',
            form: 'capsule',
            strength: '300mg',
            atc_code: 'J04AB02',
            is_art: false,
            is_controlled: false,
            active: true
        },
        {
            medication_id: 'med_13',
            medication_name: 'Ethambutol',
            generic_name: 'EMB',
            form: 'tablet',
            strength: '400mg',
            atc_code: 'J04AK02',
            is_art: false,
            is_controlled: false,
            active: true
        },
        {
            medication_id: 'med_14',
            medication_name: 'Pyrazinamide',
            generic_name: 'PZA',
            form: 'tablet',
            strength: '500mg',
            atc_code: 'J04AK01',
            is_art: false,
            is_controlled: false,
            active: true
        },
        {
            medication_id: 'med_15',
            medication_name: 'Fluconazole',
            generic_name: 'Fluconazole',
            form: 'capsule',
            strength: '150mg',
            atc_code: 'J02AC01',
            is_art: false,
            is_controlled: false,
            active: true
        },
        {
            medication_id: 'med_16',
            medication_name: 'Paracetamol',
            generic_name: 'Acetaminophen',
            form: 'tablet',
            strength: '500mg',
            atc_code: 'N02BE01',
            is_art: false,
            is_controlled: false,
            active: true
        },
        {
            medication_id: 'med_17',
            medication_name: 'Ibuprofen',
            generic_name: 'Ibuprofen',
            form: 'tablet',
            strength: '400mg',
            atc_code: 'M01AE01',
            is_art: false,
            is_controlled: false,
            active: true
        },
        {
            medication_id: 'med_18',
            medication_name: 'Metformin',
            generic_name: 'Metformin',
            form: 'tablet',
            strength: '500mg',
            atc_code: 'A10BA02',
            is_art: false,
            is_controlled: false,
            active: true
        },
        {
            medication_id: 'med_19',
            medication_name: 'Omeprazole',
            generic_name: 'Omeprazole',
            form: 'capsule',
            strength: '20mg',
            atc_code: 'A02BC01',
            is_art: false,
            is_controlled: false,
            active: true
        },
        {
            medication_id: 'med_20',
            medication_name: 'Amoxicillin',
            generic_name: 'Amoxicillin',
            form: 'capsule',
            strength: '500mg',
            atc_code: 'J01CA04',
            is_art: false,
            is_controlled: false,
            active: true
        },
        {
            medication_id: 'med_21',
            medication_name: 'Abacavir/Lamivudine',
            generic_name: 'ABC/3TC',
            form: 'tablet',
            strength: '600mg/300mg',
            atc_code: 'J05AR02',
            is_art: true,
            is_controlled: false,
            active: true
        },
        {
            medication_id: 'med_22',
            medication_name: 'Zidovudine/Lamivudine',
            generic_name: 'AZT/3TC',
            form: 'tablet',
            strength: '300mg/150mg',
            atc_code: 'J05AR01',
            is_art: true,
            is_controlled: false,
            active: true
        },
        {
            medication_id: 'med_23',
            medication_name: 'Nevirapine',
            generic_name: 'NVP',
            form: 'tablet',
            strength: '200mg',
            atc_code: 'J05AG01',
            is_art: true,
            is_controlled: false,
            active: true
        },
        {
            medication_id: 'med_24',
            medication_name: 'Ritonavir',
            generic_name: 'RTV',
            form: 'tablet',
            strength: '100mg',
            atc_code: 'J05AE03',
            is_art: true,
            is_controlled: false,
            active: true
        },
        {
            medication_id: 'med_25',
            medication_name: 'Darunavir',
            generic_name: 'DRV',
            form: 'tablet',
            strength: '600mg',
            atc_code: 'J05AE10',
            is_art: true,
            is_controlled: false,
            active: true
        }
    ],

    // Patient Risk Scores
    patient_risk_scores: [
        {
            risk_score_id: 'risk_1',
            patient_id: 1,
            score: 25.5,
            calculated_on: '2024-10-01',
            risk_factors: JSON.stringify({
                missedMedications: 15,
                missedAppointments: 10,
                labCompliance: 5,
                timeSinceLastVisit: 5
            }),
            recommendations: 'Continue current adherence. Schedule follow-up appointment in 3 months.',
            calculated_by: 2
        },
        {
            risk_score_id: 'risk_2',
            patient_id: 1,
            score: 18.2,
            calculated_on: '2024-11-01',
            risk_factors: JSON.stringify({
                missedMedications: 10,
                missedAppointments: 5,
                labCompliance: 3,
                timeSinceLastVisit: 2
            }),
            recommendations: 'Patient showing improvement. Continue monitoring.',
            calculated_by: 2
        },
        {
            risk_score_id: 'risk_3',
            patient_id: 2,
            score: 45.8,
            calculated_on: '2024-10-15',
            risk_factors: JSON.stringify({
                missedMedications: 25,
                missedAppointments: 15,
                labCompliance: 10,
                timeSinceLastVisit: 8
            }),
            recommendations: 'High risk detected. Schedule adherence counseling and closer follow-up.',
            calculated_by: 2
        },
        {
            risk_score_id: 'risk_4',
            patient_id: 2,
            score: 52.3,
            calculated_on: '2024-11-01',
            risk_factors: JSON.stringify({
                missedMedications: 30,
                missedAppointments: 18,
                labCompliance: 12,
                timeSinceLastVisit: 10
            }),
            recommendations: 'Critical risk level. Immediate intervention required. Consider case management referral.',
            calculated_by: 2
        },
        {
            risk_score_id: 'risk_5',
            patient_id: 1,
            score: 12.5,
            calculated_on: '2024-09-01',
            risk_factors: JSON.stringify({
                missedMedications: 5,
                missedAppointments: 3,
                labCompliance: 2,
                timeSinceLastVisit: 2
            }),
            recommendations: 'Low risk. Patient is adherent. Continue current care plan.',
            calculated_by: 2
        },
        {
            risk_score_id: 'risk_6',
            patient_id: 1,
            score: 30.0,
            calculated_on: '2024-08-01',
            risk_factors: JSON.stringify({
                missedMedications: 20,
                missedAppointments: 12,
                labCompliance: 8,
                timeSinceLastVisit: 6
            }),
            recommendations: 'Moderate risk. Review medication schedule and provide adherence support.',
            calculated_by: 2
        },
        {
            risk_score_id: 'risk_7',
            patient_id: 2,
            score: 38.5,
            calculated_on: '2024-09-15',
            risk_factors: JSON.stringify({
                missedMedications: 22,
                missedAppointments: 12,
                labCompliance: 8,
                timeSinceLastVisit: 6
            }),
            recommendations: 'Moderate to high risk. Schedule counseling session and medication review.',
            calculated_by: 2
        },
        {
            risk_score_id: 'risk_8',
            patient_id: 1,
            score: 8.5,
            calculated_on: '2024-07-01',
            risk_factors: JSON.stringify({
                missedMedications: 3,
                missedAppointments: 2,
                labCompliance: 1,
                timeSinceLastVisit: 1
            }),
            recommendations: 'Very low risk. Excellent adherence. Continue current care plan.',
            calculated_by: 2
        },
        {
            risk_score_id: 'risk_9',
            patient_id: 2,
            score: 60.2,
            calculated_on: '2024-08-15',
            risk_factors: JSON.stringify({
                missedMedications: 35,
                missedAppointments: 20,
                labCompliance: 15,
                timeSinceLastVisit: 12
            }),
            recommendations: 'Critical risk. Patient requires intensive case management and support.',
            calculated_by: 2
        },
        {
            risk_score_id: 'risk_10',
            patient_id: 1,
            score: 15.0,
            calculated_on: '2024-06-01',
            risk_factors: JSON.stringify({
                missedMedications: 8,
                missedAppointments: 5,
                labCompliance: 3,
                timeSinceLastVisit: 2
            }),
            recommendations: 'Low risk. Good adherence. Continue monitoring.',
            calculated_by: 2
        }
    ],

    // Survey Metrics
    survey_metrics: [
        {
            metric_id: 'metric_1',
            facility_id: 1,
            period_start: '2024-10-01',
            period_end: '2024-10-31',
            total_responses: 45,
            average_overall: 3.8,
            average_staff: 4.2,
            average_wait: 3.5,
            average_cleanliness: 4.0,
            recommendation_rate: 85.5,
            calculated_at: '2024-11-01T08:00:00Z'
        },
        {
            metric_id: 'metric_2',
            facility_id: 1,
            period_start: '2024-09-01',
            period_end: '2024-09-30',
            total_responses: 38,
            average_overall: 3.6,
            average_staff: 4.0,
            average_wait: 3.4,
            average_cleanliness: 3.9,
            recommendation_rate: 82.1,
            calculated_at: '2024-10-01T08:00:00Z'
        },
        {
            metric_id: 'metric_3',
            facility_id: 2,
            period_start: '2024-10-01',
            period_end: '2024-10-31',
            total_responses: 32,
            average_overall: 3.9,
            average_staff: 4.3,
            average_wait: 3.6,
            average_cleanliness: 4.1,
            recommendation_rate: 87.5,
            calculated_at: '2024-11-01T08:00:00Z'
        },
        {
            metric_id: 'metric_4',
            facility_id: null,
            period_start: '2024-10-01',
            period_end: '2024-10-31',
            total_responses: 77,
            average_overall: 3.85,
            average_staff: 4.25,
            average_wait: 3.55,
            average_cleanliness: 4.05,
            recommendation_rate: 86.5,
            calculated_at: '2024-11-01T08:00:00Z'
        },
        {
            metric_id: 'metric_5',
            facility_id: 1,
            period_start: '2024-08-01',
            period_end: '2024-08-31',
            total_responses: 42,
            average_overall: 3.7,
            average_staff: 4.1,
            average_wait: 3.5,
            average_cleanliness: 3.8,
            recommendation_rate: 80.0,
            calculated_at: '2024-09-01T08:00:00Z'
        },
        {
            metric_id: 'metric_6',
            facility_id: 3,
            period_start: '2024-10-01',
            period_end: '2024-10-31',
            total_responses: 28,
            average_overall: 4.0,
            average_staff: 4.4,
            average_wait: 3.7,
            average_cleanliness: 4.2,
            recommendation_rate: 89.3,
            calculated_at: '2024-11-01T08:00:00Z'
        }
    ],

    // Dashboard Cache
    dashboard_cache: [
        {
            cache_id: 'cache_1',
            widget_id: 'patient_enrollment',
            parameters: JSON.stringify({ facility_id: 1, period: 'monthly' }),
            cached_data: JSON.stringify({
                total: 150,
                newThisMonth: 12,
                trend: 'increasing'
            }),
            cached_at: '2024-11-05T08:00:00Z',
            expires_at: '2024-11-05T20:00:00Z'
        },
        {
            cache_id: 'cache_2',
            widget_id: 'appointments_today',
            parameters: JSON.stringify({ facility_id: 1, date: '2024-11-05' }),
            cached_data: JSON.stringify({
                total: 8,
                completed: 5,
                pending: 2,
                cancelled: 1
            }),
            cached_at: '2024-11-05T08:00:00Z',
            expires_at: '2024-11-05T18:00:00Z'
        },
        {
            cache_id: 'cache_3',
            widget_id: 'prescriptions_monthly',
            parameters: JSON.stringify({ facility_id: 1, month: '2024-10' }),
            cached_data: JSON.stringify({
                total: 45,
                active: 38,
                completed: 7
            }),
            cached_at: '2024-11-01T08:00:00Z',
            expires_at: '2024-11-02T08:00:00Z'
        },
        {
            cache_id: 'cache_4',
            widget_id: 'risk_distribution',
            parameters: JSON.stringify({ facility_id: 1 }),
            cached_data: JSON.stringify({
                low: 45,
                medium: 30,
                high: 15,
                critical: 5
            }),
            cached_at: '2024-11-05T08:00:00Z',
            expires_at: '2024-11-05T20:00:00Z'
        },
        {
            cache_id: 'cache_5',
            widget_id: 'inventory_alerts',
            parameters: JSON.stringify({ facility_id: 1 }),
            cached_data: JSON.stringify({
                low_stock: 3,
                expiring_soon: 2,
                expired: 0
            }),
            cached_at: '2024-11-05T08:00:00Z',
            expires_at: '2024-11-05T20:00:00Z'
        }
    ],

    // ========================================================
    // MEDICATION REFILL REQUESTS (for Case Manager approval)
    // ========================================================
    refill_requests: [
        // ===== PENDING REQUESTS (5) =====
        {
            request_id: 'refill_1732500001',
            patient_id: 1,
            prescription_id: 1,
            regimen_id: null,
            medication_name: 'TLD (Tenofovir/Lamivudine/Dolutegravir)',
            quantity_requested: 30,
            unit: 'tablets',
            preferred_pickup_date: '2025-12-01',
            pickup_facility_id: 1,
            patient_notes: 'Running low on medication. Need refill before supply runs out.',
            status: 'pending',
            reviewed_by: null,
            reviewed_at: null,
            review_notes: null,
            decline_reason: null,
            approved_quantity: null,
            ready_for_pickup_date: null,
            dispensed_by: null,
            dispensed_at: null,
            created_at: '2025-11-25T08:00:00Z',
            updated_at: '2025-11-25T08:00:00Z',
            created_by: 6
        },
        {
            request_id: 'refill_1732500002',
            patient_id: 2,
            prescription_id: 2,
            regimen_id: null,
            medication_name: 'Cotrimoxazole 960mg',
            quantity_requested: 60,
            unit: 'tablets',
            preferred_pickup_date: '2025-12-02',
            pickup_facility_id: 1,
            patient_notes: 'Monthly refill for prophylaxis medication.',
            status: 'pending',
            reviewed_by: null,
            reviewed_at: null,
            review_notes: null,
            decline_reason: null,
            approved_quantity: null,
            ready_for_pickup_date: null,
            dispensed_by: null,
            dispensed_at: null,
            created_at: '2025-11-24T14:30:00Z',
            updated_at: '2025-11-24T14:30:00Z',
            created_by: 2
        },
        {
            request_id: 'refill_1732500003',
            patient_id: 3,
            prescription_id: null,
            regimen_id: 1,
            medication_name: 'TLD (Tenofovir/Lamivudine/Dolutegravir)',
            quantity_requested: 90,
            unit: 'tablets',
            preferred_pickup_date: '2025-12-03',
            pickup_facility_id: 2,
            patient_notes: 'Requesting 90-day supply as I will be traveling for work.',
            status: 'pending',
            reviewed_by: null,
            reviewed_at: null,
            review_notes: null,
            decline_reason: null,
            approved_quantity: null,
            ready_for_pickup_date: null,
            dispensed_by: null,
            dispensed_at: null,
            created_at: '2025-11-24T10:15:00Z',
            updated_at: '2025-11-24T10:15:00Z',
            created_by: 3
        },
        {
            request_id: 'refill_1732500004',
            patient_id: 4,
            prescription_id: 3,
            regimen_id: null,
            medication_name: 'Efavirenz 600mg',
            quantity_requested: 30,
            unit: 'tablets',
            preferred_pickup_date: '2025-12-04',
            pickup_facility_id: 1,
            patient_notes: 'Regular monthly refill.',
            status: 'pending',
            reviewed_by: null,
            reviewed_at: null,
            review_notes: null,
            decline_reason: null,
            approved_quantity: null,
            ready_for_pickup_date: null,
            dispensed_by: null,
            dispensed_at: null,
            created_at: '2025-11-23T16:45:00Z',
            updated_at: '2025-11-23T16:45:00Z',
            created_by: 4
        },
        {
            request_id: 'refill_1732500005',
            patient_id: 5,
            prescription_id: null,
            regimen_id: 2,
            medication_name: 'Abacavir/Lamivudine (ABC/3TC)',
            quantity_requested: 30,
            unit: 'tablets',
            preferred_pickup_date: '2025-12-05',
            pickup_facility_id: 3,
            patient_notes: 'Switching to Alabang branch for pickup convenience.',
            status: 'pending',
            reviewed_by: null,
            reviewed_at: null,
            review_notes: null,
            decline_reason: null,
            approved_quantity: null,
            ready_for_pickup_date: null,
            dispensed_by: null,
            dispensed_at: null,
            created_at: '2025-11-23T09:30:00Z',
            updated_at: '2025-11-23T09:30:00Z',
            created_by: 5
        },

        // ===== APPROVED / READY REQUESTS (4) =====
        {
            request_id: 'refill_1732400001',
            patient_id: 1,
            prescription_id: 1,
            regimen_id: null,
            medication_name: 'TLD (Tenofovir/Lamivudine/Dolutegravir)',
            quantity_requested: 30,
            unit: 'tablets',
            preferred_pickup_date: '2025-11-20',
            pickup_facility_id: 1,
            patient_notes: 'Monthly refill request.',
            status: 'ready',
            reviewed_by: 4,
            reviewed_at: '2025-11-18T10:00:00Z',
            review_notes: 'Approved. Please bring valid ID when picking up.',
            decline_reason: null,
            approved_quantity: 30,
            ready_for_pickup_date: '2025-11-20',
            dispensed_by: null,
            dispensed_at: null,
            created_at: '2025-11-15T08:00:00Z',
            updated_at: '2025-11-18T10:00:00Z',
            created_by: 6
        },
        {
            request_id: 'refill_1732400002',
            patient_id: 2,
            prescription_id: 2,
            regimen_id: null,
            medication_name: 'Cotrimoxazole 960mg',
            quantity_requested: 30,
            unit: 'tablets',
            preferred_pickup_date: '2025-11-22',
            pickup_facility_id: 1,
            patient_notes: '',
            status: 'ready',
            reviewed_by: 4,
            reviewed_at: '2025-11-19T14:30:00Z',
            review_notes: 'Approved for pickup.',
            decline_reason: null,
            approved_quantity: 30,
            ready_for_pickup_date: '2025-11-22',
            dispensed_by: null,
            dispensed_at: null,
            created_at: '2025-11-17T11:00:00Z',
            updated_at: '2025-11-19T14:30:00Z',
            created_by: 2
        },
        {
            request_id: 'refill_1732400003',
            patient_id: 6,
            prescription_id: 4,
            regimen_id: null,
            medication_name: 'Isoniazid 300mg (IPT)',
            quantity_requested: 30,
            unit: 'tablets',
            preferred_pickup_date: '2025-11-25',
            pickup_facility_id: 1,
            patient_notes: 'IPT continuation.',
            status: 'approved',
            reviewed_by: 4,
            reviewed_at: '2025-11-20T09:00:00Z',
            review_notes: 'IPT refill approved. Continue for 3 more months.',
            decline_reason: null,
            approved_quantity: 30,
            ready_for_pickup_date: '2025-11-25',
            dispensed_by: null,
            dispensed_at: null,
            created_at: '2025-11-18T15:00:00Z',
            updated_at: '2025-11-20T09:00:00Z',
            created_by: 6
        },
        {
            request_id: 'refill_1732400004',
            patient_id: 7,
            prescription_id: 5,
            regimen_id: null,
            medication_name: 'TLD (Tenofovir/Lamivudine/Dolutegravir)',
            quantity_requested: 60,
            unit: 'tablets',
            preferred_pickup_date: '2025-11-28',
            pickup_facility_id: 2,
            patient_notes: 'Need 2-month supply for overseas travel.',
            status: 'approved',
            reviewed_by: 1,
            reviewed_at: '2025-11-21T11:30:00Z',
            review_notes: 'Approved 60-day supply for travel. Safe travels!',
            decline_reason: null,
            approved_quantity: 60,
            ready_for_pickup_date: '2025-11-28',
            dispensed_by: null,
            dispensed_at: null,
            created_at: '2025-11-19T08:00:00Z',
            updated_at: '2025-11-21T11:30:00Z',
            created_by: 7
        },

        // ===== DISPENSED REQUESTS (5) =====
        {
            request_id: 'refill_1732300001',
            patient_id: 1,
            prescription_id: 1,
            regimen_id: null,
            medication_name: 'TLD (Tenofovir/Lamivudine/Dolutegravir)',
            quantity_requested: 30,
            unit: 'tablets',
            preferred_pickup_date: '2025-11-01',
            pickup_facility_id: 1,
            patient_notes: '',
            status: 'dispensed',
            reviewed_by: 4,
            reviewed_at: '2025-10-28T10:00:00Z',
            review_notes: 'Approved for monthly refill.',
            decline_reason: null,
            approved_quantity: 30,
            ready_for_pickup_date: '2025-11-01',
            dispensed_by: 3,
            dispensed_at: '2025-11-01T14:30:00Z',
            created_at: '2025-10-25T09:00:00Z',
            updated_at: '2025-11-01T14:30:00Z',
            created_by: 6
        },
        {
            request_id: 'refill_1732300002',
            patient_id: 2,
            prescription_id: 2,
            regimen_id: null,
            medication_name: 'Cotrimoxazole 960mg',
            quantity_requested: 30,
            unit: 'tablets',
            preferred_pickup_date: '2025-10-28',
            pickup_facility_id: 1,
            patient_notes: '',
            status: 'dispensed',
            reviewed_by: 4,
            reviewed_at: '2025-10-25T11:00:00Z',
            review_notes: '',
            decline_reason: null,
            approved_quantity: 30,
            ready_for_pickup_date: '2025-10-28',
            dispensed_by: 3,
            dispensed_at: '2025-10-28T10:15:00Z',
            created_at: '2025-10-22T14:00:00Z',
            updated_at: '2025-10-28T10:15:00Z',
            created_by: 2
        },
        {
            request_id: 'refill_1732300003',
            patient_id: 3,
            prescription_id: null,
            regimen_id: 1,
            medication_name: 'TLD (Tenofovir/Lamivudine/Dolutegravir)',
            quantity_requested: 30,
            unit: 'tablets',
            preferred_pickup_date: '2025-10-15',
            pickup_facility_id: 2,
            patient_notes: '',
            status: 'dispensed',
            reviewed_by: 1,
            reviewed_at: '2025-10-12T09:30:00Z',
            review_notes: 'Approved.',
            decline_reason: null,
            approved_quantity: 30,
            ready_for_pickup_date: '2025-10-15',
            dispensed_by: 3,
            dispensed_at: '2025-10-15T11:00:00Z',
            created_at: '2025-10-10T08:00:00Z',
            updated_at: '2025-10-15T11:00:00Z',
            created_by: 3
        },
        {
            request_id: 'refill_1732300004',
            patient_id: 4,
            prescription_id: 3,
            regimen_id: null,
            medication_name: 'Efavirenz 600mg',
            quantity_requested: 30,
            unit: 'tablets',
            preferred_pickup_date: '2025-10-20',
            pickup_facility_id: 1,
            patient_notes: '',
            status: 'dispensed',
            reviewed_by: 4,
            reviewed_at: '2025-10-17T14:00:00Z',
            review_notes: '',
            decline_reason: null,
            approved_quantity: 30,
            ready_for_pickup_date: '2025-10-20',
            dispensed_by: 3,
            dispensed_at: '2025-10-20T09:45:00Z',
            created_at: '2025-10-14T10:30:00Z',
            updated_at: '2025-10-20T09:45:00Z',
            created_by: 4
        },
        {
            request_id: 'refill_1732300005',
            patient_id: 5,
            prescription_id: null,
            regimen_id: 2,
            medication_name: 'Abacavir/Lamivudine (ABC/3TC)',
            quantity_requested: 30,
            unit: 'tablets',
            preferred_pickup_date: '2025-10-25',
            pickup_facility_id: 3,
            patient_notes: '',
            status: 'dispensed',
            reviewed_by: 1,
            reviewed_at: '2025-10-22T10:00:00Z',
            review_notes: 'Approved for Alabang branch.',
            decline_reason: null,
            approved_quantity: 30,
            ready_for_pickup_date: '2025-10-25',
            dispensed_by: 3,
            dispensed_at: '2025-10-25T15:30:00Z',
            created_at: '2025-10-19T11:00:00Z',
            updated_at: '2025-10-25T15:30:00Z',
            created_by: 5
        },

        // ===== DECLINED REQUESTS (3) =====
        {
            request_id: 'refill_1732200001',
            patient_id: 8,
            prescription_id: 6,
            regimen_id: null,
            medication_name: 'TLD (Tenofovir/Lamivudine/Dolutegravir)',
            quantity_requested: 90,
            unit: 'tablets',
            preferred_pickup_date: '2025-11-10',
            pickup_facility_id: 1,
            patient_notes: 'Want 90-day supply.',
            status: 'declined',
            reviewed_by: 4,
            reviewed_at: '2025-11-08T10:00:00Z',
            review_notes: '',
            decline_reason: 'Too early for refill - previous supply not exhausted. Your last pickup was only 15 days ago. Please request again after Nov 25.',
            approved_quantity: null,
            ready_for_pickup_date: null,
            dispensed_by: null,
            dispensed_at: null,
            created_at: '2025-11-05T08:00:00Z',
            updated_at: '2025-11-08T10:00:00Z',
            created_by: 8
        },
        {
            request_id: 'refill_1732200002',
            patient_id: 9,
            prescription_id: 7,
            regimen_id: null,
            medication_name: 'Nevirapine 200mg',
            quantity_requested: 60,
            unit: 'tablets',
            preferred_pickup_date: '2025-11-12',
            pickup_facility_id: 2,
            patient_notes: '',
            status: 'declined',
            reviewed_by: 1,
            reviewed_at: '2025-11-10T14:00:00Z',
            review_notes: '',
            decline_reason: 'Prescription has expired. Please schedule an appointment with your physician to renew your prescription.',
            approved_quantity: null,
            ready_for_pickup_date: null,
            dispensed_by: null,
            dispensed_at: null,
            created_at: '2025-11-08T09:00:00Z',
            updated_at: '2025-11-10T14:00:00Z',
            created_by: 9
        },
        {
            request_id: 'refill_1732200003',
            patient_id: 10,
            prescription_id: 8,
            regimen_id: null,
            medication_name: 'TLD (Tenofovir/Lamivudine/Dolutegravir)',
            quantity_requested: 30,
            unit: 'tablets',
            preferred_pickup_date: '2025-11-15',
            pickup_facility_id: 1,
            patient_notes: '',
            status: 'declined',
            reviewed_by: 4,
            reviewed_at: '2025-11-13T11:00:00Z',
            review_notes: '',
            decline_reason: 'Low adherence rate detected (55%). Adherence counseling required before next refill. Please contact your Case Manager to schedule a counseling session.',
            approved_quantity: null,
            ready_for_pickup_date: null,
            dispensed_by: null,
            dispensed_at: null,
            created_at: '2025-11-10T15:00:00Z',
            updated_at: '2025-11-13T11:00:00Z',
            created_by: 10
        },

        // ===== CANCELLED REQUESTS (2) =====
        {
            request_id: 'refill_1732100001',
            patient_id: 1,
            prescription_id: 1,
            regimen_id: null,
            medication_name: 'TLD (Tenofovir/Lamivudine/Dolutegravir)',
            quantity_requested: 30,
            unit: 'tablets',
            preferred_pickup_date: '2025-10-05',
            pickup_facility_id: 1,
            patient_notes: 'Need urgent refill.',
            status: 'cancelled',
            reviewed_by: null,
            reviewed_at: null,
            review_notes: null,
            decline_reason: null,
            approved_quantity: null,
            ready_for_pickup_date: null,
            dispensed_by: null,
            dispensed_at: null,
            created_at: '2025-10-01T08:00:00Z',
            updated_at: '2025-10-02T10:00:00Z',
            created_by: 6
        },
        {
            request_id: 'refill_1732100002',
            patient_id: 3,
            prescription_id: null,
            regimen_id: 1,
            medication_name: 'TLD (Tenofovir/Lamivudine/Dolutegravir)',
            quantity_requested: 60,
            unit: 'tablets',
            preferred_pickup_date: '2025-10-10',
            pickup_facility_id: 2,
            patient_notes: 'Changed my mind, will pick up in person.',
            status: 'cancelled',
            reviewed_by: null,
            reviewed_at: null,
            review_notes: null,
            decline_reason: null,
            approved_quantity: null,
            ready_for_pickup_date: null,
            dispensed_by: null,
            dispensed_at: null,
            created_at: '2025-10-05T11:00:00Z',
            updated_at: '2025-10-06T09:00:00Z',
            created_by: 3
        }
    ],

    // Refill Request Notifications
    refill_notifications: [
        {
            id: 'refill_notif_001',
            type: 'new_refill_request',
            request_id: 'refill_1732500001',
            patient_id: 1,
            for_role: 'case_manager',
            message: 'New refill request from John Doe for TLD (30 tablets)',
            read: false,
            created_at: '2025-11-25T08:05:00Z'
        },
        {
            id: 'refill_notif_002',
            type: 'new_refill_request',
            request_id: 'refill_1732500002',
            patient_id: 2,
            for_role: 'case_manager',
            message: 'New refill request from Maria Santos for Cotrimoxazole 960mg (60 tablets)',
            read: false,
            created_at: '2025-11-24T14:35:00Z'
        },
        {
            id: 'refill_notif_003',
            type: 'new_refill_request',
            request_id: 'refill_1732500003',
            patient_id: 3,
            for_role: 'case_manager',
            message: 'New refill request from Carlos Rodriguez for TLD (90 tablets)',
            read: false,
            created_at: '2025-11-24T10:20:00Z'
        },
        {
            id: 'refill_notif_004',
            type: 'refill_approved',
            request_id: 'refill_1732400001',
            patient_id: 1,
            message: 'Your refill for TLD is ready for pickup on Nov 20, 2025!',
            read: true,
            created_at: '2025-11-18T10:05:00Z'
        },
        {
            id: 'refill_notif_005',
            type: 'refill_declined',
            request_id: 'refill_1732200001',
            patient_id: 8,
            message: 'Your refill request for TLD was declined. Reason: Too early for refill.',
            read: false,
            created_at: '2025-11-08T10:05:00Z'
        },
        {
            id: 'refill_notif_006',
            type: 'refill_ready',
            request_id: 'refill_1732400002',
            patient_id: 2,
            message: 'Your medication (Cotrimoxazole 960mg) is ready for pickup at My Hub Cares Ortigas Main.',
            read: true,
            created_at: '2025-11-19T14:35:00Z'
        }
    ]
};

// Initialize localStorage with mock data if not already present
function initializeMockData() {
    if (!localStorage.getItem('hiv_platform_initialized')) {
        localStorage.setItem('users', JSON.stringify(MockData.users));
        localStorage.setItem('facilities', JSON.stringify(MockData.facilities));
        localStorage.setItem('regions', JSON.stringify(MockData.regions));
        localStorage.setItem('patients', JSON.stringify(MockData.patients));
        localStorage.setItem('appointments', JSON.stringify(MockData.appointments));
        if (MockData.appointment_requests) localStorage.setItem('appointment_requests', JSON.stringify(MockData.appointment_requests));
        if (MockData.appointment_notifications) localStorage.setItem('appointment_notifications', JSON.stringify(MockData.appointment_notifications));
        localStorage.setItem('inventory', JSON.stringify(MockData.inventory));
        localStorage.setItem('prescriptions', JSON.stringify(MockData.prescriptions));
        localStorage.setItem('labTests', JSON.stringify(MockData.labTests));
        localStorage.setItem('reminders', JSON.stringify(MockData.reminders));
        localStorage.setItem('educationModules', JSON.stringify(MockData.educationModules));
        localStorage.setItem('faqs', JSON.stringify(MockData.faqs));
        localStorage.setItem('clientTypes', JSON.stringify(MockData.clientTypes));
        localStorage.setItem('visits', JSON.stringify(MockData.visits));
        localStorage.setItem('referrals', JSON.stringify(MockData.referrals));
        localStorage.setItem('artRegimens', JSON.stringify(MockData.artRegimens));
        localStorage.setItem('satisfactionSurveys', JSON.stringify(MockData.satisfactionSurveys));
        localStorage.setItem('htsSessions', JSON.stringify(MockData.htsSessions));
        localStorage.setItem('counselingSessions', JSON.stringify(MockData.counselingSessions));
        localStorage.setItem('vaccinations', JSON.stringify(MockData.vaccinations));
        localStorage.setItem('auditLogs', JSON.stringify(MockData.auditLogs));
        if (MockData.roles) localStorage.setItem('roles', JSON.stringify(MockData.roles));
        if (MockData.permissions) localStorage.setItem('permissions', JSON.stringify(MockData.permissions));
        if (MockData.role_permissions) localStorage.setItem('role_permissions', JSON.stringify(MockData.role_permissions));
        if (MockData.user_roles) localStorage.setItem('user_roles', JSON.stringify(MockData.user_roles));
        if (MockData.auth_sessions) localStorage.setItem('auth_sessions', JSON.stringify(MockData.auth_sessions));
        if (MockData.mfa_tokens) localStorage.setItem('mfa_tokens', JSON.stringify(MockData.mfa_tokens));
        if (MockData.patient_identifiers) localStorage.setItem('patient_identifiers', JSON.stringify(MockData.patient_identifiers));
        if (MockData.patient_documents) localStorage.setItem('patient_documents', JSON.stringify(MockData.patient_documents));
        if (MockData.diagnoses) localStorage.setItem('diagnoses', JSON.stringify(MockData.diagnoses));
        if (MockData.procedures) localStorage.setItem('procedures', JSON.stringify(MockData.procedures));
        if (MockData.dispense_events) localStorage.setItem('dispense_events', JSON.stringify(MockData.dispense_events));
        if (MockData.medication_adherence) localStorage.setItem('medication_adherence', JSON.stringify(MockData.medication_adherence));
        if (MockData.lab_orders) localStorage.setItem('lab_orders', JSON.stringify(MockData.lab_orders));
        if (MockData.lab_results) localStorage.setItem('lab_results', JSON.stringify(MockData.lab_results));
        if (MockData.lab_files) localStorage.setItem('lab_files', JSON.stringify(MockData.lab_files));
        if (MockData.availability_slots) localStorage.setItem('availability_slots', JSON.stringify(MockData.availability_slots));
        if (MockData.appointment_reminders) localStorage.setItem('appointment_reminders', JSON.stringify(MockData.appointment_reminders));
        if (MockData.care_tasks) localStorage.setItem('care_tasks', JSON.stringify(MockData.care_tasks));
        if (MockData.report_queries) localStorage.setItem('report_queries', JSON.stringify(MockData.report_queries));
        if (MockData.report_runs) localStorage.setItem('report_runs', JSON.stringify(MockData.report_runs));
        if (MockData.system_settings) localStorage.setItem('system_settings', JSON.stringify(MockData.system_settings));
        if (MockData.user_facility_assignments) localStorage.setItem('user_facility_assignments', JSON.stringify(MockData.user_facility_assignments));
        if (MockData.client_types) localStorage.setItem('client_types', JSON.stringify(MockData.client_types));
        if (MockData.vaccine_catalog) localStorage.setItem('vaccine_catalog', JSON.stringify(MockData.vaccine_catalog));
        if (MockData.forum_categories) localStorage.setItem('forum_categories', JSON.stringify(MockData.forum_categories));
        if (MockData.forum_posts) localStorage.setItem('forum_posts', JSON.stringify(MockData.forum_posts));
        if (MockData.forum_replies) localStorage.setItem('forum_replies', JSON.stringify(MockData.forum_replies));
        if (MockData.inventory_transactions) localStorage.setItem('inventory_transactions', JSON.stringify(MockData.inventory_transactions));
        if (MockData.inventory_alerts) localStorage.setItem('inventory_alerts', JSON.stringify(MockData.inventory_alerts));
        if (MockData.inventory_suppliers) localStorage.setItem('inventory_suppliers', JSON.stringify(MockData.inventory_suppliers));
        if (MockData.inventory_orders) localStorage.setItem('inventory_orders', JSON.stringify(MockData.inventory_orders));
        if (MockData.inventory_order_items) localStorage.setItem('inventory_order_items', JSON.stringify(MockData.inventory_order_items));
        if (MockData.art_regimen_history) localStorage.setItem('art_regimen_history', JSON.stringify(MockData.art_regimen_history));
        if (MockData.medications) localStorage.setItem('medications', JSON.stringify(MockData.medications));
        if (MockData.patient_risk_scores) localStorage.setItem('patient_risk_scores', JSON.stringify(MockData.patient_risk_scores));
        if (MockData.survey_metrics) localStorage.setItem('survey_metrics', JSON.stringify(MockData.survey_metrics));
        if (MockData.dashboard_cache) localStorage.setItem('dashboard_cache', JSON.stringify(MockData.dashboard_cache));
        if (MockData.refill_requests) localStorage.setItem('refill_requests', JSON.stringify(MockData.refill_requests));
        if (MockData.refill_notifications) localStorage.setItem('refill_notifications', JSON.stringify(MockData.refill_notifications));
        localStorage.setItem('hiv_platform_initialized', 'true');
    }
}

// Initialize on load
initializeMockData();

