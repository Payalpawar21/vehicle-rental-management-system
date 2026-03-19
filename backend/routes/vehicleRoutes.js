const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const Vehicle = require("../models/Vehicle");

const { protect, admin } = require("../middleware/authMiddleware");

const { addVehicle } = require("../controllers/adminController");

const {
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle
} = require("../controllers/vehicleController");


// ============================
// Public Routes
// ============================

// Get all vehicles
router.get("/", getVehicles);

// Get vehicle by ID
router.get("/:id", getVehicleById);


// ============================
// Admin Routes
// ============================

// Add vehicle
router.post("/", protect, admin, upload.single("image"), addVehicle);

// Update vehicle
router.put("/:id", protect, admin, updateVehicle);

// Delete vehicle
router.delete("/:id", protect, admin, deleteVehicle);


// ============================
// GPS Vehicle Tracking API
// ============================

router.post("/vehicle/location", async (req, res) => {
  try {
    const { vehicleId, lat, lng } = req.body;

    console.log("🔥 API HIT:", vehicleId, lat, lng);

    if (!vehicleId || !lat || !lng) {
      return res.status(400).json({ message: "Missing data" });
    }

    const vehicle = await Vehicle.findByIdAndUpdate(
      vehicleId,
      {
        $set: {
          "location.lat": lat,
          "location.lng": lng
        }
      },
      { new: true }
    );

    console.log("✅ UPDATED VEHICLE:", vehicle);

    res.json(vehicle);

  } catch (error) {
    console.log("❌ ERROR:", error);
    res.status(500).json({ message: "Error updating location" });
  }
});


module.exports = router;