import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, "Text is required."],
    minlength: [1, "Text must be at least 1 character."],
    maxlength: [255, "Text cannot exceed 255 characters."],
    trim: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "A user is required."],
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: [true, "A task is required."],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
});

export default mongoose.model("Comment", commentSchema);
