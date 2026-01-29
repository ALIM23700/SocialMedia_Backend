const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "posts",
    resource_type: "auto",
    allowed_formats: [
      "jpg", "jpeg", "png", "webp", "gif",
      "mp4", "mov", "avi", "mkv", "webm"
    ],
  },
});

const upload = multer({ storage });

module.exports = upload;
