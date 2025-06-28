import { configureStore } from "@reduxjs/toolkit";
export const store = configureStore({
  reducer: {
    // shop: shopReducer,    // All state managed under 'shop'
    // Future reducers (e.g., user: userReducer)
  },
});
