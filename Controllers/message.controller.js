const Message = require("../Models/message.model");
const User = require("../Models/user.model");

// send a message
const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, text } = req.body;
    if (!senderId || !receiverId || !text) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const newMessage = await Message.create({ sender: senderId, receiver: receiverId, text });
    res.status(201).json({ success: true, message: newMessage });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// get all conversations for a user (like inbox)
const getAllConversations = async (req, res) => {
  try {
    const { userId } = req.params;

    // get unique userIds that have sent or received messages with this user
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }]
    }).sort({ createdAt: -1 });

    const userIds = [...new Set(messages.flatMap(msg => [msg.sender.toString(), msg.receiver.toString()]))]
      .filter(id => id !== userId);

    // fetch user info and last message
    const conversations = await Promise.all(userIds.map(async (id) => {
      const user = await User.findById(id);
      const lastMessage = messages.find(msg => (msg.sender.toString() === id || msg.receiver.toString() === id));
      return {
        _id: id,
        username: user.username,
        profileImage: user.profileImage,
        lastMessage: lastMessage || null
      };
    }));

    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// get all messages between two users
const getMessages = async (req, res) => {
  try {
    const { sender, receiver } = req.params;
    const messages = await Message.find({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender }
      ]
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { sendMessage, getAllConversations, getMessages };