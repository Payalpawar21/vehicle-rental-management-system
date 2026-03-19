// utils/auth.js

// Save Token
export const saveToken = (token) => {
  localStorage.setItem("token", token);
};

// Get Token
export const getToken = () => {
  return localStorage.getItem("token");
};

// Save User
export const saveUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

// Get User
export const getUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

// Logout
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
