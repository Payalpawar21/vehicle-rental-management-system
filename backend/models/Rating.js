const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    feedback: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rating", ratingSchema);