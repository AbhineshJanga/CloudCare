import { loginUser } from "../services/auth.service.js";
import generateToken from "../utils/jwt.js";

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const user = await loginUser(email, password);
        const token = generateToken(user);

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user
        });
    } catch (error) {
        console.error("Login error:", error);

        res.status(401).json({
            success: false,
            message: error.message
        });
    }
};