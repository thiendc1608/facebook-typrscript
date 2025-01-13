import asyncHandler from "express-async-handler";
import db from "../models";
import { v4 as uuidv4 } from "uuid";

const createPost = asyncHandler(async (req, res) => {
  const { user_id, post_content, post_object, list_image } = req.body;
  let imagesId = uuidv4();
  const post = await db.Post.create({
    id: uuidv4(),
    user_id,
    post_content,
    post_object,
    image_id: list_image !== null ? imagesId : null,
  });

  list_image !== null &&
    (await db.Image.create({
      id: imagesId,
      message_image: list_image || [],
    }));

  if (!post) {
    return res.status(404).json({
      success: false,
      message: "Post cannot created",
    });
  }

  const user = await db.User.findByPk(user_id);
  const getImagePost = await db.Image.findOne({
    where: {
      id: post.image_id,
    },
    attributes: ["message_image"],
    raw: true,
  });

  const newPost = {
    id: post.id,
    user_id: user.id,
    post_content: post.post_content,
    post_object: post.post_object,
    image_id: user.image_id,
    imageInfo: {
      message_image: getImagePost ? getImagePost.message_image : null,
    },
    createdAt: post.createdAt,
    userOwnPost: {
      lastName: user.lastName,
      firstName: user.firstName,
      avatar: user.avatar,
    },
    listReactEmotionPost: [],
  };

  res.status(200).json({
    success: true,
    message: "Create post successfully",
    post: newPost,
  });
});

const getAllPosts = asyncHandler(async (req, res) => {
  const { offset, limit } = req.query;
  try {
    const allPosts = await db.Post.findAll({
      limit: +limit, // Giới hạn số bài đăng trả về
      offset: +offset,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: db.User,
          attributes: ["firstName", "lastName", "avatar"],
          as: "userOwnPost",
        },
        {
          model: db.Image,
          attributes: ["message_image"],
          as: "imageInfo",
        },
      ],
      raw: true,
      nest: true,
    });

    let updatedPostArray = allPosts.map((obj) => {
      return { ...obj, listReactEmotionPost: [] }; // Thêm thuộc tính mới vào mỗi object
    });

    res.status(200).json({
      success: true,
      message: "Get all posts successfully",
      allPosts: updatedPostArray,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
});

export { createPost, getAllPosts };
