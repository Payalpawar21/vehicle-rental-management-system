import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../utils/auth";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

function EditVehicle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState({
    name: "",
    brand: "",
    type: "",
    fuelType: "",
    rentPerDay: "",
    image: "",
  });

  useEffect(() => {
    fetchVehicle();
  }, []);

  const fetchVehicle = async () => {
    const res = await axios.get("http://localhost:5000/api/vehicles");
    const found = res.data.find((v) => v._id === id);
    setVehicle(found);
  };

  const handleChange = (e) => {
    setVehicle({ ...vehicle, [e.target.name]: e.target.value });
  };

  const updateVehicle = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:5000/api/vehicles/${id}`, vehicle, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      toast.success("Vehicle Updated Successfully");
      navigate("/admin/vehicles");
    } catch (error) {
      toast.error("Update Failed");
    }
  };

  return (
    <div className="container mt-5 col-md-6">
      <h2 className="fw-bold text-center">Edit Vehicle</h2>

      <form className="card shadow p-4 mt-4" onSubmit={updateVehicle}>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Vehicle Name"
          name="name"
          value={vehicle.name || ""}
          onChange={handleChange}
        />

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Brand"
          name="brand"
          value={vehicle.brand || ""}
          onChange={handleChange}
        />

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Type"
          name="type"
          value={vehicle.type || ""}
          onChange={handleChange}
        />

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Fuel Type"
          name="fuelType"
          value={vehicle.fuelType || ""}
          onChange={handleChange}
        />

        <input
          type="number"
          className="form-control mb-3"
          placeholder="Rent Per Day"
          name="rentPerDay"
          value={vehicle.rentPerDay || ""}
          onChange={handleChange}
        />

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Image URL"
          name="image"
          value={vehicle.image || ""}
          onChange={handleChange}
        />

        <button className="btn btn-primary w-100">Update Vehicle</button>
      </form>
    </div>
  );
}

export default EditVehicle;
