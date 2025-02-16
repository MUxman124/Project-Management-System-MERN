import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const auth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token missing or malformed." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: "Invalid or expired token." });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User associated with this token no longer exists." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    return res.status(401).json({ message: "Authentication failed.", error: error.message });
  }
};

