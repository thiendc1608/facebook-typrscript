import asyncHandler from "express-async-handler";
import db from "../models/index.js";

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

  const finalComment = await db.PostComment.findOne({
    where: { id: comment.id },
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

  res.status(200).json({
    success: true,
    message: "Create comment successfully",
    comment: finalComment,
  });
});

const updateComment = asyncHandler(async (req, res) => {
  const { id, post_id, user_id, comment_text, parent_comment_id } = req.body;
  let commentUpdated;
  const result = await db.PostComment.update(
    {
      comment_text,
    },
    {
      where: { id, post_id, user_id, parent_comment_id },
    }
  );
  if (result > 0) {
    commentUpdated = await db.PostComment.findOne({
      where: { id, post_id, user_id, parent_comment_id },
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
  const result = await db.PostComment.destroy({
    where: { id },
  });

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
  });
  if (reaction) {
    await db.CommentReaction.update(
      {
        emotion_id,
      },
      {
        where: { user_id, comment_id },
      }
    );
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
          attributes: ["firstName", "lastName", "avatar"],
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

export { createComment, updateComment, deleteComment, reactEmotionComment };
