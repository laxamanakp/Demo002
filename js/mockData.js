// ============================================================
// MyHubCares - Mock Data
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
            name: 'MyHubCares Ortigas Main',
            address: 'Unit 607 Tycoon Corporate Center Building, Pearl Drive, Ortigas Center, Pasig City 1605',
            regionId: 1,
            contactPerson: 'Dr. Maria Santos',
            contactNumber: '0917-187-2273',
            email: 'ortigas@myhubcares.com'
        },
        {
            id: 2,
            name: 'MyHubCares Pasay',
            address: 'Pasay City, Metro Manila',
            regionId: 1,
            contactPerson: 'Nurse Juan dela Cruz',
            contactNumber: '0898-700-1267',
            email: 'pasay@myhubcares.com'
        },
        {
            id: 3,
            name: 'MyHubCares Alabang',
            address: 'Alabang, Muntinlupa City',
            regionId: 1,
            contactPerson: 'Dr. Anna Reyes',
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
        {
            id: 1,
            patientId: 1,
            testName: 'CD4 Count',
            resultValue: '450',
            resultUnit: 'cells/μL',
            dateDone: '2025-10-01',
            performedBy: 'Lab Tech Roberto Cruz',
            labCode: 'LAB-2025-001'
        },
        {
            id: 2,
            patientId: 1,
            testName: 'Viral Load',
            resultValue: 'Undetectable',
            resultUnit: 'copies/mL',
            dateDone: '2025-10-01',
            performedBy: 'Lab Tech Roberto Cruz',
            labCode: 'LAB-2025-002'
        },
        {
            id: 3,
            patientId: 2,
            testName: 'CD4 Count',
            resultValue: '380',
            resultUnit: 'cells/μL',
            dateDone: '2025-09-28',
            performedBy: 'Lab Tech Roberto Cruz',
            labCode: 'LAB-2025-003'
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
        localStorage.setItem('hiv_platform_initialized', 'true');
    }
}

// Initialize on load
initializeMockData();

