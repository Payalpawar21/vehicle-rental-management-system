const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const { protect, admin } = require("../middleware/authMiddleware");

const { addVehicle } = require("../controllers/adminController");

const {
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle
} = require("../controllers/vehicleController");

const Vehicle = require("../models/Vehicle");


// ============================
// PUBLIC ROUTES
// ============================

// Get all vehicles
router.get("/", getVehicles);

// Get vehicle by ID
router.get("/:id", getVehicleById);


// ============================
// ADMIN ROUTES
// ============================

// Add vehicle
router.post(
  "/",
  protect,
  admin,
  upload.single("image"),
  addVehicle
);

// Update vehicle
router.put(
  "/:id",
  protect,
  admin,
  updateVehicle
);

// Delete vehicle
router.delete(
  "/:id",
  protect,
  admin,
  deleteVehicle
);


// ============================
// GPS VEHICLE TRACKING API
// ============================

router.post("/vehicle/location", async (req, res) => {
  try {
    const { vehicleId, lat, lng } = req.body;

    if (!vehicleId || lat === undefined || lng === undefined) {
      return res.status(400).json({
        message: "Missing data"
      });
    }

    const vehicle = await Vehicle.findByIdAndUpdate(
      vehicleId,
      {
        $set: {
          "location.lat": lat,
          "location.lng": lng,
        },
      },
      { new: true }
    );

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found"
      });
    }

    res.json(vehicle);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error updating location"
    });
  }
});

module.exports = router;