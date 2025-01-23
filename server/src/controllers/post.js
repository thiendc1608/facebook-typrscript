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

const updatePost = asyncHandler(async (req, res) => {
  const { post_id, user_id, post_content, post_object, list_image } = req.body;

  // Kiểm tra xem bài viết có tồn tại hay không
  const findPostUpdate = await db.Post.findOne({
    where: { id: post_id },
    raw: true,
  });

  if (findPostUpdate) {
    // Tạo một transaction để đảm bảo mọi thứ đều được xử lý cùng lúc
    const transaction = await db.sequelize.transaction();

    try {
      // Kiểm tra nếu có thay đổi về ảnh
      let newImageId = null;

      if (list_image && list_image.length > 0) {
        // Truy vấn ảnh hiện tại của post
        const existingImage = await db.Image.findOne({
          where: { id: findPostUpdate.image_id },
          transaction,
        });

        if (existingImage) {
          // Cập nhật thông tin ảnh hiện tại
          await existingImage.update(
            { message_image: list_image },
            { transaction }
          );
          newImageId = existingImage.id; // Giữ lại image_id hiện tại sau khi cập nhật
        } else {
          // Nếu không tìm thấy ảnh cũ, tạo ảnh mới
          const newImage = await db.Image.create(
            {
              id: uuidv4(),
              message_image: list_image, // list_image có thể là mảng hoặc chuỗi
            },
            { transaction }
          );
          newImageId = newImage.id; // Lưu lại id của ảnh mới
        }
      }

      // Cập nhật thông tin bài viết
      const [affectedCount] = await db.Post.update(
        {
          post_content,
          post_object,
          image_id: newImageId || findPostUpdate.image_id, // Nếu không có ảnh mới thì giữ nguyên image_id cũ
        },
        {
          where: { id: post_id },
          transaction,
        }
      );

      // Kiểm tra xem bài viết có thực sự được cập nhật hay không
      if (affectedCount === 0) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: "Post cannot be updated",
        });
      }

      // Cập nhật thành công, commit transaction
      await transaction.commit();

      const postUpdateLatest = await db.Post.findOne({
        where: { id: post_id },
        raw: true,
      });
      // Lấy thông tin người dùng và ảnh liên quan
      const user = await db.User.findByPk(user_id);
      const getImagePost = await db.Image.findOne({
        where: { id: newImageId || postUpdateLatest.image_id },
        attributes: ["message_image"],
        raw: true,
      });

      const newPost = {
        id: postUpdateLatest.id,
        user_id: user.id,
        post_content: postUpdateLatest.post_content,
        post_object: postUpdateLatest.post_object,
        image_id: user.image_id || null,
        imageInfo: {
          message_image: getImagePost ? getImagePost.message_image : null,
        },
        createdAt: postUpdateLatest.createdAt,
        userOwnPost: {
          lastName: user.lastName,
          firstName: user.firstName,
          avatar: user.avatar,
        },
        listReactEmotionPost: [],
      };

      res.status(200).json({
        success: true,
        message: "Post updated successfully",
        post: newPost,
      });
    } catch (error) {
      // Nếu có lỗi, rollback transaction
      await transaction.rollback();
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the post",
        error: error.message,
      });
    }
  } else {
    return res.status(404).json({
      success: false,
      message: "Post not found",
    });
  }
});

const deletePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const transaction = await db.sequelize.transaction();

  try {
    // Xoá bản ghi liên quan trong bảng post_reaction
    await db.PostReaction.destroy({
      where: { post_id: postId },
      transaction,
    });

    // Xoá bản ghi liên quan trong bảng post_comment
    await db.PostComment.destroy({
      where: { post_id: postId },
      transaction,
    });

    // Lấy dữ liệu post để kiểm tra image_id
    const post = await db.Post.findOne({
      where: { id: postId },
      transaction,
    });

    // Xoá ảnh nếu tồn tại
    if (post && post.image_id) {
      await db.Image.destroy({
        where: { id: post.image_id },
        transaction,
      });
    }

    // Xoá bản ghi trong bảng post
    await db.Post.destroy({
      where: { id: postId },
      transaction,
    });

    // Commit giao dịch
    await transaction.commit();
    console.log("Đã xoá thành công bài viết và dữ liệu liên quan.");
    res.status(200).json({
      success: true,
      message: "Delete post successfully",
    });
  } catch (error) {
    // Rollback nếu có lỗi xảy ra
    await transaction.rollback();
    console.error("Xoá không thành công:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the post",
      error: error.message,
    });
  }
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

export { createPost, updatePost, deletePost, getAllPost };
