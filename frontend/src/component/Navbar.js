import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUser, logout } from "../utils/auth";

function Navbar() {
  const user = getUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow">
      <div className="container">

        {/* Logo */}
        <Link className="navbar-brand fw-bold" to="/">
          🚗 Vehicle Rental
        </Link>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">

            {/* Vehicles */}
            <li className="nav-item">
              <Link className="nav-link" to="/vehicles">
                Vehicles
              </Link>
            </li>

           <li className="nav-item dropdown">
  <a
    className="nav-link dropdown-toggle fw-semibold"
    href="/#"
    role="button"
    data-bs-toggle="dropdown"
  >
    ☰ Menu
  </a>

  <ul className="dropdown-menu dropdown-menu-end shadow">

    {/* USER MENU */}
    {user && !user.isAdmin && (
      <>
        <li className="dropdown-header text-primary">
          User Menu
        </li>

        <li>
          <Link className="dropdown-item" to="/my-bookings">
            📑 My Bookings
          </Link>
        </li>

        <li>
          <Link className="dropdown-item" to="/report-damage">
            ⚠️ Report Damage
          </Link>
        </li>

        <li>
          <Link className="dropdown-item" to="/my-damage-reports">
            📋 My Damage Reports
          </Link>
        </li>

        <li>
          <hr className="dropdown-divider" />
        </li>
      </>
    )}

    {/* COMMON MENU */}
    <li className="dropdown-header text-success">
      General
    </li>

    <li>
      <Link className="dropdown-item" to="/tracking">
        📍 Vehicle Tracking
      </Link>
    </li>

    <li>
      <Link className="dropdown-item" to="/profile">
        👤 Profile
      </Link>
    </li>

    {/* ADMIN MENU */}
    {user && user.isAdmin && (
      <>
        <li>
          <hr className="dropdown-divider" />
        </li>

        <li className="dropdown-header text-danger">
          Admin Menu
        </li>

        <li>
          <Link className="dropdown-item" to="/admin/damage-reports">
            🛠 Damage Reports
          </Link>
        </li>
      </>
    )}

   {user && user.isAdmin && (
  <li className="nav-item">
    <Link className="dropdown-item" to="/admin/ratings">
      ⭐ Ratings and feedback
    </Link>
  </li>
)} 

  </ul>
</li>



            {/* Admin Dashboard (outside menu) */}
            {user && user.isAdmin && (
              <li className="nav-item">
                <Link
                  className="nav-link text-warning fw-bold"
                  to="/admin/dashboard"
                >
                  👑 Admin Dashboard
                </Link>
              </li>
            )}

            {/* Guest */}
            {!user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}

            {/* Logout */}
            {user && (
              <li className="nav-item">
                <button
                  className="btn btn-danger btn-sm ms-3"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;