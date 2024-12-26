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

export { createComment, updateComment, deleteComment };
