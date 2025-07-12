const multer = require("multer");
const { storage } = require("../config/cloudnary");

const upload = multer({ storage });

module.exports = upload;
