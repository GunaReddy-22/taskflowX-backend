const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// 🔥 DEBUG (remove later)
console.log("Cloudinary Loaded:", {
  cloud: process.env.CLOUD_NAME,
  key: process.env.API_KEY ? "OK" : "MISSING",
});

module.exports = cloudinary;