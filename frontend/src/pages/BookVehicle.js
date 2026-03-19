import React, { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import { getToken } from "../utils/auth";
import { useParams, useNavigate } from "react-router-dom";

function BookVehicle() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [location, setLocation] = useState("");
  const [bookedRanges, setBookedRanges] = useState([]);

  const [paymentMethod, setPaymentMethod] = useState("Cash");

  const [totalDays, setTotalDays] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    fetchVehicle();
    fetchBookedDates();
  }, []);

  useEffect(() => {
    if (fromDate && toDate && vehicle) {

      const diffTime = Math.abs(toDate - fromDate);
      const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      setTotalDays(days);
      setTotalAmount(days * vehicle.rentPerDay);
    }
  }, [fromDate, toDate, vehicle]);

  // FETCH VEHICLE
  const fetchVehicle = async () => {
    try {

      const res = await axios.get(
        `http://localhost:5000/api/vehicles/${id}`
      );

      setVehicle(res.data);

    } catch (error) {

      toast.error("Vehicle not found");

    }
  };

  // FETCH BOOKED DATES
  const fetchBookedDates = async () => {

    try {

      const res = await axios.get(
        `http://localhost:5000/api/bookings/booked-dates/${id}`
      );

      setBookedRanges(res.data);

    } catch (error) {

      console.log(error);

    }
  };

  // DISABLE BOOKED DATES
  const isDateBlocked = (date) => {

    for (let range of bookedRanges) {

      const start = new Date(range.fromDate);
      const end = new Date(range.toDate);

      if (date >= start && date <= end) {
        return true;
      }

    }

    return false;
  };

  // CREATE BOOKING
  const createBooking = async () => {

    try {

      await axios.post(
        "http://localhost:5000/api/bookings/create",
        {
          vehicle: id,
          fromDate: fromDate.toISOString().split("T")[0],
          toDate: toDate.toISOString().split("T")[0],
          totalDays,
          totalAmount,
          paymentMethod,
          location
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        }
      );

      toast.success("Booking Successful 🚗");

      navigate("/my-bookings");

    } catch (error) {

      toast.error("Booking Failed");

    }
  };

  // RAZORPAY PAYMENT
  const handlePayment = async () => {

    const user = JSON.parse(localStorage.getItem("user"));

    try {

      const { data } = await axios.post(
        "http://localhost:5000/api/payments/create-order",
        { amount: totalAmount },
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );

      const options = {

        key: "rzp_test_xxxxx",
        amount: data.amount,
        currency: "INR",
        name: "Vehicle Rental",
        description: "Vehicle Booking Payment",
        order_id: data.id,

        handler: function () {

          toast.success("Payment Successful 🎉");

          createBooking();

        },

        theme: {
          color: "#3399cc"
        }

      };

      const razor = new window.Razorpay(options);

      razor.open();

    } catch (error) {

      toast.error("Payment Failed");

    }

  };

  // BOOK BUTTON CLICK
  const handleBooking = () => {

    if (!getToken()) {

      toast.error("Login first to book vehicle!");

      navigate("/login");

      return;
    }

    if (!location) {

      toast.error("Please enter pickup location");

      return;
    }

    if (!fromDate || !toDate) {

      toast.error("Please select booking dates");

      return;
    }

    if (paymentMethod === "Online") {

      handlePayment();

    } else {

      createBooking();

    }

  };

  return (

    <div className="container mt-4">

      {vehicle && (

        <div className="row">

          <div className="col-md-6">

            <img
              src={`http://localhost:5000/images/${vehicle.image}`}
              alt={vehicle.name}
              style={{
                width: "100%",
                height: "350px",
                objectFit: "cover",
                borderRadius: "10px"
              }}
            />

          </div>

          <div className="col-md-6">

            <h2 className="fw-bold">{vehicle.name}</h2>

            <p className="text-muted">{vehicle.description}</p>

            <h4 className="text-success fw-bold">
              Rent Per Day: ₹{vehicle.rentPerDay}
            </h4>

            <hr />

            {/* LOCATION */}

            <div className="mb-3">

              <label className="fw-bold">Pickup Location</label>

              <input
                type="text"
                className="form-control"
                placeholder="Enter Pickup Location (Ex: Pune Railway Station)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />

            </div>

            {/* BOOKING DATES */}

            <h5 className="fw-bold">Select Booking Dates</h5>

            <div className="mb-3">

              <label className="fw-bold">From Date</label>

              <DatePicker
                selected={fromDate}
                onChange={(date) => setFromDate(date)}
                className="form-control"
                minDate={new Date()}
                filterDate={(date) => !isDateBlocked(date)}
              />

            </div>

            <div className="mb-3">

              <label className="fw-bold">To Date</label>

              <DatePicker
                selected={toDate}
                onChange={(date) => setToDate(date)}
                className="form-control"
                minDate={fromDate || new Date()}
                filterDate={(date) => !isDateBlocked(date)}
              />

            </div>

            {/* PAYMENT */}

            <div className="mb-3">

              <label className="fw-bold">Payment Method</label>

              <select
                className="form-control"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >

                <option value="Cash">Cash</option>
                <option value="Online">Online</option>

              </select>

            </div>

            <h5 className="fw-bold text-primary">
              Total Days: {totalDays}
            </h5>

            <h5 className="fw-bold text-danger">
              Total Amount: ₹{totalAmount}
            </h5>

            <button
              className="btn btn-primary w-100 mt-3"
              onClick={handleBooking}
            >
              Book Now
            </button>

          </div>

        </div>

      )}

    </div>

  );

}

export default BookVehicle;