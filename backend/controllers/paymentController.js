const Payment = require("../models/Payment");
const Razorpay = require("razorpay");
const Booking = require("../models/Booking");

let razorpay = null;

// Initialize Razorpay
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {

  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

}

// ===============================
// Create Razorpay Order
// ===============================

exports.createOrder = async (req, res) => {

  try {

    const { bookingId, amount } = req.body;

    if (!razorpay) {
      return res
        .status(500)
        .json({ message: "Razorpay keys missing in .env file" });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const options = {
      amount: amount * 100, // ₹ → paise
      currency: "INR",
      receipt: `receipt_${bookingId}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
    });

  } catch (error) {

    console.log("Create Order Error:", error);

    res.status(500).json({
      message: "Order creation failed",
      error: error.message,
    });

  }

};

// ===============================
// Verify Payment
// ===============================

exports.verifyPayment = async (req, res) => {

  try {

    const { bookingId, razorpayPaymentId } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.paymentStatus = "Paid";
    booking.razorpayPaymentId = razorpayPaymentId;

    await booking.save();

    res.json({
      success: true,
      message: "Payment Successful",
      booking,
    });

  } catch (error) {

    console.log("Verify Payment Error:", error);

    res.status(500).json({
      message: "Payment verification failed",
      error: error.message,
    });

  }

};


const savePayment = async (req, res) => {
  try {
    const { bookingId, transactionId, amount } = req.body;

    // Save payment
    const payment = new Payment({
      bookingId,
      userId: req.user._id,
      amount,
      transactionId,
      paymentStatus: "Paid"
    });

    await payment.save();

    // Update booking
    await Booking.findByIdAndUpdate(bookingId, {
      paymentStatus: "Paid"
    });

    res.json({ message: "Payment saved successfully" });

  } catch (error) {
    res.status(500).json({ message: "Payment save error" });
  }
};

module.exports = { savePayment };
