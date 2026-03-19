const express = require("express");
const router = express.Router();
const DamageReport = require("../models/DamageReport");
const upload = require("../middleware/uploadMiddleware");
const { protect, admin } = require("../middleware/authMiddleware");


// ================================
// USER: Report Damage
// ================================
router.post("/report", protect, upload.single("photo"), async (req, res) => {
  try {

    const report = new DamageReport({
      user: req.user._id,
      vehicle: req.body.vehicleId,
      description: req.body.description,
      damageCost: req.body.damageCost,
      photo: req.file ? req.file.filename : "",
      status: "Pending"
    });

    const savedReport = await report.save();

    res.json({
      message: "Damage reported successfully",
      report: savedReport
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});


// ================================
// ADMIN: View All Reports
// ================================
router.get("/all", protect, admin, async (req, res) => {

  try {

    const reports = await DamageReport
      .find()
      .populate("vehicle", "name")
      .populate("user", "name email");

    res.json(reports);

  } catch (error) {

    res.status(500).json({
      message: "Error fetching reports"
    });

  }

});


// ================================
// ADMIN: Approve Insurance
// ================================
router.put("/approve/:id", protect, admin, async (req, res) => {

  try {

    const report = await DamageReport.findByIdAndUpdate(
      req.params.id,
      { status: "Approved", insuranceClaimed: true },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.json(report);

  } catch (error) {

    res.status(500).json({
      message: "Error approving report"
    });

  }

});


// ================================
// USER: My Damage Reports
// ================================
router.get("/my", protect, async (req, res) => {

  try {

    const reports = await DamageReport
      .find({ user: req.user._id })
      .populate("vehicle", "name");

    res.json(reports);

  } catch (error) {

    res.status(500).json({
      message: "Error fetching user reports"
    });

  }

});


module.exports = router;