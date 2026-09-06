import pool from "../config/database.js";
import bcrypt from "bcryptjs";

export const loginUser = async (email, password) => {
    const [rows] = await pool.query(
        `SELECT user_id, name, email, password_hash, phone, role
         FROM users
         WHERE email = ?`,
        [email]
    );

    if (rows.length === 0) {
        throw new Error("Invalid email or password");
    }

    const user = rows[0];

    const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash
    );

    if (!isPasswordValid) {
        throw new Error("Invalid email or password");
    }

    return {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
    };
};