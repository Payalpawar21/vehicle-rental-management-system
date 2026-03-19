const Booking = require("../models/Booking");

// GET user bookings
exports.getUserBookings = async (req, res) => {
  try {

    const bookings = await Booking
      .find({ user: req.user._id })
      .populate("vehicle");

    res.status(200).json(bookings);

  } catch (error) {

    console.log("Fetch Bookings Error:", error);

    res.status(500).json({ message: error.message });

  }
};

// CREATE BOOKING
exports.createBooking = async (req, res) => {

  try {

    const {
      vehicle,
      fromDate,
      toDate,
      totalDays,
      totalAmount,
      paymentMethod,
      location
    } = req.body;

    const booking = new Booking({

      user: req.user._id,
      vehicle,
      fromDate,
      toDate,
      totalDays,
      totalAmount,
      paymentMethod,
      location,
      status: "Booked"

    });

    await booking.save();

    res.status(201).json(booking);

  } catch (error) {

    console.log("Create Booking Error:", error);

    res.status(500).json({ message: error.message });

  }

};

// CANCEL BOOKING
exports.cancelBooking = async (req, res) => {

  try {

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await booking.deleteOne();

    res.status(200).json({ message: "Booking cancelled successfully" });

  } catch (error) {

    console.log("Cancel Error:", error);

    res.status(500).json({ message: error.message });

  }

};

