const User = require("../models/User");
const Vehicle = require("../models/Vehicle");
const Booking = require("../models/Booking");


// GET ALL BOOKINGS
const getAllBookings = async (req, res) => {
  try {

    const bookings = await Booking.find()
      .populate("userId", "name email")
      .populate("vehicleId", "name brand pricePerDay")
      .sort({ createdAt: -1 });

    res.json(bookings);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }
};



// UPDATE BOOKING STATUS
const updateBookingStatus = async (req, res) => {
  try {

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = req.body.status;

    await booking.save();

    res.json({ message: "Booking status updated" });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }
};




// ADD VEHICLE
const addVehicle = async (req, res) => {

  try {

    const {
      name,
      brand,
      model,
      vehicleNumber,
      type,
      seats,
      pricePerDay,
      pricePerWeek,
      pricePerMonth
    } = req.body;

    const vehicle = new Vehicle({

      name,
      brand,
      model,
      vehicleNumber,
      type,
      seats,
      pricePerDay,
      pricePerWeek,
      pricePerMonth,
      image: req.file ? req.file.filename : ""

    });

    const savedVehicle = await vehicle.save();

    res.status(201).json({
      message: "Vehicle Added Successfully",
      vehicle: savedVehicle
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Error adding vehicle"
    });

  }

};




// DASHBOARD STATS
const getDashboardStats = async (req, res) => {

  try {

    const totalUsers = await User.countDocuments({ isAdmin: false });
    const totalVehicles = await Vehicle.countDocuments();
    const totalBookings = await Booking.countDocuments();

    const paidBookings = await Booking.find({ paymentStatus: "Paid" });

    let totalRevenue = 0;

    paidBookings.forEach((b) => {
      totalRevenue += b.totalAmount;
    });

    const pendingPayments = await Booking.countDocuments({
      paymentStatus: "Pending"
    });

    const cancelledBookings = await Booking.countDocuments({
      bookingStatus: "Cancelled"
    });

    const bookings = await Booking.find({ paymentStatus: "Paid" });

    let monthlyRevenue = {};

    bookings.forEach((b) => {

      const date = new Date(b.createdAt);
      const month = date.toLocaleString("default", { month: "short" });
      const year = date.getFullYear();

      const key = `${month}-${year}`;

      if (!monthlyRevenue[key]) {
        monthlyRevenue[key] = 0;
      }

      monthlyRevenue[key] += b.totalAmount;

    });

    const chartData = Object.keys(monthlyRevenue).map((key) => ({
      month: key,
      revenue: monthlyRevenue[key]
    }));

    res.json({
      totalUsers,
      totalVehicles,
      totalBookings,
      totalRevenue,
      pendingPayments,
      cancelledBookings,
      chartData
    });

  } catch (error) {

    res.status(500).json({
      message: "Dashboard error",
      error
    });

  }

};




// PAYMENT DETAILS
const getPaymentDetails = async (req, res) => {

  try {

    const bookings = await Booking.find()
      .populate("user", "name email phone")
      .populate("vehicle", "name brand type rentPerDay")
      .sort({ createdAt: -1 });

    res.json(bookings);

  } catch (error) {

    res.status(500).json({
      message: 
      "Error"
    });

  }

};




// EXPORT
module.exports = {
  addVehicle,
  getAllBookings,
  updateBookingStatus,
  getDashboardStats,
  getPaymentDetails
};

