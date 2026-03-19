const PDFDocument = require("pdfkit");
const Booking = require("../models/Booking");

exports.downloadInvoice = async (req, res) => {
  try {
    const bookingId = req.params.id;

    const booking = await Booking.findById(bookingId)
      .populate("user")
      .populate("vehicle");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Only paid invoice allow
    if (booking.paymentStatus !== "Paid") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice_${bookingId}.pdf`
    );

    const doc = new PDFDocument({ margin: 50 });

    doc.pipe(res);

    // Header
    doc.fontSize(22).text("Vehicle Rental Invoice", { align: "center" });
    doc.moveDown();

    doc.fontSize(14).text(`Invoice ID: ${booking._id}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.moveDown();

    // Customer Info
    doc.fontSize(16).text("Customer Details", { underline: true });
    doc.moveDown(0.5);

    doc.fontSize(12).text(`Name: ${booking.user.name}`);
    doc.text(`Email: ${booking.user.email}`);
    doc.text(`Phone: ${booking.user.phone}`);
    doc.text(`Address: ${booking.user.address}`);
    doc.moveDown();

    // Vehicle Info
    doc.fontSize(16).text("Vehicle Details", { underline: true });
    doc.moveDown(0.5);

    doc.fontSize(12).text(`Vehicle: ${booking.vehicle.name}`);
    doc.text(`Brand: ${booking.vehicle.brand}`);
    doc.text(`Type: ${booking.vehicle.type}`);
    doc.text(`Fuel Type: ${booking.vehicle.fuelType}`);
    doc.text(`Rent/Day: ₹${booking.vehicle.rentPerDay}`);
    doc.moveDown();

    // Booking Info
    doc.fontSize(16).text("Booking Details", { underline: true });
    doc.moveDown(0.5);

    doc.fontSize(12).text(`From Date: ${booking.fromDate}`);
    doc.text(`To Date: ${booking.toDate}`);
    doc.text(`Total Days: ${booking.totalDays}`);
    doc.text(`Total Amount: ₹${booking.totalAmount}`);
    doc.text(`Payment Method: ${booking.paymentMethod}`);
    doc.text(`Payment Status: ${booking.paymentStatus}`);
    doc.moveDown();

    // Razorpay ID (optional)
    if (booking.razorpayPaymentId) {
      doc.text(`Razorpay Payment ID: ${booking.razorpayPaymentId}`);
      doc.moveDown();
    }

    // Footer
    doc.moveDown();
    doc.fontSize(14).text("Thank you for choosing our service!", {
      align: "center",
    });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: "Invoice generation failed", error });
  }
};
