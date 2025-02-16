import Project from "../models/Project.js";
import mongoose from "mongoose";
import User from "../models/User.js";
import Task from "../models/Task.js";

export const createProject = async (req, res) => {
  const { name, description, project_manager, team, dates, status, category, tags } = req.body;
  console.log("Received team:", team);

  const teamIds = req.body.team.map((id) => new mongoose.Types.ObjectId(id));
  console.log("Converted teamIds:", teamIds);

  const project = new Project({
    name,
    description,
    project_manager,
    team: teamIds,
    status,
    category,
    startDate: dates[0],
    endDate: dates[1],
    tags,
  });

  const validationError = project.validateSync();
  if (validationError) {
    console.log("Validation error:", validationError);
  }

  const savedProject = await project.save();
  const projectManager = await User.findById(project_manager);
  projectManager.projects.push(savedProject._id);
  await projectManager.save();

  for (let developer of teamIds) {
    // Use teamIds instead of team here
    const user = await User.findById(developer);
    if (!user) {
      console.log("User not found:", developer);
      continue;
    }
    user.projects.push(savedProject._id);
    await user.save();
  }

  res.status(201).json(savedProject);
};

export const getProjects = async (req, res) => {
  const userId = req.user._id;
  const { page = 1, limit = 10, startDate, endDate, team, category, project_manager, status, name } = req.query;
  console.log("Received query parameters:", req.query);
  const filter = {};
  console.log("user id is  == ", userId);

  if (req.user.role === "developer") filter.developers = { $in: [userId] };
  if (startDate && startDate != "undefined") filter.startDate = { $gte: startDate };
  if (project_manager) filter.project_manager = project_manager;
  if (endDate && endDate != "undefined") filter.endDate = { $lte: endDate };
  if (team) {
    const teamArray = Array.isArray(team) ? team : team.split(",").map((id) => id.trim());
    filter.team = { $in: teamArray };
  }
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (name) filter.name = { $regex: name, $options: "i" };

  const projects = await Project.find(filter)
    .populate("project_manager")
    .populate({ path: "team", select: "-password -projects -createdAt -updatedAt -isActive" })
    .populate("tasks")
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const totalProjects = await Project.countDocuments(filter);

  res.status(200).json({
    projects,
    totalPages: Math.ceil(totalProjects / limit),
    currentPage: parseInt(page),
    totalProjects,
  });
};

export const getProject = async (req, res) => {
  const userId = req.user._id;

  const project = await Project.findById(userId).populate("project_manager").populate("developers").populate("tasks");
  res.status(200).json(project);
};

export const updateProject = async (req, res) => {
  const { id } = req.params;
  const { name, description, project_manager, developers, startDate, endDate, tags } = req.body;
  const project = await Project.findByIdAndUpdate(
    id,
    { name, description, project_manager, developers, startDate, endDate, tags },
    { new: true },
  );
  res.status(200).json(project);
};

export const deleteProject = async (req, res) => {
  const { id } = req.params;
  await Project.findByIdAndDelete(id);
  res.status(204).send();
};
