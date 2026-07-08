const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['note', 'prompt'], default: 'note' },
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: String }],
    isFavorite: { type: Boolean, default: false },
    sourceConversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);
