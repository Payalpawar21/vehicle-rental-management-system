import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./AdminVehicles.css";

function AdminVehicles() {

  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {

      const { data } = await axios.get(
        "https://vehicle-rental-management-system-1-k1m6.onrender.com/api/vehicles"
      );

      setVehicles(data);

    } catch (error) {
      console.log(error);
    }
  };

  const deleteVehicle = async (id) => {

    if (!window.confirm("Delete this vehicle?")) return;

    try {

      const user = JSON.parse(localStorage.getItem("user"));

      await axios.delete(
        `https://vehicle-rental-management-system-1-k1m6.onrender.com/api/admin/vehicles/${id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      alert("Vehicle Deleted Successfully 🚗");

      fetchVehicles();

    } catch (error) {

      console.log(error);
      alert("Error deleting vehicle");

    }
  };

  const filteredVehicles = vehicles.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase())
  );

  return (

    <div className="container mt-4">

      {/* Top Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">

        <h2 className="fw-bold">🚗 Manage Vehicles</h2>

        <Link to="/admin/addvehicle">
          <button className="btn btn-primary fw-bold">
            + Add Vehicle
          </button>
        </Link>

      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search vehicle..."
        className="form-control mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Vehicle Cards */}
      <div className="row">

        {filteredVehicles.map((vehicle) => (

          <div key={vehicle._id} className="col-md-4 mb-4">

            <div className="card vehicle-card shadow">

              {/* Vehicle Image */}
              <img
                src={`https://vehicle-rental-management-system-1-k1m6.onrender.com/images/${vehicle.image}`}
                alt={vehicle.name}
                className="card-img-top vehicle-img"
              />

              {/* Vehicle Details */}
              <div className="card-body d-flex flex-column">

                <h5 className="fw-bold">
                  {vehicle.name}
                </h5>

                <p className="text-muted mb-2">
                  {vehicle.type} • {vehicle.seats} Seats
                </p>

                <h6 className="text-success fw-bold mb-3">
                  ₹{vehicle.pricePerDay} / day
                </h6>

                {/* Buttons */}
                <div className="mt-auto d-flex gap-2">

                  <button
                    className="btn btn-warning w-50 fw-bold"
                    onClick={() =>
                      navigate(`/admin/editvehicle/${vehicle._id}`)
                    }
                  >
                    ✏ Edit
                  </button>

                  <button
                    className="btn btn-danger w-50 fw-bold"
                    onClick={() => deleteVehicle(vehicle._id)}
                  >
                    🗑 Delete
                  </button>

                </div>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default AdminVehicles;