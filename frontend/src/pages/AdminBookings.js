import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminBookings() {

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {

    try {

      const user = JSON.parse(localStorage.getItem("user"));

      const { data } = await axios.get(
        "http://localhost:5000/api/admin/bookings",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setBookings(data);
      setLoading(false);

    } catch (error) {
      console.error("Booking Fetch Error:", error);
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {

    try {

      const user = JSON.parse(localStorage.getItem("user"));

      await axios.put(
        `http://localhost:5000/api/admin/bookings/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      fetchBookings();

    } catch (error) {
      console.error("Update Error:", error);
    }
  };

  const getStatusBadge = (status) => {

    if (status === "Completed") {
      return <span className="badge bg-success">Completed</span>;
    }

    if (status === "Cancelled") {
      return <span className="badge bg-danger">Cancelled</span>;
    }

    return <span className="badge bg-warning text-dark">Booked</span>;
  };

  // 🔍 Search Filter
  const filteredBookings = bookings.filter((b) =>
    b.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    b.vehicle?.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="text-center mt-5">
        <h4>Loading Bookings...</h4>
      </div>
    );
  }

  return (

    <div className="container mt-5">

      <div className="card shadow-lg border-0">

        <div className="card-body">

          <h3 className="fw-bold mb-4">
            📋 Admin Booking Management
          </h3>

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

          {filteredBookings.length === 0 ? (

            <div className="text-center text-muted">
              <h5>No Bookings Found</h5>
            </div>

          ) : (

            <div className="table-responsive">

              <table className="table table-hover align-middle">

                <thead className="table-dark">

                  <tr>
                    <th>User</th>
                    <th>Vehicle</th>
                    <th>Total Amount</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>

                </thead>

                <tbody>

                  {filteredBookings.map((b) => (

                    <tr key={b._id}>

                      <td>
                        {b.user ? b.user.name : "User Deleted"}
                      </td>

                      <td>
                        {b.vehicle ? b.vehicle.name : "Vehicle Deleted"}
                      </td>

                      <td>
                        <strong>₹{b.totalAmount}</strong>
                      </td>

                       <td>
                        <strong>{b.location}</strong>
                      </td>

                      <td>
                        {getStatusBadge(b.status)}
                      </td>

                      <td>

                        {b.status === "Paid" && (
  <button
    className="btn btn-success btn-sm me-2"
    onClick={() => updateStatus(b._id, "Completed")}
  >
    Complete
  </button>
)}

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            updateStatus(b._id, "Cancelled")
                          }
                        >
                          Cancel
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default AdminBookings;