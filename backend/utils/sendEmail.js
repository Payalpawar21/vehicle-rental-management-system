const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, html) => {
  try {

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // 🔥 IMPORTANT
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"Vehicle Rental 🚗" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent:", info.response);

  } catch (error) {
    console.log("❌ Email error:", error.message);
  }
};

module.exports = sendEmail;