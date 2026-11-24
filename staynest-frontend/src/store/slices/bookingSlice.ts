import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import { getErrorMessage } from "../../utils/getErrorMessage";

type PricingBreakdown = {
  basePrice: number;
  weekendMultiplier: number;
  seasonMultiplier: number;
  lastMinuteDiscount: number;
  occupancyMultiplier: number;
  finalPricePerNight: number;
  nights: number;
  totalPrice: number;
};

type Booking = {
  id: string;
  userId: string;
  roomId: string;
  hotelId: string;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  totalPrice: number;
  status: "CONFIRMED" | "CANCELLED";
  bookingDate: string;
  cancelledAt?: string;
};

type BookingState = {
  bookings: Booking[];
  pricingBreakdown: PricingBreakdown | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: BookingState = {
  bookings: [],
  pricingBreakdown: null,
  isLoading: false,
  error: null,
};

// ==================== THUNKS ====================

export const createBooking = createAsyncThunk(
  "booking/create",
  async (data: { roomId: string; hotelId: string; checkInDate: string; checkOutDate: string; guests: number }, { rejectWithValue }) => {
    try {
      const res = await api.post("/booking/create-booking", data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to create booking"));
    }
  }
);

export const getMyBookings = createAsyncThunk(
  "booking/getMyBookings",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/booking/bookings-by-user");
      return res.data.data.bookings;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to fetch bookings"));
    }
  }
);

export const cancelBooking = createAsyncThunk(
  "booking/cancel",
  async (bookingId: string, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/booking/cancel-booking/${bookingId}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to cancel booking"));
    }
  }
);

export const getHotelBookings = createAsyncThunk(
  "booking/getHotelBookings",
  async (hotelId: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/booking/bookings-by-hotel/${hotelId}`);
      return res.data.data.bookings;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to fetch hotel bookings"));
    }
  }
);

// ==================== SLICE ====================

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setPricingBreakdown: (state, action) => {
      state.pricingBreakdown = action.payload;
    },
    clearPricingBreakdown: (state) => {
      state.pricingBreakdown = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // create booking
    builder
      .addCase(createBooking.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings = [action.payload.booking, ...state.bookings];
        state.pricingBreakdown = action.payload.pricingBreakdown;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // get my bookings
    builder
      .addCase(getMyBookings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyBookings.fulfilled, (state, action) => {
        state.bookings = action.payload;
        state.isLoading = false;
      })
      .addCase(getMyBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // cancel booking
    builder
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.bookings = state.bookings.map(b =>
          b.id === action.payload.id ? action.payload : b
        );
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // get hotel bookings
    builder
      .addCase(getHotelBookings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getHotelBookings.fulfilled, (state, action) => {
        state.bookings = action.payload;
        state.isLoading = false;
      })
      .addCase(getHotelBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setPricingBreakdown, clearPricingBreakdown, clearError } = bookingSlice.actions;
export default bookingSlice.reducer;