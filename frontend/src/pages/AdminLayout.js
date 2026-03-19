import React from "react";
import { Link, Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      
      {/* Sidebar */}
      <div
        className="bg-dark text-white p-3"
        style={{ width: "250px" }}
      >
        <h4 className="text-warning mb-4">👑 Admin Panel</h4>

        <ul className="nav flex-column">

          <li className="nav-item mb-2">
            <Link className="nav-link text-white" to="/admin/dashboard">
              📊 Dashboard
            </Link>
          </li>

          <li className="nav-item mb-2">
            <Link className="nav-link text-white" to="/admin/add-vehicle">
              ➕ Add Vehicle
            </Link>
          </li>

          <li className="nav-item mb-2">
            <Link className="nav-link text-white" to="/admin/manage-vehicles">
              🚗 Manage Vehicles
            </Link>
          </li>

          <li className="nav-item mb-2">
            <Link className="nav-link text-white" to="/admin/bookings">
              📅 Bookings
            </Link>
          </li>

        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4 bg-light">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;