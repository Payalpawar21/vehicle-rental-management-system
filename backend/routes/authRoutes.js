const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  sendOTP,
  verifyOTP,
  adminResetPassword,
  updateProfile,
} = require("../controllers/authController");

const { protect, admin } = require("../middleware/authMiddleware");

//admin only
router.post("/admin/reset-password", protect, admin, adminResetPassword);

// Register new user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

// Forgot password
router.post("/forgot-password", forgotPassword);

// Reset password
router.post("/reset-password/:token", resetPassword);

// Update user profile (protected route)
router.put("/profile", protect, updateProfile);

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

module.exports = router;




