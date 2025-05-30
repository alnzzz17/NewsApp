require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const verifyToken = async (req, res, next) => {
    try {
        // Check for Authorization header
        const authHeader = req.headers['authorization'] || req.headers['Authorization'];
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                status: "error",
                message: "Unauthorized: No token provided"
            });
        }

        // Extract token
        const token = authHeader.split(' ')[1];
        
        // Verify token
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
        
        // Check if user still exists
        const user = await User.findOne({
            where: { id: decoded.id },
            attributes: ['id', 'userName', 'email', 'profilePict', 'fullName', 'roleId', 'isActive']
        });
        
        if (!user || !user.isActive) {
            return res.status(401).json({
                status: "error",
                message: "Unauthorized: User no longer exists or is inactive"
            });
        }

        // Attach user information to request object
        req.user = {
            id: user.id,
            userName: user.userName,
            email: user.email,
            profilePict: user.profilePict,
            fullName: user.fullName,
            roleId: user.roleId,
            isActive: user.isActive
        };

        next();
    } catch (error) {
        // Handle token errors
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                status: "error",
                message: "Unauthorized: Token expired"
            });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                status: "error",
                message: "Unauthorized: Invalid token"
            });
        }

        console.error("Authentication error:", error);
        res.status(500).json({
            status: "error",
            message: "Internal server error during authentication"
        });
    }
};

module.exports = verifyToken;