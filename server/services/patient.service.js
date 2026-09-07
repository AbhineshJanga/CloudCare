import pool from "../config/database.js";

export const getPatientProfile = async (userId) => {
    const [rows] = await pool.query(
        `SELECT
            u.user_id,
            u.name,
            u.email,
            u.phone,
            u.role,
            p.patient_id,
            p.date_of_birth,
            p.gender,
            p.address
         FROM users u
         INNER JOIN patients p
             ON u.user_id = p.user_id
         WHERE u.user_id = ?
           AND u.role = 'PATIENT'`,
        [userId]
    );

    if (rows.length === 0) {
        throw new Error("Patient profile not found");
    }

    return rows[0];
};

export const updatePatientProfile = async (userId, profileData) => {
    const {
        name,
        phone,
        date_of_birth,
        gender,
        address
    } = profileData;

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        await connection.query(
            `UPDATE users
             SET name = ?, phone = ?
             WHERE user_id = ?
               AND role = 'PATIENT'`,
            [name, phone, userId]
        );

        await connection.query(
            `UPDATE patients
             SET date_of_birth = ?,
                 gender = ?,
                 address = ?
             WHERE user_id = ?`,
            [date_of_birth, gender, address, userId]
        );

        await connection.commit();

        return await getPatientProfile(userId);
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

export const getDoctors = async () => {
    const [rows] = await pool.query(
        `SELECT
            d.doctor_id,
            u.user_id,
            u.name,
            u.email,
            u.phone,
            d.specialization,
            d.license_number,
            d.experience
         FROM doctors d
         INNER JOIN users u
             ON d.user_id = u.user_id
         WHERE u.role = 'DOCTOR'
         ORDER BY u.name`
    );

    return rows;
};

export const createAppointment = async (
    userId,
    doctorId,
    appointmentDate,
    appointmentTime,
    reason
) => {
    const [patientRows] = await pool.query(
        `SELECT patient_id
         FROM patients
         WHERE user_id = ?`,
        [userId]
    );

    if (patientRows.length === 0) {
        throw new Error("Patient profile not found");
    }

    const patientId = patientRows[0].patient_id;

    const [doctorRows] = await pool.query(
        `SELECT doctor_id
         FROM doctors
         WHERE doctor_id = ?`,
        [doctorId]
    );

    if (doctorRows.length === 0) {
        throw new Error("Doctor not found");
    }

    const [result] = await pool.query(
        `INSERT INTO appointments
            (patient_id, doctor_id, appointment_date, appointment_time, status, reason)
         VALUES (?, ?, ?, ?, 'SCHEDULED', ?)`,
        [
            patientId,
            doctorId,
            appointmentDate,
            appointmentTime,
            reason || null
        ]
    );

    const [rows] = await pool.query(
        `SELECT
            a.appointment_id,
            a.patient_id,
            a.doctor_id,
            a.appointment_date,
            a.appointment_time,
            a.status,
            a.reason,
            u.name AS doctor_name,
            d.specialization
         FROM appointments a
         INNER JOIN doctors d
             ON a.doctor_id = d.doctor_id
         INNER JOIN users u
             ON d.user_id = u.user_id
         WHERE a.appointment_id = ?`,
        [result.insertId]
    );

    return rows[0];
};

export const getPatientAppointments = async (userId) => {
    const [rows] = await pool.query(
        `SELECT
            a.appointment_id,
            a.appointment_date,
            a.appointment_time,
            a.status,
            a.reason,
            d.doctor_id,
            u.name AS doctor_name,
            u.email AS doctor_email,
            d.specialization
         FROM appointments a
         INNER JOIN patients p
             ON a.patient_id = p.patient_id
         INNER JOIN doctors d
             ON a.doctor_id = d.doctor_id
         INNER JOIN users u
             ON d.user_id = u.user_id
         WHERE p.user_id = ?
         ORDER BY a.appointment_date DESC, a.appointment_time DESC`,
        [userId]
    );

    return rows;
};
export const cancelAppointment = async (userId, appointmentId) => {
    const [result] = await pool.query(
        `UPDATE appointments a
         INNER JOIN patients p
             ON a.patient_id = p.patient_id
         SET a.status = 'CANCELLED'
         WHERE a.appointment_id = ?
           AND p.user_id = ?
           AND a.status IN ('SCHEDULED', 'CONFIRMED')`,
        [appointmentId, userId]
    );

    if (result.affectedRows === 0) {
        throw new Error(
            "Appointment not found or cannot be cancelled"
        );
    }

    const [rows] = await pool.query(
        `SELECT
            a.appointment_id,
            a.appointment_date,
            a.appointment_time,
            a.status,
            a.reason,
            d.doctor_id,
            u.name AS doctor_name,
            d.specialization
         FROM appointments a
         INNER JOIN doctors d
             ON a.doctor_id = d.doctor_id
         INNER JOIN users u
             ON d.user_id = u.user_id
         WHERE a.appointment_id = ?`,
        [appointmentId]
    );

    return rows[0];
};

export const getPatientMedicalRecords = async (userId) => {
    const [rows] = await pool.query(
        `SELECT
            mr.record_id,
            mr.record_date,
            mr.diagnosis,
            mr.notes,
            mr.appointment_id,
            d.doctor_id,
            u.name AS doctor_name,
            d.specialization,
            a.appointment_date,
            a.appointment_time
         FROM medical_records mr
         INNER JOIN patients p
             ON mr.patient_id = p.patient_id
         INNER JOIN doctors d
             ON mr.doctor_id = d.doctor_id
         INNER JOIN users u
             ON d.user_id = u.user_id
         INNER JOIN appointments a
             ON mr.appointment_id = a.appointment_id
         WHERE p.user_id = ?
         ORDER BY mr.record_date DESC`,
        [userId]
    );

    return rows;
};
export const getPatientPrescriptions = async (userId) => {
    const [rows] = await pool.query(
        `SELECT
            pr.prescription_id,
            pr.prescription_date,
            pr.medicines,
            pr.instructions,
            pr.appointment_id,
            d.doctor_id,
            u.name AS doctor_name,
            d.specialization,
            a.appointment_date,
            a.appointment_time
         FROM prescriptions pr
         INNER JOIN appointments a
             ON pr.appointment_id = a.appointment_id
         INNER JOIN patients p
             ON a.patient_id = p.patient_id
         INNER JOIN doctors d
             ON a.doctor_id = d.doctor_id
         INNER JOIN users u
             ON d.user_id = u.user_id
         WHERE p.user_id = ?
         ORDER BY pr.prescription_date DESC`,
        [userId]
    );

    return rows;
};