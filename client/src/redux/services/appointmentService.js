import api from "./api";

const AppointmentService = {
  create: (data) => api.post("/api/appointments/create", data),
  getAll: () => api.get("/api/appointments"),
  getById: (id) => api.get(`/api/appointments/${id}`),
  update: (id, data) => api.put(`/api/appointments/${id}`, data),
  delete: (id) => api.delete(`/api/appointments/${id}`),
};

export default AppointmentService;
