import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./component/Navbar";
import PrivateRoute from "./component/PrivateRoute";
import AdminRoute from "./component/AdminRoute";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Vehicles from "./pages/Vehicles";
import VehicleDetails from "./pages/VehicleDetails";
import BookVehicle from "./pages/BookVehicle";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VehicleLocation from "./pages/VehicleLocation";
import VehicleTracking from "./pages/VehicleTracking";
import AdminDamageReports from "./pages/AdminDamageReports";
import ReportDamage from "./pages/ReportDamage";
import MyDamageReports from "./pages/MyDamageReports";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminVehicles from "./pages/AdminVehicles";
import AddVehicle from "./pages/AddVehicle";
import EditVehicle from "./pages/EditVehicle";
import AdminUsers from "./pages/AdminUsers";
import AdminBookings from "./pages/AdminBookings";
import AdminPayments from "./pages/AdminPayments";
import AdminLayout  from "./pages/AdminLayout";
import AdminRefundRequests from "./pages/AdminRefundRequests";
import AdminRatings from "./pages/AdminRatings";

function App() {
  return (
    <Router>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/vehicle/:id" element={<VehicleDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/admin" element={<AdminLayout />}/>
        <Route path="/vehicle-location" element={<VehicleLocation />} />
        <Route path="/tracking" element={<VehicleTracking />} />
        <Route path="/admin/damage-reports" element={<AdminDamageReports />} />
        <Route path="/report-damage" element={<ReportDamage />} />
        <Route path="/admin/ratings" element={<AdminRatings />} />
        

        {/* ================= USER PROTECTED ================= */}
        <Route
          path="/book/:id"
          element={
            <PrivateRoute>
              <BookVehicle />
            </PrivateRoute>
          }
        />

        <Route
          path="/my-bookings"
          element={
            <PrivateRoute>
              <MyBookings />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route path="/my-damage-reports" element={<MyDamageReports />} />

        {/* ================= ADMIN PROTECTED ================= */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/vehicles"
          element={
            <AdminRoute>
              <AdminVehicles />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/add-vehicle"
          element={
            <AdminRoute>
              <AddVehicle />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/editvehicle/:id"
          element={
            <AdminRoute>
              <EditVehicle />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/bookings"
          element={
            <AdminRoute>
              <AdminBookings />
            </AdminRoute>
          }
        />

        

        <Route
          path="/admin/payments"
          element={
            <AdminRoute>
              <AdminPayments />
            </AdminRoute>
          }
        />

        <Route
  path="/admin/refund-requests"
  element={<AdminRefundRequests />}
/>

        


        

      </Routes>
    </Router>
  );
}

export default App;

