import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.REACT_APP_API_URL || "http://localhost:3000";
export const createAppointment = createAsyncThunk(
  "appointments/create",
  async (appointmentData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const { title, date, startTime, endTime, status } = appointmentData;

      // Client-side validation
      if (!title || !date || !startTime || !endTime) {
        throw new Error("All fields are required");
      }

      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
        throw new Error("Invalid time format. Use HH:MM");
      }

      const [startHour, startMin] = startTime.split(":").map(Number);
      const [endHour, endMin] = endTime.split(":").map(Number);
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;
      if (endMinutes <= startMinutes) {
        throw new Error("End time must be after start time");
      }

      const appointmentDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      appointmentDate.setHours(0, 0, 0, 0);

      if (appointmentDate < today) {
        throw new Error("Cannot create appointment for past dates");
      }

      const validStatuses = ["pending", "confirmed", "cancelled"];
      if (status && !validStatuses.includes(status)) {
        throw new Error("Invalid status. Must be pending, confirmed, or cancelled");
      }

      const response = await axios.post(
        `${API_URL}/api/appointments/create`,
        { title, date, startTime, endTime, status: status || "pending" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Appointment created successfully!");
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      toast.error(`Error: ${errorMessage}`);
      return rejectWithValue(errorMessage);
    }
  }
);

export const getAppointments = createAsyncThunk(
  "appointments/getAll",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.get(`${API_URL}/api/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      toast.error(`Error: ${errorMessage}`);
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateAppointment = createAsyncThunk(
  "appointments/update",
  async ({ id, data }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const { title, date, startTime, endTime, status } = data;

      if (!title || !date || !startTime || !endTime) {
        throw new Error("All fields are required");
      }

      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
        throw new Error("Invalid time format. Use HH:MM");
      }

      const [startHour, startMin] = startTime.split(":").map(Number);
      const [endHour, endMin] = endTime.split(":").map(Number);
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;
      if (endMinutes <= startMinutes) {
        throw new Error("End time must be after start time");
      }

      const appointmentDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      appointmentDate.setHours(0, 0, 0, 0);

      if (appointmentDate < today) {
        throw new Error("Cannot update appointment to past dates");
      }

      const validStatuses = ["pending", "confirmed", "cancelled"];
      if (status && !validStatuses.includes(status)) {
        throw new Error("Invalid status. Must be pending, confirmed, or cancelled");
      }

      const response = await axios.put(
        `${API_URL}/api/appointments/${id}`,
        { title, date, startTime, endTime, status: status || "pending" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Appointment updated successfully!");
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      toast.error(`Error: ${errorMessage}`);
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteAppointment = createAsyncThunk(
  "appointments/delete",
  async (id, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      await axios.delete(`${API_URL}/api/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Appointment deleted successfully!");
      return id;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      toast.error(`Error: ${errorMessage}`);
      return rejectWithValue(errorMessage);
    }
  }
);

const initialState = {
  appointments: [],
  loading: false,
  error: null,
};

const appointmentSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments.push(action.payload);
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(getAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAppointment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.appointments.findIndex(
          (app) => app._id === action.payload._id
        );
        if (index !== -1) state.appointments[index] = action.payload;
      })
      .addCase(updateAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = state.appointments.filter(
          (app) => app._id !== action.payload
        );
      })
      .addCase(deleteAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default appointmentSlice.reducer;
