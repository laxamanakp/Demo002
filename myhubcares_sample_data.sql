-- ============================================================================
-- MyHubCares Healthcare Management System - Sample Data
-- ============================================================================
-- This file contains sample/seed data for testing and development
-- Run this AFTER creating the database schema
-- 
-- IMPORTANT: TEST CREDENTIALS
-- ============================================================================
-- All test users have the same password for easy testing:
-- PASSWORD: password
-- 
-- Test Users:
-- - admin / admin@myhubcares.com
-- - dr.santos / maria.santos@myhubcares.com
-- - dr.delacruz / juan.delacruz@myhubcares.com
-- - nurse.garcia / anna.garcia@myhubcares.com
-- - nurse.reyes / carlos.reyes@myhubcares.com
-- - case.lopez / lisa.lopez@myhubcares.com
-- - lab.torres / michael.torres@myhubcares.com
-- ============================================================================

-- ============================================================================
-- MODULE 9: SYSTEM ADMINISTRATION - Reference Data
-- ============================================================================

-- Regions (Philippines)
INSERT INTO regions (region_id, region_name, region_code, is_active) VALUES
(1, 'National Capital Region (NCR)', 'NCR', TRUE),
(2, 'Cordillera Administrative Region', 'CAR', TRUE),
(3, 'Ilocos Region', 'I', TRUE),
(4, 'Cagayan Valley', 'II', TRUE),
(5, 'Central Luzon', 'III', TRUE),
(6, 'CALABARZON', 'IV-A', TRUE),
(7, 'MIMAROPA', 'IV-B', TRUE),
(8, 'Bicol Region', 'V', TRUE),
(9, 'Western Visayas', 'VI', TRUE),
(10, 'Central Visayas', 'VII', TRUE);

-- Client Types
INSERT INTO client_types (type_name, type_code, description, is_active) VALUES
('Males having Sex with Males', 'MSM', 'Men who have sex with men', TRUE),
('Female Sex Workers', 'FSW', 'Female sex workers', TRUE),
('People Who Inject Drugs', 'PWID', 'People who inject drugs', TRUE),
('Transgender Women', 'TGW', 'Transgender women', TRUE),
('General Population', 'GEN', 'General population', TRUE),
('Pregnant Women', 'PREGNANT', 'Pregnant women', TRUE);

-- Facilities
INSERT INTO facilities (facility_id, facility_name, facility_type, address, region_id, contact_person, contact_number, email, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'MyHubCares Main Clinic', 'main', 
 '{"street": "123 Health Avenue", "barangay": "Barangay Health", "city": "Manila", "province": "Metro Manila", "zip": "1000"}', 
 1, 'Dr. Maria Santos', '+63-2-1234-5678', 'main@myhubcares.com', TRUE),
('550e8400-e29b-41d4-a716-446655440002', 'MyHubCares Quezon City Branch', 'branch',
 '{"street": "456 Wellness Street", "barangay": "Barangay Care", "city": "Quezon City", "province": "Metro Manila", "zip": "1100"}',
 1, 'Dr. Juan dela Cruz', '+63-2-2345-6789', 'qc@myhubcares.com', TRUE),
('550e8400-e29b-41d4-a716-446655440003', 'MyHubCares Makati Satellite', 'satellite',
 '{"street": "789 Medical Plaza", "barangay": "Barangay Medical", "city": "Makati", "province": "Metro Manila", "zip": "1200"}',
 1, 'Nurse Anna Garcia', '+63-2-3456-7890', 'makati@myhubcares.com', TRUE);

-- ============================================================================
-- MODULE 1: USER AUTHENTICATION & AUTHORIZATION
-- ============================================================================

-- Roles
INSERT INTO roles (role_id, role_code, role_name, description, is_system_role) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'admin', 'Administrator', 'System administrator with full access', TRUE),
('660e8400-e29b-41d4-a716-446655440002', 'physician', 'Physician', 'Medical doctor', TRUE),
('660e8400-e29b-41d4-a716-446655440003', 'nurse', 'Nurse', 'Registered nurse', TRUE),
('660e8400-e29b-41d4-a716-446655440004', 'case_manager', 'Case Manager', 'Case manager for patient coordination', TRUE),
('660e8400-e29b-41d4-a716-446655440005', 'lab_personnel', 'Lab Personnel', 'Laboratory technician', TRUE),
('660e8400-e29b-41d4-a716-446655440006', 'patient', 'Patient', 'Patient user', TRUE);

