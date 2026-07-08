const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },

    content: {
      type: String,
      required: true,
    },
    
    attachments: [
      {
        type: { type: String, enum: ["image", "file", "code"], required: true },
        name: { type: String },
        data: { type: String, required: true },
      }
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Message",
  messageSchema
);