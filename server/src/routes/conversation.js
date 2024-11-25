import express from "express";
import * as conversationController from "../controllers/conversation.js";
const fileUploader = require("../config/cloundinary.config.js");
// import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/create-conversation", conversationController.createConversation);
router.get("/get-all-conversation", conversationController.getAllConversation);
router.delete(
  "/delete-conversation/:conversation_id",
  conversationController.deleteConversation
);
router.get(
  "/get-all-message/:conversation_id",
  conversationController.getAllMessage
);

router.post(
  "/images/upload",
  fileUploader.array("image_url", 10),
  conversationController.uploadImage
);

router.delete(
  "/delete-image/:folder/:image_id",
  conversationController.deleteImage
);
router.post("/create-message", conversationController.createMessage);

export default router;
