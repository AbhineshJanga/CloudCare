import pool from "../config/database.js";

export const getDoctorProfile = async (userId) => {
    const [rows] = await pool.query(
        `SELECT
            u.user_id,
            u.name,
            u.email,
            u.phone,
            u.role,
            d.doctor_id,
            d.specialization,
            d.license_number,
            d.experience
         FROM users u
         INNER JOIN doctors d
             ON u.user_id = d.user_id
         WHERE u.user_id = ?
           AND u.role = 'DOCTOR'`,
        [userId]
    );

    if (rows.length === 0) {
        throw new Error("Doctor profile not found");
    }

    return rows[0];
};

export const updateDoctorProfile = async (userId, profileData) => {
    const {
        name,
        phone,
        specialization,
        experience
    } = profileData;

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        await connection.query(
            `UPDATE users
             SET name = ?, phone = ?
             WHERE user_id = ?
               AND role = 'DOCTOR'`,
            [name, phone, userId]
        );

        await connection.query(
            `UPDATE doctors
             SET specialization = ?,
                 experience = ?
             WHERE user_id = ?`,
            [specialization, experience, userId]
        );

        await connection.commit();

        return await getDoctorProfile(userId);
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};
export const getDoctorAppointments = async (userId) => {
    const [rows] = await pool.query(
        `SELECT
            a.appointment_id,
            a.appointment_date,
            a.appointment_time,
            a.status,
            a.reason,
            p.patient_id,
            u.name AS patient_name,
            u.email AS patient_email,
            u.phone AS patient_phone
         FROM appointments a
         INNER JOIN doctors d
             ON a.doctor_id = d.doctor_id
         INNER JOIN patients p
             ON a.patient_id = p.patient_id
         INNER JOIN users u
             ON p.user_id = u.user_id
         WHERE d.user_id = ?
         ORDER BY a.appointment_date ASC, a.appointment_time ASC`,
        [userId]
    );

    return rows;
};
export const updateAppointmentStatus = async (
    userId,
    appointmentId,
    status
) => {
    const allowedStatuses = [
        "SCHEDULED",
        "CONFIRMED",
        "COMPLETED",
        "CANCELLED"
    ];

    if (!allowedStatuses.includes(status)) {
        throw new Error("Invalid appointment status");
    }

    const [result] = await pool.query(
        `UPDATE appointments a
         INNER JOIN doctors d
             ON a.doctor_id = d.doctor_id
         SET a.status = ?
         WHERE a.appointment_id = ?
           AND d.user_id = ?`,
        [status, appointmentId, userId]
    );

    if (result.affectedRows === 0) {
        throw new Error(
            "Appointment not found or does not belong to this doctor"
        );
    }

    const [rows] = await pool.query(
        `SELECT
            a.appointment_id,
            a.appointment_date,
            a.appointment_time,
            a.status,
            a.reason,
            p.patient_id,
            u.name AS patient_name,
            u.email AS patient_email,
            u.phone AS patient_phone
         FROM appointments a
         INNER JOIN doctors d
             ON a.doctor_id = d.doctor_id
         INNER JOIN patients p
             ON a.patient_id = p.patient_id
         INNER JOIN users u
             ON p.user_id = u.user_id
         WHERE a.appointment_id = ?`,
        [appointmentId]
    );

    return rows[0];
};
export const getDoctorPatients = async (userId) => {
    const [rows] = await pool.query(
        `SELECT DISTINCT
            p.patient_id,
            u.user_id,
            u.name,
            u.email,
            u.phone,
            p.date_of_birth,
            p.gender,
            p.address
         FROM patients p
         INNER JOIN users u
             ON p.user_id = u.user_id
         INNER JOIN appointments a
             ON a.patient_id = p.patient_id
         INNER JOIN doctors d
             ON a.doctor_id = d.doctor_id
         WHERE d.user_id = ?
         ORDER BY u.name`,
        [userId]
    );

    return rows;
};

