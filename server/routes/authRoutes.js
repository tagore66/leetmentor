const express = require("express");

const {
    register,
    login,
    profile,
    googleAuth
} = require("../controllers/authController");

const router = express.Router();
const protect = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleAuth);
router.get("/profile", protect, profile);
module.exports = router;