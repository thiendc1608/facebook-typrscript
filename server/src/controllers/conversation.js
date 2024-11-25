import asyncHandler from "express-async-handler";
import db from "../models";
import { v4 as uuidv4 } from "uuid";
import { v2 as cloudinary } from "cloudinary";

const createConversation = asyncHandler(async (req, res) => {
  const { conversation_id, participants, join_at } = req.body;
  let new_participants = [];
  const checkUser = await db.Participant.findAll({
    where: {
      conversation_id,
    },
    raw: true,
  });
  if (checkUser !== null) {
    new_participants = participants.filter((user) =>
      checkUser.some((el) => el.user_id !== user.id)
    );
  }

  new_participants =
    new_participants.length !== participants.length ? participants : [];

  const participantsList = new_participants.map((user) => ({
    conversation_id,
    user_id: user.user_id,
    join_at,
  }));
  await db.Participant.bulkCreate(participantsList, {
    validate: true, // Validate data before inserting
    ignoreDuplicates: true, // Ignore duplicate entries
  });

  return res.status(200).json({
    success: true,
    message: "Create conversation successfully",
  });
});

const getAllConversation = asyncHandler(async (req, res) => {
  const conversations = await db.Conversation.findAll({
    raw: true,
  });
  if (!conversations) {
    return res.status(404).json({
      success: false,
      message: "Conversations not found",
    });
  }
  return res.status(200).json({
    success: true,
    message: "Get all conversation successfully",
    conversations,
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
        model: db.Conversation,
        attributes: ["conversation_name", "group_image"],
        as: "conversation",
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
    user_id,
    type_msg,
    send_at,
    file_url,
    audio_record_url,
    sub_type,
    image_url,
    message,
  } = req.body;
  let imagesId = uuidv4();
  const messageCreated = await db.Message.create({
    conversation_id,
    user_id,
    type_msg,
    send_at,
    file_url,
    message,
    audio_record_url,
    sub_type,
    image_id: image_url ? imagesId : null,
  });
  image_url &&
    (await db.Image.create({
      id: imagesId,
      message_image: image_url || [],
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
  createConversation,
  uploadImage,
  deleteImage,
};
