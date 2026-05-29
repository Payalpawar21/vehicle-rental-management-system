import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function AddRating({ vehicleId }) {

  const [rating, setRating] = useState(1);
  const [feedback, setFeedback] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login first");
      return;
    }

    if (!rating) {
      toast.error("Please select rating");
      return;
    }

    try {

      await axios.post(
        "http://localhost:5000/api/ratings/add",   // ✅ correct route
        {
          vehicleId: vehicleId,
          rating: Number(rating),
          feedback: feedback
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );

      toast.success("Rating & Feedback submitted successfully ⭐");

      setRating(1);
      setFeedback("");

    } catch (error) {

      console.log(error);
      toast.error(
        error.response?.data?.message || "Error submitting rating"
      );

    }
  };

  return (
    <div className="card p-3 mt-4 shadow-sm">

      <h5 className="mb-3">⭐ Rate this Vehicle</h5>

      <form onSubmit={handleSubmit}>

        <div className="mb-3">
          <label className="form-label">Rating (1 - 5)</label>

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

        <div className="mb-3">
          <label className="form-label">Feedback</label>

          <textarea
            className="form-control"
            rows="3"
            placeholder="Write your feedback..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Submit Rating
        </button>

      </form>

    </div>
  );
}

export default AddRating;