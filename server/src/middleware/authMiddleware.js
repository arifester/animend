const jwt = require('jsonwebtoken');

/**
 * Middleware to verify JWT token
 * Protects private routes from unauthorized access
 */
const verifyToken = (req, res, next) => {
    // Get token from the 'Authorization' header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        // Verify token using our secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach user data from token payload to the request object
        req.userId = decoded.userId;
        req.userEmail = decoded.email;
        
        // Move to the next function (the controller)
        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid or expired token." });
    }
};

module.exports = verifyToken;
