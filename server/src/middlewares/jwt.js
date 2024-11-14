import jwt from "jsonwebtoken";
// import { client } from "../config/redis.config.js";

export const generateAccessToken = (userId, email) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { userId, email },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      },
      async (err, token) => {
        if (err) reject(err);
        // await client.setEx(`${userId}_access_token`, 60 * 60, token);
        resolve(token);
      }
    );
  });
};

export const generateRefreshToken = (userId) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { userId },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1d",
      },
      async (err, rf_token) => {
        if (err) reject(err);
        // await client.setEx(`${userId}_refresh_token`, 24 * 60 * 60, rf_token);
        resolve(rf_token);
      }
    );
  });
};

export const verifyRefreshToken = (refresh_token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(refresh_token, process.env.JWT_SECRET_KEY, (err, payload) => {
      if (err) reject(err);
      resolve(payload);
    });
  });
};
