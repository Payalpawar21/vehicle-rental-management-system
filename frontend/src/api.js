import axios from "axios";

const API = axios.create({
  baseURL: "https://vehicle-rental-management-system-llbf.onrender.com",
});

export default API;
