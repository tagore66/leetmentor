const User = require("../models/User");
const bcrypt = require("bcrypt");

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching profile" });
  }
};

const updateSettings = async (req, res) => {
  try {
    const { settings } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { settings } },
      { new: true }
    ).select("-password");
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating settings" });
  }
};

const verifyPassword = async (req, res) => {
  try {
    const { currentPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user || user.provider !== "local") {
      return res.status(400).json({ success: false, message: "Invalid request" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Incorrect current password" });
    }

    res.json({ success: true, message: "Password verified" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error verifying password" });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.provider !== "local") {
      return res.status(400).json({ success: false, message: "Cannot change password for OAuth accounts" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Incorrect current password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating password" });
  }
};

module.exports = {
  getProfile,
  updateSettings,
  verifyPassword,
  updatePassword,
};
