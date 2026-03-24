const app = require("../Backend/app");
const dotenv = require("dotenv");
const http = require("http");         
const { Server } = require("socket.io"); 
const User = require("./Models/user.model"); 
const Message = require("./Models/message.model"); 

dotenv.config();
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

const onlineUsers = new Map(); // userId => socket.id

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Add user to online map
  socket.on("addUser", (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.userId = userId;
    console.log("User added:", userId);
  });

  // Listen for sending message
  socket.on("sendMessage", async ({ senderId, receiverId, text }) => {
    try {
      if (!senderId || !receiverId || !text) return;

      // Save message to DB
      const newMessage = await Message.create({
        sender: senderId,
        receiver: receiverId,
        text,
      });

      // Emit message only to **receiver** if online
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", {
          ...newMessage.toObject(),
        });
      }

      // **Do NOT emit back to sender** — the frontend already adds it locally
    } catch (err) {
      console.error("Error sending message:", err.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    if (socket.userId) onlineUsers.delete(socket.userId);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}`);
});