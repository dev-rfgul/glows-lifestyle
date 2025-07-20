import jwt from 'jsonwebtoken';

const verifyAdmin = (req, res, next) => {
    try {
        // Support both Cookie & Authorization Header
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

        console.log("🟡 All Cookies:", req.cookies);
        console.log("🔹 Token received:", token); 

        if (!token) {
            console.log("⛔ No token found! Unauthorized access.");
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Check if JWT_SECRET is properly loaded
        if (!process.env.JWT_SECRET) {
            console.log("⛔ JWT_SECRET not found in environment variables!");
            return res.status(500).json({ message: "Server configuration error" });
        }

        console.log("🔑 JWT_SECRET exists:", !!process.env.JWT_SECRET);
        console.log("🔑 JWT_SECRET length:", process.env.JWT_SECRET?.length);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Decoded Token:", decoded);

        if (decoded.role !== "admin") {
            console.log(`⛔ User "${decoded.email}" is not an admin. Access Denied!`);
            return res.status(403).json({ message: "Forbidden" });
        }

        req.user = decoded;
        console.log(`✅ Admin "${decoded.email}" verified successfully!`);
        next();
    } catch (err) {
        console.log("⛔ JWT Verification Error:", err.message);
        console.log("⛔ Error Type:", err.name);
        
        if (err.name === 'JsonWebTokenError') {
            console.log("🚨 This usually means JWT_SECRET mismatch!");
        } else if (err.name === 'TokenExpiredError') {
            console.log("🚨 Token has expired!");
        }
        
        res.status(401).json({ message: "Invalid token", error: err.message });
    }
};

export default verifyAdmin;
