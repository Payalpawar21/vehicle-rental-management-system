const DamageReport = require("../models/DamageReport");

// Create Damage Report
const reportDamage = async (req, res) => {
  try {

    const damage = new DamageReport({
      user: req.user._id,
      vehicle: req.body.vehicleId,
      description: req.body.description,
      damageCost: req.body.damageCost,
      photo: req.file ? req.file.filename : "",
      status: "Pending"
    });

    const savedDamage = await damage.save();

    res.json(savedDamage);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};


// Get all damage reports (Admin)
const getAllReports = async (req, res) => {
  try {

    const reports = await DamageReport.find()
      .populate("user", "name")
      .populate("vehicle", "name");

    res.json(reports);

  } catch (error) {
    res.status(500).json({ message: "Error fetching reports" });
  }
};


// Approve damage report
const approveDamage = async (req, res) => {
  try {

    const report = await DamageReport.findByIdAndUpdate(
      req.params.id,
      { status: "Approved", insuranceClaimed: true },
      { new: true }
    );

    res.json(report);

  } catch (error) {
    res.status(500).json({ message: "Error approving report" });
  }
};


// Get user damage reports
const getMyReports = async (req, res) => {
  try {

    const reports = await DamageReport.find({ user: req.user._id })
      .populate("vehicle", "name");

    res.json(reports);

  } catch (error) {
    res.status(500).json({ message: "Error fetching reports" });
  }
};


module.exports = {
  reportDamage,
  getAllReports,
  approveDamage,
  getMyReports
};