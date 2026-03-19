import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminUsers() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {

    try {

      const user = JSON.parse(localStorage.getItem("user"));

      const { data } = await axios.get(
        "http://localhost:5000/api/admin/users",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setUsers(data);
      setLoading(false);

    } catch (error) {
      console.error("Fetch Users Error:", error);
      setLoading(false);
    }
  };

  // 🔍 Search Filter
  const filteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="text-center mt-5">
        <h4>Loading Users...</h4>
      </div>
    );
  }

  return (

    <div className="container mt-5">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">

        <h2 className="fw-bold">👨‍💻 User Management</h2>

        <div className="badge bg-primary fs-6 p-2">
          Total Users : {filteredUsers.length}
        </div>

      </div>

      {/* 🔍 Search Bar */}
      <div className="mb-3">

        <input
          type="text"
          className="form-control"
          placeholder="🔍 Search by Name or Email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      {/* Users Table */}
      <div className="card shadow-lg border-0">

        <div className="card-body">

          <div className="table-responsive">

            <table className="table table-hover align-middle">

              <thead className="table-dark">
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th> {/* ✅ Address Column */}
                  <th>Role</th>
                </tr>
              </thead>

              <tbody>

                {filteredUsers.length === 0 ? (

                  <tr>
                    <td colSpan="5" className="text-center text-muted">
                      No Users Found
                    </td>
                  </tr>

                ) : (

                  filteredUsers.map((u) => (

                    <tr key={u._id}>

                      <td>

                        <div className="d-flex align-items-center">

                          <img
                            src={`https://ui-avatars.com/api/?name=${u.name}&background=random`}
                            alt={u.name}
                            className="rounded-circle me-2"
                            width="40"
                            height="40"
                          />

                          <span className="fw-semibold">
                            {u.name}
                          </span>

                        </div>

                      </td>

                      <td>{u.email}</td>

                      <td>{u.phone || "N/A"}</td>

                      <td>{u.address || "N/A"}</td> {/* ✅ Address Show */}

                      <td>

                        {u.isAdmin ? (

                          <span className="badge bg-success">
                            Admin
                          </span>

                        ) : (

                          <span className="badge bg-secondary">
                            User
                          </span>

                        )}

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminUsers;