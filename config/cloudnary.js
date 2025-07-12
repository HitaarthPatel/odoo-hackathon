const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "skillswap/profiles", // ✅ This will organize all uploads under skillswap/profiles/
    allowed_formats: ["jpeg", "png", "jpg"],
    public_id: (req, file) => {
      // You can generate a custom name or leave it undefined to auto-generate
      return `${Date.now()}-${file.originalname.split(".")[0]}`;
    },
  },
});

module.exports = {
  cloudinary,
  storage,
};
