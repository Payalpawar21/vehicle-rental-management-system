import React from "react";
import { Navigate } from "react-router-dom";
import { getUser } from "../utils/auth";

function PrivateRoute({ children }) {
  const user = getUser();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default PrivateRoute;


