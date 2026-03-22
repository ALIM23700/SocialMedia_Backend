const router6 = require("express").Router();
const { sendMessage, getAllConversations, getMessages } = require("../Controllers/message.controller");

// send a message
router6.post("/message", sendMessage);

// get all conversations for a user
router6.get("/message/conversations/:userId", getAllConversations);

// get messages between two users
router6.get("/message/:sender/:receiver", getMessages);

module.exports = router6;