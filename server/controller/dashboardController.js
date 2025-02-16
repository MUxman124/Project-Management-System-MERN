import Project from "../models/Project.js";
import Task from "../models/Task.js";
import User from "../models/User.js";

export const dashboardData = async (req, res) => {
  const projects = await Project.find().countDocuments();
  const tasks = await Task.find().countDocuments();
  const completedTasks = await Task.find({ status: "Completed" }).countDocuments();
  const inProgressTasks = await Task.find({ status: "In Progress" }).countDocuments();
  const overdueTasks = await Task.find({ status: "On Hold" }).countDocuments();
  const developers = await User.find({ role: "developer" }).countDocuments();
  const tasksToShow = await Task.find().limit(5).select("-attachments -comments -tags").populate("team").sort({ createdAt: -1 });

  res.status(200).json({
    projects,
    tasks,
    completedTasks,
    inProgressTasks,
    overdueTasks,
    developers,
    tasksToShow,
  });
};
