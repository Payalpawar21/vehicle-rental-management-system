import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function VehicleDetails() {

const { id } = useParams();
const navigate = useNavigate();
const user = JSON.parse(localStorage.getItem("user"));

const [vehicle, setVehicle] = useState(null);
const [startDate, setStartDate] = useState(null);
const [endDate, setEndDate] = useState(null);
const [location, setLocation] = useState("");   // ✅ LOCATION STATE

const [showRating, setShowRating] = useState(false);
const [rating, setRating] = useState(0);
const [feedback, setFeedback] = useState("");
const [showMore, setShowMore] = useState(false);


useEffect(() => {
fetchVehicle();
}, [id]);

const fetchVehicle = async () => {
try {


  const { data } = await axios.get(
    `http://localhost:5000/api/vehicles/${id}`
  );

  setVehicle(data);

} catch (error) {
  console.log(error);
}


};

const calculateDays = () => {


if (!startDate || !endDate) return 0;

const diff = endDate - startDate;

return diff / (1000 * 60 * 60 * 24) + 1;


};

const totalDays = calculateDays();

const totalAmount =
totalDays && vehicle
? totalDays * vehicle.pricePerDay
: 0;

// ==========================
// Booking
// ==========================

const handleBooking = async () => {


if (!user) {
  navigate("/login");
  return;
}

if (!location) {
  alert("Please enter pickup location");
  return;
}

if (!startDate || !endDate) {
  alert("Please select booking dates");
  return;
}

try {

  await axios.post(
    "http://localhost:5000/api/bookings",
    {
      vehicle: vehicle._id,
      fromDate: startDate,
      toDate: endDate,
      totalAmount,
      location      // ✅ LOCATION SEND
    },
    {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    }
  );

  alert("Booking Successful 🚗");

  setShowRating(true);

} catch (error) {

  console.log(error);

  alert(
    error.response?.data?.message ||
    "Booking Failed"
  );

}


};

// ==========================
// Rating
// ==========================

const handleRatingSubmit = async () => {


if (!rating) {
  alert("Please select rating");
  return;
}

try {

  await axios.post(
    "http://localhost:5000/api/ratings/add",
    {
      vehicleId: vehicle._id,
      rating: rating,
      feedback: feedback
    },
    {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    }
  );

  alert("Thank you for your feedback ⭐");

  setShowRating(false);
  setRating(0);
  setFeedback("");

  navigate("/my-bookings");

} catch (error) {

  console.log(error);

  alert(
    error.response?.data?.message ||
    "Rating submission failed"
  );

}


};

if (!vehicle)
return <h4 className="text-center mt-5">Loading...</h4>;

return (


<div className="container mt-5">

  <div className="row">

    {/* Vehicle Info */}

    <div className="col-md-6">

<div className="card shadow-lg border-0">

<img
src={`http://localhost:5000/images/${vehicle.image}`}
alt={vehicle.name}
className="card-img-top"
style={{ height:"350px", objectFit:"cover"}}
/>

<div className="card-body">

<h3 className="fw-bold">
{vehicle.name}
</h3>

<p className="text-muted">
{vehicle.brand}  {vehicle.model}
</p>

<p>
<strong>Vehicle Number:</strong> {vehicle.vehicleNumber}
</p>

<p className="text-muted">
{vehicle.type} • {vehicle.seats} Seats
</p>

<h4 className="text-primary">
₹{vehicle.pricePerDay} / day
</h4>

{/* MORE INFO BUTTON */}

<button
className="btn btn-outline-primary btn-sm mt-2"
onClick={()=>setShowMore(!showMore)}
>
{showMore ? "Less Information" : "More Information"}
</button>

{/* EXTRA DETAILS */}

{showMore && (

<div className="mt-3">

<hr/>

<p>
<strong>Weekly Price:</strong> ₹{vehicle.pricePerWeek}
</p>

<p>
<strong>Monthly Price:</strong> ₹{vehicle.pricePerMonth}
</p>

<p>
<strong>Fuel Type:</strong> Petrol
</p>

<p>
<strong>Transmission:</strong> Manual
</p>

<p>
<strong>Availability:</strong> Available
</p>

</div>

)}

</div>

</div>

</div>


    {/* Booking Section */}

    <div className="col-md-6">

      <div className="card shadow-lg p-4 border-0">

        <h4 className="mb-4 fw-bold">
          📅 Book This Vehicle
        </h4>

        {/* LOCATION */}

        <label className="form-label">
          Pickup Location
        </label>

        <input
          type="text"
          className="form-control"
          placeholder="Enter Pickup Location (Ex: Pune Railway Station)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <label className="form-label mt-3">
          Select Start Date
        </label>

        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          className="form-control"
          minDate={new Date()}
        />

        <label className="form-label mt-3">
          Select End Date
        </label>

        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          className="form-control"
          minDate={startDate || new Date()}
        />

        <hr />

        <h5>Total Days: {totalDays}</h5>

        <h4 className="text-success">
          Total Amount: ₹{totalAmount}
        </h4>

        <button
          className="btn btn-success w-100 mt-3"
          onClick={handleBooking}
        >
          Confirm Booking
        </button>

      </div>

    </div>

  </div>

</div>


);

}

export default VehicleDetails;
