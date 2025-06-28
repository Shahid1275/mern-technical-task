import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// Async Thunks for API operations
export const registerUser = createAsyncThunk(
  "user/register",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${backendUrl}/api/auth/register`, {
        name,
        email,
        password,
      });

      if (response.data.success) {
        toast.success("Registration successful! Please log in.");
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Registration failed");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${backendUrl}/api/auth/login`, {
        email,
        password,
      });

      if (response.data.success) {
        toast.success("Login successful!");
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().user;
      const response = await axios.post(
        `${backendUrl}/api/auth/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success("Logged out successfully!");
        return {};
      } else {
        throw new Error(response.data.message || "Logout failed");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  "user/fetchProfile",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().user;
      const response = await axios.get(`${backendUrl}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch profile");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      return rejectWithValue(errorMessage);
    }
  }
);

// Initial state
const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
  registerStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  loginStatus: "idle",
  logoutStatus: "idle",
  profileStatus: "idle",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      state.registerStatus = "idle";
      state.loginStatus = "idle";
      state.logoutStatus = "idle";
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
    resetAuthStatus: (state) => {
      state.error = null;
      state.registerStatus = "idle";
      state.loginStatus = "idle";
      state.logoutStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.registerStatus = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.registerStatus = "succeeded";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.registerStatus = "failed";
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.loginStatus = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.loginStatus = "succeeded";
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.loginStatus = "failed";
      })
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.logoutStatus = "loading";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.logoutStatus = "succeeded";
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.logoutStatus = "failed";
      })
      // Fetch Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.profileStatus = "loading";
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.profileStatus = "succeeded";
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.profileStatus = "failed";
      });
  },
});

// Export actions
export const { setCredentials, clearCredentials, resetAuthStatus } =
  userSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.user.user;
export const selectAuthToken = (state) => state.user.token;
export const selectAuthLoading = (state) => state.user.loading;
export const selectAuthError = (state) => state.user.error;
export const selectRegisterStatus = (state) => state.user.registerStatus;
export const selectLoginStatus = (state) => state.user.loginStatus;
export const selectLogoutStatus = (state) => state.user.logoutStatus;
export const selectProfileStatus = (state) => state.user.profileStatus;

export default userSlice.reducer;
