import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

export const verifyToken = asyncHandler(async (req, res, next) => {
  if (req.headers?.authorization?.startsWith("Bearer")) {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
      if (err)
        return res.status(401).json({
          success: false,
          message: "Invalid access token",
        });
      req.user = payload;

      next();
    });
  } else {
    return res.status(401).json({
      success: false,
      message: "Required authentication",
    });
  }
});
