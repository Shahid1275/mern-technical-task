import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_ADMIN_API_URL || "http://localhost:3000/api/admin",
});

// Auto-inject admin token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("adminToken");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

export default api;
