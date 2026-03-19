import React, { useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "../component/SearchBar";

function AdminRatings() {

  const [ratings, setRatings] = useState([]);
  const [search, setSearch] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/ratings/all",
        {
          headers: {
            Authorization: `Bearer ${user?.token}`
          }
        }
      );

      console.log("Ratings Data:", res.data);

      // backend response handle
      setRatings(res.data.ratings || res.data);

    } catch (error) {
      console.log(error);
    }

  };

  // Search filter
  const filteredRatings = ratings.filter((r) =>
    r.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.vehicle?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (

    <div className="container mt-4">

      <h2 className="mb-4">⭐ Customer Ratings & Feedback</h2>

      <SearchBar search={search} setSearch={setSearch} />

      <table className="table table-bordered table-striped">

        <thead className="table-dark">
          <tr>
            <th>User</th>
            <th>Vehicle</th>
            <th>Rating</th>
            <th>Feedback</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>

          {filteredRatings.length === 0 ? (

            <tr>
              <td colSpan="5" className="text-center">
                No Ratings Found
              </td>
            </tr>

          ) : (

            filteredRatings.map((r) => (

              <tr key={r._id}>

                <td>{r.user?.name || "N/A"}</td>

                <td>{r.vehicle?.name || "N/A"}</td>

                <td>⭐ {r.rating}</td>

                <td>{r.feedback || "No Feedback"}</td>

                <td>
                  {new Date(r.createdAt).toLocaleDateString()}
                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>

  );
}

export default AdminRatings;