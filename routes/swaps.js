const express = require("express");
const router = express.Router();
const SwapRequest = require("../models/swapRequest");
const User = require("../models/user");
const { isLoggedIn } = require("../middleware/auth");

// Show swap request form
router.get("/new/:receiverId", isLoggedIn, async (req, res) => {
  const receiver = await User.findById(req.params.receiverId);
  res.render("swap/new", { receiver });
});

// Handle form submission
router.post("/", isLoggedIn, async (req, res) => {
  const { receiverId, message } = req.body;

  await SwapRequest.create({
    sender: req.user._id,
    receiver: receiverId,
    message
  });

  req.flash("success", "Swap request sent!");
  res.redirect("/users");
});

// View incoming and outgoing swap requests
router.get("/", isLoggedIn, async (req, res) => {
  try {
    const incoming = await SwapRequest.find({ receiver: req.user._id }).populate("sender");
    const outgoing = await SwapRequest.find({ sender: req.user._id }).populate("receiver");

    res.render("swap/index", { incoming, outgoing });
  } catch (err) {
    console.error("Error loading swap requests:", err);
    req.flash("error", "Something went wrong.");
    res.redirect("/");
  }
});


// Accept a swap request
router.post("/:id/accept", isLoggedIn, async (req, res) => {
  try {
    await SwapRequest.findByIdAndUpdate(req.params.id, { status: "accepted" });
    req.flash("success", "Swap request accepted.");
    res.redirect("/swaps");
  } catch (err) {
    console.error("Accept error:", err);
    req.flash("error", "Could not accept request.");
    res.redirect("/swaps");
  }
});

// Decline a swap request
router.post("/:id/decline", isLoggedIn, async (req, res) => {
  try {
    await SwapRequest.findByIdAndUpdate(req.params.id, { status: "declined" });
    req.flash("info", "Swap request declined.");
    res.redirect("/swaps");
  } catch (err) {
    console.error("Decline error:", err);
    req.flash("error", "Could not decline request.");
    res.redirect("/swaps");
  }
});

module.exports = router;
