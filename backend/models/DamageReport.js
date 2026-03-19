const mongoose = require("mongoose");

const damageReportSchema = new mongoose.Schema({

  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    required: true
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  description: {
    type: String,
    required: true
  },

  damageCost: {
    type: Number,
    default: 0
  },

  insuranceClaimed: {
    type: Boolean,
    default: false
  },

  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending"
  }

}, { timestamps: true });

module.exports = mongoose.model("DamageReport", damageReportSchema);