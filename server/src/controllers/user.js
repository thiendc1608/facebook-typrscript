import { Op } from "sequelize";
import db from "../models";
const asyncHandler = require("express-async-handler");

const getCurrentUser = asyncHandler(async (req, res) => {
  // const { userId } = req.user;
  const { id } = req.query;
  const user = await db.User.findOne({
    where: { id },
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

  const otherUsers = await db.User.findAll({
    where: {
      id: { [Op.ne]: userId },
    },
    raw: true,
  });

  const allUserFriend = await db.Friend.findAll({
    where: {
      [Op.and]: [
        {
          [Op.or]: [{ user_request_id: userId }, { user_response_id: userId }],
        },
        { status_id: 2 },
      ],
    },
    attributes: ["user_response_id"],
    include: [{ model: db.User, as: "friends" }],
  });

  const allUserNotFriend = otherUsers.filter(
    (user) => !allUserFriend.some((id) => id.friends.id === user.id)
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
    allUserFriend,
    allUserNotFriend,
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
      id: { [Op.ne]: id },
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

const changeCoverPicture = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { coverPicture, coverPicturePos } = req.body;
  const result = await db.User.update(
    {
      cover_picture: coverPicture,
      cover_picture_pos: coverPicturePos,
    },
    {
      where: {
        id: userId,
      },
    }
  );
  if (result < 1) {
    return res.status(404).json({
      success: false,
      message: "Error when updating user cover picture",
    });
  }
  const coverPictureUpdate = await db.User.findOne({
    where: {
      id: userId,
    },
    attributes: ["cover_picture", "cover_picture_pos"],
    raw: true,
  });
  return res.status(200).json({
    success: true,
    message: "Change cover picture successfully",
    coverPictureUpdate,
  });
});

const changeAvatar = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { avatar } = req.body;
  const result = await db.User.update(
    {
      avatar,
    },
    {
      where: {
        id: userId,
      },
    }
  );
  if (result < 1) {
    return res.status(404).json({
      success: false,
      message: "Error when updating user avatar",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Change avatar successfully",
  });
});

const changeBio = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { bio } = req.body;
  const result = await db.User.update(
    {
      bio,
    },
    {
      where: {
        id: userId,
      },
    }
  );
  if (result < 1) {
    return res.status(404).json({
      success: false,
      message: "Error when updating user bio",
    });
  }
  return res.status(200).json({
    success: true,
    message: "Update bio successfully",
  });
});

const changeAddress = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { address } = req.body;
  const result = await db.User.update(
    {
      address,
    },
    {
      where: {
        id: userId,
      },
    }
  );
  if (result < 1) {
    return res.status(404).json({
      success: false,
      message: "Error when updating user address",
    });
  }
  return res.status(200).json({
    success: true,
    message: "Update address successfully",
  });
});

const changePhone = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { phone } = req.body;
  const result = await db.User.update(
    {
      phone,
    },
    {
      where: {
        id: userId,
      },
    }
  );
  if (result < 1) {
    return res.status(404).json({
      success: false,
      message: "Error when updating user phone",
    });
  }
  return res.status(200).json({
    success: true,
    message: "Update phone successfully",
  });
});

const changeEmail = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { email } = req.body;
  const result = await db.User.update(
    {
      email,
    },
    {
      where: {
        id: userId,
      },
    }
  );
  if (result < 1) {
    return res.status(404).json({
      success: false,
      message: "Error when updating user email",
    });
  }
  return res.status(200).json({
    success: true,
    message: "Update email successfully",
  });
});

const changeDOB = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { date_of_birth } = req.body;
  const result = await db.User.update(
    {
      date_of_birth,
    },
    {
      where: {
        id: userId,
      },
    }
  );
  if (result < 1) {
    return res.status(404).json({
      success: false,
      message: "Error when updating user DOB",
    });
  }
  return res.status(200).json({
    success: true,
    message: "Update DOB successfully",
  });
});

const changeGender = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { gender } = req.body;
  const result = await db.User.update(
    {
      gender,
    },
    {
      where: {
        id: userId,
      },
    }
  );
  if (result < 1) {
    return res.status(404).json({
      success: false,
      message: "Error when updating user gender",
    });
  }
  return res.status(200).json({
    success: true,
    message: "Update gender successfully",
  });
});

export {
  getCurrentUser,
  getOtherUsers,
  addAndRemoveFriend,
  confirmFriendRequest,
  getAllUsers,
  updateStatus,
  changeCoverPicture,
  changeAvatar,
  changeBio,
  changeAddress,
  changePhone,
  changeEmail,
  changeDOB,
  changeGender,
};
