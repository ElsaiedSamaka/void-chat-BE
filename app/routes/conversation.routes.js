const express = require("express");
const router = express.Router();
const conversationController = require("../controllers/conversation.controller");
const { checkUser } = require("../middleware");
// Get List of conversation
router.get("/", [checkUser.getCurrentUser], conversationController.getConversations);
// Create conversation
router.post("/",[checkUser.getCurrentUser], conversationController.createConversation)
// get conversation
router.get(":id",conversationController.getConversation)

module.exports = router;
