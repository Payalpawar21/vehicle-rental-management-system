const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

// Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ================= REGISTER =================
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password || !phone || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanPassword = password.trim(); // ✅ FIX

    const userExists = await User.findOne({ email: cleanEmail });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(cleanPassword, 10); // ✅ FIX

    const user = await User.create({
      name,
      email: cleanEmail,
      password: hashedPassword,
      phone,
      address,
    });

    res.status(201).json({
      message: "User registered successfully",
      token: generateToken(user._id),
      user,
    });

  } catch (error) {
    console.log("REGISTER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= LOGIN =================
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const cleanEmail = email.toLowerCase().trim();
    const cleanPassword = password.trim(); // ✅ FIX

    console.log("Entered Email:", email);
    console.log("Clean Email:", cleanEmail);
    console.log("Entered Password:", password);

    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(cleanPassword, user.password); // ✅ FIX

    console.log("Password Match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      message: "Login successful",
      token: generateToken(user._id),
      user,
    });

  } catch (error) {
    console.log("LOGIN ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= FORGOT PASSWORD =================
exports.forgotPassword = async (req, res) => {
  try {
    const email = req.body.email.toLowerCase().trim();

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    const message = `
      <h2>Reset Password</h2>
      <a href="${resetUrl}">Click here to reset</a>
    `;

    await sendEmail(user.email, "Password Reset", message);

    res.json({ message: "Email sent successfully ✅" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// ================= RESET PASSWORD =================
exports.resetPassword = async (req, res) => {
  try {
    const resetToken = req.params.token;

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Token invalid or expired" });
    }

    const newPassword = req.body.password.trim(); // ✅ FIX
    user.password = await bcrypt.hash(newPassword, 10);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ message: "Password reset successful 🎉" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= SEND OTP =================
exports.sendOTP = async (req, res) => {
  try {
    const email = req.body.email.toLowerCase().trim();

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpire = Date.now() + 5 * 60 * 1000;

    await user.save();

    const message = `
      <h2>Your OTP is: ${otp}</h2>
      <p>This OTP is valid for 5 minutes.</p>
    `;

    await sendEmail(user.email, "OTP Verification", message);

    res.json({ message: "OTP sent to email ✅" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= VERIFY OTP =================
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpire < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const cleanPassword = password.trim(); // ✅ FIX
    user.password = await bcrypt.hash(cleanPassword, 10);

    user.otp = undefined;
    user.otpExpire = undefined;

    await user.save();

    res.json({ message: "Password reset successful 🎉" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= ADMIN RESET =================
exports.adminResetPassword = async (req, res) => {
  try {
    const { userId, newPassword } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cleanPassword = newPassword.trim(); // ✅ FIX
    user.password = await bcrypt.hash(cleanPassword, 10);

    await user.save();

    res.json({ message: "Password reset by admin ✅" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ================= UPDATE PROFILE =================
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;

    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};