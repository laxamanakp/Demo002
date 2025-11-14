-- ============================================================================
-- MyHubCares Healthcare Management System - MySQL Database Schema
-- ============================================================================

-- CREATE DATABASE myhubcares CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE myhubcares;

-- ============================================================================
-- MODULE 9: SYSTEM ADMINISTRATION (P9) - Base Tables
-- ============================================================================

-- 9.4. regions
CREATE TABLE IF NOT EXISTS regions (
    region_id INT PRIMARY KEY,
    region_name VARCHAR(150) NOT NULL,
    region_code VARCHAR(20) UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_regions_code (region_code),
    INDEX idx_regions_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9.5. client_types
CREATE TABLE IF NOT EXISTS client_types (
    client_type_id INT AUTO_INCREMENT PRIMARY KEY,
    type_name VARCHAR(200) NOT NULL,
    type_code VARCHAR(50) UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_client_types_code (type_code),
    INDEX idx_client_types_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9.1. facilities
CREATE TABLE IF NOT EXISTS facilities (
    facility_id CHAR(36) PRIMARY KEY,
    facility_name VARCHAR(150) NOT NULL,
    facility_type ENUM('main', 'branch', 'satellite', 'external') NOT NULL,
    address JSON NOT NULL,
    region_id INT,
    contact_person VARCHAR(200),
    contact_number VARCHAR(50),
    email VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_facilities_name (facility_name),
    INDEX idx_facilities_type (facility_type),
    INDEX idx_facilities_is_active (is_active),
    FOREIGN KEY (region_id) REFERENCES regions(region_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- MODULE 1: USER AUTHENTICATION & AUTHORIZATION (P1)
-- ============================================================================

-- 1.2. roles
CREATE TABLE IF NOT EXISTS roles (
    role_id CHAR(36) PRIMARY KEY,
    role_code VARCHAR(50) UNIQUE NOT NULL,
    role_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_system_role BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 1.3. permissions
CREATE TABLE IF NOT EXISTS permissions (
    permission_id CHAR(36) PRIMARY KEY,
    permission_code VARCHAR(100) UNIQUE NOT NULL,
    permission_name VARCHAR(150) NOT NULL,
    module VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT,
    INDEX idx_permissions_module (module),
    INDEX idx_permissions_action (action)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 1.1. users
CREATE TABLE IF NOT EXISTS users (
    user_id CHAR(36) PRIMARY KEY,
    username VARCHAR(150) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    role ENUM('admin', 'physician', 'nurse', 'case_manager', 'lab_personnel', 'patient') NOT NULL,
    status ENUM('active', 'inactive', 'suspended', 'pending') DEFAULT 'active',
    facility_id CHAR(36),
    phone VARCHAR(30),
    last_login DATETIME,
    failed_login_attempts INT DEFAULT 0,
    locked_until DATETIME,
    mfa_enabled BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by CHAR(36),
    INDEX idx_users_username (username),
    INDEX idx_users_email (email),
    INDEX idx_users_role (role),
    INDEX idx_users_facility_id (facility_id),
    FOREIGN KEY (facility_id) REFERENCES facilities(facility_id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 1.4. role_permissions
CREATE TABLE IF NOT EXISTS role_permissions (
    role_permission_id CHAR(36) PRIMARY KEY,
    role_id CHAR(36) NOT NULL,
    permission_id CHAR(36) NOT NULL,
    granted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_role_permission (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(permission_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 1.5. user_roles
CREATE TABLE IF NOT EXISTS user_roles (
    user_role_id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    role_id CHAR(36) NOT NULL,
    assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    assigned_by CHAR(36),
    UNIQUE KEY unique_user_role (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 1.6. auth_sessions
CREATE TABLE IF NOT EXISTS auth_sessions (
    session_id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    issued_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    revoked_at DATETIME,
    INDEX idx_sessions_user_id (user_id),
    INDEX idx_sessions_expires_at (expires_at),
    INDEX idx_sessions_token_hash (token_hash),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 1.7. mfa_tokens
CREATE TABLE IF NOT EXISTS mfa_tokens (
    mfa_token_id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    method ENUM('totp', 'sms', 'email') NOT NULL,
    secret VARCHAR(255),
    phone_number VARCHAR(30),
    code_hash VARCHAR(255),
    issued_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    consumed_at DATETIME,
    attempts INT DEFAULT 0,
    INDEX idx_mfa_tokens_user_id (user_id),
    INDEX idx_mfa_tokens_expires_at (expires_at),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9.3. user_facility_assignments
CREATE TABLE IF NOT EXISTS user_facility_assignments (
    assignment_id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    facility_id CHAR(36) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    assigned_by CHAR(36),
    UNIQUE KEY unique_user_facility (user_id, facility_id),
    INDEX idx_user_facility_assignments_user_id (user_id),
    INDEX idx_user_facility_assignments_facility_id (facility_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (facility_id) REFERENCES facilities(facility_id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9.2. system_settings
CREATE TABLE IF NOT EXISTS system_settings (
    setting_key VARCHAR(100) PRIMARY KEY,
    setting_value JSON NOT NULL,
    description TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by CHAR(36),
    FOREIGN KEY (updated_by) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- MODULE 2: PATIENT MANAGEMENT (P2)
-- ============================================================================

-- 2.1. patients
CREATE TABLE IF NOT EXISTS patients (
    patient_id CHAR(36) PRIMARY KEY,
    uic VARCHAR(30) UNIQUE NOT NULL,
    philhealth_no VARCHAR(20),
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    suffix VARCHAR(10),
    birth_date DATE NOT NULL,
    sex ENUM('M', 'F', 'O') NOT NULL,
    civil_status ENUM('Single', 'Married', 'Divorced', 'Widowed', 'Separated'),
    nationality VARCHAR(50) DEFAULT 'Filipino',
    current_city VARCHAR(100),
    current_province VARCHAR(100),
    current_address JSON,
    contact_phone VARCHAR(30),
    email VARCHAR(255),
    mother_name VARCHAR(200),
    father_name VARCHAR(200),
    birth_order INT,
    guardian_name VARCHAR(200),
    guardian_relationship VARCHAR(50),
    facility_id CHAR(36) NOT NULL,
    arpa_risk_score DECIMAL(5,2),
    arpa_last_calculated DATE,
    status ENUM('active', 'inactive', 'deceased', 'transferred') DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by CHAR(36) NOT NULL,
    INDEX idx_patients_uic (uic),
    INDEX idx_patients_philhealth_no (philhealth_no),
    INDEX idx_patients_name (last_name, first_name),
    INDEX idx_patients_facility_id (facility_id),
    INDEX idx_patients_birth_date (birth_date),
    FOREIGN KEY (facility_id) REFERENCES facilities(facility_id) ON DELETE RESTRICT,
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2.2. patient_identifiers
CREATE TABLE IF NOT EXISTS patient_identifiers (
    identifier_id CHAR(36) PRIMARY KEY,
    patient_id CHAR(36) NOT NULL,
    id_type ENUM('passport', 'driver_license', 'sss', 'tin', 'other') NOT NULL,
    id_value VARCHAR(100) NOT NULL,
    issued_at DATE,
    expires_at DATE,
    verified BOOLEAN DEFAULT FALSE,
    INDEX idx_patient_identifiers_patient_id (patient_id),
    INDEX idx_patient_identifiers_type_value (id_type, id_value),
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2.3. patient_risk_scores
CREATE TABLE IF NOT EXISTS patient_risk_scores (
    risk_score_id CHAR(36) PRIMARY KEY,
    patient_id CHAR(36) NOT NULL,
    score DECIMAL(5,2) NOT NULL,
    calculated_on DATE DEFAULT (CURRENT_DATE),
    risk_factors JSON,
    recommendations TEXT,
    calculated_by CHAR(36),
    INDEX idx_patient_risk_scores_patient_id (patient_id),
    INDEX idx_patient_risk_scores_calculated_on (calculated_on),
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (calculated_by) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2.4. patient_documents
CREATE TABLE IF NOT EXISTS patient_documents (
    document_id CHAR(36) PRIMARY KEY,
    patient_id CHAR(36) NOT NULL,
    document_type ENUM('consent', 'id_copy', 'medical_record', 'lab_result', 'other') NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    uploaded_by CHAR(36) NOT NULL,
    INDEX idx_patient_documents_patient_id (patient_id),
    INDEX idx_patient_documents_type (document_type),
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(user_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- MODULE 3: CLINICAL CARE (P3)
-- ============================================================================

-- 3.1. clinical_visits
CREATE TABLE IF NOT EXISTS clinical_visits (
    visit_id CHAR(36) PRIMARY KEY,
    patient_id CHAR(36) NOT NULL,
    provider_id CHAR(36) NOT NULL,
    facility_id CHAR(36) NOT NULL,
    visit_date DATE NOT NULL,
    visit_type ENUM('initial', 'follow_up', 'emergency', 'routine', 'art_pickup') NOT NULL,
    who_stage ENUM('Stage 1', 'Stage 2', 'Stage 3', 'Stage 4', 'Not Applicable'),
    chief_complaint TEXT,
    clinical_notes TEXT,
    assessment TEXT,
    plan TEXT,
    follow_up_date DATE,
    follow_up_reason TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_clinical_visits_patient_id (patient_id),
    INDEX idx_clinical_visits_visit_date (visit_date),
    INDEX idx_clinical_visits_provider_id (provider_id),
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE RESTRICT,
    FOREIGN KEY (provider_id) REFERENCES users(user_id) ON DELETE RESTRICT,
    FOREIGN KEY (facility_id) REFERENCES facilities(facility_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3.2. vital_signs
CREATE TABLE IF NOT EXISTS vital_signs (
    vital_id CHAR(36) PRIMARY KEY,
    visit_id CHAR(36) NOT NULL,
    height_cm DECIMAL(5,2),
    weight_kg DECIMAL(5,2),
    bmi DECIMAL(5,2),
    systolic_bp INT,
    diastolic_bp INT,
    pulse_rate INT,
    temperature_c DECIMAL(4,1),
    respiratory_rate INT,
    oxygen_saturation DECIMAL(4,1),
    recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    recorded_by CHAR(36) NOT NULL,
    INDEX idx_vital_signs_visit_id (visit_id),
    FOREIGN KEY (visit_id) REFERENCES clinical_visits(visit_id) ON DELETE CASCADE,
    FOREIGN KEY (recorded_by) REFERENCES users(user_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3.3. diagnoses
CREATE TABLE IF NOT EXISTS diagnoses (
    diagnosis_id CHAR(36) PRIMARY KEY,
    visit_id CHAR(36) NOT NULL,
    icd10_code VARCHAR(10),
    diagnosis_description TEXT NOT NULL,
    diagnosis_type ENUM('primary', 'secondary', 'differential', 'rule_out') DEFAULT 'primary',
    is_chronic BOOLEAN DEFAULT FALSE,
    onset_date DATE,
    resolved_date DATE,
    INDEX idx_diagnoses_visit_id (visit_id),
    INDEX idx_diagnoses_icd10_code (icd10_code),
    FOREIGN KEY (visit_id) REFERENCES clinical_visits(visit_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3.4. procedures
CREATE TABLE IF NOT EXISTS procedures (
    procedure_id CHAR(36) PRIMARY KEY,
    visit_id CHAR(36) NOT NULL,
    cpt_code VARCHAR(8),
    procedure_name VARCHAR(200) NOT NULL,
    procedure_description TEXT,
    outcome TEXT,
    performed_at DATETIME,
    INDEX idx_procedures_visit_id (visit_id),
    FOREIGN KEY (visit_id) REFERENCES clinical_visits(visit_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- MODULE 4: MEDICATION MANAGEMENT (P4)
-- ============================================================================

-- 4.1. medications
CREATE TABLE IF NOT EXISTS medications (
    medication_id CHAR(36) PRIMARY KEY,
    medication_name VARCHAR(150) NOT NULL,
    generic_name VARCHAR(150),
    form ENUM('tablet', 'capsule', 'syrup', 'injection', 'cream', 'other') NOT NULL,
    strength VARCHAR(50),
    atc_code VARCHAR(10),
    is_art BOOLEAN DEFAULT FALSE,
    is_controlled BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    INDEX idx_medications_name (medication_name),
    INDEX idx_medications_atc_code (atc_code),
    INDEX idx_medications_is_art (is_art)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4.2. prescriptions
CREATE TABLE IF NOT EXISTS prescriptions (
    prescription_id CHAR(36) PRIMARY KEY,
    patient_id CHAR(36) NOT NULL,
    prescriber_id CHAR(36) NOT NULL,
    facility_id CHAR(36) NOT NULL,
    prescription_date DATE DEFAULT (CURRENT_DATE),
    prescription_number VARCHAR(50) UNIQUE,
    start_date DATE NOT NULL,
    end_date DATE,
    duration_days INT,
    notes TEXT,
    status ENUM('active', 'completed', 'cancelled', 'expired') DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_prescriptions_patient_id (patient_id),
    INDEX idx_prescriptions_prescriber_id (prescriber_id),
    INDEX idx_prescriptions_date (prescription_date),
    INDEX idx_prescriptions_status (status),
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE RESTRICT,
    FOREIGN KEY (prescriber_id) REFERENCES users(user_id) ON DELETE RESTRICT,
    FOREIGN KEY (facility_id) REFERENCES facilities(facility_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4.3. prescription_items
CREATE TABLE IF NOT EXISTS prescription_items (
    prescription_item_id CHAR(36) PRIMARY KEY,
    prescription_id CHAR(36) NOT NULL,
    medication_id CHAR(36) NOT NULL,
    dosage VARCHAR(50) NOT NULL,
    frequency VARCHAR(50) NOT NULL,
    quantity INT NOT NULL,
    instructions TEXT,
    duration_days INT,
    INDEX idx_prescription_items_prescription_id (prescription_id),
    INDEX idx_prescription_items_medication_id (medication_id),
    FOREIGN KEY (prescription_id) REFERENCES prescriptions(prescription_id) ON DELETE CASCADE,
    FOREIGN KEY (medication_id) REFERENCES medications(medication_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4.4. medication_inventory
CREATE TABLE IF NOT EXISTS medication_inventory (
    inventory_id CHAR(36) PRIMARY KEY,
    medication_id CHAR(36) NOT NULL,
    facility_id CHAR(36) NOT NULL,
    batch_number VARCHAR(50),
    quantity_on_hand INT NOT NULL DEFAULT 0,
    unit VARCHAR(20) DEFAULT 'tablets',
    expiry_date DATE,
    reorder_level INT DEFAULT 0,
    last_restocked DATE,
    supplier VARCHAR(200),
    cost_per_unit DECIMAL(10,2),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_inventory_medication_id (medication_id),
    INDEX idx_inventory_facility_id (facility_id),
    INDEX idx_inventory_expiry_date (expiry_date),
    INDEX idx_inventory_batch_number (batch_number),
    FOREIGN KEY (medication_id) REFERENCES medications(medication_id) ON DELETE RESTRICT,
    FOREIGN KEY (facility_id) REFERENCES facilities(facility_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4.5. dispense_events
CREATE TABLE IF NOT EXISTS dispense_events (
    dispense_id CHAR(36) PRIMARY KEY,
    prescription_id CHAR(36) NOT NULL,
    prescription_item_id CHAR(36),
    nurse_id CHAR(36) NOT NULL,
    facility_id CHAR(36) NOT NULL,
    dispensed_date DATE DEFAULT (CURRENT_DATE),
    quantity_dispensed INT NOT NULL,
    batch_number VARCHAR(50),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_dispense_events_prescription_id (prescription_id),
    INDEX idx_dispense_events_dispensed_date (dispensed_date),
    FOREIGN KEY (prescription_id) REFERENCES prescriptions(prescription_id) ON DELETE RESTRICT,
    FOREIGN KEY (prescription_item_id) REFERENCES prescription_items(prescription_item_id) ON DELETE SET NULL,
    FOREIGN KEY (nurse_id) REFERENCES users(user_id) ON DELETE RESTRICT,
    FOREIGN KEY (facility_id) REFERENCES facilities(facility_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4.6. medication_reminders
CREATE TABLE IF NOT EXISTS medication_reminders (
    reminder_id CHAR(36) PRIMARY KEY,
    prescription_id CHAR(36),
    patient_id CHAR(36) NOT NULL,
    medication_name VARCHAR(150) NOT NULL,
    dosage VARCHAR(50) NOT NULL,
    frequency VARCHAR(50) NOT NULL,
    reminder_time TIME NOT NULL,
    sound_preference ENUM('default', 'gentle', 'urgent') DEFAULT 'default',
    browser_notifications BOOLEAN DEFAULT TRUE,
    special_instructions TEXT,
    active BOOLEAN DEFAULT TRUE,
    missed_doses INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_medication_reminders_patient_id (patient_id),
    INDEX idx_medication_reminders_prescription_id (prescription_id),
    INDEX idx_medication_reminders_active (active),
    FOREIGN KEY (prescription_id) REFERENCES prescriptions(prescription_id) ON DELETE SET NULL,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4.7. medication_adherence
CREATE TABLE IF NOT EXISTS medication_adherence (
    adherence_id CHAR(36) PRIMARY KEY,
    prescription_id CHAR(36) NOT NULL,
    patient_id CHAR(36) NOT NULL,
    adherence_date DATE DEFAULT (CURRENT_DATE),
    taken BOOLEAN DEFAULT FALSE,
    missed_reason TEXT,
    adherence_percentage DECIMAL(5,2),
    recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_medication_adherence_prescription_id (prescription_id),
    INDEX idx_medication_adherence_patient_id (patient_id),
    INDEX idx_medication_adherence_date (adherence_date),
    FOREIGN KEY (prescription_id) REFERENCES prescriptions(prescription_id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- MODULE 5: LAB TEST MANAGEMENT (P5)
-- ============================================================================

-- 5.1. lab_orders
CREATE TABLE IF NOT EXISTS lab_orders (
    order_id CHAR(36) PRIMARY KEY,
    patient_id CHAR(36) NOT NULL,
    ordering_provider_id CHAR(36) NOT NULL,
    facility_id CHAR(36) NOT NULL,
    order_date DATE DEFAULT (CURRENT_DATE),
    test_panel VARCHAR(100) NOT NULL,
    priority ENUM('routine', 'urgent', 'stat') DEFAULT 'routine',
    status ENUM('ordered', 'collected', 'in_progress', 'completed', 'cancelled') DEFAULT 'ordered',
    collection_date DATE,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_lab_orders_patient_id (patient_id),
    INDEX idx_lab_orders_order_date (order_date),
    INDEX idx_lab_orders_status (status),
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE RESTRICT,
    FOREIGN KEY (ordering_provider_id) REFERENCES users(user_id) ON DELETE RESTRICT,
    FOREIGN KEY (facility_id) REFERENCES facilities(facility_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5.2. lab_results
CREATE TABLE IF NOT EXISTS lab_results (
    result_id CHAR(36) PRIMARY KEY,
    order_id CHAR(36) NOT NULL,
    patient_id CHAR(36) NOT NULL,
    test_code VARCHAR(50) NOT NULL,
    test_name VARCHAR(150) NOT NULL,
    result_value VARCHAR(100) NOT NULL,
    unit VARCHAR(20),
    reference_range_min DECIMAL(10,2),
    reference_range_max DECIMAL(10,2),
    reference_range_text VARCHAR(100),
    is_critical BOOLEAN DEFAULT FALSE,
    critical_alert_sent BOOLEAN DEFAULT FALSE,
    collected_at DATE,
    reported_at DATE DEFAULT (CURRENT_DATE),
    reviewed_at DATETIME,
    reviewer_id CHAR(36),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by CHAR(36) NOT NULL,
    INDEX idx_lab_results_order_id (order_id),
    INDEX idx_lab_results_patient_id (patient_id),
    INDEX idx_lab_results_test_code (test_code),
    INDEX idx_lab_results_reported_at (reported_at),
    INDEX idx_lab_results_is_critical (is_critical),
    FOREIGN KEY (order_id) REFERENCES lab_orders(order_id) ON DELETE RESTRICT,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE RESTRICT,
    FOREIGN KEY (reviewer_id) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5.3. lab_files
CREATE TABLE IF NOT EXISTS lab_files (
    file_id CHAR(36) PRIMARY KEY,
    result_id CHAR(36) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    uploaded_by CHAR(36) NOT NULL,
    INDEX idx_lab_files_result_id (result_id),
    FOREIGN KEY (result_id) REFERENCES lab_results(result_id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(user_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- MODULE 6: APPOINTMENT SCHEDULING (P6)
-- ============================================================================

-- 6.1. appointments
CREATE TABLE IF NOT EXISTS appointments (
    appointment_id CHAR(36) PRIMARY KEY,
    patient_id CHAR(36) NOT NULL,
    provider_id CHAR(36),
    facility_id CHAR(36) NOT NULL,
    appointment_type ENUM('follow_up', 'art_pickup', 'lab_test', 'counseling', 'general', 'initial') NOT NULL,
    scheduled_start DATETIME NOT NULL,
    scheduled_end DATETIME NOT NULL,
    duration_minutes INT DEFAULT 30,
    status ENUM('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show') DEFAULT 'scheduled',
    reason TEXT,
    notes TEXT,
    booked_by CHAR(36) NOT NULL,
    booked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    cancelled_at DATETIME,
    cancelled_by CHAR(36),
    cancellation_reason TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_appointments_patient_id (patient_id),
    INDEX idx_appointments_provider_id (provider_id),
    INDEX idx_appointments_facility_id (facility_id),
    INDEX idx_appointments_scheduled_start (scheduled_start),
    INDEX idx_appointments_status (status),
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE RESTRICT,
    FOREIGN KEY (provider_id) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (facility_id) REFERENCES facilities(facility_id) ON DELETE RESTRICT,
    FOREIGN KEY (booked_by) REFERENCES users(user_id) ON DELETE RESTRICT,
    FOREIGN KEY (cancelled_by) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6.2. availability_slots
CREATE TABLE IF NOT EXISTS availability_slots (
    slot_id CHAR(36) PRIMARY KEY,
    provider_id CHAR(36) NOT NULL,
    facility_id CHAR(36) NOT NULL,
    slot_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    slot_status ENUM('available', 'booked', 'blocked', 'unavailable') DEFAULT 'available',
    appointment_id CHAR(36),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_availability_slots_provider_id (provider_id),
    INDEX idx_availability_slots_facility_id (facility_id),
    INDEX idx_availability_slots_date (slot_date),
    INDEX idx_availability_slots_status (slot_status),
    FOREIGN KEY (provider_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (facility_id) REFERENCES facilities(facility_id) ON DELETE RESTRICT,
    FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6.3. appointment_reminders
CREATE TABLE IF NOT EXISTS appointment_reminders (
    reminder_id CHAR(36) PRIMARY KEY,
    appointment_id CHAR(36) NOT NULL,
    reminder_type ENUM('sms', 'email', 'push', 'in_app') NOT NULL,
    reminder_sent_at DATETIME,
    reminder_scheduled_at DATETIME NOT NULL,
    status ENUM('pending', 'sent', 'failed', 'cancelled') DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_appointment_reminders_appointment_id (appointment_id),
    INDEX idx_appointment_reminders_status (status),
    INDEX idx_appointment_reminders_scheduled_at (reminder_scheduled_at),
    FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- MODULE 7: CARE COORDINATION & REFERRALS (P7)
-- ============================================================================

-- 7.1. referrals
CREATE TABLE IF NOT EXISTS referrals (
    referral_id CHAR(36) PRIMARY KEY,
    patient_id CHAR(36) NOT NULL,
    from_facility_id CHAR(36) NOT NULL,
    to_facility_id CHAR(36) NOT NULL,
    referral_reason TEXT NOT NULL,
    urgency ENUM('routine', 'urgent', 'emergency') DEFAULT 'routine',
    status ENUM('pending', 'accepted', 'in_transit', 'completed', 'rejected', 'cancelled') DEFAULT 'pending',
    clinical_notes TEXT,
    referred_by CHAR(36) NOT NULL,
    referred_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    accepted_at DATETIME,
    accepted_by CHAR(36),
    completed_at DATETIME,
    rejection_reason TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_referrals_patient_id (patient_id),
    INDEX idx_referrals_from_facility_id (from_facility_id),
    INDEX idx_referrals_to_facility_id (to_facility_id),
    INDEX idx_referrals_status (status),
    INDEX idx_referrals_referred_at (referred_at),
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE RESTRICT,
    FOREIGN KEY (from_facility_id) REFERENCES facilities(facility_id) ON DELETE RESTRICT,
    FOREIGN KEY (to_facility_id) REFERENCES facilities(facility_id) ON DELETE RESTRICT,
    FOREIGN KEY (referred_by) REFERENCES users(user_id) ON DELETE RESTRICT,
    FOREIGN KEY (accepted_by) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7.2. counseling_sessions
CREATE TABLE IF NOT EXISTS counseling_sessions (
    session_id CHAR(36) PRIMARY KEY,
    patient_id CHAR(36) NOT NULL,
    counselor_id CHAR(36) NOT NULL,
    facility_id CHAR(36) NOT NULL,
    session_date DATE DEFAULT (CURRENT_DATE),
    session_type ENUM('pre_test', 'post_test', 'adherence', 'mental_health', 'support', 'other') NOT NULL,
    session_notes TEXT,
    follow_up_required BOOLEAN DEFAULT FALSE,
    follow_up_date DATE,
    follow_up_reason TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_counseling_sessions_patient_id (patient_id),
    INDEX idx_counseling_sessions_counselor_id (counselor_id),
    INDEX idx_counseling_sessions_session_date (session_date),
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE RESTRICT,
    FOREIGN KEY (counselor_id) REFERENCES users(user_id) ON DELETE RESTRICT,
    FOREIGN KEY (facility_id) REFERENCES facilities(facility_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7.3. hts_sessions
CREATE TABLE IF NOT EXISTS hts_sessions (
    hts_id CHAR(36) PRIMARY KEY,
    patient_id CHAR(36) NOT NULL,
    tester_id CHAR(36) NOT NULL,
    facility_id CHAR(36) NOT NULL,
    test_date DATE DEFAULT (CURRENT_DATE),
    test_result ENUM('positive', 'negative', 'indeterminate') NOT NULL,
    test_type VARCHAR(50),
    pre_test_counseling BOOLEAN DEFAULT FALSE,
    post_test_counseling BOOLEAN DEFAULT FALSE,
    linked_to_care BOOLEAN DEFAULT FALSE,
    care_link_date DATE,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_hts_sessions_patient_id (patient_id),
    INDEX idx_hts_sessions_test_date (test_date),
    INDEX idx_hts_sessions_test_result (test_result),
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE RESTRICT,
    FOREIGN KEY (tester_id) REFERENCES users(user_id) ON DELETE RESTRICT,
    FOREIGN KEY (facility_id) REFERENCES facilities(facility_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7.4. care_tasks
CREATE TABLE IF NOT EXISTS care_tasks (
    task_id CHAR(36) PRIMARY KEY,
    referral_id CHAR(36),
    patient_id CHAR(36) NOT NULL,
    assignee_id CHAR(36) NOT NULL,
    task_type ENUM('follow_up', 'referral', 'counseling', 'appointment', 'other') NOT NULL,
    task_description TEXT NOT NULL,
    due_date DATE,
    status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    completed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by CHAR(36) NOT NULL,
    INDEX idx_care_tasks_patient_id (patient_id),
    INDEX idx_care_tasks_assignee_id (assignee_id),
    INDEX idx_care_tasks_due_date (due_date),
    INDEX idx_care_tasks_status (status),
    FOREIGN KEY (referral_id) REFERENCES referrals(referral_id) ON DELETE SET NULL,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE RESTRICT,
    FOREIGN KEY (assignee_id) REFERENCES users(user_id) ON DELETE RESTRICT,
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- MODULE 8: REPORTING & ANALYTICS (P8)
-- ============================================================================

-- 8.1. report_queries
CREATE TABLE IF NOT EXISTS report_queries (
    report_id CHAR(36) PRIMARY KEY,
    report_name VARCHAR(150) NOT NULL,
    report_description TEXT,
    report_type ENUM('patient', 'clinical', 'inventory', 'survey', 'custom') NOT NULL,
    query_definition JSON NOT NULL,
    parameters JSON,
    schedule VARCHAR(50),
    owner_id CHAR(36) NOT NULL,
    is_public BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_report_queries_report_type (report_type),
    INDEX idx_report_queries_owner_id (owner_id),
    FOREIGN KEY (owner_id) REFERENCES users(user_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8.2. report_runs
CREATE TABLE IF NOT EXISTS report_runs (
    run_id CHAR(36) PRIMARY KEY,
    report_id CHAR(36) NOT NULL,
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    finished_at DATETIME,
    status ENUM('running', 'completed', 'failed', 'cancelled') DEFAULT 'running',
    parameters_used JSON,
    output_ref VARCHAR(500),
    error_message TEXT,
    run_by CHAR(36) NOT NULL,
    INDEX idx_report_runs_report_id (report_id),
    INDEX idx_report_runs_started_at (started_at),
    INDEX idx_report_runs_status (status),
    FOREIGN KEY (report_id) REFERENCES report_queries(report_id) ON DELETE CASCADE,
    FOREIGN KEY (run_by) REFERENCES users(user_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8.3. dashboard_cache
CREATE TABLE IF NOT EXISTS dashboard_cache (
    cache_id CHAR(36) PRIMARY KEY,
    widget_id VARCHAR(100) NOT NULL,
    parameters JSON NOT NULL,
    cached_data JSON NOT NULL,
    cached_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    INDEX idx_dashboard_cache_widget_id (widget_id),
    INDEX idx_dashboard_cache_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8.4. audit_log
CREATE TABLE IF NOT EXISTS audit_log (
    audit_id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    user_name VARCHAR(200) NOT NULL,
    user_role VARCHAR(50) NOT NULL,
    action ENUM('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'VIEW', 'EXPORT', 'PRINT', 'DOWNLOAD') NOT NULL,
    module VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id CHAR(36),
    record_id VARCHAR(50),
    old_value JSON,
    new_value JSON,
    change_summary TEXT,
    ip_address VARCHAR(45),
    device_type ENUM('Desktop', 'Mobile', 'Tablet'),
    user_agent TEXT,
    remarks TEXT,
    status ENUM('success', 'failed', 'error') DEFAULT 'success',
    error_message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_audit_log_user_id (user_id),
    INDEX idx_audit_log_action (action),
    INDEX idx_audit_log_module (module),
    INDEX idx_audit_log_entity_id (entity_id),
    INDEX idx_audit_log_created_at (created_at),
    INDEX idx_audit_log_user_role (user_role),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- MODULE 10: VACCINATION PROGRAM
-- ============================================================================

-- 10.1. vaccine_catalog
CREATE TABLE IF NOT EXISTS vaccine_catalog (
    vaccine_id CHAR(36) PRIMARY KEY,
    vaccine_name VARCHAR(150) NOT NULL,
    manufacturer VARCHAR(100),
    series_length INT NOT NULL,
    dose_intervals JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_vaccine_catalog_name (vaccine_name),
    INDEX idx_vaccine_catalog_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10.2. vaccination_records
CREATE TABLE IF NOT EXISTS vaccination_records (
    vaccination_id CHAR(36) PRIMARY KEY,
    patient_id CHAR(36) NOT NULL,
    vaccine_id CHAR(36) NOT NULL,
    provider_id CHAR(36) NOT NULL,
    facility_id CHAR(36) NOT NULL,
    dose_number INT NOT NULL,
    total_doses INT NOT NULL,
    date_given DATE DEFAULT (CURRENT_DATE),
    next_dose_due DATE,
    lot_number VARCHAR(50),
    administration_site ENUM('left_arm', 'right_arm', 'left_thigh', 'right_thigh', 'other'),
    notes TEXT,
    status ENUM('complete', 'in_progress', 'due_soon', 'overdue'),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_vaccination_records_patient_id (patient_id),
    INDEX idx_vaccination_records_vaccine_id (vaccine_id),
    INDEX idx_vaccination_records_date_given (date_given),
    INDEX idx_vaccination_records_next_dose_due (next_dose_due),
    INDEX idx_vaccination_records_status (status),
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE RESTRICT,
    FOREIGN KEY (vaccine_id) REFERENCES vaccine_catalog(vaccine_id) ON DELETE RESTRICT,
    FOREIGN KEY (provider_id) REFERENCES users(user_id) ON DELETE RESTRICT,
    FOREIGN KEY (facility_id) REFERENCES facilities(facility_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- MODULE 11: PATIENT FEEDBACK & SURVEYS
-- ============================================================================

-- 11.1. survey_responses
CREATE TABLE IF NOT EXISTS survey_responses (
    survey_id CHAR(36) PRIMARY KEY,
    patient_id CHAR(36) NOT NULL,
    facility_id CHAR(36),
    overall_satisfaction ENUM('very_happy', 'happy', 'neutral', 'unhappy', 'very_unhappy') NOT NULL,
    staff_friendliness INT CHECK (staff_friendliness >= 1 AND staff_friendliness <= 5) NOT NULL,
    wait_time INT CHECK (wait_time >= 1 AND wait_time <= 5) NOT NULL,
    facility_cleanliness INT CHECK (facility_cleanliness >= 1 AND facility_cleanliness <= 5) NOT NULL,
    would_recommend ENUM('yes', 'maybe', 'no') NOT NULL,
    comments TEXT,
    average_score DECIMAL(3,2),
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_survey_responses_patient_id (patient_id),
    INDEX idx_survey_responses_facility_id (facility_id),
    INDEX idx_survey_responses_submitted_at (submitted_at),
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE RESTRICT,
    FOREIGN KEY (facility_id) REFERENCES facilities(facility_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11.2. survey_metrics
CREATE TABLE IF NOT EXISTS survey_metrics (
    metric_id CHAR(36) PRIMARY KEY,
    facility_id CHAR(36),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_responses INT DEFAULT 0,
    average_overall DECIMAL(3,2),
    average_staff DECIMAL(3,2),
    average_wait DECIMAL(3,2),
    average_cleanliness DECIMAL(3,2),
    recommendation_rate DECIMAL(5,2),
    calculated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_survey_metrics_facility_id (facility_id),
    INDEX idx_survey_metrics_period (period_start, period_end),
    FOREIGN KEY (facility_id) REFERENCES facilities(facility_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- MODULE 12: COMMUNITY FORUM & EDUCATION
-- ============================================================================

-- 12.1. forum_categories
CREATE TABLE IF NOT EXISTS forum_categories (
    category_id CHAR(36) PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    category_code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(10),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_forum_categories_code (category_code),
    INDEX idx_forum_categories_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12.2. forum_posts
CREATE TABLE IF NOT EXISTS forum_posts (
    post_id CHAR(36) PRIMARY KEY,
    patient_id CHAR(36),
    category_id CHAR(36) NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    is_anonymous BOOLEAN DEFAULT TRUE,
    reply_count INT DEFAULT 0,
    view_count INT DEFAULT 0,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_locked BOOLEAN DEFAULT FALSE,
    status ENUM('pending', 'approved', 'rejected', 'flagged') DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_forum_posts_category_id (category_id),
    INDEX idx_forum_posts_patient_id (patient_id),
    INDEX idx_forum_posts_status (status),
    INDEX idx_forum_posts_created_at (created_at),
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE SET NULL,
    FOREIGN KEY (category_id) REFERENCES forum_categories(category_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12.3. forum_replies
CREATE TABLE IF NOT EXISTS forum_replies (
    reply_id CHAR(36) PRIMARY KEY,
    post_id CHAR(36) NOT NULL,
    patient_id CHAR(36),
    content TEXT NOT NULL,
    is_anonymous BOOLEAN DEFAULT TRUE,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_forum_replies_post_id (post_id),
    INDEX idx_forum_replies_patient_id (patient_id),
    INDEX idx_forum_replies_created_at (created_at),
    FOREIGN KEY (post_id) REFERENCES forum_posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12.4. learning_modules
CREATE TABLE IF NOT EXISTS learning_modules (
    module_id CHAR(36) PRIMARY KEY,
    module_title VARCHAR(200) NOT NULL,
    module_content TEXT,
    module_type ENUM('article', 'video', 'infographic', 'pdf') DEFAULT 'article',
    category VARCHAR(50),
    description TEXT,
    read_time VARCHAR(20),
    tags JSON,
    is_published BOOLEAN DEFAULT FALSE,
    view_count INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_learning_modules_type (module_type),
    INDEX idx_learning_modules_is_published (is_published),
    INDEX idx_learning_modules_created_at (created_at),
    INDEX idx_learning_modules_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12.5. faqs
CREATE TABLE IF NOT EXISTS faqs (
    faq_id CHAR(36) PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(50),
    display_order INT DEFAULT 0,
    view_count INT DEFAULT 0,
    is_published BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_faqs_category (category),
    INDEX idx_faqs_is_published (is_published),
    INDEX idx_faqs_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- MODULE 14: INVENTORY MANAGEMENT
-- ============================================================================

-- 14.2. inventory_transactions
CREATE TABLE IF NOT EXISTS inventory_transactions (
    transaction_id CHAR(36) PRIMARY KEY,
    inventory_id CHAR(36) NOT NULL,
    transaction_type ENUM('restock', 'dispense', 'adjustment', 'transfer', 'expired', 'damaged', 'return') NOT NULL,
    quantity_change INT NOT NULL,
    quantity_before INT NOT NULL,
    quantity_after INT NOT NULL,
    batch_number VARCHAR(50),
    transaction_reason TEXT,
    performed_by CHAR(36) NOT NULL,
    facility_id CHAR(36) NOT NULL,
    transaction_date DATE DEFAULT (CURRENT_DATE),
    reference_id CHAR(36),
    reference_type VARCHAR(50),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_inventory_transactions_inventory_id (inventory_id),
    INDEX idx_inventory_transactions_transaction_type (transaction_type),
    INDEX idx_inventory_transactions_transaction_date (transaction_date),
    INDEX idx_inventory_transactions_facility_id (facility_id),
    FOREIGN KEY (inventory_id) REFERENCES medication_inventory(inventory_id) ON DELETE RESTRICT,
    FOREIGN KEY (performed_by) REFERENCES users(user_id) ON DELETE RESTRICT,
    FOREIGN KEY (facility_id) REFERENCES facilities(facility_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14.3. inventory_alerts
CREATE TABLE IF NOT EXISTS inventory_alerts (
    alert_id CHAR(36) PRIMARY KEY,
    inventory_id CHAR(36) NOT NULL,
    alert_type ENUM('low_stock', 'expiring_soon', 'expired', 'overstock') NOT NULL,
    alert_level ENUM('info', 'warning', 'critical') DEFAULT 'warning',
    current_value DECIMAL(10,2) NOT NULL,
    threshold_value DECIMAL(10,2) NOT NULL,
    message TEXT NOT NULL,
    acknowledged BOOLEAN DEFAULT FALSE,
    acknowledged_by CHAR(36),
    acknowledged_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_inventory_alerts_inventory_id (inventory_id),
    INDEX idx_inventory_alerts_alert_type (alert_type),
    INDEX idx_inventory_alerts_acknowledged (acknowledged),
    INDEX idx_inventory_alerts_created_at (created_at),
    FOREIGN KEY (inventory_id) REFERENCES medication_inventory(inventory_id) ON DELETE CASCADE,
    FOREIGN KEY (acknowledged_by) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14.4. inventory_suppliers
CREATE TABLE IF NOT EXISTS inventory_suppliers (
    supplier_id CHAR(36) PRIMARY KEY,
    supplier_name VARCHAR(200) NOT NULL,
    contact_person VARCHAR(200),
    contact_phone VARCHAR(50),
    contact_email VARCHAR(255),
    address JSON,
    payment_terms VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_inventory_suppliers_name (supplier_name),
    INDEX idx_inventory_suppliers_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14.5. inventory_orders
CREATE TABLE IF NOT EXISTS inventory_orders (
    order_id CHAR(36) PRIMARY KEY,
    facility_id CHAR(36) NOT NULL,
    supplier_id CHAR(36) NOT NULL,
    order_date DATE DEFAULT (CURRENT_DATE),
    expected_delivery_date DATE,
    status ENUM('pending', 'ordered', 'in_transit', 'received', 'cancelled', 'partial') DEFAULT 'pending',
    total_cost DECIMAL(10,2),
    ordered_by CHAR(36) NOT NULL,
    received_by CHAR(36),
    received_at DATETIME,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_inventory_orders_facility_id (facility_id),
    INDEX idx_inventory_orders_supplier_id (supplier_id),
    INDEX idx_inventory_orders_status (status),
    INDEX idx_inventory_orders_order_date (order_date),
    FOREIGN KEY (facility_id) REFERENCES facilities(facility_id) ON DELETE RESTRICT,
    FOREIGN KEY (supplier_id) REFERENCES inventory_suppliers(supplier_id) ON DELETE RESTRICT,
    FOREIGN KEY (ordered_by) REFERENCES users(user_id) ON DELETE RESTRICT,
    FOREIGN KEY (received_by) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14.6. inventory_order_items
CREATE TABLE IF NOT EXISTS inventory_order_items (
    order_item_id CHAR(36) PRIMARY KEY,
    order_id CHAR(36) NOT NULL,
    medication_id CHAR(36) NOT NULL,
    quantity_ordered INT NOT NULL,
    quantity_received INT DEFAULT 0,
    unit_cost DECIMAL(10,2),
    batch_number VARCHAR(50),
    expiry_date DATE,
    status ENUM('pending', 'received', 'partial', 'cancelled') DEFAULT 'pending',
    INDEX idx_inventory_order_items_order_id (order_id),
    INDEX idx_inventory_order_items_medication_id (medication_id),
    FOREIGN KEY (order_id) REFERENCES inventory_orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (medication_id) REFERENCES medications(medication_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- MODULE 15: ART REGIMEN MANAGEMENT
-- ============================================================================

-- 15.1. art_regimens
CREATE TABLE IF NOT EXISTS art_regimens (
    regimen_id CHAR(36) PRIMARY KEY,
    patient_id CHAR(36) NOT NULL,
    provider_id CHAR(36) NOT NULL,
    facility_id CHAR(36) NOT NULL,
    start_date DATE NOT NULL,
    stop_date DATE,
    status ENUM('active', 'stopped', 'changed') DEFAULT 'active',
    stop_reason TEXT,
    change_reason TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_art_regimens_patient_id (patient_id),
    INDEX idx_art_regimens_status (status),
    INDEX idx_art_regimens_start_date (start_date),
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE RESTRICT,
    FOREIGN KEY (provider_id) REFERENCES users(user_id) ON DELETE RESTRICT,
    FOREIGN KEY (facility_id) REFERENCES facilities(facility_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15.2. art_regimen_drugs
CREATE TABLE IF NOT EXISTS art_regimen_drugs (
    regimen_drug_id CHAR(36) PRIMARY KEY,
    regimen_id CHAR(36) NOT NULL,
    medication_id CHAR(36) NOT NULL,
    drug_name VARCHAR(200) NOT NULL,
    dosage VARCHAR(50) NOT NULL,
    pills_per_day INT NOT NULL,
    pills_dispensed INT DEFAULT 0,
    pills_remaining INT DEFAULT 0,
    missed_doses INT DEFAULT 0,
    last_dispensed_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_art_regimen_drugs_regimen_id (regimen_id),
    INDEX idx_art_regimen_drugs_medication_id (medication_id),
    FOREIGN KEY (regimen_id) REFERENCES art_regimens(regimen_id) ON DELETE CASCADE,
    FOREIGN KEY (medication_id) REFERENCES medications(medication_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15.3. art_regimen_history
CREATE TABLE IF NOT EXISTS art_regimen_history (
    history_id CHAR(36) PRIMARY KEY,
    regimen_id CHAR(36) NOT NULL,
    action_type ENUM('started', 'stopped', 'changed', 'drug_added', 'drug_removed', 'pills_dispensed', 'dose_missed') NOT NULL,
    action_date DATE DEFAULT (CURRENT_DATE),
    previous_status VARCHAR(50),
    new_status VARCHAR(50),
    details JSON,
    performed_by CHAR(36) NOT NULL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_art_regimen_history_regimen_id (regimen_id),
    INDEX idx_art_regimen_history_action_date (action_date),
    INDEX idx_art_regimen_history_action_type (action_type),
    FOREIGN KEY (regimen_id) REFERENCES art_regimens(regimen_id) ON DELETE CASCADE,
    FOREIGN KEY (performed_by) REFERENCES users(user_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================


