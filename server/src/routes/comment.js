import express from "express";
import * as commentController from "../controllers/comment.js";

const router = express.Router();

router.post("/create-comment", commentController.createComment);
router.put("/update-comment", commentController.updateComment);
router.delete("/delete-comment/:id", commentController.deleteComment);

export default router;
