import express from "express";
import * as postController from "../controllers/post.js";

const router = express.Router();

router.post("/create-post", postController.createPost);
router.get("/get-all-post", postController.getAllPosts);

export default router;
