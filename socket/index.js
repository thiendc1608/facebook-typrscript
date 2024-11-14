import { Server } from "socket.io";

const io = new Server(5000, {
  cors: {
    origin: "http://localhost:3000",
  },
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
});
