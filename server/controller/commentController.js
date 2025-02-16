import Comments from "../models/Comments.js";
import Task from "../models/Task.js";

export const createComment = async (req, res) => {
  console.log("Received comment:", req.user);
  const userId = req.user._id;
  const { text, id } = req.body;
  console.log("Received text:", text, id);
  const comment = new Comments({
    text,
    user: userId,
    task: id,
  });
  const savedComment = await comment.save();
  const taskToUpdate = await Task.findById(id);
  taskToUpdate.comments.push(savedComment._id);
  await taskToUpdate.save();
  res.status(201).json(savedComment);
};

export const getComments = async (req, res) => {
  const comments = await Comments.find().populate("user").populate("task");
  res.status(200).json(comments);
};

export const getComment = async (req, res) => {
  const { id } = req.params;
  const comment = await Comments.findById(id).populate("user").populate("task");
  res.status(200).json(comment);
};

export const updateComment = async (req, res) => {
  const { id } = req.params;
  const { text, user, task } = req.body;
  const comment = await Comments.findByIdAndUpdate(id, { text, user, task }, { new: true });
  res.status(200).json(comment);
};

export const deleteComment = async (req, res) => {
  const { id } = req.params;
  await Comments.findByIdAndDelete(id);
  res.status(204).send();
};
