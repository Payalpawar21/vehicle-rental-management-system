require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");

const paymentRoutes = require("./routes/paymentRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const adminRoutes = require("./routes/adminRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const userRoutes = require("./routes/userRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const damageRoutes = require("./routes/damageRoutes");
const ratingRoutes = require("./routes/ratingRoutes");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", userRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/damage", damageRoutes);
app.use("/api/ratings", ratingRoutes);

app.use("/images", express.static("public/images"));

app.get("/", (req, res) => {
  res.send("Vehicle Rental Backend Running Successfully 🚗");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server Running on Port ${PORT}`)
);


