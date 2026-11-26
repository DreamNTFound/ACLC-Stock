const express = require("express");
const router = express.Router();
const { chatbot } = require("../controllers/geminiAIController");
const authenticate = require("../middleware/authMiddleware");

router.post("/", authenticate, chatbot);

module.exports = router;