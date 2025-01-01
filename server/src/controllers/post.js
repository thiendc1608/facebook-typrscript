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
    list_image: getImagePost ? JSON.parse(getImagePost.message_image) : null,
    createdAt: post.createdAt,
    userOwnPost: {
      last_name: user.lastName,
      first_name: user.firstName,
      avatar: user.avatar,
    },
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
      ],
      raw: true,
      nest: true,
    });

    res.status(200).json({
      success: true,
      message: "Get all posts successfully",
      allPosts,
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
