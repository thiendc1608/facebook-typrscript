import express from "express";
import * as authController from "../controllers/auth.js";

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
// router.post("/forget-password", authController.forgetPassword);
// router.post("/change-password", authController.changePassword);
// router.post("/refresh-token", authController.refreshToken);

export default router;
