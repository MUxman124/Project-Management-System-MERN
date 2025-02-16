import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Project name is required."],
    minlength: [3, "Project name must be at least 3 characters."],
    maxlength: [255, "Project name cannot exceed 255 characters."],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Project description is required."],
    minlength: [3, "Description must be at least 3 characters."],
    maxlength: [1000, "Description cannot exceed 1000 characters."],
    trim: true,
  },
  status: {
    type: String,
    enum: ["not_started", "in_progress", "completed", "on_hold"],
    default: "not_started",
  },
  project_manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "A project manager is required."],
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
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
  startDate: {
    type: Date,
    required: [true, "Start date is required."],
  },
  endDate: {
    type: Date,
    validate: {
      validator: function (value) {
        return !this.startDate || value > this.startDate;
      },
      message: "End date must be after the start date.",
    },
  },
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  category: {
    type: String,
    enum: ["web", "mobile", "desktop", "other"],
    required: [true, "Category is required."],
  },
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

// function arrayLimit(val) {
//   return val.length <= 50;
// }

projectSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("Project", projectSchema);