-- Users
-- NOTE: All users have password: "password" (bcrypt hash: $2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi)
-- In production, use proper bcrypt/argon2 hashing with unique passwords per user
INSERT INTO users (user_id, username, email, password_hash, full_name, role, status, facility_id, phone, mfa_enabled) VALUES
-- Admin - Password: password
('770e8400-e29b-41d4-a716-446655440001', 'admin', 'admin@myhubcares.com', 
 '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
 'System Administrator', 'admin', 'active', '550e8400-e29b-41d4-a716-446655440001', '+63-912-345-6789', FALSE),

-- Physicians - Password: password
('770e8400-e29b-41d4-a716-446655440002', 'dr.santos', 'maria.santos@myhubcares.com',
 '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
 'Dr. Maria Santos', 'physician', 'active', '550e8400-e29b-41d4-a716-446655440001', '+63-912-345-6790', FALSE),

('770e8400-e29b-41d4-a716-446655440003', 'dr.delacruz', 'juan.delacruz@myhubcares.com',
 '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
 'Dr. Juan dela Cruz', 'physician', 'active', '550e8400-e29b-41d4-a716-446655440002', '+63-912-345-6791', FALSE),

-- Nurses - Password: password
('770e8400-e29b-41d4-a716-446655440004', 'nurse.garcia', 'anna.garcia@myhubcares.com',
 '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
 'Nurse Anna Garcia', 'nurse', 'active', '550e8400-e29b-41d4-a716-446655440001', '+63-912-345-6792', FALSE),

('770e8400-e29b-41d4-a716-446655440005', 'nurse.reyes', 'carlos.reyes@myhubcares.com',
 '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
 'Nurse Carlos Reyes', 'nurse', 'active', '550e8400-e29b-41d4-a716-446655440002', '+63-912-345-6793', FALSE),

-- Case Manager - Password: password
('770e8400-e29b-41d4-a716-446655440006', 'case.lopez', 'lisa.lopez@myhubcares.com',
 '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
 'Lisa Lopez', 'case_manager', 'active', '550e8400-e29b-41d4-a716-446655440001', '+63-912-345-6794', FALSE),

-- Lab Personnel - Password: password
('770e8400-e29b-41d4-a716-446655440007', 'lab.torres', 'michael.torres@myhubcares.com',
 '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
 'Michael Torres', 'lab_personnel', 'active', '550e8400-e29b-41d4-a716-446655440001', '+63-912-345-6795', FALSE);

-- User Roles
INSERT INTO user_roles (user_role_id, user_id, role_id, assigned_by) VALUES
('880e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001'),
('880e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440001'),
('880e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440001'),
('880e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440001'),
('880e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440001'),
('880e8400-e29b-41d4-a716-446655440006', '770e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440001'),
('880e8400-e29b-41d4-a716-446655440007', '770e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440001');

-- User Facility Assignments
INSERT INTO user_facility_assignments (assignment_id, user_id, facility_id, is_primary, assigned_by) VALUES
('990e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', TRUE, '770e8400-e29b-41d4-a716-446655440001'),
('990e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', TRUE, '770e8400-e29b-41d4-a716-446655440001'),
('990e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', TRUE, '770e8400-e29b-41d4-a716-446655440001'),
('990e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', TRUE, '770e8400-e29b-41d4-a716-446655440001'),
('990e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', TRUE, '770e8400-e29b-41d4-a716-446655440001'),
('990e8400-e29b-41d4-a716-446655440006', '770e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440001', TRUE, '770e8400-e29b-41d4-a716-446655440001'),
('990e8400-e29b-41d4-a716-446655440007', '770e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440001', TRUE, '770e8400-e29b-41d4-a716-446655440001');

-- System Settings
INSERT INTO system_settings (setting_key, setting_value, description, updated_by) VALUES
('system.name', '"MyHubCares"', 'System name', '770e8400-e29b-41d4-a716-446655440001'),
('system.timezone', '"Asia/Manila"', 'System timezone', '770e8400-e29b-41d4-a716-446655440001'),
('system.session_timeout', '3600', 'Session timeout in seconds', '770e8400-e29b-41d4-a716-446655440001'),
('inventory.low_stock_threshold', '10', 'Low stock threshold percentage', '770e8400-e29b-41d4-a716-446655440001'),
('appointment.reminder_hours', '24', 'Appointment reminder hours before', '770e8400-e29b-41d4-a716-446655440001');

