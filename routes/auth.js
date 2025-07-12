const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user.js");
const upload=require("../middleware/upload.js");

router.get("/test",(req,res)=>{
    console.log("route working");
    res.send("rpute working");
});


router.get("/login",(req,res)=>{
   res.render("./login.ejs");
})
router.get("/register",(req,res)=>{
   res.render("./register.ejs");
})
// Register




router.get("/register", (req, res) => {
  res.render("register");
});
router.post("/register", upload.single("profileImage"), async (req, res) => {
  try {
    const { email, password, bio, location, skills } = req.body;

    const user = new User({
      email,
      bio,
      location,
      skills: skills ? skills.split(",").map(s => s.trim()) : [],
    });

    // Handle image upload
    if (req.file) {
      user.profileImage = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    const registeredUser = await User.register(user, password);

    req.login(registeredUser, err => {
      if (err) {
        req.flash("error", "Login after registration failed.");
        return res.redirect("/login");
      }
      res.redirect(`/users/${registeredUser._id}`);
    });
  } catch (e) {
    console.error("Registration error:", e);
    req.flash("error", e.message);
    res.redirect("/register");
  }
});


// Login
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }),
  (req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect("/home"); // redirect wherever you want after login
  }
);


// GET logout
router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged out successfully!");
    res.redirect("/home");
  });
});


const { isLoggedIn } = require("../middleware/auth");

router.get("/dashboard", isLoggedIn, (req, res) => {
  res.render("dashboard");
});


// Logout
router.post("/logout", (req, res) => {
req.logout(() => {
res.json({ message: "Logged out" });
});
});




router.get("/home",(req,res)=>{
    res.render("home.ejs");
})




// Protected route
router.get("/profile", (req, res) => {
if (req.isAuthenticated()) {
res.json({ user: req.user });
} else {
res.status(401).json({ message: "Unauthorized" });
}
});

module.exports = router;