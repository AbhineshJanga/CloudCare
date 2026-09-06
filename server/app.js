import express from 'express';
import cors from 'cors';
import pool from "./config/database.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();
 //Middleware
 app.use(cors())
 app.use(express.json())

 app.use("/api/auth", authRoutes);
 //Health chk route
 app.get('/api/health',(req,res) => {
    res.status(200).json({
        success: true,
        message: "CLoudCare api is running"
    })
 })
 // Database health check
app.get("/api/health/db", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT 1 AS database_connected");

        res.status(200).json({
            success: true,
            message: "CloudCare database is connected",
            result: rows[0]
        });
    } catch (error) {
        console.error("Database connection error:", error);

        res.status(500).json({
            success: false,
            message: "Database connection failed"
        });
    }
});
 export default app;