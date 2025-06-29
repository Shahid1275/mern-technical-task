import api from "./api";

const UserService = {
  register: async (userData) => {
    const response = await api.post("/api/auth/register", userData);
    if (response.data.success && response.data.data.token) {
      localStorage.setItem("token", response.data.data.token);
    }
    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post("/api/auth/login", credentials);
    if (response.data.success && response.data.data.token) {
      localStorage.setItem("token", response.data.data.token);
    }
    return response.data;
  },
  logout: async () => {
    const response = await api.post("/api/auth/logout");
    localStorage.removeItem("token");
    return response.data;
  },
};

export default UserService;
