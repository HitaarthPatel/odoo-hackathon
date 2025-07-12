const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const flash = require("connect-flash");
const User = require("./models/user");
require("dotenv").config();

const app = express();


const path = require("path");
app.use(express.static(path.join(__dirname, "../public")));

// Middleware
app.use(express.urlencoded({ extended: true }));  // Required for form parsing
app.use(session({
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.static("public"));

// Passport config
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash + current user in locals
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// Connect DB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected to skill_swap"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));


// Routes
const authRoutes = require("./routes/auth");
app.use("/", authRoutes);
app.use("/profile", require("./routes/profile"));
const userRoutes = require("./routes/users"); // ✅ Correct path
app.use("/users", userRoutes); // ✅ Mount the route
const swapRoutes = require("./routes/swaps");
app.use("/swaps", swapRoutes);



app.set("view engine", "ejs");

app.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:5000");
});
