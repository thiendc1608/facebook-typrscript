import express from "express";
import * as commentController from "../controllers/comment.js";

const router = express.Router();

router.post("/create-comment", commentController.createComment);
router.put("/update-comment", commentController.updateComment);
router.delete("/delete-comment/:id", commentController.deleteComment);
router.post("/react-emotion-comment", commentController.reactEmotionComment);

export default router;