-- ============================================================================
-- MODULE 2: PATIENT MANAGEMENT
-- ============================================================================

-- Patients
INSERT INTO patients (patient_id, uic, philhealth_no, first_name, middle_name, last_name, suffix, birth_date, sex, civil_status, nationality, current_city, current_province, current_address, contact_phone, email, mother_name, father_name, birth_order, facility_id, status, created_by) VALUES
('aa0e8400-e29b-41d4-a716-446655440001', 'MIFI0111-15-1990', '12-345678901-2', 'Juan', 'Dela', 'Cruz', 'Jr.', '1990-01-15', 'M', 'Single', 'Filipino', 'Manila', 'Metro Manila',
 '{"street": "123 Sample Street", "barangay": "Barangay Sample", "city": "Manila", "province": "Metro Manila", "zip": "1000"}',
 '+63-917-123-4567', 'juan.cruz@email.com', 'Maria', 'Jose', 1,
 '550e8400-e29b-41d4-a716-446655440001', 'active', '770e8400-e29b-41d4-a716-446655440002'),

('aa0e8400-e29b-41d4-a716-446655440002', 'MIFI0222-20-1985', '12-345678901-3', 'Maria', 'Santos', 'Garcia', NULL, '1985-02-20', 'F', 'Married', 'Filipino', 'Quezon City', 'Metro Manila',
 '{"street": "456 Health Avenue", "barangay": "Barangay Health", "city": "Quezon City", "province": "Metro Manila", "zip": "1100"}',
 '+63-917-234-5678', 'maria.garcia@email.com', 'Rosa', 'Pedro', 2,
 '550e8400-e29b-41d4-a716-446655440002', 'active', '770e8400-e29b-41d4-a716-446655440002'),

('aa0e8400-e29b-41d4-a716-446655440003', 'MIFI0333-10-1995', '12-345678901-4', 'Carlos', 'Reyes', 'Torres', NULL, '1995-03-10', 'M', 'Single', 'Filipino', 'Makati', 'Metro Manila',
 '{"street": "789 Care Street", "barangay": "Barangay Care", "city": "Makati", "province": "Metro Manila", "zip": "1200"}',
 '+63-917-345-6789', 'carlos.torres@email.com', 'Ana', 'Luis', 1,
 '550e8400-e29b-41d4-a716-446655440001', 'active', '770e8400-e29b-41d4-a716-446655440002'),

('aa0e8400-e29b-41d4-a716-446655440004', 'MIFI0444-25-1992', '12-345678901-5', 'Ana', 'Lopez', 'Villanueva', NULL, '1992-04-25', 'F', 'Single', 'Filipino', 'Manila', 'Metro Manila',
 '{"street": "321 Wellness Road", "barangay": "Barangay Wellness", "city": "Manila", "province": "Metro Manila", "zip": "1000"}',
 '+63-917-456-7890', 'ana.villanueva@email.com', 'Carmen', 'Roberto', 1,
 '550e8400-e29b-41d4-a716-446655440001', 'active', '770e8400-e29b-41d4-a716-446655440002');

-- Patient Identifiers
INSERT INTO patient_identifiers (identifier_id, patient_id, id_type, id_value, issued_at, expires_at, verified) VALUES
('bb0e8400-e29b-41d4-a716-446655440001', 'aa0e8400-e29b-41d4-a716-446655440001', 'passport', 'P123456789', '2020-01-15', '2030-01-15', TRUE),
('bb0e8400-e29b-41d4-a716-446655440002', 'aa0e8400-e29b-41d4-a716-446655440002', 'driver_license', 'DL987654321', '2021-02-20', '2026-02-20', TRUE),
('bb0e8400-e29b-41d4-a716-446655440003', 'aa0e8400-e29b-41d4-a716-446655440003', 'sss', 'SSS123456789', '2015-03-10', NULL, TRUE);

-- ============================================================================
-- MODULE 4: MEDICATION MANAGEMENT
-- ============================================================================

