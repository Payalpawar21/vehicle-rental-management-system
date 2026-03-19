import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddVehicle() {

  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState({
    name: "",
    brand: "",
    model: "",
    vehicleNumber: "",
    type: "",
    seats: "",
    pricePerDay: "",
    pricePerWeek: "",
    pricePerMonth: ""
  });

  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setVehicle({
      ...vehicle,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const user = JSON.parse(localStorage.getItem("user"));

      const formData = new FormData();

      formData.append("name", vehicle.name);
      formData.append("brand", vehicle.brand);
      formData.append("model", vehicle.model);
      formData.append("vehicleNumber", vehicle.vehicleNumber);
      formData.append("type", vehicle.type);
      formData.append("seats", vehicle.seats);
      formData.append("pricePerDay", vehicle.pricePerDay);
      formData.append("pricePerWeek", vehicle.pricePerWeek);
      formData.append("pricePerMonth", vehicle.pricePerMonth);
      formData.append("image", image);

      await axios.post(
        "http://localhost:5000/api/vehicles",
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      alert("Vehicle Added Successfully 🚗");

      navigate("/admin/vehicles");

    } catch (error) {

      console.log(error);
      alert("Error adding vehicle");

    }
  };

  return (

    <div className="container mt-5">

      <div className="card shadow p-4">

        <h3 className="mb-4 text-center">
          🚗 Add New Vehicle
        </h3>

        <form onSubmit={handleSubmit}>

          <div className="mb-3">
            <label className="form-label">Vehicle Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Enter vehicle name"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Brand</label>
            <input
              type="text"
              name="brand"
              className="form-control"
              placeholder="Toyota / Honda / Tata"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Model</label>
            <input
              type="text"
              name="model"
              className="form-control"
              placeholder="Swift / Creta"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Vehicle Number</label>
            <input
              type="text"
              name="vehicleNumber"
              className="form-control"
              placeholder="MH12AB1234"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Vehicle Type</label>
            <input
              type="text"
              name="type"
              className="form-control"
              placeholder="Car / Bike / SUV"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Seats</label>
            <input
              type="number"
              name="seats"
              className="form-control"
              placeholder="Number of seats"
              onChange={handleChange}
              required
            />
          </div>

          {/* Rental Pricing */}

          <div className="mb-3">
            <label className="form-label">Price Per Day</label>
            <input
              type="number"
              name="pricePerDay"
              className="form-control"
              placeholder="₹ Price per day"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Price Per Week</label>
            <input
              type="number"
              name="pricePerWeek"
              className="form-control"
              placeholder="₹ Price per week"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Price Per Month</label>
            <input
              type="number"
              name="pricePerMonth"
              className="form-control"
              placeholder="₹ Price per month"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Vehicle Image</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) => setImage(e.target.files[0])}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-success w-100"
          >
            Add Vehicle
          </button>

        </form>

      </div>

    </div>

  );
}

export default AddVehicle;
