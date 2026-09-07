import pool from "../config/database.js";
import bcrypt from "bcryptjs";

export const getAdminDashboardStats = async () => {
    const [[users]] = await pool.query(
        `SELECT COUNT(*) AS total_users
         FROM users`
    );

    const [[patients]] = await pool.query(
        `SELECT COUNT(*) AS total_patients
         FROM patients`
    );

    const [[doctors]] = await pool.query(
        `SELECT COUNT(*) AS total_doctors
         FROM doctors`
    );

    const [[appointments]] = await pool.query(
        `SELECT COUNT(*) AS total_appointments
         FROM appointments`
    );

    return {
        total_users: users.total_users,
        total_patients: patients.total_patients,
        total_doctors: doctors.total_doctors,
        total_appointments: appointments.total_appointments
    };
};

export const getAllUsers = async () => {
    const [rows] = await pool.query(
        `SELECT
            user_id,
            name,
            email,
            phone,
            role,
            created_at
         FROM users
         ORDER BY created_at DESC`
    );

    return rows;
};
export const getAllDoctors = async () => {
    const [rows] = await pool.query(
        `SELECT
            d.doctor_id,
            u.user_id,
            u.name,
            u.email,
            u.phone,
            d.specialization,
            d.license_number,
            d.experience,
            u.created_at
         FROM doctors d
         INNER JOIN users u
             ON d.user_id = u.user_id
         WHERE u.role = 'DOCTOR'
         ORDER BY u.name`
    );

    return rows;
};
export const getAllPatients = async () => {
    const [rows] = await pool.query(
        `SELECT
            p.patient_id,
            u.user_id,
            u.name,
            u.email,
            u.phone,
            p.date_of_birth,
            p.gender,
            p.address,
            u.created_at
         FROM patients p
         INNER JOIN users u
             ON p.user_id = u.user_id
         WHERE u.role = 'PATIENT'
         ORDER BY u.name`
    );

    return rows;
};  
export const getAllAppointments = async () => {
    const [rows] = await pool.query(
        `SELECT
            a.appointment_id,
            a.appointment_date,
            a.appointment_time,
            a.status,
            a.reason,
            p.patient_id,
            pu.name AS patient_name,
            d.doctor_id,
            du.name AS doctor_name,
            d.specialization
         FROM appointments a
         INNER JOIN patients p
             ON a.patient_id = p.patient_id
         INNER JOIN users pu
             ON p.user_id = pu.user_id
         INNER JOIN doctors d
             ON a.doctor_id = d.doctor_id
         INNER JOIN users du
             ON d.user_id = du.user_id
         ORDER BY a.appointment_date DESC, a.appointment_time DESC`
    );

    return rows;
};

export const createUser = async (
    name,
    email,
    password,
    phone,
    role
) => {
    const allowedRoles = [
        "PATIENT",
        "DOCTOR",
        "ADMIN"
    ];

    if (!allowedRoles.includes(role)) {
        throw new Error("Invalid user role");
    }

    const [existingRows] = await pool.query(
        `SELECT user_id
         FROM users
         WHERE email = ?`,
        [email]
    );

    if (existingRows.length > 0) {
        throw new Error("A user with this email already exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [userResult] = await connection.query(
            `INSERT INTO users
                (name, email, password_hash, phone, role)
             VALUES (?, ?, ?, ?, ?)`,
            [
                name,
                email,
                passwordHash,
                phone || null,
                role
            ]
        );

        const userId = userResult.insertId;

        if (role === "PATIENT") {
            await connection.query(
                `INSERT INTO patients (user_id)
                 VALUES (?)`,
                [userId]
            );
        }

        if (role === "DOCTOR") {
            await connection.query(
                `INSERT INTO doctors
                    (user_id, specialization, license_number)
                 VALUES (?, ?, ?)`,
                [
                    userId,
                    "General Medicine",
                    `TEMP-${userId}`
                ]
            );
        }

        await connection.commit();

        return {
            user_id: userId,
            name,
            email,
            phone: phone || null,
            role
        };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};
export const deleteUser = async (userId) => {
    const [rows] = await pool.query(
        `SELECT user_id, role
         FROM users
         WHERE user_id = ?`,
        [userId]
    );

    if (rows.length === 0) {
        throw new Error("User not found");
    }

    if (rows[0].role === "ADMIN") {
        throw new Error("Admin users cannot be deleted");
    }

    const [result] = await pool.query(
        `DELETE FROM users
         WHERE user_id = ?`,
        [userId]
    );

    if (result.affectedRows === 0) {
        throw new Error("User could not be deleted");
    }

    return {
        user_id: userId
    };
};
export const updateUser = async (
    userId,
    name,
    email,
    phone,
    role
) => {
    const allowedRoles = [
        "PATIENT",
        "DOCTOR",
        "ADMIN"
    ];

    if (!allowedRoles.includes(role)) {
        throw new Error("Invalid user role");
    }

    const [userRows] = await pool.query(
        `SELECT user_id, role
         FROM users
         WHERE user_id = ?`,
        [userId]
    );

    if (userRows.length === 0) {
        throw new Error("User not found");
    }

    if (
        userRows[0].role === "ADMIN" &&
        role !== "ADMIN"
    ) {
        throw new Error("Admin role cannot be changed");
    }

    const [emailRows] = await pool.query(
        `SELECT user_id
         FROM users
         WHERE email = ?
           AND user_id <> ?`,
        [email, userId]
    );

    if (emailRows.length > 0) {
        throw new Error("Email is already in use");
    }

    await pool.query(
        `UPDATE users
         SET name = ?,
             email = ?,
             phone = ?,
             role = ?
         WHERE user_id = ?`,
        [
            name,
            email,
            phone || null,
            role,
            userId
        ]
    );

    const [rows] = await pool.query(
        `SELECT
            user_id,
            name,
            email,
            phone,
            role,
            created_at
         FROM users
         WHERE user_id = ?`,
        [userId]
    );

    return rows[0];
};

export const updateAppointmentStatus = async (
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
        `UPDATE appointments
         SET status = ?
         WHERE appointment_id = ?`,
        [status, appointmentId]
    );

    if (result.affectedRows === 0) {
        throw new Error("Appointment not found");
    }

    const [rows] = await pool.query(
        `SELECT
            a.appointment_id,
            a.appointment_date,
            a.appointment_time,
            a.status,
            a.reason,
            p.patient_id,
            pu.name AS patient_name,
            d.doctor_id,
            du.name AS doctor_name,
            d.specialization
         FROM appointments a
         INNER JOIN patients p
             ON a.patient_id = p.patient_id
         INNER JOIN users pu
             ON p.user_id = pu.user_id
         INNER JOIN doctors d
             ON a.doctor_id = d.doctor_id
         INNER JOIN users du
             ON d.user_id = du.user_id
         WHERE a.appointment_id = ?`,
        [appointmentId]
    );

    return rows[0];
};