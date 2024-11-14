"use strict";
import asyncHandler from "express-async-handler";
import db from "../models/index.js";
import { Sequelize, where } from "sequelize";
import moment from "moment";

const createStory = asyncHandler(async (req, res) => {
  const story = await db.Reel.findOrCreate({
    where: { id: req.body.id },
    defaults: {
      ...req.body,
    },
  });
  res.status(200).json({
    success: true,
    message: "Create story successfully",
    story,
  });
});

const getAllStories = asyncHandler(async (req, res) => {
  const stories = await db.Reel.findAll({
    raw: true,
    nest: true,
    include: [{ model: db.User, as: "user" }],
  });
  if (!stories) {
    return res.status(404).json({
      success: false,
      message: "Stories not found",
    });
  }
  const allStories = stories.filter(
    (el, index) =>
      stories.findIndex((item) => item.user_id === el.user_id) === index
  );

  res.status(200).json({
    success: true,
    message: "Get all stories successfully",
    allStories,
  });
});

// [GET] stories/
const getDetailStory = asyncHandler(async (req, res) => {
  const { user_id } = req.params;
  const currentTime = moment();

  let storyViewer = [];

  const myStories = await db.Reel.findAll({
    where: {
      user_id,
      expiredAt: {
        [Sequelize.Op.gt]: currentTime.toDate(), // Chỉ lấy những story chưa hết hạn
      },
    },
    raw: true,
    nest: true,
    include: [{ model: db.User, as: "user" }],
  });
  storyViewer.push({ [user_id]: myStories });

  const getFriends = await db.Friend.findAll({
    where: {
      status: "accept",
    },
    attributes: ["user_response"], // Chỉ lấy cột user
  });

  // Chuyển kết quả thành mảng các user được following(bạn bè)
  const uniqueUserIds = getFriends.map((friend) => friend.user_id);

  // Mảng chứa tất cả các stories của bạn bè
  const followingStories = await Promise.all(
    uniqueUserIds.map((id) => {
      const story = db.Reel.findAll({ where: { user_id: id } });
      return story;
    })
  );

  // Mảng chứa tất cả các stories của người dùng hiện tại và những người đang follow
  const stories = myStories.concat(...followingStories);

  uniqueUserIds.forEach((userId) => {
    const userStory = stories.map((story) => {
      if (userId === story.user_id) return { userId: story };
    });
    storyViewer.push(...userStory);
  });

  res.status(200).json({
    success: true,
    message: "Get all stories successfully",
    storyViewer,
  });
});
// const getDetailStory = asyncHandler(async (req, res) => {
//   const { user_id } = req.params;
//   const cacheKey = `${user_id}_reel`;
//   try {
//     // Kiểm tra xem có dữ liệu trong Redis không
//     const cachedData = await client.get(cacheKey);

//     if (cachedData) {
//       // Nếu có, trả về dữ liệu từ cache
//       res.status(200).json({
//         success: true,
//         message: "Get all stories successfully",
//         storyUser: JSON.parse(cachedData),
//       });
//     }

//     const storyUser = await db.Reel.findAll({
//       raw: true,
//       nest: true,
//       include: [
//         {
//           model: db.User,
//           attributes: ["firstName", "lastName", "avatar"],
//           as: "user",
//         },
//       ],
//     });
//     if (!storyUser) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Reel not found" });
//     }
//     // Cache dữ liệu mới lấy từ database vào Redis
//     await client.setEx(cacheKey, 3600, JSON.stringify(storyUser)); // Lưu vào Redis, TTL 1 giờ
//     res.status(200).json({
//       success: true,
//       message: "Get all stories successfully",
//       storyUser: JSON.parse(storyUser),
//     });
//   } catch (error) {
//     console.error("Error:", error);
//     return res.status(500).json({ error: "An error occurred" });
//   }
// });

export { createStory, getAllStories, getDetailStory };
