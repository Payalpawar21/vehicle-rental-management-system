const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Vehicle = require("./models/Vehicle");

dotenv.config();

// MongoDB Connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => {
    console.error("MongoDB Connection Failed ❌");
    process.exit(1);
  });

const vehicles = [
  {
    name: "Honda City",
    type: "Car",
    seats: 5,
    pricePerDay: 2000,
    image: "Car.jpg",
    available: true,
  },
  {
    name: "Hyundai Creta",
    type: "Car",
    seats: 5,
    pricePerDay: 1800,
    image: "creta.jpg",
    available: true,
  },
  {
    name: "Toyota Fortuner",
    type: "SUV",
    seats: 7,
    pricePerDay: 3500,
    image: "fortuner.jpg",
    available: true,
  },
  {
    name: "Mahindra Thar",
    type: "SUV",
    seats: 4,
    pricePerDay: 3000,
    image: "thar.jpg",
    available: true,
  },
  {
    name: "Maruti Swift",
    type: "Car",
    seats: 5,
    pricePerDay: 1200,
    image: "swift.jpg",
    available: true,
  },
  {
    name: "Royal Enfield Classic 350",
    type: "Bike",
    seats: 2,
    pricePerDay: 900,
    image: "royal.jpg",
    available: true,
  },
  {
    name: "KTM Duke 390",
    type: "Bike",
    seats: 2,
    pricePerDay: 1100,
    image: "ktm.jpg",
    available: true,
  },
  {
    name: "Activa 6G",
    type: "Scooter",
    seats: 2,
    pricePerDay: 500,
    image: "activa.jpg",
    available: true,
  },
  {
    name: "Tata Nexon",
    type: "SUV",
    seats: 5,
    pricePerDay: 2200,
    image: "nexon.jpg",
    available: true,
  },
  {
    name: "BMW X5",
    type: "Luxury SUV",
    seats: 5,
    pricePerDay: 6000,
    image: "bmw.jpg",
    available: true,
  },
];

const importData = async () => {
  try {
    await Vehicle.deleteMany();
    await Vehicle.insertMany(vehicles);
    console.log("🔥 10 Vehicles Inserted Successfully!");
    process.exit();
  } catch (error) {
    console.error("Error inserting vehicles ❌", error);
    process.exit(1);
  }
};

importData();