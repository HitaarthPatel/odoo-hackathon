const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  profileImage: {
  url: String,
  filename: String,
},
  bio: String,
  location: String,
  skills: [String]
});

userSchema.plugin(passportLocalMongoose, { usernameField: "email" });

module.exports = mongoose.model("User", userSchema);
