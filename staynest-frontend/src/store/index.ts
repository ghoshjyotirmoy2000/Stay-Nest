import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import hotelReducer from "./slices/hotelSlice";
import bookingReducer from "./slices/bookingSlice";
import roomReducer from "./slices/roomSlice";
import adminReducer from "./slices/adminSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    hotel: hotelReducer,
    booking: bookingReducer,
    room: roomReducer,
    admin: adminReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;