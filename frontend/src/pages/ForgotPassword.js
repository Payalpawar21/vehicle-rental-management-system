import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleForgot = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email }
      );

      toast.success("Reset link sent to email!");
      console.log("Reset Link:", res.data.resetUrl);
    } catch (error) {
  console.log(error.response?.data); // 🔥 debug

  toast.error(
    error.response?.data?.message || "Something went wrong"
  );
}
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="fw-bold text-center mb-3">Forgot Password</h2>

        <p className="text-center text-muted">
          Enter your email to reset password.
        </p>

        <form onSubmit={handleForgot}>
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button className="btn btn-warning w-100 fw-bold">
            Send Reset Link
          </button>
        </form>

        <p className="text-center mt-3">
          Back to{" "}
          <Link to="/login" className="fw-bold text-decoration-none">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;

