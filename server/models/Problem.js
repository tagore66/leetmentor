const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    titleSlug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    topicTags: [
      {
        type: String,
      },
    ],
    companies: [
      {
        type: String,
      },
    ],
    acceptanceRate: {
      type: Number,
      default: 0,
    },
    order: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Problem", problemSchema);
