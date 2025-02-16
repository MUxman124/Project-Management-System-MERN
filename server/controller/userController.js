import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import logger from "../config/logger.js";

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  let userr = await findUserByEmail(email);
  if (userr) {
    return res.status(400).json({ message: "User already exists." });
  }
  const user = new User({
    username,
    email,
    password: bcrypt.hashSync(password, 10),
  });
  const savedUser = await user.save();
  res.status(201).json(savedUser);
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not found." });
  }
  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(400).json({ message: "Invalid credentials." });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.status(200).json({ token });
};

export const getUsers = async (req, res) => {
  const { searchQuery, role, page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const query = {};
  if (searchQuery) {
    query.name = { $regex: searchQuery, $options: "i" };
  }
  if (role) {
    query.role = role;
  }

  const [users, total] = await Promise.all([
    User.find(query).select("-password -__v -createdAt -updatedAt -projects").skip(skip).limit(Number(limit)).lean(),
    User.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  logger.info({
    message: "Users retrieved successfully",
    searchQuery,
    role,
    page,
    total,
  });

  return res.status(200).json({
    data: users,
    pagination: {
      currentPage: Number(page),
      totalPages,
      totalUsers: total,
      hasNext,
      hasPrev,
      limit: Number(limit),
    },
  });
};

export const addUser = async (req, res) => {
  const { name, email, password, isActive, phone, address, bio, role, jobTitle } = req.body;
  const profilePicture = req.file ? req.file.path : null;
  const user = new User({
    name,
    email,
    password,
    role,
    profilePicture,
    isActive,
    phone,
    address,
    bio,
    role,
    jobTitle,
  });
  const hashedPassword = bcrypt.hashSync(password, 10);
  user.password = hashedPassword;
  const savedUser = await user.save();
  res.status(201).json(savedUser);
};

export const updateUserStatus = async (req, res) => {
  const { id } = req.params;
  console.log("ID received:", id);
  console.log("Update body received:", req.body);

  const updates = { isActive: req.body.isActive };
  console.log("Updates to be applied:", updates);

  const user = await User.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true });

  console.log("Updated user:", user);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({ success: true, message: "The status updated successfully" });
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const user = await User.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({ success: true, message: "User updated" });
};

export const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password -__v -createdAt -updatedAt -projects");
  res.status(200).json(user);
};
