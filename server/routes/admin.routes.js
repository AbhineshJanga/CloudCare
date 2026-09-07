import express from "express";

import {
    getDashboardStats,
    getUsers,
    getDoctors,
    getPatients,
    getAppointments,
    addUser,
    removeUser,
    editUser,
    updateAppointmentStatusAdmin
} from "../controllers/admin.controller.js";

import authenticateToken from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";

const router = express.Router();

router.get(
    "/dashboard",
    authenticateToken,
    authorizeRoles("ADMIN"),
    getDashboardStats
);
router.get(
    "/users",
    authenticateToken,
    authorizeRoles("ADMIN"),
    getUsers
);

router.get(
    "/doctors",
    authenticateToken,
    authorizeRoles("ADMIN"),
    getDoctors
);

router.get(
    "/patients",
    authenticateToken,
    authorizeRoles("ADMIN"),
    getPatients
);

router.get(
    "/appointments",
    authenticateToken,
    authorizeRoles("ADMIN"),
    getAppointments
);

router.post(
    "/users",
    authenticateToken,
    authorizeRoles("ADMIN"),
    addUser
);
router.delete(
    "/users/:id",
    authenticateToken,
    authorizeRoles("ADMIN"),
    removeUser
);

router.put(
    "/users/:id",
    authenticateToken,
    authorizeRoles("ADMIN"),
    editUser
);

router.put(
    "/appointments/:id/status",
    authenticateToken,
    authorizeRoles("ADMIN"),
    updateAppointmentStatusAdmin
);

export default router;