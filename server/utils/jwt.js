import jwt from 'jsonwebtoken';

const generateToken = (user) => {
    return jwt.sign(
        {
            user_id: user.user_id,
            role: user.role,
            email: user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '1d'
        }
    );
};

export default generateToken;