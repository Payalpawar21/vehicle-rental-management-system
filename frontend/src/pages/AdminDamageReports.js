import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminDamageReports() {

  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {

    try {

      const { data } = await axios.get(
        "http://localhost:5000/api/damage/all",
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );

      setReports(data);

    } catch (error) {
      console.log(error);
    }
  };

  const approveReport = async (id) => {

    try {

      await axios.put(
        `http://localhost:5000/api/damage/approve/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );

      alert("Insurance Approved");

      fetchReports();

    } catch (error) {
      console.log(error);
    }
  };

  // 🔍 Search Filter
  const filteredReports = reports.filter((r) =>
    r.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.vehicle?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (

    <div className="container mt-4">

      <h2 className="mb-3">🛠 Damage Reports</h2>

      {/* 🔍 Search Bar */}

      <div className="mb-3">

        <input
          type="text"
          className="form-control"
          placeholder="🔍 Search by User or Vehicle"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      <table className="table table-bordered table-striped">

        <thead className="table-dark">
          <tr>
            <th>User</th>
            <th>Vehicle</th>
            <th>Description</th>
            <th>Cost</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {filteredReports.length === 0 ? (

            <tr>
              <td colSpan="6" className="text-center">
                No Reports Found
              </td>
            </tr>

          ) : (

            filteredReports.map((r) => (

              <tr key={r._id}>

                <td>{r.user?.name}</td>

                <td>{r.vehicle?.name}</td>

                <td>{r.description}</td>

                <td>₹{r.damageCost}</td>

                <td>{r.status}</td>

                <td>

                  {r.status === "Pending" && (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => approveReport(r._id)}
                    >
                      Approve
                    </button>
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

export default AdminDamageReports;