const Conversation = require("../models/Conversation");

const createConversation = async (req, res) => {
  try {

    const conversation =
      await Conversation.create({
        user: req.user.id,
      });

    res.json({
      success: true,
      conversation,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
    });

  }
};

const getConversations = async (req, res) => {

  const conversations =
    await Conversation.find({
      user: req.user.id,
    }).sort({
      isPinned: -1,
      updatedAt: -1,
    });

  res.json({
    success: true,
    conversations,
  });
};

const updateConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, isPinned } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (isPinned !== undefined) updateData.isPinned = isPinned;

    const conversation = await Conversation.findOneAndUpdate(
      { _id: id, user: req.user.id },
      updateData,
      { new: true }
    );

    res.json({ success: true, conversation });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

const deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const Message = require("../models/Message");

    await Conversation.findOneAndDelete({ _id: id, user: req.user.id });
    await Message.deleteMany({ conversation: id });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

const searchConversations = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json({ success: true, conversations: [] });

    const Message = require("../models/Message");

    const messages = await Message.find({
      content: { $regex: q, $options: "i" }
    }).select("conversation");
    const matchedConversationIds = messages.map(m => m.conversation);

    const conversations = await Conversation.find({
      user: req.user.id,
      $or: [
        { title: { $regex: q, $options: "i" } },
        { _id: { $in: matchedConversationIds } }
      ]
    }).sort({ updatedAt: -1 });

    res.json({ success: true, conversations });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

module.exports = {
  createConversation,
  getConversations,
  updateConversation,
  deleteConversation,
  searchConversations
};