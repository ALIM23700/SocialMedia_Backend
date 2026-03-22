const app = require("../Backend/app");
const dotenv = require("dotenv");
const http = require("http");         
const { Server } = require("socket.io"); 
const mongoose = require("./Models/user.model");

dotenv.config();
const PORT = process.env.PORT || 3000;

const server = http.createServer(app); 

const io = new Server(server, {
  cors: { origin: "*" } 
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("addUser", (userId) => {
    socket.userId = userId;
    console.log("User added:", userId);
  });

  socket.on("sendMessage", async ({ senderId, receiverId, text }) => {
    try {
      const sender = await mongoose.findById(senderId);
      if (!sender.following.includes(receiverId)) {
        return;
      }
      for (let [id, s] of io.of("/").sockets) {
        if (s.userId === receiverId) {
          s.emit("getMessage", { senderId, text });
        }
      }
    } catch (err) {
      console.error(err.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}`);
});