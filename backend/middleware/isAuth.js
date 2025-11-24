import jwt from "jsonwebtoken"

const isAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        
        if (!token) {
            return res.status(401).json({ message: "Authentication required: No token provided" });
        }

        const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
        
        if (!verifyToken) {
            return res.status(401).json({ message: "Authentication failed: Invalid token" });
        }
        
        req.userId = verifyToken.userId;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Authentication failed: Invalid token" });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Authentication failed: Token expired" });
        }
        console.error('Auth error:', error);
        return res.status(500).json({ message: "Internal server error during authentication" });
    }
};

export default isAuth;