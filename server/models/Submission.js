const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    status: {
      type: String,
      enum: ["Accepted", "Wrong Answer", "Time Limit Exceeded", "Runtime Error"],
      required: true,
    },
    language: {
      type: String,
      default: "python",
    },
    code: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Submission", submissionSchema);
