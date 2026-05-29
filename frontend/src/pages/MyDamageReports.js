import React, { useEffect, useState } from "react";
import axios from "axios";

function MyDamageReports() {

  const [reports, setReports] = useState([]);

  const fetchReports = async () => {
    try {

      // ✅ token localStorage मधून घ्या
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/damage/my",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setReports(res.data);

    } catch (error) {
      console.log("Error fetching reports:", error);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (

    <div className="container mt-4">

      <h2 className="mb-3">My Damage Reports</h2>

      <table className="table table-bordered">

        <thead className="table-dark">
          <tr>
            <th>Vehicle</th>
            <th>Description</th>
            <th>Cost</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>

          {reports.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">
                No Damage Reports Found
              </td>
            </tr>
          ) : (
            reports.map((r) => (
              <tr key={r._id}>
                <td>{r.vehicle?.name}</td>
                <td>{r.description}</td>
                <td>₹{r.damageCost}</td>
                <td>
                  {r.status === "Pending" && (
                    <span className="badge bg-warning">Pending</span>
                  )}

                  {r.status === "Approved" && (
                    <span className="badge bg-success">Approved</span>
                  )}

                  {r.status === "Rejected" && (
                    <span className="badge bg-danger">Rejected</span>
                  )}
                </td>
              </tr>
            ))
          )}

        </tbody>

      </table>

    </div>
  );
}

export default MyDamageReports;