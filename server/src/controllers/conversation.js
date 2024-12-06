import asyncHandler from "express-async-handler";
import db from "../models";
import { v4 as uuidv4 } from "uuid";
import { v2 as cloudinary } from "cloudinary";
import { Op, Sequelize } from "sequelize";

const getAllConversation = asyncHandler(async (req, res) => {
  const { current_id } = req.params;
  const conversations = await db.Conversation.findAll({
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
    raw: true,
    nest: true,
  });

  if (!conversations) {
    return res.status(404).json({
      success: false,
      message: "Conversations not found",
    });
  }
  const newConversation = conversations.filter(
    (conversation) => conversation.members.user_id !== current_id
  );
  return res.status(200).json({
    success: true,
    message: "Get all conversation successfully",
    conversations: newConversation,
  });
});

const deleteConversation = asyncHandler(async (req, res) => {
  const { conversation_id } = req.params;
  const conversation = await db.Conversation.destroy({
    where: { id: conversation_id },
  });
  if (!conversation) {
    return res.status(404).json({
      success: false,
      message: "Conversation not found",
    });
  }
  return res.status(200).json({
    success: true,
    message: "Delete conversation successfully",
  });
});

const getAllMessage = asyncHandler(async (req, res) => {
  const { conversation_id } = req.params;

  // Lấy tất cả các tin nhắn
  const messages = await db.Message.findAll({
    where: { conversation_id },
    order: [["createdAt", "ASC"]],
    include: [
      {
        model: db.Image,
        attributes: ["message_image"],
        as: "imageInfo",
      },
      {
        model: db.User,
        attributes: ["firstName", "lastName", "avatar"],
        as: "senderInfo",
      },
      {
        model: db.MessageReact,
        attributes: ["message_id", "emoji_dropper_id", "emoji_icon"],
        as: "messageReact",
        include: [
          {
            model: db.User,
            attributes: ["firstName", "lastName", "avatar"],
            as: "userReact",
          },
        ],
      },
      {
        model: db.Message, // Kết hợp với chính bảng Message để lấy thông tin tin nhắn trả lời
        as: "info_reply", // Alias cho tin nhắn trả lời
        required: false, // Không bắt buộc phải có tin nhắn trả lời
        where: { id: Sequelize.col("message.reply_text_id") }, // Điều kiện join: reply_text_id của message phải trùng với id của message
        attributes: ["sender_id", "message"],
        include: [
          {
            model: db.User, // Lấy thông tin người trả lời từ bảng User
            as: "senderInfo", // Alias cho người trả lời
            attributes: ["firstName", "lastName"], // Lấy id và name của người trả lời
          },
        ],
      },
    ],
    nest: true,
  });

  // Lấy tất cả các phản ứng (reactions) của tin nhắn
  const countReactMes = await db.MessageReact.findAll({
    attributes: [
      "message_id",
      "emoji_icon",
      [Sequelize.fn("COUNT", Sequelize.col("emoji_icon")), "count"],
    ],
    group: ["message_id", "emoji_icon"], // Nhóm theo message_id và emoji_icon
    raw: true,
  });

  if (!messages || messages.length === 0) {
    return res.status(404).json({
      success: false,
      message: "Messages not found",
      messages,
    });
  }

  return res.status(200).json({
    success: true,
    message: "Get all messages successfully",
    messages,
    countReactMes,
  });
});

const uploadImage = asyncHandler(async (req, res) => {
  const images = req.files?.map((el) => el);
  res.status(200).json({
    success: true,
    message: "Upload image successfully",
    images,
  });
});

const createMessage = asyncHandler(async (req, res) => {
  const {
    id,
    conversation_id,
    sender_id,
    type_msg,
    send_at,
    file_url,
    reply_text_id,
    reply_image_id,
    audio_record_url,
    sub_type,
    imageInfo,
    message,
  } = req.body;
  let imagesId = uuidv4();
  const messageCreated = await db.Message.create({
    id,
    conversation_id,
    sender_id,
    type_msg,
    send_at,
    reply_text_id,
    reply_image_id,
    file_url,
    message,
    audio_record_url,
    sub_type,
    image_id: imageInfo?.message_image ? imagesId : null,
  });
  imageInfo &&
    (await db.Image.create({
      id: imagesId,
      message_image: imageInfo?.message_image || [],
    }));
  if (!messageCreated) {
    return res.status(404).json({
      success: false,
      message: "Message not created",
    });
  }
  return res.status(200).json({
    success: true,
    message: "Create message successfully",
    messageCreated,
  });
});

const deleteImage = asyncHandler(async (req, res) => {
  cloudinary.uploader
    .destroy(`${req.params.folder}/${req.params.image_id}`)
    .then((result) => {
      console.log(result);
      res.status(200).json({
        success: true,
        message: "Delete image successfully",
      });
    });
});

export {
  getAllConversation,
  deleteConversation,
  getAllMessage,
  createMessage,
  uploadImage,
  deleteImage,
};
