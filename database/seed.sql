-- ============================================
-- CloudCare Demo / Seed Data
-- All data below is fictional.
-- Demo password for all users: password
-- ============================================

USE cloudcare;

-- ============================================
-- USERS
-- ============================================

INSERT INTO users
    (name, email, password_hash, phone, role)
VALUES
    ('CloudCare Admin', 'admin@cloudcare.local',
     '$2b$10$HMa/erjlmJKOu5cLZ34p3.IJy8ZvuvXOVgeOO34jC6Fj1tEkKNBUy',
     '9000000001', 'ADMIN'),

    ('Dr. Arjun Sharma', 'arjun.doctor@cloudcare.local',
     '$2b$10$HMa/erjlmJKOu5cLZ34p3.IJy8ZvuvXOVgeOO34jC6Fj1tEkKNBUy',
     '9000000002', 'DOCTOR'),

    ('Dr. Priya Mehta', 'priya.doctor@cloudcare.local',
     '$2b$10$HMa/erjlmJKOu5cLZ34p3.IJy8ZvuvXOVgeOO34jC6Fj1tEkKNBUy',
     '9000000003', 'DOCTOR'),

    ('Rahul Kumar', 'rahul.patient@cloudcare.local',
     '$2b$10$HMa/erjlmJKOu5cLZ34p3.IJy8ZvuvXOVgeOO34jC6Fj1tEkKNBUy',
     '9000000004', 'PATIENT'),

    ('Ananya Reddy', 'ananya.patient@cloudcare.local',
     '$2b$10$HMa/erjlmJKOu5cLZ34p3.IJy8ZvuvXOVgeOO34jC6Fj1tEkKNBUy',
     '9000000005', 'PATIENT');


-- ============================================
-- PATIENTS
-- ============================================

INSERT INTO patients
    (user_id, date_of_birth, gender, address)
VALUES
    (4, '2002-05-15', 'Male', 'Hyderabad, Telangana'),
    (5, '2001-11-20', 'Female', 'Bengaluru, Karnataka');


-- ============================================
-- DOCTORS
-- ============================================

INSERT INTO doctors
    (user_id, specialization, license_number, experience)
VALUES
    (2, 'General Medicine', 'DOC-CC-001', 8),
    (3, 'Cardiology', 'DOC-CC-002', 12);


-- ============================================
-- APPOINTMENTS
-- ============================================

INSERT INTO appointments
    (patient_id, doctor_id, appointment_date, appointment_time, status, reason)
VALUES
    (1, 1, '2026-09-10', '10:00:00', 'COMPLETED',
     'Regular health consultation'),

    (1, 2, '2026-09-15', '11:30:00', 'CONFIRMED',
     'Cardiology consultation'),

    (2, 1, '2026-09-12', '15:00:00', 'SCHEDULED',
     'General medical checkup');


-- ============================================
-- MEDICAL RECORDS
-- ============================================

INSERT INTO medical_records
    (patient_id, doctor_id, record_date, diagnosis, notes, appointment_id)
VALUES
    (1, 1, '2026-09-10',
     'Mild seasonal allergy',
     'Patient advised adequate hydration and rest.',
     1);


-- ============================================
-- PRESCRIPTIONS
-- ============================================

INSERT INTO prescriptions
    (appointment_id, prescription_date, medicines, instructions)
VALUES
    (1, '2026-09-10',
     'Cetirizine 10mg - 1 tablet once daily',
     'Take after dinner for 5 days.');