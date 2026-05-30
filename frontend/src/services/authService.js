import API from "API";

const API_URL = "https://vehicle-rental-management-system-1-k1m6.onrender.com/api/auth";

export const registerUser = async (userData) => {
  return await API.post(`${API_URL}/register`, userData);
};

export const loginUser = async (loginData) => {
  return await API.post(`${API_URL}/login`, loginData);
};
