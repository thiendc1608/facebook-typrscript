import asyncHandler from "express-async-handler";
import db from "../models";
import { Sequelize, where } from "sequelize";
import { raw } from "body-parser";

const getEmoji = asyncHandler(async (req, res) => {
  const emojiList = await db.Emotion.findAll({
    attributes: ["id", "emotion_name", "emotion_icon"],
    raw: true,
  });
  if (!emojiList) {
    return res.status(404).json({
      success: false,
      message: "Emoji not found",
    });
  }
  res.status(200).json({
    success: true,
    message: "Get emoji successfully",
    emojiList,
  });
});

const getAllUserReactMessage = asyncHandler(async (req, res) => {
  const { message_id } = req.params;

  let reactMessageList = new Object();
  const reactMessage = await db.MessageReact.findAll({
    where: { message_id },
    attributes: ["message_id", "emoji_dropper_id", "emoji_icon"],
    include: [
      {
        model: db.User,
        attributes: ["firstName", "lastName", "avatar"],
        as: "userReact",
      },
    ],
    raw: true,
    nest: true,
  });

  const countReactMes = await db.MessageReact.findAll({
    attributes: [
      "emoji_icon",
      [Sequelize.fn("COUNT", Sequelize.col("emoji_icon")), "count"],
    ],
    where: { message_id },
    group: ["message_id", "emoji_icon"],
    raw: true,
    nested: true,
  });

  // Đảm bảo rằng countReactMes đã tồn tại
  if (!reactMessageList["countReactMes"]) {
    reactMessageList["countReactMes"] = {};
  }

  reactMessageList["messageReact"] = reactMessage;
  reactMessageList["countReactMes"][message_id] = countReactMes;

  res.status(200).json({
    success: true,
    message: "Get all user react message successfully",
    reactMessageList,
  });
});

export { getEmoji, getAllUserReactMessage };
