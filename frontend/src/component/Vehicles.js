// src/pages/Vehicles.js
import React, { useEffect, useState } from "react";
import axios from "axios";



const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/vehicles", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVehicles(data);
      } catch (error) {
        console.log("Vehicles fetch error:", error);
      }
    };

    fetchVehicles();
  }, [token]);

  return (
    <div>
      <h2>Available Vehicles</h2>
      {vehicles.length === 0 && <p>No vehicles found</p>}
      <ul>
        {vehicles.map(v => (
          <li key={v._id}>
            <h3>{v.name}</h3>
            <p>Price per day: ₹{v.price}</p>
            <button>Book Now</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Vehicles;
