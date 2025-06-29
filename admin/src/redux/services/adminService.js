import api from "./api";

export default {
  login: (credentials) => api.post("/login", credentials),
  getAllAppointments: () => api.get("/appointments"),
  getAllUsers: () => api.get("/users"),
};
