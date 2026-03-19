import React from "react";
import { Navigate } from "react-router-dom";
import { getUser } from "../utils/auth";

function AdminRoute({ children }) {
  const user = getUser();

  if (!user || !user.isAdmin) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default AdminRoute;




