import {
    getAdminDashboardStats,
    getAllUsers,
    getAllDoctors,
    getAllPatients,
    getAllAppointments,
    createUser,
    deleteUser,
    updateUser,
    updateAppointmentStatus
} from "../services/admin.service.js";


export const getDashboardStats = async (req, res) => {
    try {
        const stats = await getAdminDashboardStats();

        res.status(200).json({
            success: true,
            message: "Admin dashboard statistics retrieved successfully",
            stats
        });
    } catch (error) {
        console.error("Get admin dashboard stats error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve dashboard statistics"
        });
    }
};
export const getUsers = async (req, res) => {
    try {
        const users = await getAllUsers();

        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            users
        });
    } catch (error) {
        console.error("Get users error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve users"
        });
    }
};
export const getDoctors = async (req, res) => {
    try {
        const doctors = await getAllDoctors();

        res.status(200).json({
            success: true,
            message: "Doctors retrieved successfully",
            doctors
        });
    } catch (error) {
        console.error("Get doctors error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve doctors"
        });
    }
};
export const getPatients = async (req, res) => {
    try {
        const patients = await getAllPatients();

        res.status(200).json({
            success: true,
            message: "Patients retrieved successfully",
            patients
        });
    } catch (error) {
        console.error("Get patients error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve patients"
        });
    }
};
export const getAppointments = async (req, res) => {
    try {
        const appointments = await getAllAppointments();

        res.status(200).json({
            success: true,
            message: "Appointments retrieved successfully",
            appointments
        });
    } catch (error) {
        console.error("Get appointments error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve appointments"
        });
    }
};
export const addUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            phone,
            role
        } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message:
                    "Name, email, password and role are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must be at least 6 characters"
            });
        }

        const user = await createUser(
            name,
            email,
            password,
            phone,
            role
        );

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user
        });
    } catch (error) {
        console.error("Create user error:", error);

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
export const removeUser = async (req, res) => {
    try {
        const userId = Number(req.params.id);

        if (!Number.isInteger(userId) || userId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        const result = await deleteUser(userId);

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
            result
        });
    } catch (error) {
        console.error("Delete user error:", error);

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
export const editUser = async (req, res) => {
    try {
        const userId = Number(req.params.id);

        const {
            name,
            email,
            phone,
            role
        } = req.body;

        if (!Number.isInteger(userId) || userId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        if (!name || !email || !role) {
            return res.status(400).json({
                success: false,
                message: "Name, email and role are required"
            });
        }

        const user = await updateUser(
            userId,
            name,
            email,
            phone,
            role
        );

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            user
        });
    } catch (error) {
        console.error("Update user error:", error);

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
export const updateAppointmentStatusAdmin = async (req, res) => {
    try {
        const appointmentId = Number(req.params.id);
        const { status } = req.body;

        if (!Number.isInteger(appointmentId) || appointmentId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid appointment ID"
            });
        }

        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Appointment status is required"
            });
        }

        const appointment = await updateAppointmentStatus(
            appointmentId,
            status
        );

        res.status(200).json({
            success: true,
            message: "Appointment status updated successfully",
            appointment
        });
    } catch (error) {
        console.error("Admin update appointment status error:", error);

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};