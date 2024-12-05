import express from "express";
// import { verifyToken } from "../middlewares/verifyToken.js";
import * as emojiController from "../controllers/emoji.js";

const router = express.Router();

router.get("/get-emoji", emojiController.getEmoji);
router.get(
  "/get-all-react-message/:message_id",
  emojiController.getAllUserReactMessage
);

export default router;
