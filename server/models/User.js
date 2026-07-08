const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      default: null,
    },

    profilePicture: {
      type: String,
      default: "",
    },

    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    settings: {
      extensionEnabled: { type: Boolean, default: true },
      defaultAIModel: { type: String, default: "deepseek/deepseek-chat-v3-0324" },
      hintBehavior: { type: String, enum: ["auto", "manual"], default: "manual" },
      autoDetectProblem: { type: Boolean, default: true },
      keyboardShortcuts: { type: Boolean, default: true },
      theme: { type: String, enum: ["light", "dark", "system"], default: "system" },
      privacyMode: { type: Boolean, default: false },
      streaming: { type: Boolean, default: true },
      markdown: { type: Boolean, default: true },
      codeHighlighting: { type: Boolean, default: true }
    },

    usage: {
      totalRequests: { type: Number, default: 0 },
      todayRequests: { type: Number, default: 0 },
      todayDate: { type: Date, default: Date.now },
      problemsDiscussed: { type: Number, default: 0 },
      debugSessions: { type: Number, default: 0 },
      mockInterviews: { type: Number, default: 0 },
      totalMessages: { type: Number, default: 0 },
      totalConversations: { type: Number, default: 0 }
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);