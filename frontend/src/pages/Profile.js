import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken, getUser, saveUser } from "../utils/auth";
import { toast } from "react-toastify";

function Profile() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const user = getUser();
    if (user) {
      setForm({
        name: user.name,
        phone: user.phone,
        address: user.address,
      });
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        "http://localhost:5000/api/users/profile",
        form,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      saveUser(res.data.user);
      toast.success("Profile Updated Successfully");
    } catch (error) {
      toast.error("Profile Update Failed");
    }
  };

  return (
    <div className="container mt-5 col-md-6">
      <h2 className="fw-bold text-center">My Profile</h2>

      <form className="card shadow p-4 mt-4" onSubmit={updateProfile}>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
        />

        <textarea
          className="form-control mb-3"
          placeholder="Address"
          name="address"
          value={form.address}
          onChange={handleChange}
          required
        />

        <button className="btn btn-primary w-100">Update Profile</button>
      </form>
    </div>
  );
}

export default Profile;


