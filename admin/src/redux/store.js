import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "./features/adminSlice";

export const store = configureStore({
  reducer: {
    admin: adminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActionPaths: ["payload.headers"],
        ignoredPaths: ["admin.appointments.0.date"],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});
