const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const { protect } = require("../middleware/authMiddleware");

// CREATE Booking
router.post("/", protect, async (req, res) => {
  try {
    const { vehicle, fromDate, toDate, totalAmount, location } = req.body;

    const newFrom = new Date(fromDate);
    const newTo = new Date(toDate);

    // 🔥 Proper Overlap Check
    const conflict = await Booking.findOne({
      vehicle: vehicle,
      $or: [
        {
          fromDate: { $lte: newTo },
          toDate: { $gte: newFrom },
        },
      ],
    });

    if (conflict) {
      return res.status(400).json({
        message: "Vehicle already booked for selected dates",
      });
    }

    const booking = new Booking({
      user: req.user._id,
      vehicle,
      fromDate: newFrom,
      toDate: newTo,
      totalAmount,
      location,
      status: "Booked",
    });

    await booking.save();

    res.status(201).json({ message: "Booking Successful" });

  } catch (error) {
    console.log("Booking Error:", error);
    res.status(500).json({ message: "Booking Failed" });
  }
});

// GET Logged-in user bookings
router.get("/my-bookings", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user._id,
    }).populate("vehicle");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// DELETE Booking
router.delete("/:id", protect, async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking Cancelled" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/refund-request/:bookingId", protect, async (req, res) => {

  try {

    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    booking.status = "refund requested";

    await booking.save();

    res.json({
      message: "Refund request submitted"
    });

  } catch (error) {

    res.status(500).json({
      message: "Refund request failed"
    });

  }

});

module.exports = router;
