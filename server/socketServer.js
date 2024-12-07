import connectDB from "./src/config/connectDB.js";
import app from "./server.js";
import http from "http";
const server = http.createServer(app);
import { v4 as uuidv4 } from "uuid";

import { Server } from "socket.io";
import db from "./src/models/index.js";
import { Op, Sequelize } from "sequelize";
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
    const {
      sender_id,
      receiver_id,
      conversation_name,
      type_conversation,
      group_image,
    } = data;

    const userIds = [sender_id, receiver_id];
    let values = [];
    if (type_conversation === "private") {
      // Kiểm tra xem cuộc trò chuyện cá nhân giữa 2 người đã tồn tại chưa
      const existingConversation = await db.Conversation.findAll({
        subQuery: false,
        where: {
          type_conversation: "private",
        },
        include: {
          model: db.Member,
          as: "members",
          where: {
            user_id: {
              [Op.in]: userIds, // Kiểm tra các người dùng đã có cuộc trò chuyện cá nhân với nhau chưa
            },
          },
          required: true, // Đảm bảo rằng cuộc trò chuyện phải có ít nhất 2 người tham gia
          attributes: [], // Không cần lấy thuộc tính của member, chỉ cần kiểm tra sự tồn tại
        },
        group: ["Conversation.id"], // Đảm bảo tìm kiếm theo từng cuộc trò chuyện
        having: Sequelize.literal(
          `COUNT(DISTINCT Members.user_id) = ${userIds.length}`
        ), // Đảm bảo rằng có đúng 2 người tham gia vào cuộc trò chuyện
        raw: true,
      });
      values = existingConversation;
    } else if (type === "group") {
      // Kiểm tra xem tên nhóm có tồn tại chưa
      const existingGroupConversation = await Conversation.findOne({
        where: {
          type: "group",
          conversation_name,
        },
      });

      if (existingGroupConversation) {
        return res.status(400).json({
          message: "A group conversation with this name already exists.",
          conversation: existingGroupConversation,
        });
      }
    }

    let conversationId = uuidv4();
    if (values.length === 0) {
      await db.Conversation.create({
        id: conversationId,
        conversation_name,
        type_conversation,
        group_image,
      });

      const members = userIds.map((userId) => ({
        conversation_id: conversationId,
        user_id: userId,
        joined_at: new Date(),
      }));
      await db.Member.bulkCreate(members);
    }

    const newConversationId = values.length > 0 ? values[0].id : conversationId;
    const info_conversation = await db.Conversation.findAll({
      where: {
        id: newConversationId,
      },
      include: [
        {
          model: db.Member,
          as: "members",
          attributes: ["user_id", "joined_at"], // Chọn các cột bạn muốn lấy từ bảng members
          include: [
            {
              model: db.User,
              attributes: ["firstName", "lastName", "avatar"],
              as: "user",
            },
          ],
        },
      ],
      attributes: { exclude: ["type_conversation", "createdAt", "updatedAt"] },
      raw: true,
      nest: true,
    });

    const new_conversation = info_conversation.find(
      (elm) => elm.members.user_id !== sender_id
    );

    socket.emit("start_chat", { new_conversation });
  });

  socket.on("send_message", async (data) => {
    const { receiver_id, message, timeMessage } = data;
    const to_user = await db.User.findOne({
      where: { id: receiver_id },
      raw: true,
    });
    const from_user = await db.User.findOne({
      where: { id: message.sender_id },
      raw: true,
    });
    const receiveUser = getUser(to_user);
    const senderUser = getUser(from_user);

    let infoReplyMessage = {};
    let imageList = [];
    if (message.reply_text_id) {
      infoReplyMessage = await db.Message.findOne({
        where: { id: message.reply_text_id },
        attributes: ["sender_id", "message"],
        include: [
          {
            model: db.User,
            attributes: ["firstName", "lastName", "avatar"],
            as: "senderInfo",
          },
        ],
        raw: true,
        nest: true,
      });
      const findImage = await db.Message.findOne({
        where: {
          image_id: message.image_id,
        },
        include: [
          {
            model: db.Image,
            attributes: ["message_image"],
            as: "imageInfo",
          },
        ],
        raw: true,
        nest: true,
      });
      imageList = findImage.imageInfo.message_image;
    }

    const newMessage = {
      ...message,
      info_reply: infoReplyMessage,
      imageInfo: {
        message_image: imageList,
      },
      senderInfo: {
        firstName: from_user.firstName,
        lastName: from_user.lastName,
        avatar: from_user.avatar,
      },
    };
    io.to(receiveUser?.socketId).emit("new_message", {
      message: newMessage,
      timeMessage,
    });
    io.to(senderUser?.socketId).emit("new_message", {
      message: newMessage,
      timeMessage,
    });
  });

  socket.on("send_react_message", async (data) => {
    const { message_id, emoji_dropper_id, emoji_icon } = data;
    // Tìm thông tin người nhận và người gửi từ DB
    const existingReaction = await db.MessageReact.findOne({
      where: {
        message_id,
        emoji_dropper_id,
      },
      raw: true,
    });

    let filteredReactionData = {};
    if (!existingReaction) {
      await db.MessageReact.create({
        message_id,
        emoji_dropper_id,
        emoji_icon,
      });
      filteredReactionData.message = "Create react message successfully";
    } else {
      if (existingReaction.emoji_icon !== emoji_icon) {
        await db.MessageReact.update(
          {
            emoji_icon,
          },
          {
            where: {
              message_id,
              emoji_dropper_id,
            },
          }
        );
        filteredReactionData.message = "Update react message successfully";
      } else {
        if (
          existingReaction.message_id === message_id &&
          existingReaction.emoji_dropper_id === emoji_dropper_id &&
          existingReaction.emoji_icon === emoji_icon
        ) {
          await db.MessageReact.destroy({
            where: {
              message_id,
              emoji_dropper_id,
              emoji_icon,
            },
          });
          filteredReactionData.message = "Delete react message successfully";
        }
      }
    }

    const to_user = await db.User.findOne({
      where: { id: data.receiver_id },
      raw: true,
    });
    const from_user = await db.User.findOne({
      where: { id: data.emoji_dropper_id },
      raw: true,
    });

    // Lấy socketId của người nhận và người gửi
    const receiveUser = getUser(to_user);
    const senderUser = getUser(from_user);

    // Phát sự kiện tới người nhận
    if (receiveUser?.socketId) {
      io.to(receiveUser.socketId).emit("new_react_message", {
        data: { message_id, emoji_dropper_id, emoji_icon },
        filteredReactionData,
      });
    }

    if (senderUser?.socketId && senderUser.socketId !== receiveUser?.socketId) {
      io.to(senderUser.socketId).emit("new_react_message", {
        data: { message_id, emoji_dropper_id, emoji_icon },
        filteredReactionData,
      });
    }
  });

  socket.on("remove_message", async (data) => {
    let removeMessageList = [];
    if (data.el.message !== "Bạn đã thu hồi một tin nhắn") {
      const [affectedCount] = await db.Message.update(
        {
          message: "Bạn đã thu hồi một tin nhắn",
        },
        { where: { id: data.el.id } }
      );
      if (affectedCount > 0) {
        const removeMessage = await db.Message.findOne({
          where: { id: data.el.id },
          raw: true,
        });

        const listMessageReply = await db.Message.findAll({
          where: { reply_text_id: data.el.id },
          include: [
            {
              model: db.User,
              attributes: ["firstName", "lastName", "avatar"],
              as: "senderInfo",
            },
          ],
          raw: true,
          nest: true,
        });

        listMessageReply.forEach((el) => {
          el.info_reply = {
            sender_id: el.sender_id,
            message: "Bạn đã thu hồi một tin nhắn",
            senderInfo: {
              firstName: el.senderInfo?.firstName,
              lastName: el.senderInfo?.lastName,
              avatar: el.senderInfo?.avatar,
            },
          };
        });
        removeMessageList = [removeMessage, ...listMessageReply];
      }
    } else {
      let removeMessage = await db.Message.destroy({
        where: { id: data.el.id },
      });
      if (removeMessage === 1) removeMessage = { id: data.el.id };
      const listMessageReply = await db.Message.findAll({
        where: { reply_text_id: data.el.id },
        attributes: ["id"],
        raw: true,
      });
      const listObjectId = [removeMessage, ...listMessageReply];
      removeMessageList = listObjectId.map((item) => item.id);
      await db.Message.destroy({
        where: { reply_text_id: data.el.id },
      });
    }

    const to_user = await db.User.findOne({
      where: { id: data.receiver_id },
      raw: true,
    });
    const from_user = await db.User.findOne({
      where: { id: data.el.sender_id },
      raw: true,
    });
    const receiveUser = getUser(to_user);
    const senderUser = getUser(from_user);
    if (receiveUser?.socketId) {
      io.to(receiveUser.socketId).emit("update_remove_message", {
        message: removeMessageList,
      });
    }
    if (senderUser?.socketId && senderUser.socketId !== receiveUser?.socketId) {
      io.to(senderUser.socketId).emit("update_remove_message", {
        message: removeMessageList,
      });
    }
  });

  socket.on("update_message", async (data) => {
    const { receiver_id, message_id, sender_id, messageUpdate } = data;
    let updateMessage = [];
    const [affectedCount] = await db.Message.update(
      {
        message: messageUpdate,
      },
      { where: { id: message_id } }
    );
    if (affectedCount > 0) {
      const updateMsg = await db.Message.findOne({
        where: { id: message_id },
        raw: true,
      });
      updateMessage.push(updateMsg);
    }

    const to_user = await db.User.findOne({
      where: { id: receiver_id },
      raw: true,
    });
    const from_user = await db.User.findOne({
      where: { id: sender_id },
      raw: true,
    });

    // Lấy socketId của người nhận và người gửi
    const receiveUser = getUser(to_user);
    const senderUser = getUser(from_user);

    // Phát sự kiện tới người nhận
    if (receiveUser?.socketId) {
      io.to(receiveUser.socketId).emit("update_remove_message", {
        message: updateMessage,
      });
    }

    if (senderUser?.socketId && senderUser.socketId !== receiveUser?.socketId) {
      io.to(senderUser.socketId).emit("update_remove_message", {
        message: updateMessage,
      });
    }
  });
});
