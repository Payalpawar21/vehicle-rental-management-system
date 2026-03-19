const express = require("express");
const router = express.Router();
const { addVehicle } = require("../controllers/adminController");
const { protect, admin } = require("../middleware/authMiddleware");

const User = require("../models/User");
const Vehicle = require("../models/Vehicle");
const Booking = require("../models/Booking");
const upload = require("../middleware/uploadMiddleware");


// =============================
// ADMIN ADD VEHICLE
// =============================
router.post("/vehicles", protect, admin, upload.single("image"), addVehicle);


// =============================
// GET ALL BOOKINGS (ADMIN)
// =============================
router.get("/bookings", protect, admin, async (req, res) => {
  try {

    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("vehicle", "name");

    res.json(bookings);

  } catch (error) {

    console.log(error);
    res.status(500).json({ message: "Error fetching bookings" });

  }
});


// =============================
// UPDATE BOOKING STATUS
// =============================
router.put("/bookings/:id", protect, admin, async (req, res) => {
  try {

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = req.body.status;

    await booking.save();

    res.json({
      message: "Booking status updated successfully",
      booking
    });

  } catch (error) {

    console.log("Status Update Error:", error);
    res.status(500).json({ message: "Status update failed" });

  }
});


// =============================
// GET ALL USERS
// =============================
router.get("/users", protect, admin, async (req, res) => {
  try {

    const users = await User.find().select("-password");

    res.json(users);

  } catch (error) {

    console.log(error);
    res.status(500).json({ message: "Error fetching users" });

  }
});


// =============================
// DELETE VEHICLE
// =============================
router.delete("/vehicles/:id", protect, admin, async (req, res) => {

  try {

    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    await vehicle.deleteOne();

    res.json({ message: "Vehicle deleted successfully" });

  } catch (error) {

    console.log(error);
    res.status(500).json({ message: "Error deleting vehicle" });

  }

});


// =============================
// ADMIN PAYMENTS
// =============================
router.get("/payments", async (req, res) => {
  try {
    const payments = await Booking.find()
      .populate("user", "name email")
      .populate("vehicle", "name");

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// =============================
// ADMIN DASHBOARD STATS
// =============================
router.get("/stats", protect, admin, async (req, res) => {

  try {

    const totalUsers = await User.countDocuments();
    const totalVehicles = await Vehicle.countDocuments();
    const totalBookings = await Booking.countDocuments();

    const bookings = await Booking.find();

    const totalRevenue = bookings.reduce(
      (sum, booking) => sum + booking.totalAmount,
      0
    );

    res.json({
      totalUsers,
      totalVehicles,
      totalBookings,
      totalRevenue
    });

  } catch (error) {

    console.log(error);
    res.status(500).json({ message: "Error fetching stats" });

  }

});


router.get("/test", (req, res) => {
  res.json({ message: "Admin route working" });
});


module.exports = router;



