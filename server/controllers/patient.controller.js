import {
    getPatientProfile,
    updatePatientProfile,
    getDoctors,
    createAppointment,
    getPatientAppointments,
    cancelAppointment,
    getPatientMedicalRecords,
    getPatientPrescriptions
} from "../services/patient.service.js";

export const getProfile = async (req, res) => {
    try {
        const profile = await getPatientProfile(req.user.user_id);

        res.status(200).json({
            success: true,
            message: "Patient profile retrieved successfully",
            profile
        });
    } catch (error) {
        console.error("Get patient profile error:", error);

        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const {
            name,
            phone,
            date_of_birth,
            gender,
            address
        } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Name is required"
            });
        }

        const profile = await updatePatientProfile(
            req.user.user_id,
            {
                name,
                phone,
                date_of_birth,
                gender,
                address
            }
        );

        res.status(200).json({
            success: true,
            message: "Patient profile updated successfully",
            profile
        });
    } catch (error) {
        console.error("Update patient profile error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update patient profile"
        });
    }
};

export const getAvailableDoctors = async (req, res) => {
    try {
        const doctors = await getDoctors();

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

export const bookAppointment = async (req, res) => {
    try {
        const {
            doctor_id,
            appointment_date,
            appointment_time,
            reason
        } = req.body;

        if (
            !doctor_id ||
            !appointment_date ||
            !appointment_time
        ) {
            return res.status(400).json({
                success: false,
                message: "Doctor, date and time are required"
            });
        }

        const appointment = await createAppointment(
            req.user.user_id,
            doctor_id,
            appointment_date,
            appointment_time,
            reason
        );

        res.status(201).json({
            success: true,
            message: "Appointment booked successfully",
            appointment
        });
    } catch (error) {
        console.error("Book appointment error:", error);

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
export const getAppointments = async (req, res) => {
    try {
        const appointments = await getPatientAppointments(
            req.user.user_id
        );

        res.status(200).json({
            success: true,
            message: "Appointments retrieved successfully",
            appointments
        });
    } catch (error) {
        console.error("Get patient appointments error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve appointments"
        });
    }
};

export const cancelPatientAppointment = async (req, res) => {
    try {
        const appointmentId = Number(req.params.id);

        if (!Number.isInteger(appointmentId) || appointmentId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid appointment ID"
            });
        }

        const appointment = await cancelAppointment(
            req.user.user_id,
            appointmentId
        );

        res.status(200).json({
            success: true,
            message: "Appointment cancelled successfully",
            appointment
        });
    } catch (error) {
        console.error("Cancel appointment error:", error);

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
export const getMedicalRecords = async (req, res) => {
    try {
        const records = await getPatientMedicalRecords(
            req.user.user_id
        );

        res.status(200).json({
            success: true,
            message: "Medical records retrieved successfully",
            records
        });
    } catch (error) {
        console.error("Get medical records error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve medical records"
        });
    }
};
export const getPrescriptions = async (req, res) => {
    try {
        const prescriptions = await getPatientPrescriptions(
            req.user.user_id
        );

        res.status(200).json({
            success: true,
            message: "Prescriptions retrieved successfully",
            prescriptions
        });
    } catch (error) {
        console.error("Get prescriptions error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve prescriptions"
        });
    }
};