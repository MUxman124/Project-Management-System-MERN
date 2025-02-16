import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Task name is required."],
    minlength: [3, "Task name must be at least 3 characters."],
    maxlength: [255, "Task name cannot exceed 255 characters."],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Task description is required."],
    minlength: [3, "Description must be at least 3 characters."],
    maxlength: [1000, "Description cannot exceed 1000 characters."],
    trim: true,
  },
  status: {
    type: String,
    enum: ["not_started", "in_progress", "completed", "on_hold"],
    default: "not_started",
  },
  
  priority: {
    type: String,
    enum: ["Low", "Medium", "High", "Critical"],
    default: "Medium",
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: [true, "A project is required."],
  },
  team: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    validate: {
      validator: function (arr) {
        return arr.length <= 50;
      },
      message: "A project cannot have more than 50 developers.",
    },
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  dueDate: {
    type: Date,
    required: [true, "Due date is required."],
  },

  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  attachments: [
    {
      filename: String,
      url: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

taskSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("Task", taskSchema);
