// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <Navigate to="/login" replace />;

  if (role === "admin" && !user.isAdmin) return <Navigate to="/" replace />;
  if (role === "user" && user.isAdmin) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;