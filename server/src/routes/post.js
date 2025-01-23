import express from "express";
import * as postController from "../controllers/post.js";

const router = express.Router();

router.post("/create-post", postController.createPost);
router.put("/update-post", postController.updatePost);
router.delete("/delete-post/:postId", postController.deletePost);
router.get("/get-all-post", postController.getAllPost);

export default router;
