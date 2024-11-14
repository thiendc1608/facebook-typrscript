import express from "express";
import * as storyController from "../controllers/story.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

// router.post("/create-story", verifyToken, storyController.createStory);
router.post("/create-story", storyController.createStory);
router.get("/get-stories", storyController.getAllStories);
router.get("/detail-story/:user_id", storyController.getDetailStory);

export default router;
