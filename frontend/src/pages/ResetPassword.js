import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `https://vehicle-rental-management-system-1-k1m6.onrender.com/api/auth/reset-password/${token}`,
        { password }
      );

      alert("Password reset successful 🎉");

    } catch (error) {
      alert("Error resetting password");
    }
  };

  return (
    <form onSubmit={handleReset}>
      <input
        type="password"
        placeholder="New Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button>Reset Password</button>
    </form>
  );
}

export default ResetPassword;
