import express from "express";
import * as userController from "../controllers/user.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/other-users/:userId", userController.getOtherUsers);
router.get("/all-users/:id", userController.getAllUsers);
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
router.put("/update-status/:userId", userController.updateStatus);
router.put("/change-cover-picture/:userId", userController.changeCoverPicture);
router.put("/change-avatar/:userId", userController.changeAvatar);
router.put("/change-bio/:userId", userController.changeBio);
router.put("/change-address/:userId", userController.changeAddress);
router.put("/change-phone/:userId", userController.changePhone);
router.put("/change-email/:userId", userController.changeEmail);
router.put("/change-DOB/:userId", userController.changeDOB);
router.put("/change-gender/:userId", userController.changeGender);

export default router;
