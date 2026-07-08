const Notification = require("../models/Notification");

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, notifications });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { read: true },
      { new: true }
    );
    res.json({ success: true, notification });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

module.exports = { getNotifications, markAsRead };
