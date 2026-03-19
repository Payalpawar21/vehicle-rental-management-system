import React, { useEffect, useState } from "react";
import axios from "axios";

function ReportDamage() {

  const [vehicles, setVehicles] = useState([]);
  const [vehicleId, setVehicleId] = useState("");
  const [description, setDescription] = useState("");
  const [damageCost, setDamageCost] = useState("");
  const [photo, setPhoto] = useState(null);

  // Fetch vehicles
  const fetchVehicles = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/vehicles");
      setVehicles(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("vehicleId", vehicleId);
    formData.append("description", description);
    formData.append("damageCost", damageCost);
    formData.append("photo", photo);

    const token = localStorage.getItem("token");

await axios.post(
  "http://localhost:5000/api/damage/report",
  formData,
  {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`
    }
  }
);

    try {

      await axios.post(
  "http://localhost:5000/api/damage/report",
  formData,
  {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`
    }
  }
);

      alert("Damage Report Submitted");

      setVehicleId("");
      setDescription("");
      setDamageCost("");
      setPhoto(null);

    } catch (error) {
      console.log(error);
      alert("Error submitting damage report");
    }
  };

  return (
    <div className="container mt-4">

      <h2>Report Vehicle Damage</h2>

      <form onSubmit={handleSubmit}>

        <div className="mb-3">
          <label>Select Vehicle</label>
          <select
            className="form-control"
            value={vehicleId}
            onChange={(e) => setVehicleId(e.target.value)}
            required
          >
            <option value="">Select Vehicle</option>

            {vehicles.map((v) => (
              <option key={v._id} value={v._id}>
                {v.name}
              </option>
            ))}

          </select>
        </div>

        <div className="mb-3">
          <label>Damage Description</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Damage Cost</label>
          <input
            type="number"
            className="form-control"
            value={damageCost}
            onChange={(e) => setDamageCost(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Upload Photo (Optional)</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setPhoto(e.target.files[0])}
          />
        </div>

        <button className="btn btn-danger">
          Submit Damage Report
        </button>

      </form>

    </div>
  );
}

export default ReportDamage;