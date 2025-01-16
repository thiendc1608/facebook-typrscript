const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ["jpg", "jpeg", "png", "gif", "mp4", "avi", "mov"],
  params: (req, file) => {
    // Dựa trên MIME type của file, thiết lập resource_type tương ứng
    if (file.mimetype.startsWith("image/")) {
      return { folder: "facebookResources", resource_type: "image" };
    } else if (file.mimetype.startsWith("video/")) {
      return { folder: "facebookResources", resource_type: "video" };
    } else {
      return Promise.reject(new Error("Unsupported file type"));
    }
  },
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;
