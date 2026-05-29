import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    vehicles: 0,
    users: 0,
    bookings: 0,
    revenue: 0,
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
useEffect(() => {
  const fetchStats = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;

      const { data } = await axios.get(
        "http://localhost:5000/api/admin/stats",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setStats({
        vehicles: data.totalVehicles,
        users: data.totalUsers,
        bookings: data.totalBookings,
        revenue: data.totalRevenue,
      });

    } catch (error) {
      console.error("Dashboard Error", error);
    }
  };

  fetchStats();
}, []);

  return (
    <div className="container mt-4">
      <h2 className="fw-bold mb-4 text-center">Admin Dashboard</h2>
      

      {/* Stats Cards */}
      <div className="row g-4">
        <DashboardCard title="Total Vehicles" value={stats.vehicles} color="primary" />
        <DashboardCard title="Total Users" value={stats.users} color="success" />
        <DashboardCard title="Total Bookings" value={stats.bookings} color="warning" />
        <DashboardCard title="Total Revenue (₹)" value={stats.revenue} color="danger" />
      </div>

      

      {/* Action Buttons */}
      <div className="row mt-5">
        <div className="col-md-3">
          <ActionButton text="Manage Vehicles" onClick={() => navigate("/vehicles")} />
        </div>
        <div className="col-md-3">
          <ActionButton text="Manage Bookings" onClick={() => navigate("/admin/bookings")} />
        </div>
        <div className="col-md-3">
          <ActionButton text="Payments" onClick={() => navigate("/admin/payments")} />
        </div>
        <div className="col-md-3">
          <ActionButton text="Users" onClick={() => navigate("/admin/users")} />
        </div>
      </div>
    </div>
  );
};



/* Small Components */

const DashboardCard = ({ title, value, color }) => (
  <div className="col-md-3">
    <div className={`card text-white bg-${color} shadow-lg`}>
      <div className="card-body text-center">
        <h6 className="card-title">{title}</h6>
        <h2 className="fw-bold">{value}</h2>
      </div>
    </div>
  </div>
);

const ActionButton = ({ text, onClick }) => (
  <button
    className="btn btn-outline-dark w-100 py-3 fw-bold shadow-sm"
    onClick={onClick}
  >
    {text}
  </button>

  
);

export default AdminDashboard;