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

const getAllPost = asyncHandler(async (req, res) => {
  const { offset, limit } = req.query;
  try {
    const allPosts = await db.Post.findAll({
      limit: +limit, // Giới hạn số bài đăng trả về
      offset: +offset,
      order: [["createdAt", "DESC"]],
      attributes: { exclude: ["updatedAt"] },
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
        {
          model: db.PostReaction,
          attributes: [],
          as: "postReaction",
          include: [
            {
              model: db.User,
              attributes: ["id", "firstName", "lastName", "avatar"],
              as: "userInfo",
            },
            {
              model: db.Emotion,
              attributes: ["emotion_name", "emotion_post"],
              as: "emotion",
            },
          ],
        },
      ],
      raw: true,
      nest: true,
    });

    const groupedPosts = allPosts.reduce((acc, post) => {
      // Kiểm tra postReaction, nếu là object thì chuyển thành mảng chứa object đó
      const reactions = Array.isArray(post.postReaction)
        ? post.postReaction
        : [post.postReaction];

      // Tìm bài post đã có trong mảng acc chưa
      let existingPost = acc.find((p) => p.id === post.id);

      if (existingPost) {
        // Nếu bài post đã tồn tại, thêm các postReaction mới vào
        existingPost.postReaction.push(...reactions);
      } else {
        // Nếu bài post chưa có, thêm bài post mới vào mảng acc
        acc.push({
          ...post,
          postReaction: [...reactions], // Đảm bảo postReaction luôn là mảng
        });
      }

      return acc;
    }, []);

    let updatedPostArray = groupedPosts.map((obj) => {
      const groupedReactions = obj.postReaction.reduce(
        (acc, { emotion, userInfo }) => {
          const emotionName = emotion.emotion_name; // Lấy tên cảm xúc
          const emotionPost = emotion.emotion_post; // Lấy emotion_post

          // Tìm xem emotionName đã có trong acc chưa
          let existingEmotion = acc.find((item) => item[emotionName]);

          if (!existingEmotion) {
            // Nếu chưa có emotionName, khởi tạo mới
            existingEmotion = {
              [emotionName]: {
                emoji_post: emotionPost,
                listUser: [],
              },
            };
            acc.push(existingEmotion); // Thêm vào mảng acc
          }

          // Thêm userInfo vào listUser của emotionName
          existingEmotion[emotionName].listUser.push(userInfo);

          return acc;
        },
        []
      );

      const listReactEmotionPost = groupedReactions
        .filter((reaction) => {
          // Kiểm tra các cảm xúc không có emoji_post hoặc emoji_post là null
          return Object.values(reaction).every(
            (item) => item.emoji_post !== null
          );
        })
        .map((reaction) => {
          // Trả về đối tượng với cảm xúc là khóa và emoji_post là giá trị
          const emotionName = Object.keys(reaction)[0]; // Lấy tên cảm xúc từ khóa đầu tiên
          return {
            [emotionName]: reaction[emotionName],
          };
        });

      delete obj.postReaction;
      return {
        ...obj,
        listReactEmotionPost,
      };
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

export { createPost, getAllPost };
