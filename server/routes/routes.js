import express from "express";
import {
  register,
  login,
  getUsers,
  addUser,
  updateUserStatus,
  updateUser,
  getCurrentUser,
} from "../controller/userController.js";
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
} from "../controller/projectController.js";
import { addTask, getTasks, getTask, updateTask, deleteTask, getAllTasks } from "../controller/taskController.js";
import { createComment, getComments, updateComment, deleteComment } from "../controller/commentController.js";
import { dashboardData } from "../controller/dashboardController.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { auth } from "../middleware/auth.js";
const router = express.Router();
import { asyncHandler } from "../utils/asyncHandler.js";
import { upload } from "../middleware/fileUpload.js";

// Public routes (no auth required)
router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));

router.get("/dashboard", adminAuth, asyncHandler(dashboardData));

// User management routes (admin only)
router.get("/users", auth, asyncHandler(getUsers));
router.post("/add-user", adminAuth, upload.single("profilePicture"), asyncHandler(addUser));
router.put("/update-status/:id", adminAuth, asyncHandler(updateUserStatus));
router.put("/update-user/:id", adminAuth, asyncHandler(updateUser));

// User profile route (authenticated user)
router.get("/me", auth, asyncHandler(getCurrentUser));

// Project routes
router.post("/add-project", adminAuth, asyncHandler(createProject));
router.get("/projects", auth, asyncHandler(getProjects));
router.get("/projects/:id", auth, asyncHandler(getProject));
router.put("/projects/:id", adminAuth, asyncHandler(updateProject));
router.delete("/projects/:id", adminAuth, asyncHandler(deleteProject));

// Task routes
router.post("/add-task", auth, asyncHandler(addTask));
router.get("/tasks/:id", auth, asyncHandler(getTasks));
router.get("/task/:id", auth, asyncHandler(getTask));
router.get("/all-tasks", adminAuth, asyncHandler(getAllTasks));
router.post("/tasks/:id", auth, asyncHandler(updateTask));
router.delete("/delete-task/:id", adminAuth, asyncHandler(deleteTask));

// Comment routes
router.post("/add-comment", auth, asyncHandler(createComment));
router.get("/comments", auth, asyncHandler(getComments));
router.put("/comments/:id", auth, asyncHandler(updateComment));
router.delete("/delete-comment/:id", auth, asyncHandler(deleteComment));

export default router;
