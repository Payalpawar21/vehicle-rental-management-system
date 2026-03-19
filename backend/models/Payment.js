const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking"
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  amount: Number,
  transactionId: String,
  paymentStatus: {
    type: String,
    default: "Paid"
  }
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);