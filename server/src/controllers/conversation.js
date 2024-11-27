import asyncHandler from "express-async-handler";
import db from "../models";
import { v4 as uuidv4 } from "uuid";
import { v2 as cloudinary } from "cloudinary";

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
  const messages = await db.Message.findAll({
    where: { conversation_id },
    order: [["createdAt", "ASC"]],
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

  if (messages === null) {
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
    conversation_id,
    sender_id,
    type_msg,
    send_at,
    file_url,
    audio_record_url,
    sub_type,
    imageInfo,
    message,
  } = req.body;
  let imagesId = uuidv4();
  const messageCreated = await db.Message.create({
    conversation_id,
    sender_id,
    type_msg,
    send_at,
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
