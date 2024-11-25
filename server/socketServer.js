import connectDB from "./src/config/connectDB.js";
import app from "./server.js";
import http from "http";
const server = http.createServer(app);
import { v4 as uuidv4 } from "uuid";

import { Server } from "socket.io";
import db from "./src/models/index.js";
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
connectDB();
const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});

let users = [];
const addUser = (user, socketId) => {
  !users.some((el) => el.user.id === user.id) && users.push({ user, socketId });
};

const getUser = (currentUser) => {
  return users.find((user) => user.user.id === currentUser.id);
};

const removeUser = (socketId) => {
  users = users.filter((el) => el.socketId !== socketId);
};

io.on("connection", (socket) => {
  console.log("a user connected");
  // take userId and socketId
  socket.on("add_user", (user) => {
    addUser(user, socket.id);
  });

  // send friend request
  socket.on("send_friend_request", (data) => {
    const { receiver, sender, timeSend } = data;
    const receiveUser = getUser(receiver);
    io.to(receiveUser?.socketId).emit("get_friend_request", {
      sender,
      timeSend,
      message: `${sender.lastName} ${sender.firstName} vừa gửi cho bạn lời mời kết bạn`,
    });
  });

  // accept friend request
  socket.on("confirm_friend_request", (data) => {
    const { receiver, sender } = data;
    const receiveUser = getUser(receiver);
    const senderUser = getUser(sender);

    // Accept friend request and notify both users
    io.to(receiveUser?.socketId).emit("friendRequestConfirmed", {
      receiver,
      sender,
      message: `Bạn đã trở thành bạn bè với ${sender.lastName} ${sender.firstName}`,
    });
    io.to(senderUser?.socketId).emit("friendRequestConfirmed", {
      receiver,
      sender,
      message: `Bạn đã trở thành bạn bè với ${receiver.lastName} ${receiver.firstName}`,
    });
  });

  // cancel friend request
  socket.on("cancel_friend_request", (data) => {
    const { receiver, sender } = data;
    const receiveUser = getUser(receiver);
    // Accept friend request and notify both users
    io.to(receiveUser?.socketId).emit("friendRequestCancelled", {
      sender,
    });
  });

  // when disconnect from server socket
  socket.on("disconnect", () => {
    console.log("user disconnected");
    removeUser(socket.id);
  });

  socket.on("start_conversation", async (data) => {
    const { user_id, conversation_name, type_conversation, group_image } = data;
    await db.Conversation.findOrCreate({
      where: {
        user_id,
      },
      defaults: {
        id: uuidv4(),
        user_id,
        conversation_name: `${conversation_name.lastName} ${conversation_name.firstName}`,
        type_conversation,
        group_image,
      },
      raw: true,
    });

    const new_conversation = await db.Conversation.findOne({
      where: {
        user_id,
      },
      raw: true,
    });

    socket.emit("start_chat", { new_conversation });
  });

  socket.on("send_message", async (data) => {
    const { receiver_id, message } = data;
    const to_user = await db.User.findOne({
      where: { id: receiver_id },
      raw: true,
    });
    const receiveUser = getUser(to_user);
    io.to(receiveUser?.socketId).emit("new_message", {
      message,
    });
  });
});
