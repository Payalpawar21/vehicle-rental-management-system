require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

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


// ✅ CORS FIX (IMPORTANT FOR VERCEL + RENDER)
app.use(cors({
  origin: [
    "https://vehicle-rental-management-system-hgqkhyvxn.vercel.app",
    "http://localhost:3000"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options("*", cors());

// ✅ FIX: wildcard regex instead of "*"
app.options(/.*/, cors(corsOptions));

// middleware
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


// static files
app.use("/images", express.static("public/images"));


// test route
app.get("/", (req, res) => {
  res.send("Vehicle Rental Backend Running Successfully 🚗");
});


// server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server Running on Port ${PORT}`)
);



