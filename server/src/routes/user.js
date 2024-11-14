import express from "express";
import * as userController from "../controllers/user.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/all-user/:userId", userController.getAllUser);
// router.get("/current-user", verifyToken, userController.getCurrentUser);
// router.post(
//   "/add-remove-friend",
//   verifyToken,
//   userController.addAndRemoveFriend
// );
// router.post(
//   "/confirm-friend",
//   verifyToken,
//   userController.confirmFriendRequest
// );

router.get("/current-user", userController.getCurrentUser);
router.post("/add-remove-friend/:userId", userController.addAndRemoveFriend);
router.post("/confirm-friend/:userId", userController.confirmFriendRequest);

export default router;
