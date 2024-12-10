import express from "express";
import * as conversationController from "../controllers/conversation.js";
const fileUploader = require("../config/cloundinary.config.js");
// import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get(
  "/get-all-conversation/:current_id",
  conversationController.getAllConversation
);
router.delete(
  "/delete-conversation/:conversation_id",
  conversationController.deleteConversation
);
router.get(
  "/get-all-message/:conversation_id",
  conversationController.getAllMessage
);

router.get(
  "/get-all-message-search/:conversation_id",
  conversationController.getAllMessageSearch
);

router.get(
  "/get-all-nickname/:conversation_id",
  conversationController.getAllNickName
);

router.get(
  "/get-all-image/:conversation_id",
  conversationController.getAllImage
);

router.post(
  "/images/upload",
  fileUploader.array("imageInfo", 10),
  conversationController.uploadImage
);

router.delete(
  "/delete-image/:folder/:image_id",
  conversationController.deleteImage
);
router.post("/create-message", conversationController.createMessage);

export default router;
