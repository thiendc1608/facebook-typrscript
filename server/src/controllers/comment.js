import asyncHandler from "express-async-handler";
import db from "../models/index.js";
import { Op } from "sequelize";

const createComment = asyncHandler(async (req, res) => {
  const { post_id, user_id, comment_text, parent_comment_id } = req.body;
  const comment = await db.PostComment.create({
    post_id,
    user_id,
    comment_text,
    parent_comment_id,
  });

  if (!comment) {
    return res.status(404).json({
      success: false,
      message: "Comment cannot created",
    });
  }

  let finalComment = await db.PostComment.findOne({
    where: { id: comment.id },
    include: [
      {
        model: db.User,
        attributes: ["id", "firstName", "lastName", "avatar"],
        as: "user",
      },
    ],
    raw: true,
    nest: true,
  });

  finalComment = { ...finalComment, emotion_comment: [] };

  res.status(200).json({
    success: true,
    message: "Create comment successfully",
    comment: finalComment,
  });
});

const updateComment = asyncHandler(async (req, res) => {
  const { id, post_id, user_id, comment_text } = req.body;

  let commentUpdated;
  const result = await db.PostComment.update(
    {
      comment_text,
    },
    {
      where: { id },
    }
  );
  if (result > 0) {
    commentUpdated = await db.PostComment.findOne({
      where: { id, post_id, user_id },
      include: [
        {
          model: db.User,
          attributes: ["firstName", "lastName", "avatar"],
          as: "user",
        },
      ],
      raw: true,
      nest: true,
    });
  }

  res.status(200).json({
    success: true,
    message: "Update comment successfully",
    comment: commentUpdated,
  });
});

const deleteComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(id);

  const result = await db.PostComment.destroy({
    where: {
      [Op.or]: [{ id: +id }, { parent_comment_id: +id }],
    },
  });
  console.log(result);

  if (result === 0) {
    return res.status(404).json({
      success: false,
      message: "Cannot delete comment",
    });
  }
  res.status(200).json({
    success: true,
    message: "Delete comment successfully",
    deleteId: id,
  });
});

const reactEmotionComment = asyncHandler(async (req, res) => {
  const { emotion_id, user_id, comment_id } = req.body;
  const reaction = await db.CommentReaction.findOne({
    where: { user_id, comment_id },
    raw: true,
  });

  if (reaction) {
    if (+reaction.emotion_id === +emotion_id) {
      const removeEmotion = await db.CommentReaction.destroy({
        where: { user_id, comment_id, emotion_id },
      });
      if (removeEmotion === 0) {
        return res.status(404).json({
          success: false,
          message: "Error when delete emotion comment",
        });
      }
      res.status(200).json({
        success: true,
        message: "Delete emotion comment successfully",
      });
    } else {
      const updateEmotion = await db.CommentReaction.update(
        {
          emotion_id,
        },
        {
          where: { user_id, comment_id },
        }
      );
      if (updateEmotion === 0) {
        return res.status(404).json({
          success: false,
          message: "Error when update emotion comment",
        });
      }
      const getEmotionComment = await db.CommentReaction.findOne({
        where: { comment_id },
        attributes: ["id"],
        include: [
          {
            model: db.PostComment,
            attributes: ["id"],
            as: "comment",
          },
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
        raw: true,
        nest: true,
      });

      res.status(200).json({
        success: true,
        message: "Update emotion comment successfully",
        emotionComment: getEmotionComment,
      });
    }
  } else {
    const createReaction = await db.CommentReaction.create({
      emotion_id,
      user_id,
      comment_id,
    });
    if (!createReaction) {
      return res.status(404).json({
        success: false,
        message: "Cannot create emotion comment",
      });
    }
    const getEmotionComment = await db.CommentReaction.findOne({
      where: { comment_id },
      attributes: ["id"],
      include: [
        {
          model: db.PostComment,
          attributes: ["id"],
          as: "comment",
        },
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
      raw: true,
      nest: true,
    });

    res.status(200).json({
      success: true,
      message: "Create emotion comment successfully",
      emotionComment: getEmotionComment,
    });
  }
});

const getAllComment = asyncHandler(async (req, res) => {
  // Truy vấn lấy tất cả comments
  const comments = await db.PostComment.findAll({
    attributes: { exclude: ["updatedAt"] },
    include: [
      {
        model: db.User,
        attributes: ["id", "firstName", "lastName", "avatar"],
        as: "user",
      },
    ],
    raw: true,
    nest: true,
  });

  // Truy vấn lấy reactions cho từng comment
  const reactions = await db.CommentReaction.findAll({
    where: { comment_id: comments.map((comment) => comment.id) }, // Lọc reactions theo comment_id
    attributes: ["comment_id"],
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
    raw: true,
    nest: true,
  });

  // Gộp reactions vào từng comment
  comments.forEach((comment) => {
    comment.emotion_comment = reactions.filter(
      (reaction) => +reaction.comment_id === +comment.id
    );
  });

  // Gộp emotion_comment theo emotion_name
  const allComments = comments.map((comment) => {
    // Gộp emotion_comment theo emotion_name và tạo cấu trúc mới
    const emotionCommentObj = comment.emotion_comment.reduce((acc, current) => {
      const emotionName = current.emotion.emotion_name;
      // Kiểm tra nếu emotion_name đã tồn tại trong accumulator
      const existingEmotion = acc.find((item) => item[emotionName]);
      if (existingEmotion) {
        // Nếu emotion_name đã tồn tại, thêm user vào listUser
        existingEmotion[emotionName].listUser.push(current.userInfo);
      } else {
        // Nếu chưa tồn tại, tạo một đối tượng mới và thêm vào mảng acc
        acc.push({
          [emotionName]: {
            emoji_post: current.emotion.emotion_post,
            listUser: [current.userInfo],
          },
        });
      }

      return acc;
    }, []);
    // Trả về comment với emotion_comment đã được cấu trúc lại
    return {
      ...comment,
      emotion_comment: emotionCommentObj,
    };
  });

  res.status(200).json({
    success: true,
    message: "Get all comments successfully",
    listComment: allComments,
  });
});

export {
  createComment,
  updateComment,
  deleteComment,
  reactEmotionComment,
  getAllComment,
};
