import Task from "../models/Task.js";
import Project from "../models/Project.js";
import User from "../models/User.js";
import mongoose from "mongoose";

export const addTask = async (req, res) => {
  const { name, description, status, priority, project, team, comments, dueDate, tags, attachments } = req.body;

  console.log("name:", name);
  console.log("description:", description);
  console.log("status:", status);
  console.log("priority:", priority);
  console.log("project:", project);
  console.log("team:", team);
  console.log("comments:", comments);
  console.log("dueDate:", dueDate);
  console.log("tags:", tags);
  console.log("attachments:", attachments);

  console.log("Task Schema Status Enum:", Task.schema.path("status").enumValues);
  const task = new Task({
    name,
    description,
    status,
    priority,
    project,
    team,
    comments,
    dueDate,
    tags,
    attachments,
  });
  const savedTask = await task.save();
  const projectToUpdate = await Project.findById(project);
  projectToUpdate.tasks.push(savedTask._id);
  await projectToUpdate.save();
  for (const developer of team) {
    const user = await User.findById(developer);
    user.tasks.push(savedTask._id);
    await user.save();
  }
  res.status(201).json(savedTask);
};

export const getTasks = async (req, res) => {
  const { id } = req.params;
  const { page = 1, limit = 10, dueDate, team, status, name } = req.query;

  const filter = { project: new mongoose.Types.ObjectId(id) };

  if (dueDate && dueDate !== "undefined") filter.dueDate = { $gte: new Date(dueDate) };
  if (team) filter.team = { $in: team.split(",") };
  if (status) filter.status = status;
  if (name) filter.name = { $regex: name, $options: "i" };

  const tasks = await Task.find(filter)
    .populate("project")
    .populate({
      path: "team",
      select: "-password -email -projects -role -createdAt -updatedAt -__v",
    })
    .populate({
      path: "comments",
      populate: {
        path: "user",
      },
    })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const totalTasks = await Task.countDocuments(filter);

  res.status(200).json({
    tasks,
    totalPages: Math.ceil(totalTasks / limit),
    currentPage: parseInt(page),
    totalTasks,
  });
};

export const getTask = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findById(id).populate("project").populate("developer").populate("comments");
  res.status(200).json(task);
};

export const getAllTasks = async (req, res) => {
  const tasks = await Task.find().populate({
    path: "team",
    select: "-password -email -projects -role -createdAt -updatedAt -__v",
  });
  res.status(200).json(tasks);
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { name, description, status, priority, project, developer, comments, startDate, endDate, tags, attachments } =
    req.body;
  const task = await Task.findByIdAndUpdate(
    id,
    { name, description, status, priority, project, developer, comments, startDate, endDate, tags, attachments },
    { new: true },
  );
  res.status(200).json(task);
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findByIdAndDelete(id);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }
  const project = await Project.findById(task.project);
  if (project) {
    project.tasks.pull(task._id);
    await project.save();
  }
  for (const developer of task.team) {
    const user = await User.findById(developer);
    if (user) {
      user.tasks.pull(task._id);
      await user.save();
    }
  }
  res.status(200).json({ message: "Task deleted successfully" });
};
