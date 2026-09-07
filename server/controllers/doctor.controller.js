import {
    getDoctorProfile,
    updateDoctorProfile,
    getDoctorAppointments,
    updateAppointmentStatus,
    getDoctorPatients,
    getDoctorPatientById,
    getDoctorMedicalRecords,
    getDoctorPrescriptions,
    createMedicalRecord,
    createPrescription
} from "../services/doctor.service.js";

export const getProfile = async (req, res) => {
    try {
        const profile = await getDoctorProfile(req.user.user_id);

        res.status(200).json({
            success: true,
            message: "Doctor profile retrieved successfully",
            profile
        });
    } catch (error) {
        console.error("Get doctor profile error:", error);

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
            specialization,
            experience
        } = req.body;

        if (!name || !specialization) {
            return res.status(400).json({
                success: false,
                message: "Name and specialization are required"
            });
        }

        const profile = await updateDoctorProfile(
            req.user.user_id,
            {
                name,
                phone,
                specialization,
                experience
            }
        );

        res.status(200).json({
            success: true,
            message: "Doctor profile updated successfully",
            profile
        });
    } catch (error) {
        console.error("Update doctor profile error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update doctor profile"
        });
    }
};
export const getAppointments = async (req, res) => {
    try {
        const appointments = await getDoctorAppointments(
            req.user.user_id
        );

        res.status(200).json({
            success: true,
            message: "Doctor appointments retrieved successfully",
            appointments
        });
    } catch (error) {
        console.error("Get doctor appointments error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve doctor appointments"
        });
    }
};
export const updateStatus = async (req, res) => {
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
            req.user.user_id,
            appointmentId,
            status
        );

        res.status(200).json({
            success: true,
            message: "Appointment status updated successfully",
            appointment
        });
    } catch (error) {
        console.error("Update appointment status error:", error);

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const getPatients = async (req, res) => {
    try {
        const patients = await getDoctorPatients(
            req.user.user_id
        );

        res.status(200).json({
            success: true,
            message: "Doctor patients retrieved successfully",
            patients
        });
    } catch (error) {
        console.error("Get doctor patients error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve patients"
        });
    }
};
export const getPatientById = async (req, res) => {
    try {
        const patientId = Number(req.params.id);

        if (!Number.isInteger(patientId) || patientId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid patient ID"
            });
        }

        const patient = await getDoctorPatientById(
            req.user.user_id,
            patientId
        );

        res.status(200).json({
            success: true,
            message: "Patient details retrieved successfully",
            patient
        });
    } catch (error) {
        console.error("Get patient details error:", error);

        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};
export const getMedicalRecords = async (req, res) => {
    try {
        const records = await getDoctorMedicalRecords(
            req.user.user_id
        );

        res.status(200).json({
            success: true,
            message: "Doctor medical records retrieved successfully",
            records
        });
    } catch (error) {
        console.error("Get doctor medical records error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve medical records"
        });
    }
};
export const getPrescriptions = async (req, res) => {
    try {
        const prescriptions = await getDoctorPrescriptions(
            req.user.user_id
        );

        res.status(200).json({
            success: true,
            message: "Doctor prescriptions retrieved successfully",
            prescriptions
        });
    } catch (error) {
        console.error("Get doctor prescriptions error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve prescriptions"
        });
    }
};
export const addMedicalRecord = async (req, res) => {
    try {
        const {
            patient_id,
            appointment_id,
            record_date,
            diagnosis,
            notes
        } = req.body;

        if (
            !patient_id ||
            !appointment_id ||
            !record_date ||
            !diagnosis
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Patient, appointment, record date and diagnosis are required"
            });
        }

        const patientId = Number(patient_id);
        const appointmentId = Number(appointment_id);

        if (
            !Number.isInteger(patientId) ||
            patientId <= 0 ||
            !Number.isInteger(appointmentId) ||
            appointmentId <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid patient or appointment ID"
            });
        }

        const record = await createMedicalRecord(
            req.user.user_id,
            patientId,
            appointmentId,
            record_date,
            diagnosis,
            notes
        );

        res.status(201).json({
            success: true,
            message: "Medical record created successfully",
            record
        });
    } catch (error) {
        console.error("Create medical record error:", error);

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
export const addPrescription = async (req, res) => {
    try {
        const {
            appointment_id,
            prescription_date,
            medicines,
            instructions
        } = req.body;

        if (
            !appointment_id ||
            !prescription_date ||
            !medicines
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Appointment, prescription date and medicines are required"
            });
        }

        const appointmentId = Number(appointment_id);

        if (!Number.isInteger(appointmentId) || appointmentId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid appointment ID"
            });
        }

        const prescription = await createPrescription(
            req.user.user_id,
            appointmentId,
            prescription_date,
            medicines,
            instructions
        );

        res.status(201).json({
            success: true,
            message: "Prescription created successfully",
            prescription
        });
    } catch (error) {
        console.error("Create prescription error:", error);

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};