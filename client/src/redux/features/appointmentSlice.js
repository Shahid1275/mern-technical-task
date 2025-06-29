
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import appointmentService from "../services/appointmentService";

// Async thunks for API calls
export const createAppointment = createAsyncThunk(
  "appointments/create",
  async (appointmentData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.user?.token;
      return await appointmentService.createAppointment(appointmentData, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getAppointments = createAsyncThunk(
  "appointments/getAll",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.user?.token;
      return await appointmentService.getAppointments(token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateAppointment = createAsyncThunk(
  "appointments/update",
  async ({ id, appointmentData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.user?.token;
      return await appointmentService.updateAppointment(
        id,
        appointmentData,
        token
      );
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deleteAppointment = createAsyncThunk(
  "appointments/delete",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.user?.token;
      await appointmentService.deleteAppointment(id, token);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  appointments: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

const appointmentSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Appointment
      .addCase(createAppointment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.appointments.push(action.payload);
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.error || "Failed to create appointment";
      })
      // Get Appointments
      .addCase(getAppointments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAppointments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.appointments = action.payload;
      })
      .addCase(getAppointments.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.error || "Failed to fetch appointments";
      })
      // Update Appointment
      .addCase(updateAppointment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateAppointment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.appointments = state.appointments.map((appt) =>
          appt._id === action.payload._id ? action.payload : appt
        );
      })
      .addCase(updateAppointment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.error || "Failed to update appointment";
      })
      // Delete Appointment
      .addCase(deleteAppointment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAppointment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.appointments = state.appointments.filter(
          (appt) => appt._id !== action.payload
        );
      })
      .addCase(deleteAppointment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.error || "Failed to delete appointment";
      });
  },
});

export const { reset } = appointmentSlice.actions;
export default appointmentSlice.reducer;
