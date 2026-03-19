const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    required: true
  },

  fromDate: {
    type: Date,
    required: true
  },

  toDate: {
    type: Date,
    required: true
  },

  totalAmount: {
    type: Number,
    required: true
  },

  location: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: [
      "Booked",
      "Paid",
      "Cancelled",
      "Completed",
      "Refund Requested",
      "Refunded",
      
    ],
    default: "Booked"
  },

  razorpayOrderId: {
    type: String
  },

  razorpayPaymentId: {
    type: String
  },

  refundId: {
    type: String
  }

},
{ timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);