-- Medications
INSERT INTO medications (medication_id, medication_name, generic_name, form, strength, atc_code, is_art, is_controlled, active) VALUES
('cc0e8400-e29b-41d4-a716-446655440001', 'Tenofovir/Lamivudine/Dolutegravir', 'TDF/3TC/DTG', 'tablet', '300mg/300mg/50mg', 'J05AR', TRUE, FALSE, TRUE),
('cc0e8400-e29b-41d4-a716-446655440002', 'Efavirenz', 'EFV', 'tablet', '600mg', 'J05AG', TRUE, FALSE, TRUE),
('cc0e8400-e29b-41d4-a716-446655440003', 'Paracetamol', 'Acetaminophen', 'tablet', '500mg', 'N02BE01', FALSE, FALSE, TRUE),
('cc0e8400-e29b-41d4-a716-446655440004', 'Amoxicillin', 'Amoxicillin', 'capsule', '500mg', 'J01CA04', FALSE, FALSE, TRUE),
('cc0e8400-e29b-41d4-a716-446655440005', 'Ibuprofen', 'Ibuprofen', 'tablet', '400mg', 'M01AE01', FALSE, FALSE, TRUE);

-- Medication Inventory
INSERT INTO medication_inventory (inventory_id, medication_id, facility_id, batch_number, quantity_on_hand, unit, expiry_date, reorder_level, last_restocked, supplier, cost_per_unit) VALUES
('dd0e8400-e29b-41d4-a716-446655440001', 'cc0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'BATCH001', 500, 'tablets', '2025-12-31', 50, '2024-01-15', 'Pharma Supplier Inc.', 25.50),
('dd0e8400-e29b-41d4-a716-446655440002', 'cc0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'BATCH002', 300, 'tablets', '2025-11-30', 30, '2024-01-10', 'Pharma Supplier Inc.', 20.75),
('dd0e8400-e29b-41d4-a716-446655440003', 'cc0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'BATCH003', 1000, 'tablets', '2026-06-30', 100, '2024-01-20', 'Generic Pharma Co.', 2.50),
('dd0e8400-e29b-41d4-a716-446655440004', 'cc0e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 'BATCH004', 800, 'capsules', '2025-09-30', 80, '2024-01-18', 'Generic Pharma Co.', 3.25),
('dd0e8400-e29b-41d4-a716-446655440005', 'cc0e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', 'BATCH005', 600, 'tablets', '2025-08-31', 60, '2024-01-12', 'Generic Pharma Co.', 4.00);

-- Prescriptions
INSERT INTO prescriptions (prescription_id, patient_id, prescriber_id, facility_id, prescription_date, prescription_number, start_date, end_date, duration_days, status, notes) VALUES
('ee0e8400-e29b-41d4-a716-446655440001', 'aa0e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '2024-01-15', 'RX-2024-001', '2024-01-15', '2024-04-15', 90, 'active', 'ART regimen - first line'),
('ee0e8400-e29b-41d4-a716-446655440002', 'aa0e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', '2024-01-20', 'RX-2024-002', '2024-01-20', '2024-02-20', 30, 'active', 'Pain management'),
('ee0e8400-e29b-41d4-a716-446655440003', 'aa0e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '2024-01-25', 'RX-2024-003', '2024-01-25', '2024-02-25', 30, 'active', 'Antibiotic course');

-- Prescription Items
INSERT INTO prescription_items (prescription_item_id, prescription_id, medication_id, dosage, frequency, quantity, instructions, duration_days) VALUES
('ff0e8400-e29b-41d4-a716-446655440001', 'ee0e8400-e29b-41d4-a716-446655440001', 'cc0e8400-e29b-41d4-a716-446655440001', '1 tablet', 'Once daily', 90, 'Take with food', 90),
('ff0e8400-e29b-41d4-a716-446655440002', 'ee0e8400-e29b-41d4-a716-446655440002', 'cc0e8400-e29b-41d4-a716-446655440003', '1 tablet', 'As needed for pain', 30, 'Maximum 4 tablets per day', 30),
('ff0e8400-e29b-41d4-a716-446655440003', 'ee0e8400-e29b-41d4-a716-446655440003', 'cc0e8400-e29b-41d4-a716-446655440004', '1 capsule', 'Three times daily', 90, 'Take with meals', 30);

-- Medication Reminders
INSERT INTO medication_reminders (reminder_id, prescription_id, patient_id, medication_name, dosage, frequency, reminder_time, sound_preference, browser_notifications, active) VALUES
('gg0e8400-e29b-41d4-a716-446655440001', 'ee0e8400-e29b-41d4-a716-446655440001', 'aa0e8400-e29b-41d4-a716-446655440001', 'Tenofovir/Lamivudine/Dolutegravir', '1 tablet', 'Once daily', '20:00:00', 'default', TRUE, TRUE),
('gg0e8400-e29b-41d4-a716-446655440002', 'ee0e8400-e29b-41d4-a716-446655440003', 'aa0e8400-e29b-41d4-a716-446655440003', 'Amoxicillin', '1 capsule', 'Three times daily', '08:00:00', 'gentle', TRUE, TRUE);

-- ============================================================================
-- MODULE 3: CLINICAL CARE
-- ============================================================================

-- Clinical Visits
INSERT INTO clinical_visits (visit_id, patient_id, provider_id, facility_id, visit_date, visit_type, who_stage, chief_complaint, clinical_notes, assessment, plan, follow_up_date) VALUES
('hh0e8400-e29b-41d4-a716-446655440001', 'aa0e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '2024-01-15', 'initial', 'Stage 1', 'Routine check-up', 'Patient presents for initial consultation. No acute complaints.', 'Healthy patient, starting ART', 'Start ART regimen, follow-up in 1 month', '2024-02-15'),
('hh0e8400-e29b-41d4-a716-446655440002', 'aa0e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', '2024-01-20', 'follow_up', 'Stage 2', 'Headache', 'Patient reports occasional headaches', 'Mild tension headache', 'Prescribed pain medication, follow-up if persists', '2024-02-20'),
('hh0e8400-e29b-41d4-a716-446655440003', 'aa0e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '2024-01-25', 'routine', 'Not Applicable', 'Cough and cold', 'Patient presents with symptoms of upper respiratory infection', 'Acute upper respiratory infection', 'Prescribed antibiotics, rest and hydration', '2024-02-25');

-- Vital Signs
INSERT INTO vital_signs (vital_id, visit_id, height_cm, weight_kg, bmi, systolic_bp, diastolic_bp, pulse_rate, temperature_c, respiratory_rate, oxygen_saturation, recorded_by) VALUES
('ii0e8400-e29b-41d4-a716-446655440001', 'hh0e8400-e29b-41d4-a716-446655440001', 170.0, 70.0, 24.22, 120, 80, 72, 36.5, 18, 98.0, '770e8400-e29b-41d4-a716-446655440004'),
('ii0e8400-e29b-41d4-a716-446655440002', 'hh0e8400-e29b-41d4-a716-446655440002', 165.0, 60.0, 22.04, 110, 70, 68, 36.8, 16, 99.0, '770e8400-e29b-41d4-a716-446655440005'),
('ii0e8400-e29b-41d4-a716-446655440003', 'hh0e8400-e29b-41d4-a716-446655440003', 175.0, 75.0, 24.49, 125, 85, 75, 37.2, 20, 97.5, '770e8400-e29b-41d4-a716-446655440004');

-- Diagnoses
INSERT INTO diagnoses (diagnosis_id, visit_id, icd10_code, diagnosis_description, diagnosis_type, is_chronic) VALUES
('jj0e8400-e29b-41d4-a716-446655440001', 'hh0e8400-e29b-41d4-a716-446655440001', 'B20', 'HIV infection', 'primary', TRUE),
('jj0e8400-e29b-41d4-a716-446655440002', 'hh0e8400-e29b-41d4-a716-446655440002', 'G44.2', 'Tension-type headache', 'primary', FALSE),
('jj0e8400-e29b-41d4-a716-446655440003', 'hh0e8400-e29b-41d4-a716-446655440003', 'J06.9', 'Acute upper respiratory infection', 'primary', FALSE);

-- ============================================================================
-- MODULE 5: LAB TEST MANAGEMENT
-- ============================================================================

-- Lab Orders
INSERT INTO lab_orders (order_id, patient_id, ordering_provider_id, facility_id, order_date, test_panel, priority, status, collection_date, notes) VALUES
('kk0e8400-e29b-41d4-a716-446655440001', 'aa0e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '2024-01-15', 'CD4 Count', 'routine', 'completed', '2024-01-15', 'Baseline CD4'),
('kk0e8400-e29b-41d4-a716-446655440002', 'aa0e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '2024-01-15', 'Viral Load', 'routine', 'completed', '2024-01-15', 'Baseline viral load'),
('kk0e8400-e29b-41d4-a716-446655440003', 'aa0e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', '2024-01-20', 'Complete Blood Count', 'routine', 'completed', '2024-01-20', 'Routine CBC');

-- Lab Results
INSERT INTO lab_results (result_id, order_id, patient_id, test_code, test_name, result_value, unit, reference_range_min, reference_range_max, is_critical, critical_alert_sent, reported_at, created_by) VALUES
('ll0e8400-e29b-41d4-a716-446655440001', 'kk0e8400-e29b-41d4-a716-446655440001', 'aa0e8400-e29b-41d4-a716-446655440001', 'CD4', 'CD4 Count', '450', 'cells/μL', 500, 1200, FALSE, FALSE, '2024-01-16', '770e8400-e29b-41d4-a716-446655440007'),
('ll0e8400-e29b-41d4-a716-446655440002', 'kk0e8400-e29b-41d4-a716-446655440002', 'aa0e8400-e29b-41d4-a716-446655440001', 'VL', 'Viral Load', '25000', 'copies/mL', NULL, NULL, FALSE, FALSE, '2024-01-16', '770e8400-e29b-41d4-a716-446655440007'),
('ll0e8400-e29b-41d4-a716-446655440003', 'kk0e8400-e29b-41d4-a716-446655440003', 'aa0e8400-e29b-41d4-a716-446655440002', 'CBC', 'White Blood Cell Count', '7200', 'cells/μL', 4000, 11000, FALSE, FALSE, '2024-01-21', '770e8400-e29b-41d4-a716-446655440007');

-- ============================================================================
-- MODULE 6: APPOINTMENT SCHEDULING
-- ============================================================================

-- Appointments
INSERT INTO appointments (appointment_id, patient_id, provider_id, facility_id, appointment_type, scheduled_start, scheduled_end, duration_minutes, status, reason, booked_by) VALUES
('mm0e8400-e29b-41d4-a716-446655440001', 'aa0e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'follow_up', '2024-02-15 09:00:00', '2024-02-15 09:30:00', 30, 'scheduled', 'ART follow-up', '770e8400-e29b-41d4-a716-446655440002'),
('mm0e8400-e29b-41d4-a716-446655440002', 'aa0e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'follow_up', '2024-02-20 10:00:00', '2024-02-20 10:30:00', 30, 'scheduled', 'Follow-up for headache', '770e8400-e29b-41d4-a716-446655440003'),
('mm0e8400-e29b-41d4-a716-446655440003', 'aa0e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'art_pickup', '2024-02-10 14:00:00', '2024-02-10 14:15:00', 15, 'scheduled', 'ART medication pickup', '770e8400-e29b-41d4-a716-446655440002');

-- Appointment Reminders
INSERT INTO appointment_reminders (reminder_id, appointment_id, reminder_type, reminder_scheduled_at, status) VALUES
('nn0e8400-e29b-41d4-a716-446655440001', 'mm0e8400-e29b-41d4-a716-446655440001', 'sms', '2024-02-14 09:00:00', 'pending'),
('nn0e8400-e29b-41d4-a716-446655440002', 'mm0e8400-e29b-41d4-a716-446655440002', 'email', '2024-02-19 10:00:00', 'pending'),
('nn0e8400-e29b-41d4-a716-446655440003', 'mm0e8400-e29b-41d4-a716-446655440003', 'in_app', '2024-02-09 14:00:00', 'pending');

-- ============================================================================
-- MODULE 7: CARE COORDINATION & REFERRALS
-- ============================================================================

-- Counseling Sessions
INSERT INTO counseling_sessions (session_id, patient_id, counselor_id, facility_id, session_date, session_type, session_notes, follow_up_required, follow_up_date) VALUES
('oo0e8400-e29b-41d4-a716-446655440001', 'aa0e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440001', '2024-01-15', 'pre_test', 'Pre-test counseling completed. Patient understands HIV testing process.', FALSE, NULL),
('oo0e8400-e29b-41d4-a716-446655440002', 'aa0e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440001', '2024-01-16', 'post_test', 'Post-test counseling completed. Patient linked to care.', TRUE, '2024-02-15');

-- HTS Sessions
INSERT INTO hts_sessions (hts_id, patient_id, tester_id, facility_id, test_date, test_result, test_type, pre_test_counseling, post_test_counseling, linked_to_care, care_link_date, notes) VALUES
('pp0e8400-e29b-41d4-a716-446655440001', 'aa0e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', '2024-01-15', 'positive', 'Rapid Test', TRUE, TRUE, TRUE, '2024-01-15', 'Patient tested positive, immediately linked to care');

-- ============================================================================
-- MODULE 10: VACCINATION PROGRAM
-- ============================================================================

-- Vaccine Catalog
INSERT INTO vaccine_catalog (vaccine_id, vaccine_name, manufacturer, series_length, dose_intervals, is_active) VALUES
('qq0e8400-e29b-41d4-a716-446655440001', 'Hepatitis B', 'Generic Pharma', 3, '[0, 30, 180]', TRUE),
('qq0e8400-e29b-41d4-a716-446655440002', 'HPV', 'Vaccine Corp', 3, '[0, 60, 180]', TRUE),
('qq0e8400-e29b-41d4-a716-446655440003', 'Influenza', 'Flu Vaccine Inc', 1, '[0]', TRUE);

-- Vaccination Records
INSERT INTO vaccination_records (vaccination_id, patient_id, vaccine_id, provider_id, facility_id, dose_number, total_doses, date_given, next_dose_due, lot_number, administration_site, status) VALUES
('rr0e8400-e29b-41d4-a716-446655440001', 'aa0e8400-e29b-41d4-a716-446655440001', 'qq0e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 1, 3, '2024-01-15', '2024-02-14', 'LOT-HBV-001', 'left_arm', 'in_progress'),
('rr0e8400-e29b-41d4-a716-446655440002', 'aa0e8400-e29b-41d4-a716-446655440002', 'qq0e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 1, 1, '2024-01-20', NULL, 'LOT-FLU-001', 'right_arm', 'complete');

-- ============================================================================
-- MODULE 11: PATIENT FEEDBACK & SURVEYS
-- ============================================================================

-- Survey Responses
INSERT INTO survey_responses (survey_id, patient_id, facility_id, overall_satisfaction, staff_friendliness, wait_time, facility_cleanliness, would_recommend, comments, average_score) VALUES
('ss0e8400-e29b-41d4-a716-446655440001', 'aa0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'happy', 5, 4, 5, 'yes', 'Very satisfied with the service', 4.67),
('ss0e8400-e29b-41d4-a716-446655440002', 'aa0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'very_happy', 5, 5, 5, 'yes', 'Excellent care and attention', 5.00);

-- ============================================================================
-- MODULE 12: COMMUNITY FORUM & EDUCATION
-- ============================================================================

-- Forum Categories
INSERT INTO forum_categories (category_id, category_name, category_code, description, icon, is_active) VALUES
('tt0e8400-e29b-41d4-a716-446655440001', 'General Discussion', 'general', 'General health discussions', '💬', TRUE),
('tt0e8400-e29b-41d4-a716-446655440002', 'Treatment Support', 'treatment', 'Support for treatment-related questions', '💊', TRUE),
('tt0e8400-e29b-41d4-a716-446655440003', 'Lifestyle & Wellness', 'lifestyle', 'Healthy living and wellness tips', '🌱', TRUE);

-- Forum Posts
INSERT INTO forum_posts (post_id, patient_id, category_id, title, content, is_anonymous, reply_count, view_count, status) VALUES
('uu0e8400-e29b-41d4-a716-446655440001', 'aa0e8400-e29b-41d4-a716-446655440001', 'tt0e8400-e29b-41d4-a716-446655440002', 'Starting ART - What to expect?', 'I just started my ART regimen. Can anyone share their experience?', TRUE, 2, 15, 'approved'),
('uu0e8400-e29b-41d4-a716-446655440002', 'aa0e8400-e29b-41d4-a716-446655440002', 'tt0e8400-e29b-41d4-a716-446655440003', 'Healthy meal ideas', 'Looking for nutritious meal suggestions for better health', TRUE, 1, 8, 'approved');

-- FAQs
INSERT INTO faqs (faq_id, question, answer, category, display_order, is_published) VALUES
('vv0e8400-e29b-41d4-a716-446655440001', 'What is ART?', 'ART stands for Antiretroviral Therapy, which is the treatment for HIV infection using a combination of medications.', 'treatment', 1, TRUE),
('vv0e8400-e29b-41d4-a716-446655440002', 'How often should I take my medication?', 'It is crucial to take your medication exactly as prescribed by your doctor, usually once or twice daily at the same time.', 'treatment', 2, TRUE),
('vv0e8400-e29b-41d4-a716-446655440003', 'What should I do if I miss a dose?', 'If you miss a dose, take it as soon as you remember. If it is almost time for your next dose, skip the missed dose and continue with your regular schedule. Do not double the dose.', 'treatment', 3, TRUE);

-- ============================================================================
-- MODULE 14: INVENTORY MANAGEMENT
-- ============================================================================

-- Inventory Suppliers
INSERT INTO inventory_suppliers (supplier_id, supplier_name, contact_person, contact_phone, contact_email, address, payment_terms, is_active) VALUES
('ww0e8400-e29b-41d4-a716-446655440001', 'Pharma Supplier Inc.', 'John Supplier', '+63-2-1111-2222', 'contact@pharmasupplier.com', '{"street": "Supplier Street", "city": "Manila", "province": "Metro Manila"}', 'Net 30', TRUE),
('ww0e8400-e29b-41d4-a716-446655440002', 'Generic Pharma Co.', 'Jane Generic', '+63-2-2222-3333', 'info@genericpharma.com', '{"street": "Generic Avenue", "city": "Quezon City", "province": "Metro Manila"}', 'Net 45', TRUE);

-- ============================================================================
-- MODULE 15: ART REGIMEN MANAGEMENT
-- ============================================================================

-- ART Regimens
INSERT INTO art_regimens (regimen_id, patient_id, provider_id, facility_id, start_date, status, notes) VALUES
('xx0e8400-e29b-41d4-a716-446655440001', 'aa0e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '2024-01-15', 'active', 'First-line ART regimen');

-- ART Regimen Drugs
INSERT INTO art_regimen_drugs (regimen_drug_id, regimen_id, medication_id, drug_name, dosage, pills_per_day, pills_dispensed, pills_remaining, missed_doses) VALUES
('yy0e8400-e29b-41d4-a716-446655440001', 'xx0e8400-e29b-41d4-a716-446655440001', 'cc0e8400-e29b-41d4-a716-446655440001', 'Tenofovir/Lamivudine/Dolutegravir', '1 tablet', 1, 30, 60, 0);

-- ART Regimen History
INSERT INTO art_regimen_history (history_id, regimen_id, action_type, action_date, new_status, performed_by, notes) VALUES
('zz0e8400-e29b-41d4-a716-446655440001', 'xx0e8400-e29b-41d4-a716-446655440001', 'started', '2024-01-15', 'active', '770e8400-e29b-41d4-a716-446655440002', 'ART regimen initiated'),
('zz0e8400-e29b-41d4-a716-446655440002', 'xx0e8400-e29b-41d4-a716-446655440001', 'pills_dispensed', '2024-01-15', 'active', '770e8400-e29b-41d4-a716-446655440004', 'Dispensed 30 tablets');

-- ============================================================================
-- END OF SAMPLE DATA
-- ============================================================================
-- TEST CREDENTIALS SUMMARY:
-- ============================================================================
-- PASSWORD FOR ALL USERS: password
-- 
-- Login Credentials:
-- Username: admin              | Email: admin@myhubcares.com
-- Username: dr.santos          | Email: maria.santos@myhubcares.com
-- Username: dr.delacruz        | Email: juan.delacruz@myhubcares.com
-- Username: nurse.garcia       | Email: anna.garcia@myhubcares.com
-- Username: nurse.reyes        | Email: carlos.reyes@myhubcares.com
-- Username: case.lopez         | Email: lisa.lopez@myhubcares.com
-- Username: lab.torres         | Email: michael.torres@myhubcares.com
-- 
-- WARNING: These are test credentials only!
-- In production, use proper bcrypt/argon2 hashing with unique passwords
-- ============================================================================

