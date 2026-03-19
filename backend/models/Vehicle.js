const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true
  },

  brand: {
    type: String,
    required: true
  },

  model: {
    type: String,
    required: true
  },

  vehicleNumber: {
    type: String,
    required: true
  },

  type: {
    type: String,
    required: true
  },

  seats: {
    type: Number,
    required: true
  },

  pricePerDay: {
    type: Number,
    required: true
  },

  pricePerWeek: {
    type: Number,
    required: true
  },

  pricePerMonth: {
    type: Number,
    required: true
  },

  image: {
    type: String
  },

  available: {
    type: Boolean,
    default: true
  },

  // GPS location
  location: {
    lat: {
      type: Number,
      default: 0
    },
    lng: {
      type: Number,
      default: 0
    }
  }

},
{ timestamps: true }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);