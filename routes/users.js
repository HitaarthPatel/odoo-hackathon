const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { isLoggedIn } = require("../middleware/auth"); 

// List all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    res.render("users/index", { users });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.redirect("/");
  }
});



router.get("/profile", async (req, res) => {
  const user = await User.findById(req.user._id);
  res.render("users/myprofile", { user }); // ✅
});



router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      req.flash("error", "User not found.");
      return res.redirect("/users");
    }
    res.render("users/show", { user });
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong.");
    res.redirect("/users");
  }
});

module.exports = router;
