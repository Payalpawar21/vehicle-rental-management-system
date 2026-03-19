const express = require("express");
const Razorpay = require("razorpay");

const router = express.Router();
const Booking = require("../models/Booking");
const { protect, admin } = require("../middleware/authMiddleware");

const razorpay = new Razorpay({
key_id: process.env.RAZORPAY_KEY_ID,
key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ==============================
// CREATE RAZORPAY ORDER
// ==============================

router.post("/create-order", protect, async (req, res) => {

const { amount } = req.body;

const order = await razorpay.orders.create({
  amount: amount * 100,
  currency: "INR"

});

res.json(order);

});

router.post("/verify", async (req, res) => {
  try {

    const { bookingId, razorpayPaymentId, razorpayOrderId } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        razorpayPaymentId: razorpayPaymentId,
        razorpayOrderId: razorpayOrderId,
        status: "Paid"
      },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    res.json({
      message: "Payment verified",
      booking
    });

  } catch (error) {

    console.log("Verify Payment Error:", error);

    res.status(500).json({
      message: "Payment verification failed"
    });

  }
});
// ==============================
// REFUND PAYMENT (ADMIN ONLY)
// ==============================
router.post("/refund-request/:bookingId", protect, async (req, res) => {

  try {

    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    booking.status = "Refund Requested";

    await booking.save({ validateBeforeSave: false });

    res.json({
      message: "Refund request submitted"
    });

  } catch (error) {
    console.log("Refund Error:", error);

    res.status(500).json({
      message: "Refund request failed"
    });

  }

});

router.get("/refund-requests", protect, admin, async (req, res) => {

  try {

    const bookings = await Booking.find({
      status: "Refund Requested"
    }).populate("user vehicle");

    res.json(bookings);

  } catch (error) {

    res.status(500).json({
      message: "Error fetching refund requests"
    });

  }

});

// PROCESS REFUND (ADMIN)

router.post("/refund/:bookingId", protect, admin, async (req, res) => {

  try {

    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    booking.status = "Refunded";

    await booking.save({ validateBeforeSave: false });

    res.json({
      message: "Refund processed successfully"
    });

  } catch (error) {

    console.log("Refund Error:", error);

    res.status(500).json({
      message: "Refund failed"
    });

  }

});

module.exports = router;
