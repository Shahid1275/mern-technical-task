import { configureStore } from "@reduxjs/toolkit";
import appointmentReducer from "./features/appointmentSlice";
import userReducer from "./features/userSlice";

export const store = configureStore({
  reducer: {
    appointments: appointmentReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActionPaths: ["meta.arg", "payload.timestamp"],
        ignoredPaths: ["appointments.dates"],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});
