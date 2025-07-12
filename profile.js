const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/auth");
const User = require("../models/user");

// Show edit form
router.get("/edit", isLoggedIn, (req, res) => {
  res.render("profile/edit");
});

// Save profile updates
router.post("/edit", isLoggedIn, async (req, res) => {
  const { name, bio, skills, location } = req.body;

  const updatedFields = {
    name,
    bio,
    location,
    skills: skills.split(",").map(skill => skill.trim())
  };

  await User.findByIdAndUpdate(req.user._id, updatedFields);
  req.flash("success", "Profile updated!");
  res.redirect("/profile");
});

// View profile
router.get("/", isLoggedIn, (req, res) => {
  res.render("profile/show", { user: req.user });
});

module.exports = router;
