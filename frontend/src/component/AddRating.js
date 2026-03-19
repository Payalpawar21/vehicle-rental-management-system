import React, { useState } from "react";
import axios from "axios";

function AddRating({ vehicleId }) {

  const [rating, setRating] = useState(1);
  const [feedback, setFeedback] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      await axios.post(
        "http://localhost:5000/api/ratings/add",
        {
          vehicleId,
          rating,
          feedback
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );

      alert("Rating submitted successfully ⭐");

      setRating(1);
      setFeedback("");

    } catch (error) {
      console.log(error);
      alert("Rating failed");
    }
  };

  return (

    <div className="card p-3 mt-4">

      <h5>⭐ Rate This Vehicle</h5>

      <form onSubmit={handleSubmit}>

        <div className="mb-2">
          <label>Rating</label>

          <select
            className="form-control"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          >
            <option value="1">1 ⭐</option>
            <option value="2">2 ⭐</option>
            <option value="3">3 ⭐</option>
            <option value="4">4 ⭐</option>
            <option value="5">5 ⭐</option>
          </select>

        </div>

        <div className="mb-2">
          <label>Feedback</label>

          <textarea
            className="form-control"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />

        </div>

        <button className="btn btn-primary mt-2">
          Submit
        </button>

      </form>

    </div>
  );
}

export default AddRating;