export const getDoctorPatientById = async (userId, patientId) => {
    const [rows] = await pool.query(
        `SELECT DISTINCT
            p.patient_id,
            u.user_id,
            u.name,
            u.email,
            u.phone,
            p.date_of_birth,
            p.gender,
            p.address
         FROM patients p
         INNER JOIN users u
             ON p.user_id = u.user_id
         INNER JOIN appointments a
             ON a.patient_id = p.patient_id
         INNER JOIN doctors d
             ON a.doctor_id = d.doctor_id
         WHERE d.user_id = ?
           AND p.patient_id = ?`,
        [userId, patientId]
    );

    if (rows.length === 0) {
        throw new Error(
            "Patient not found or has no appointment with this doctor"
        );
    }

    return rows[0];
};
export const getDoctorMedicalRecords = async (userId) => {
    const [rows] = await pool.query(
        `SELECT
            mr.record_id,
            mr.record_date,
            mr.diagnosis,
            mr.notes,
            mr.appointment_id,
            p.patient_id,
            pu.name AS patient_name,
            d.doctor_id,
            du.name AS doctor_name,
            d.specialization,
            a.appointment_date,
            a.appointment_time
         FROM medical_records mr
         INNER JOIN appointments a
             ON mr.appointment_id = a.appointment_id
         INNER JOIN patients p
             ON mr.patient_id = p.patient_id
         INNER JOIN users pu
             ON p.user_id = pu.user_id
         INNER JOIN doctors d
             ON mr.doctor_id = d.doctor_id
         INNER JOIN users du
             ON d.user_id = du.user_id
         WHERE d.user_id = ?
         ORDER BY mr.record_date DESC`,
        [userId]
    );

    return rows;
};
export const getDoctorPrescriptions = async (userId) => {
    const [rows] = await pool.query(
        `SELECT
            pr.prescription_id,
            pr.prescription_date,
            pr.medicines,
            pr.instructions,
            pr.appointment_id,
            p.patient_id,
            pu.name AS patient_name,
            d.doctor_id,
            du.name AS doctor_name,
            d.specialization,
            a.appointment_date,
            a.appointment_time
         FROM prescriptions pr
         INNER JOIN appointments a
             ON pr.appointment_id = a.appointment_id
         INNER JOIN patients p
             ON a.patient_id = p.patient_id
         INNER JOIN users pu
             ON p.user_id = pu.user_id
         INNER JOIN doctors d
             ON a.doctor_id = d.doctor_id
         INNER JOIN users du
             ON d.user_id = du.user_id
         WHERE d.user_id = ?
         ORDER BY pr.prescription_date DESC`,
        [userId]
    );

    return rows;
};
export const createMedicalRecord = async (
    userId,
    patientId,
    appointmentId,
    recordDate,
    diagnosis,
    notes
) => {
    // Verify that the appointment belongs to this doctor and patient
    const [appointmentRows] = await pool.query(
        `SELECT
            a.appointment_id,
            a.patient_id,
            a.doctor_id
         FROM appointments a
         INNER JOIN doctors d
             ON a.doctor_id = d.doctor_id
         WHERE a.appointment_id = ?
           AND a.patient_id = ?
           AND d.user_id = ?`,
        [appointmentId, patientId, userId]
    );

    if (appointmentRows.length === 0) {
        throw new Error(
            "Appointment not found or does not belong to this doctor and patient"
        );
    }

    const [existingRows] = await pool.query(
        `SELECT record_id
         FROM medical_records
         WHERE appointment_id = ?`,
        [appointmentId]
    );

    if (existingRows.length > 0) {
        throw new Error(
            "A medical record already exists for this appointment"
        );
    }

    const [result] = await pool.query(
        `INSERT INTO medical_records
            (
                patient_id,
                doctor_id,
                record_date,
                diagnosis,
                notes,
                appointment_id
            )
         SELECT
            a.patient_id,
            a.doctor_id,
            ?,
            ?,
            ?,
            a.appointment_id
         FROM appointments a
         INNER JOIN doctors d
             ON a.doctor_id = d.doctor_id
         WHERE a.appointment_id = ?
           AND a.patient_id = ?
           AND d.user_id = ?`,
        [
            recordDate,
            diagnosis,
            notes || null,
            appointmentId,
            patientId,
            userId
        ]
    );

    const [rows] = await pool.query(
        `SELECT
            mr.record_id,
            mr.record_date,
            mr.diagnosis,
            mr.notes,
            mr.appointment_id,
            mr.patient_id,
            mr.doctor_id
         FROM medical_records mr
         WHERE mr.record_id = ?`,
        [result.insertId]
    );

    return rows[0];
};
export const createPrescription = async (
    userId,
    appointmentId,
    prescriptionDate,
    medicines,
    instructions
) => {
    const [appointmentRows] = await pool.query(
        `SELECT
            a.appointment_id,
            a.patient_id,
            a.doctor_id
         FROM appointments a
         INNER JOIN doctors d
             ON a.doctor_id = d.doctor_id
         WHERE a.appointment_id = ?
           AND d.user_id = ?`,
        [appointmentId, userId]
    );

    if (appointmentRows.length === 0) {
        throw new Error(
            "Appointment not found or does not belong to this doctor"
        );
    }

    const [existingRows] = await pool.query(
        `SELECT prescription_id
         FROM prescriptions
         WHERE appointment_id = ?`,
        [appointmentId]
    );

    if (existingRows.length > 0) {
        throw new Error(
            "A prescription already exists for this appointment"
        );
    }

    const [result] = await pool.query(
        `INSERT INTO prescriptions
            (
                appointment_id,
                prescription_date,
                medicines,
                instructions
            )
         VALUES (?, ?, ?, ?)`,
        [
            appointmentId,
            prescriptionDate,
            medicines,
            instructions || null
        ]
    );

    /*
     * Return the complete prescription object,
     * matching the GET /prescriptions response.
     */
    const [rows] = await pool.query(
        `SELECT
            pr.prescription_id,
            pr.prescription_date,
            pr.medicines,
            pr.instructions,
            pr.appointment_id,
            p.patient_id,
            pu.name AS patient_name,
            d.doctor_id,
            du.name AS doctor_name,
            d.specialization,
            a.appointment_date,
            a.appointment_time
         FROM prescriptions pr
         INNER JOIN appointments a
             ON pr.appointment_id = a.appointment_id
         INNER JOIN patients p
             ON a.patient_id = p.patient_id
         INNER JOIN users pu
             ON p.user_id = pu.user_id
         INNER JOIN doctors d
             ON a.doctor_id = d.doctor_id
         INNER JOIN users du
             ON d.user_id = du.user_id
         WHERE pr.prescription_id = ?`,
        [result.insertId]
    );

    return rows[0];
};