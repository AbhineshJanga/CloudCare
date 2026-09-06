import express from "express";
import { login } from "../controllers/auth.controller.js";

const router = express.Router();

// Public login route
router.post("/login", login);

export default router;