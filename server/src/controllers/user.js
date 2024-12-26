import { Sequelize, where } from "sequelize";
import db from "../models";
const asyncHandler = require("express-async-handler");

const getCurrentUser = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const user = await db.User.findOne({
    where: { id: userId },
    attributes: { exclude: ["password"] },
    raw: true,
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  return res.status(200).json({
    success: true,
    message: "Get user successfully",
    user,
  });
});

const getOtherUsers = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const allMadeFriend = await db.Friend.findAll({
    attributes: ["user_response_id"],
    include: [{ model: db.User, as: "friends" }],
    where: {
      user_request_id: userId,
      status_id: 2,
    },
  });
  const otherUsers = await db.User.findAll({
    where: {
      id: { [Sequelize.Op.ne]: userId },
    },
    raw: true,
  });

  const allUserNotFriend = otherUsers.filter(
    (user) => !allMadeFriend.some((id) => id.friends.id === user.id)
  );
  if (!otherUsers) {
    return res.status(404).json({
      success: false,
      message: "Not found any other user",
    });
  }
  return res.status(200).json({
    success: true,
    message: "Get all user successfully",
    allUser: allUserNotFriend,
  });
});

const addAndRemoveFriend = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { friend } = req.body;

  // Ensure that user and friend are different
  if (userId === friend.id) {
    return res
      .status(400)
      .json({ message: "You cannot be friends with yourself." });
  }

  const makeFriend = await db.Friend.findOne({
    where: {
      user_request_id: userId,
      user_response_id: friend.id,
    },
  });

  if (makeFriend) {
    await db.Friend.destroy({
      where: {
        user_request_id: userId,
        user_response_id: friend.id,
      },
    });
    return res.status(200).json({
      success: true,
      message: "Remove friend request successfully",
    });
  }

  await db.Friend.create({
    user_request_id: userId,
    user_response_id: friend.id,
    status_id: 1,
  });
  res.status(200).json({
    success: true,
    message: "Add friend request successfully",
  });
});

const confirmFriendRequest = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { friend } = req.body;

  await db.Friend.update(
    {
      status_id: 2,
    },
    {
      where: {
        user_request_id: friend.id,
        user_response_id: userId,
      },
    }
  );

  return res.status(200).json({
    success: true,
    message: "Confirm friend request successfully",
  });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userList = await db.User.findAll({
    where: {
      id: { [Sequelize.Op.ne]: id },
    },
    raw: true,
  });
  if (!userList) {
    return res.status(404).json({
      success: false,
      message: "Users not found",
    });
  }
  return res.status(200).json({
    success: true,
    message: "Get all users successfully",
    userList,
  });
});

const updateStatus = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { status } = req.body;
  await db.User.update(
    {
      status,
    },
    {
      where: {
        id: userId,
      },
    }
  );
  return res.status(200).json({
    success: true,
    message: "Update status successfully",
  });
});

export {
  getCurrentUser,
  getOtherUsers,
  addAndRemoveFriend,
  confirmFriendRequest,
  getAllUsers,
  updateStatus,
};
