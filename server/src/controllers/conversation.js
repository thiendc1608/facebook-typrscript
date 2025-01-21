import asyncHandler from "express-async-handler";
import db from "../models";
import { v4 as uuidv4 } from "uuid";
import { v2 as cloudinary } from "cloudinary";
import { Op, Sequelize } from "sequelize";

const getAllConversation = asyncHandler(async (req, res) => {
  const { current_id } = req.params;
  const memberList = await db.Member.findAll({
    where: {
      user_id: current_id,
    },
    attributes: ["conversation_id"],
    raw: true,
  });

  const conversationIds = memberList.map((item) => item.conversation_id);
  const newConversation = await db.Member.findAll({
    where: {
      conversation_id: {
        [Op.in]: conversationIds,
      },
      user_id: {
        [Op.ne]: current_id, // Loại bỏ user_id của bạn
      },
    },
    attributes: ["conversation_id", "user_id", "nickname", "joined_at"],
    include: [
      {
        model: db.User,
        attributes: ["avatar"],
        as: "user",
      },
    ],
    raw: true,
    nest: true,
  });

  const conversations = await db.Conversation.findAll({
    where: {
      id: {
        [Op.in]: conversationIds, // Tìm các cuộc hội thoại có conversation_id trong danh sách
      },
    },
    raw: true,
  });

  // Gộp thông tin từ Conversation với dữ liệu ban đầu
  const result = newConversation.map((item) => {
    // Tìm cuộc hội thoại tương ứng với conversation_id của từng item trong mảng
    const conversation = conversations.find(
      (conv) => conv.id === item.conversation_id
    );

    // Trả về một object mới kết hợp cả thông tin cuộc hội thoại và thông tin người dùng
    return {
      ...conversation,
      members: { ...item },
    };
  });

  if (!result) {
    return res.status(404).json({
      success: false,
      message: "Conversations not found",
    });
  }
  return res.status(200).json({
    success: true,
    message: "Get all conversation successfully",
    conversations: result,
  });
});

const deleteConversation = asyncHandler(async (req, res) => {
  const { conversation_id } = req.params;
  const conversation = await Promise.all([
    (db.Conversation.destroy({
      where: { id: conversation_id },
    }),
    db.Member.destroy({
      where: { conversation_id },
    }),
    db.Message.destroy({
      where: { conversation_id },
    })),
  ]);
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
  //Lấy tất cả các tin nhắn
  const messages = await db.Message.findAll({
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
        required: false,
        include: [
          {
            model: db.User,
            attributes: ["firstName", "lastName", "avatar"],
            as: "userReact",
          },
        ],
      },
      {
        model: db.Message,
        as: "info_reply", // Alias của bảng Message trong include
        attributes: ["sender_id", "message"],
        include: [
          {
            model: db.User,
            as: "senderInfo", // Alias của bảng User
            attributes: ["firstName", "lastName"],
          },
        ],
      },
    ],
    nest: true,
  });

  // Kiểm tra messageReact của từng tin nhắn, nếu không có thì ghi đè thành mảng rỗng
  messages.forEach((message) => {
    if (!message.messageReact) {
      message.messageReact = []; // Ghi đè null thành mảng rỗng nếu không có dữ liệu messageReact
    }
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

  if (!messages) {
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

const getAllMessageSearch = asyncHandler(async (req, res) => {
  const { conversation_id } = req.params;

  const messages = await db.Message.findAll({
    where: { conversation_id },
    order: [["createdAt", "ASC"]],
    attributes: ["id", "message", "send_at"],
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

  if (!messages) {
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

const getAllNickName = asyncHandler(async (req, res) => {
  const { conversation_id } = req.params;
  const allNickName = await db.Member.findAll({
    where: { conversation_id },
    attributes: ["id", "conversation_id", "user_id", "nickname"],
    include: [
      {
        model: db.User,
        attributes: ["avatar"],
        as: "user",
      },
    ],
    raw: true,
    nest: true,
  });

  if (!allNickName) {
    return res.status(404).json({
      success: false,
      message: "Nicknames not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Get all nicknames successfully",
    allNickName,
  });
});

const getAllImage = asyncHandler(async (req, res) => {
  const { conversation_id } = req.params;
  const allImage = await db.Message.findAll({
    where: {
      conversation_id,
      image_id: {
        [Op.ne]: null,
      },
    },
    include: [
      {
        model: db.Image,
        attributes: ["message_image"],
        order: ["createdAt", "ASC"],
        as: "imageInfo",
      },
    ],
    attributes: [],
    raw: true,
    nest: true,
  });

  return res.status(200).json({
    success: true,
    message: "Get all images successfully",
    allImage,
  });
});

const uploadImageVideo = asyncHandler(async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "No files uploaded.",
      });
    }
    const files = req.files;
    const fileUrls = files.map((file) => ({
      path: file.path,
      originalname: file.originalname,
      filename: file.filename,
    }));

    res.status(200).json({
      success: true,
      message: "Files uploaded successfully!",
      imageVideos: fileUrls, // Trả về URL của các file đã upload
    });
  } catch (error) {
    res.status(500).send("Error uploading files: " + error.message);
  }
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
  uploadImageVideo,
  deleteImage,
  getAllMessageSearch,
  getAllNickName,
  getAllImage,
};
