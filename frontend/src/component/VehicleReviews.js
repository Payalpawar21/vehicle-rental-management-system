import React, { useEffect, useState } from "react";
import axios from "axios";

function VehicleReviews({ vehicleId }) {

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {

    const { data } = await axios.get(
      `http://localhost:5000/api/ratings/vehicle/${vehicleId}`
    );

    setReviews(data);
  };

  return (

    <div className="mt-4">

      <h4>Customer Reviews</h4>

      {reviews.map((r) => (

        <div key={r._id} className="card p-2 mb-2">

          <strong>{r.user?.name}</strong>

          <p>⭐ {r.rating}</p>

          <p>{r.feedback}</p>

        </div>

      ))}

    </div>

  );
}

export default VehicleReviews;