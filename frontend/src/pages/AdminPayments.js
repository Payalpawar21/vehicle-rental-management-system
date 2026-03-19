import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminPayments() {

const [payments, setPayments] = useState([]);
const [loading, setLoading] = useState(true);
const [search, setSearch] = useState("");

useEffect(() => {
fetchPayments();
}, []);

const fetchPayments = async () => {

try {

  const user = JSON.parse(localStorage.getItem("user"));

  const { data } = await axios.get(
    "http://localhost:5000/api/admin/payments",
    {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    }
  );

  setPayments(data);
  setLoading(false);

} catch (error) {

  console.log("Fetch payment error:", error);
  setLoading(false);

}

};


const handleRefund = async (bookingId) => {

if (!window.confirm("Are you sure you want to refund this payment?")) return;

try {

  const user = JSON.parse(localStorage.getItem("user"));

  await axios.post(
    `http://localhost:5000/api/payments/refund/${bookingId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    }
  );

  alert("Refund successful 💸");

  fetchPayments();

} catch (error) {

  console.log("Refund error:", error);
  alert("Refund failed ❌");

}

};

// 🔍 Search Filter
const filteredPayments = payments.filter((p) =>
  p.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
  p.vehicle?.name?.toLowerCase().includes(search.toLowerCase())
);

return (

<div className="container mt-4">

  <h2 className="fw-bold mb-4">💳 Admin Payment Management</h2>

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

  {loading ? (

    <div className="text-center mt-5">
      <div className="spinner-border text-primary"></div>
    </div>

  ) : filteredPayments.length === 0 ? (

    <div className="alert alert-info text-center">
      No payments found
    </div>

  ) : (

    <div className="card shadow border-0">

      <div className="card-body">

        <div className="table-responsive">

          <table className="table table-hover align-middle">

            <thead className="table-dark">
              <tr>
                <th>User</th>
                <th>Vehicle</th>
                <th>Amount</th>
                <th>Payment Status</th>
                 <th>transaction ID</th>
                <th>Refund</th>
               
                <th>Date</th>
              </tr>
            </thead>

            <tbody>

              {filteredPayments.map((p) => (

                <tr key={p._id}>

                  <td className="fw-semibold">
                    {p.user?.name || "User Deleted"}
                  </td>

                  <td>
                    {p.vehicle?.name || "Vehicle Deleted"}
                  </td>

                  <td className="fw-bold text-success">
                    ₹{p.totalAmount}
                  </td>

            


                  <td>

                    {p.status === "Refunded" ? (

                      

                      <span className="badge bg-secondary">
                        Refunded
                      </span>

                    ) : (

                      <span className="badge bg-success">
                        Paid
                      </span>

                    )}

                  </td>
                  <td className="fw-bold text-success">
                  {p.razorpayPaymentId}
                  </td>

                  <td>

                    

                    {p.status !== "Refunded" ? (

                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => handleRefund(p._id)}
                      >
                        Refund
                      </button>

                    ) : (

                      <span className="text-muted small">
                        Completed
                      </span>

                    )}

                  </td>
                   

                  <td>
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>

                  

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  )}

</div>

);

}

export default AdminPayments;