import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const adminAuth = async (req, res, next) => {
  try {
    // Check if Authorization header exists
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ message: "No authorization token provided." });
    }

    // Verify token format
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Invalid token format." });
    }

    const token = authHeader.replace("Bearer ", "");

    // Verify and decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.id) {
      return res.status(401).json({ message: "Invalid token." });
    }

    // Find user and check if they still exist
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ message: "User account is deactivated." });
    }

    // Verify admin role
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid token." });
    }
    console.error("Error in adminAuth middleware:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};