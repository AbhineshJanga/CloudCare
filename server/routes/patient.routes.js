import express from "express";

import {
    getProfile,
    updateProfile,
    getAvailableDoctors,
    bookAppointment,
    getAppointments,
    cancelPatientAppointment,
    getMedicalRecords,
    getPrescriptions
} from "../controllers/patient.controller.js";

import authenticateToken from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";

const router = express.Router();

router.get(
    "/profile",
    authenticateToken,
    authorizeRoles("PATIENT"),
    getProfile
);

router.put(
    "/profile",
    authenticateToken,
    authorizeRoles("PATIENT"),
    updateProfile
);

router.get(
    "/doctors",
    authenticateToken,
    authorizeRoles("PATIENT"),
    getAvailableDoctors
);

router.post(
    "/appointments",
    authenticateToken,
    authorizeRoles("PATIENT"),
    bookAppointment
);

router.get(
    "/appointments",
    authenticateToken,
    authorizeRoles("PATIENT"),
    getAppointments
);

router.put(
    "/appointments/:id/cancel",
    authenticateToken,
    authorizeRoles("PATIENT"),
    cancelPatientAppointment
);

router.get(
    "/medical-records",
    authenticateToken,
    authorizeRoles("PATIENT"),
    getMedicalRecords
);

router.get(
    "/prescriptions",
    authenticateToken,
    authorizeRoles("PATIENT"),
    getPrescriptions
);

export default router;