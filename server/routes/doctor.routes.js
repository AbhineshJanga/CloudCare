import express from "express";

import {
    getProfile,
    updateProfile,
    getAppointments,
    updateStatus,
    getPatients,
    getPatientById,
    getMedicalRecords,
    getPrescriptions,
    addMedicalRecord,
    addPrescription
} from "../controllers/doctor.controller.js";

import authenticateToken from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";

const router = express.Router();

router.get(
    "/profile",
    authenticateToken,
    authorizeRoles("DOCTOR"),
    getProfile
);

router.put(
    "/profile",
    authenticateToken,
    authorizeRoles("DOCTOR"),
    updateProfile
);
router.get(
    "/appointments",
    authenticateToken,
    authorizeRoles("DOCTOR"),
    getAppointments
);

router.put(
    "/appointments/:id/status",
    authenticateToken,
    authorizeRoles("DOCTOR"),
    updateStatus
);

router.get(
    "/patients",
    authenticateToken,
    authorizeRoles("DOCTOR"),
    getPatients
);

router.get(
    "/patients/:id",
    authenticateToken,
    authorizeRoles("DOCTOR"),
    getPatientById
);

router.get(
    "/medical-records",
    authenticateToken,
    authorizeRoles("DOCTOR"),
    getMedicalRecords
);

router.get(
    "/prescriptions",
    authenticateToken,
    authorizeRoles("DOCTOR"),
    getPrescriptions
);

router.post(
    "/medical-records",
    authenticateToken,
    authorizeRoles("DOCTOR"),
    addMedicalRecord
);

router.post(
    "/prescriptions",
    authenticateToken,
    authorizeRoles("DOCTOR"),
    addPrescription
);

export default router;