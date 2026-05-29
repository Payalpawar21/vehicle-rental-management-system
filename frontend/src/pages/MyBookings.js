import React, { useEffect, useState } from "react";
import axios from "axios";
import VehicleMap from "../component/VehicleMap";


function MyBookings() {

const [bookings, setBookings] = useState([]);
const [loading, setLoading] = useState(true);
const [search, setSearch] = useState("");



const [ratingBookingId, setRatingBookingId] = useState(null);
const [rating, setRating] = useState(0);
const [feedback, setFeedback] = useState("");
const [showMore, setShowMore] = useState({});




const user = JSON.parse(localStorage.getItem("user"));

useEffect(() => {
fetchBookings();
}, []);

const fetchBookings = async () => {


try {

  const { data } = await axios.get(
    "http://localhost:5000/api/bookings/my-bookings",
    {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    }
  );

  setBookings(data);
  setLoading(false);

} catch (error) {
  console.log(error);
  setLoading(false);
}


};


//GPS LOCATION UPDATE

const updateLocation = (vehicleId) => {

  console.log("🚀 Sending Location for:", vehicleId);

  navigator.geolocation.getCurrentPosition(
    async (position) => {

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      console.log("📍 LAT:", lat);
      console.log("📍 LNG:", lng);

      try {
        const res = await axios.post(
          "http://localhost:5000/api/vehicles/vehicle/location",
          { vehicleId, lat, lng }
        );

        console.log("✅ RESPONSE:", res.data);

      } catch (error) {
        console.log("❌ API ERROR:", error.response?.data);
      }
    },
    (error) => {
      console.log("❌ GPS ERROR:", error.message);
    }
  );
};
// ==========================
// Razorpay Payment
// ==========================

const handlePayment = async (booking) => {


try {

  const { data } = await axios.post(
    "http://localhost:5000/api/payments/create-order",
    { amount: booking.totalAmount },
    {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    }
  );

  const options = {

    key: "rzp_test_SO0Jo7eZ1zOSAs",

    amount: data.amount,

    currency: "INR",

    name: "Vehicle Rental",

    description: "Vehicle Booking Payment",

    order_id: data.id,

    handler: async function (response) {

      //VERIFY PAYMENT

      await axios.post(
        "http://localhost:5000/api/payments/verify",
        {
          bookingId: booking._id,
          razorpayPaymentId: response.razorpay_payment_id
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      //GPS SAVE AFTER PAYMENT

      updateLocation(booking.vehicle._id || booking.vehicleId);

      alert("Payment Successful 🎉");

      fetchBookings();

    }

  };

  const razor = new window.Razorpay(options);

  razor.open();

} catch (error) {

  console.log(error);

  alert("Payment Failed");

}


};


//RATINGS


const openRating = (bookingId) => {
  setRatingBookingId(bookingId);
};

const submitRating = async (booking) => {

try{

await axios.post(
"http://localhost:5000/api/ratings/add",
{
vehicleId: booking.vehicle._id,
rating: rating,
feedback: feedback
},
{
headers:{
Authorization:`Bearer ${user.token}`
}
}
);

alert("Rating submitted successfully ⭐");

setRating(0);
setFeedback("");

fetchBookings();

}catch(error){

console.log(error);
alert("Rating failed");

}

};






// ==========================
// Cancel Booking
// ==========================

const cancelBooking = async (id) => {


if (!window.confirm("Are you sure you want to cancel this booking?")) {
  return;
}

try {

  await axios.delete(
    `http://localhost:5000/api/bookings/${id}`,
    {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    }
  );

  alert("Booking Cancelled ❌");

  fetchBookings();

} catch (error) {

  alert("Error Cancelling Booking");

}


};

const toggleMore = (id) => {

setShowMore((prev) => ({
...prev,
[id]: !prev[id]
}));

};


// REFUND REQUEST

const requestRefund = async (bookingId) => {

  console.log("Refund Booking ID:", bookingId);

  try {

    await axios.post(
      `http://localhost:5000/api/payments/refund-request/${bookingId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
    );

    alert("Refund request sent successfully");

    fetchBookings();

  } catch (error) {

    console.log(error.response?.data);

    alert("Refund request failed");

  }

};
// 🔍 Filter bookings
const filteredBookings = bookings.filter((b) =>
b.vehicle?.name?.toLowerCase().includes(search.toLowerCase())
);

const getStatusBadge = (status) => {


if (status === "Paid") return <span className="badge bg-success">Paid</span>;
if (status === "Refund Requested") return <span className="badge bg-warning text-dark">Refund Requested</span>;
if (status === "Refunded") return <span className="badge bg-info">Refunded</span>;
if (status === "Cancelled") return <span className="badge bg-danger">Cancelled</span>;

return <span className="badge bg-secondary">Booked</span>;


};

if (loading) {


return (
  <div className="text-center mt-5">
    <h4>Loading Your Bookings...</h4>
  </div>
);


}

return (


<div className="container mt-5">

  <h2 className="fw-bold mb-4">🚗 My Bookings</h2>

  {/* 🔍 Search */}

  <div className="mb-4">

    <input
      type="text"
      className="form-control"
      placeholder="🔍 Search by Vehicle Name"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />

  </div>


  {filteredBookings.length === 0 ? (

    <div className="text-center text-muted">
      <h5>No bookings found</h5>
    </div>

  ) : (

    <div className="row">

      {filteredBookings.map((booking) => (

        <div key={booking._id} className="col-md-6 mb-4">

          <div className="card shadow border-0 h-100">

            <img
              src={`http://localhost:5000/images/${booking.vehicle?.image}`}
              alt={booking.vehicle?.name}
              className="card-img-top"
              style={{ height: "200px", objectFit: "cover" }}
            />

     <div className="card-body">

<h5 className="fw-bold">
{booking.vehicle?.name}
</h5>

<p className="text-muted">
{booking.vehicle?.brand} {booking.vehicle?.model}
</p>

<p>
<strong>Vehicle Number:</strong> {booking.vehicle?.vehicleNumber}
</p>

<p className="text-muted">
{booking.vehicle?.type} • {booking.vehicle?.seats} Seats
</p>

<p>
<strong>Pickup Location:</strong> {booking.location}
</p>

<p>
<strong>From:</strong>{" "}
{new Date(booking.fromDate).toDateString()}
<br/>

<strong>To:</strong>{" "}
{new Date(booking.toDate).toDateString()}
</p>

<h5 className="text-primary">
₹ {booking.totalAmount}
</h5>


 <VehicleMap vehicle={booking.vehicle}/>               

<p>Status: {getStatusBadge(booking.status)}</p>

{/* MORE INFO BUTTON */}

<button
className="btn btn-outline-primary btn-sm"
onClick={() => toggleMore(booking._id)}
>
{showMore[booking._id] ? "Less Information" : "More Information"}
</button>

{/* EXTRA INFO */}

{showMore[booking._id] && (

<div className="mt-3">

<hr/>

<p>
<strong>Daily Price:</strong> ₹{booking.vehicle?.pricePerDay}
</p>

<p>
<strong>Weekly Price:</strong> ₹{booking.vehicle?.pricePerWeek}
</p>

<p>
<strong>Monthly Price:</strong> ₹{booking.vehicle?.pricePerMonth}
</p>

<p>
<strong>Fuel Type:</strong> Petrol
</p>

<p>
<strong>Transmission:</strong> Manual
</p>

</div>

)}


{/* Rating Section */}

{booking.status === "Paid" && booking.rating == null && (

<div className="mt-3">

<button
className="btn btn-primary btn-sm"
onClick={() => openRating(booking._id)}
>
⭐ Rate & Review
</button>

</div>

)}

{ratingBookingId === booking._id && (

<div className="mt-3 p-3 border rounded">

<div style={{fontSize:"22px"}}>

{[1,2,3,4,5].map((star) => (

<span
key={star}
style={{
cursor:"pointer",
color: star <= rating ? "#ffc107" : "#ccc",
fontSize:"26px"
}}
onClick={() => setRating(star)}
>
★
</span>

))}

</div>

<textarea
className="form-control mt-2"
placeholder="Write your feedback..."
value={feedback}
onChange={(e) => setFeedback(e.target.value)}
/>

<button
className="btn btn-primary btn-sm"
onClick={() => submitRating(booking)}
>
Submit Review
</button>


</div>

)}



              {/* Buttons */}

            <div className="d-flex gap-2 mt-3">

  {booking.status === "Booked" && (
    <button
      className="btn btn-success"
      onClick={() => handlePayment(booking)}
    >
      💳 Pay Now
    </button>
  )}

  {booking.status === "Paid" && (
    <button
      className="btn btn-warning"
      onClick={() => requestRefund(booking._id)}
    >
      Refund Request
    </button>
  )}

  

  {booking.status !== "Cancelled" && (
    <button
      className="btn btn-outline-danger"
      onClick={() => cancelBooking(booking._id)}
    >
      Cancel Booking
    </button>
  )}

</div>

            </div>

          </div>

        </div>

      ))}

    </div>

  )}

</div>


);

}

export default MyBookings;
