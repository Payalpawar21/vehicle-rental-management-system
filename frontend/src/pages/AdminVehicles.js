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
        "http://localhost:5000/api/vehicles"
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
        `http://localhost:5000/api/admin/vehicles/${id}`,
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

      <div className="d-flex justify-content-between align-items-center mb-4">

        <h2 className="fw-bold">🚗 Manage Vehicles</h2>

        <Link to="/admin/addvehicle">
          <button className="btn btn-primary">
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

      <div className="row">

        {filteredVehicles.map((vehicle) => (

          <div key={vehicle._id} className="col-md-4 mb-4">

            <div className="card shadow-sm h-100">

              <img
                src={`http://localhost:5000/images/${vehicle.image}`}
                alt={vehicle.name}
                className="card-img-top"
                style={{
                  height: "200px",
                  objectFit: "cover",
                }}
              />

              <div className="card-body">

                <h5 className="card-title fw-bold">
                  {vehicle.name}
                </h5>

                <p className="text-muted">
                  {vehicle.type} • {vehicle.seats} Seats
                </p>

                <h6 className="text-success">
                  ₹{vehicle.pricePerDay} / day
                </h6>

              </div>

              <div className="card-footer d-flex justify-content-between">

                <button
                  className="btn btn-warning btn-sm"
                  onClick={() =>
                    navigate(`/admin/editvehicle/${vehicle._id}`)
                  }
                >
                  Edit
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteVehicle(vehicle._id)}
                >
                  Delete
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default AdminVehicles;
