const Message = require("../models/Message");

const saveMessage = async (conversationId, role, content, attachments = []) => {
  return await Message.create({
    conversation: conversationId,
    role,
    content,
    attachments
  });
};

const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      conversation: req.params.id,
    }).sort({ createdAt: 1 });

    res.json({
      success: true,
      messages,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  saveMessage,
  getMessages,
};