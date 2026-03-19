import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Vehicles.css";

function Vehicles() {

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [showMore, setShowMore] = useState({});


  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/vehicles");
      setVehicles(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleBookNow = (vehicleId) => {
    if (!user) {
      navigate("/login");
    } else {
      navigate(`/vehicle/${vehicleId}`);
    }
  };

  const toggleMore = (id) => {

setShowMore((prev) => ({
...prev,
[id]: !prev[id]
}));

};


  // 🔎 Filter Logic
  const filteredVehicles = vehicles.filter((v) => {

    const nameMatch = v.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const typeMatch =
      typeFilter === "" || v.type === typeFilter;

    const priceMatch =
      priceFilter === "" ||
      (priceFilter === "low" && v.pricePerDay < 1000) ||
      (priceFilter === "mid" &&
        v.pricePerDay >= 1000 &&
        v.pricePerDay <= 3000) ||
      (priceFilter === "high" && v.pricePerDay > 3000);

    return nameMatch && typeMatch && priceMatch;
  });

  if (loading) {
    return (
      <div className="text-center mt-5">
        <h4>Loading Vehicles...</h4>
      </div>
    );
  }

  return (

    <div className="container mt-5">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">🚗 Available Vehicles</h2>

        {user && user.isAdmin && (
          <button
            className="btn btn-success"
            onClick={() => navigate("/admin/add-vehicle")}
          >
            + Add Vehicle
          </button>
        )}
      </div>

      {/* 🔎 Search + Filters */}
      <div className="row mb-4">

        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Search Vehicle"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-md-4">
          <select
            className="form-control"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="2-W">2 Wheeler</option>
            <option value="4-W">4 Wheeler</option>
          </select>
        </div>

        <div className="col-md-4">
          <select
            className="form-control"
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
          >
            <option value="">All Prices</option>
            <option value="low">Below ₹1000</option>
            <option value="mid">₹1000 - ₹3000</option>
            <option value="high">Above ₹3000</option>
          </select>
        </div>

      </div>

      {/* Vehicles List */}
      <div className="row">

        {filteredVehicles.length === 0 ? (
          <h5 className="text-center text-muted">
            No Vehicles Found
          </h5>
        ) : (

          filteredVehicles.map((vehicle) => (

            <div className="col-md-4 mb-4" key={vehicle._id}>

              <div className="card vehicle-card shadow border-0">

                <div className="position-relative">

                  <img
                    src={`http://localhost:5000/images/${vehicle.image}`}
                    alt={vehicle.name}
                    className="card-img-top"
                    style={{ height: "220px", objectFit: "cover" }}
                  />

                  <span className="badge bg-dark position-absolute top-0 end-0 m-2">
                    ₹{vehicle.pricePerDay}/day
                  </span>

                </div>

                <div className="card-body">

<h5 className="fw-bold">{vehicle.name}</h5>

<p className="text-muted">
{vehicle.brand}  {vehicle.model}
</p>

<p className="mb-1">
<strong>Vehicle No:</strong> {vehicle.vehicleNumber}
</p>

<p className="text-muted mb-2">
{vehicle.type} • {vehicle.seats} Seats
</p>





{/* More Info Button */}

<button
className="btn btn-outline-secondary btn-sm mb-3"
onClick={() => toggleMore(vehicle._id)}
>
{showMore[vehicle._id] ? "Less Information" : "More Information"}
</button>

{/* Extra Information */}

{showMore[vehicle._id] && (

<div className="mb-3">

<hr/>

<p>
<strong>Daily Price:</strong> ₹{vehicle.pricePerDay}
</p>

<p>
<strong>Weekly Price:</strong> ₹{vehicle.pricePerWeek || "-"}
</p>

<p>
<strong>Monthly Price:</strong> ₹{vehicle.pricePerMonth || "-"}
</p>

<p>
<strong>Fuel Type:</strong> Petrol
</p>

<p>
<strong>Transmission:</strong> Manual
</p>

</div>

)}

{user && !user.isAdmin && (

<button
className="btn btn-primary w-100"
onClick={() => handleBookNow(vehicle._id)}
>
Book Now
</button>

)}

</div>


              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
}

export default Vehicles;