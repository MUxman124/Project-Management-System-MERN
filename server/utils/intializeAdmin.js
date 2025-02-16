import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
export const initializeAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("Admin already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash("Super@123", 10);

    const admin = new User({
      name: "Super Admin",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
      // Add the required fields
      jobTitle: "System Administrator",
      phone: "1234567890",
      address: "System Address",
    });

    await admin.save();
    console.log("Admin initialized successfully.");
  } catch (error) {
    console.error("Error initializing admin:", error);
  }
};