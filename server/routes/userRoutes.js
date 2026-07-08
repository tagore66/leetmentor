const express = require("express");
const protect = require("../middleware/authMiddleware");
const { getProfile, updateSettings, verifyPassword, updatePassword } = require("../controllers/userController");

const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/settings", protect, updateSettings);
router.post("/verify-password", protect, verifyPassword);
router.put("/password", protect, updatePassword);

module.exports = router;
