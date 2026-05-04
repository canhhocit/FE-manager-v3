import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const loginApi = (username, password) => 
    api.post("/auth/login", { username, password });

export const registerApi = (data) => 
    api.post("/auth/register", data);

// Event APIs
export const getEventsApi = (params) => 
    api.get("/events/search", { params });

export default api;
export const API_BASE = api.defaults.baseURL;
