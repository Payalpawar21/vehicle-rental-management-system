import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate, useParams } from "react-router-dom";

function EditVehicle() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState({
    name: "",
    brand: "",
    model: "",
    vehicleNumber: "",
    type: "",
    seats: "",
    pricePerDay: ""
  });

  useEffect(() => {
    fetchVehicle();
  }, []);

  const fetchVehicle = async () => {

    try {

      const token = localStorage.getItem("token");

      const { data } = await API.get(
        `http://localhost:5000/api/vehicles/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setVehicle(data);

    } catch (error) {

      console.log(error);

      alert("Vehicle Fetch Failed");

    }
  };

  const handleChange = (e) => {

    setVehicle({
      ...vehicle,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const token = localStorage.getItem("token");

      await API.put(
        `http://localhost:5000/api/vehicles/${id}`,
        vehicle,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Vehicle Updated Successfully");

      navigate("/vehicles");

    } catch (error) {

      console.log(error);

      alert("Update Failed");

    }
  };

  return (

    <div className="container mt-5">

      <div className="card shadow p-4">

        <h2 className="mb-4">
          Edit Vehicle
        </h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="Vehicle Name"
            className="form-control mb-3"
            value={vehicle.name}
            onChange={handleChange}
          />

          <input
            type="text"
            name="brand"
            placeholder="Brand"
            className="form-control mb-3"
            value={vehicle.brand}
            onChange={handleChange}
          />

          <input
            type="text"
            name="model"
            placeholder="Model"
            className="form-control mb-3"
            value={vehicle.model}
            onChange={handleChange}
          />

          <input
            type="text"
            name="vehicleNumber"
            placeholder="Vehicle Number"
            className="form-control mb-3"
            value={vehicle.vehicleNumber}
            onChange={handleChange}
          />

          <input
            type="text"
            name="type"
            placeholder="Type"
            className="form-control mb-3"
            value={vehicle.type}
            onChange={handleChange}
          />

          <input
            type="number"
            name="seats"
            placeholder="Seats"
            className="form-control mb-3"
            value={vehicle.seats}
            onChange={handleChange}
          />

          <input
            type="number"
            name="pricePerDay"
            placeholder="Price Per Day"
            className="form-control mb-3"
            value={vehicle.pricePerDay}
            onChange={handleChange}
          />

          <button className="btn btn-primary w-100">
            Update Vehicle
          </button>

        </form>

      </div>

    </div>
  );
}

export default EditVehicle;