const express = require("express");
const router = express.Router();
const Rating = require("../models/Rating");
const { protect, admin } = require("../middleware/authMiddleware");


// Add Rating
router.post("/add", protect, async (req, res) => {
  try {

    const { vehicleId, rating, feedback } = req.body;

    const newRating = new Rating({
      user: req.user._id,
      vehicle: vehicleId,
      rating,
      feedback
    });

    await newRating.save();

    res.status(201).json({
      success: true,
      message: "Rating added successfully",
      data: newRating
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Get Vehicle Ratings
router.get("/vehicle/:id", async (req, res) => {
  try {

    const ratings = await Rating.find({ vehicle: req.params.id })
      .populate("user", "name");

    res.json(ratings);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Admin view all ratings
router.get("/all", protect, admin, async (req, res) => {
  try {

    const ratings = await Rating.find()
      .populate("user", "name email")
      .populate("vehicle", "name type");

    res.json(ratings);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;