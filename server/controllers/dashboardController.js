const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User");
const Note = require("../models/Note");

const getStats = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Conversations & Messages
        const totalConversations = await Conversation.countDocuments({ user: userId });
        const userConversations = await Conversation.find({ user: userId }).select("_id").sort({ updatedAt: -1 });
        const conversationIds = userConversations.map(c => c._id);
        const totalMessages = await Message.countDocuments({ conversation: { $in: conversationIds }, role: "assistant" });

        // 2. Notes
        const totalNotes = await Note.countDocuments({ user: userId });

        // 3. Recent Activity (Recent Conversations)
        const recentConversations = await Conversation.find({ user: userId })
            .sort({ updatedAt: -1 })
            .limit(3)
            .select("title updatedAt");
        
        const recentActivity = recentConversations.map(c => ({
            id: c._id,
            type: "Chat",
            title: c.title || "New Chat",
            date: c.updatedAt,
        }));

        // 4. User Stats
        const user = await User.findById(userId);
        
        res.json({
            success: true,
            stats: {
                totalConversations,
                totalMessages,
                totalNotes,
                recentActivity,
            },
        });
    } catch (err) {
        console.error("Dashboard Stats Error:", err);
        res.status(500).json({ success: false, message: "Failed to fetch dashboard stats" });
    }
};

module.exports = {
    getStats,
};