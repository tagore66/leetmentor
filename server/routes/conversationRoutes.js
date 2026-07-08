const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  createConversation,
  getConversations,
  updateConversation,
  deleteConversation,
  searchConversations
} = require("../controllers/conversationController");

const router = express.Router();

router.post("/", protect, createConversation);
router.get("/search", protect, searchConversations);
router.get("/", protect, getConversations);
router.put("/:id", protect, updateConversation);
router.delete("/:id", protect, deleteConversation);

module.exports = router;