const mongoose = require("mongoose");

const swapRequestSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: String,
  status: {
    type: String,
    enum: ["pending", "accepted", "declined"],
    default: "pending"
  }
}, { timestamps: true });

module.exports = mongoose.model("SwapRequest", swapRequestSchema);
