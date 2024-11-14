"use strict";
import db from "../models/index.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../middlewares/jwt.js";
import asyncHandler from "express-async-handler";
import {
  userForgetPasswordSchema,
  userRegisterSchema,
} from "../schemas/userSchemas.js";
import { z } from "zod";
// import { sendEmailService } from "../utils/sendEmail.js";
// import jwt from "jsonwebtoken";
// import { client } from "../config/redis.config.js";

const register = async (req, res) => {
  try {
    const { date, month, year, ...other } = req.body;
    const userData = {
      ...other,
      date_of_birth: `${year}-${month}-${date}`,
    };

    const validatedData = userRegisterSchema.parse(userData);

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(validatedData.password, salt);
    const response = await db.User.findOrCreate({
      where: { email: validatedData.email },
      defaults: {
        id: uuidv4(),
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        password: hashedPassword,
        gender: validatedData.gender,
        avatar:
          validatedData.gender === "male"
            ? "https://invisiblechildren.com/wp-content/uploads/2012/07/facebook-profile-picture-no-pic-avatar.jpg"
            : "https://i.pinimg.com/236x/c5/78/8a/c5788ab9863064ba1de85c47e4cbb8f3.jpg",
        date_of_birth: validatedData.date_of_birth,
      },
    });
    console.log(response);

    if (response[1] === false) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    return res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.errors,
      });
    }
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const login = asyncHandler(async (req, res) => {
  const { email, password: userPassword } = req.body;
  if (!email || !userPassword) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }
  try {
    const response = await db.User.findOne({
      where: { email },
      raw: true, // trả về 1 instance của sequelize, ko phải 1 object
    });

    const isCorrectPassword =
      response && bcrypt.compareSync(userPassword, response.password);

    if (!response) {
      return res
        .status(400)
        .json({ success: false, message: "Email or password is incorrect" });
    }

    // const token =
    //   isCorrectPassword &&
    //   (await generateAccessToken(response.id, response.email));

    // const refreshToken =
    //   isCorrectPassword && (await generateRefreshToken(response.id));
    // res.cookie("refresh_token", refreshToken, {
    //   httpOnly: true,
    //   maxAge: 24 * 60 * 60 * 1000, // 1d
    //   secure: false,
    //   sameSite: "strict",
    // });
    const { password, ...user } = response;
    return res.status(200).json({
      success: true,
      message: "Login successfully",
      user,
      // token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

// const forgetPassword = asyncHandler(async (req, res) => {
//   try {
//     const { email, OTP } = req.body;
//     const validateEmail = userForgetPasswordSchema.parse({ email });

//     const response = await db.User.findOne({
//       where: { email: validateEmail.email },
//     });
//     if (!response) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found. Please check again email address",
//       });
//     }
//     const responseEmail = await sendEmailService(validateEmail.email, OTP);

//     return res.status(200).json({
//       success: true,
//       message: responseEmail.message,
//     });
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       return res.status(400).json({
//         message: "Validation failed",
//         errors: error.errors,
//       });
//     }
//     return res.status(500).json({ status: false, message: error.message });
//   }
// });

// const changePassword = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;
//   if (!password)
//     return res
//       .status(400)
//       .json({ success: false, message: "Password are required" });
//   const user = await db.User.findOne({ email });
//   if (!user)
//     return res.status(404).json({ success: false, message: "User not found" });
//   const salt = bcrypt.genSaltSync(10);
//   const hashedPassword = bcrypt.hashSync(password, salt);
//   await user.update({ password: hashedPassword });
//   await user.save();
//   if (req?.headers?.authorization?.startsWith("Bearer")) {
//     const token = req.headers.authorization.split(" ")[1];
//     if (typeof token === "string") {
//       const decode = await new Promise((resolve, reject) => {
//         jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
//           if (err) {
//             reject(err);
//           } else {
//             resolve(decoded);
//           }
//         });
//       });
//       if (decode.id === user.id) {
//         await client.del(`${decode.id}_access_token`);
//         await client.del(`${decode.id}_refresh_token`);
//       }
//     }
//   }
//   return res.status(200).send({
//     success: true,
//     message: "Change password successfully",
//   });
// });

// const refreshToken = asyncHandler(async (req, res) => {
//   const refreshToken = req.cookies.refresh_token;

//   if (!refreshToken) {
//     return res
//       .status(401)
//       .json({ success: false, message: "Please login or register" });
//   }
//   const { userId } = await verifyRefreshToken(refreshToken);

//   const newAccessToken = await generateAccessToken(userId);
//   const newRefreshToken = await generateRefreshToken(userId);
//   res.cookie("refresh_token", newRefreshToken, {
//     httpOnly: true,
//     maxAge: 30 * 24 * 60 * 60 * 1000,
//     secure: false,
//     sameSite: "strict",
//   });
//   return res.status(200).json({
//     success: true,
//     message: "Get new access token successfully",
//     newAccessToken,
//   });
// });

// export { register, login, forgetPassword, changePassword, refreshToken };
export { register, login };
