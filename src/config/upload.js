const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "taskflow",
    resource_type: "auto", // 🔥 supports all files
  },
});

const upload = multer({ storage });

module.exports = upload;