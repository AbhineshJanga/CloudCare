import express from 'express';
import cors from 'cors';

const app = express();
 //Middleware
 app.use(cors())
 app.use(express.json())

 //Health chk route
 app.get('/api/health',(req,res) => {
    res.status(200).json({
        success: true,
        message: "CLoudCare api is running"
    })
 })
 export default app;