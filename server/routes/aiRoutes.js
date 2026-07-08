const express = require("express");
const protect = require("../middleware/authMiddleware");
const { askAI } = require("../controllers/aiController");

const router = express.Router();

router.post("/ask", protect, askAI);
router.get("/models", protect, (req, res) => {
  const models = require("../config/models");
  res.json({ success: true, models: models.filter(m => m.enabled) });
});

module.exports = router;
