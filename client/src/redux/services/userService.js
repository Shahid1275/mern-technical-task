import api from "./api";

const UserService = {
  register: (userData) => api.post("/api/auth/register", userData),
  login: (credentials) => api.post("/api/auth/login", credentials),
  logout: () => api.post("/api/auth/logout"),
};

export default UserService;
