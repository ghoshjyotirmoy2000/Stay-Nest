import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import { getErrorMessage } from "../../utils/getErrorMessage";

type Hotel = {
  id: string;
  ownerId: string;
  name: string;
  description?: string;
  city: string;
  country: string;
  amenities: string[];
  images: string[];
  rating: string;
  totalReviews: number;
  createdAt: string;
};

type HotelState = {
  hotels: Hotel[];
  ownerHotels: Hotel[];
  selectedHotel: Hotel | null;
  nextCursor: string | null;
  hasNextPage: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialState: HotelState = {
  hotels: [],
  ownerHotels: [],
  selectedHotel: null,
  nextCursor: null,
  hasNextPage: true,
  isLoading: false,
  error: null,
};

// ==================== THUNKS ====================

export const getAllHotels = createAsyncThunk(
  "hotel/getAll",
  async (params: { cursor?: string; city?: string; country?: string }, { rejectWithValue }) => {
    try {
      const res = await api.get("/hotel/all-hotels", { params });
      return res.data.data.hotels;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to fetch hotels"));
    }
  }
);

export const getHotelById = createAsyncThunk(
  "hotel/getById",
  async (hotelId: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/hotel/hotel-by-id/${hotelId}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to fetch hotel"));
    }
  }
);

export const getOwnerHotels = createAsyncThunk(
  "hotel/getByOwner",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/hotel/hotels-by-owner-id");
      return res.data.data.hotels;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to fetch owner hotels"));
    }
  }
);

export const createHotel = createAsyncThunk(
  "hotel/create",
  async (data: { name: string; description?: string; city: string; country: string; amenities: string[]; images?: string[] }, { rejectWithValue }) => {
    try {
      const res = await api.post("/hotel/create-hotel", data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to create hotel"));
    }
  }
);

export const updateHotel = createAsyncThunk(
  "hotel/update",
  async ({ hotelId, data }: { hotelId: string; data: Partial<{ name: string; description: string; city: string; country: string; amenities: string[]; images: string[] }> }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/hotel/update-hotel/${hotelId}`, data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to update hotel"));
    }
  }
);

export const deleteHotel = createAsyncThunk(
  "hotel/delete",
  async (hotelId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/hotel/delete-hotel/${hotelId}`);
      return hotelId;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to delete hotel"));
    }
  }
);

// ==================== SLICE ====================

const hotelSlice = createSlice({
  name: "hotel",
  initialState,
  reducers: {
    resetHotels: (state) => {
      state.hotels = [];
      state.nextCursor = null;
      state.hasNextPage = true;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // get all hotels
    builder
      .addCase(getAllHotels.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllHotels.fulfilled, (state, action) => {
        state.isLoading = false;
        const { hotelData, nextCursor, hasNextPage } = action.payload;
        // append for infinite scroll, replace for fresh fetch
        if (action.meta.arg.cursor) {
          state.hotels = [...state.hotels, ...hotelData];
        } else {
          state.hotels = hotelData;
        }
        state.nextCursor = nextCursor;
        state.hasNextPage = hasNextPage;
      })
      .addCase(getAllHotels.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // get hotel by id
    builder
      .addCase(getHotelById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getHotelById.fulfilled, (state, action) => {
        state.selectedHotel = action.payload;
        state.isLoading = false;
      })
      .addCase(getHotelById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // get owner hotels
    builder
      .addCase(getOwnerHotels.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOwnerHotels.fulfilled, (state, action) => {
        state.ownerHotels = action.payload;
        state.isLoading = false;
      })
      .addCase(getOwnerHotels.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // create hotel
    builder
      .addCase(createHotel.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createHotel.fulfilled, (state, action) => {
        state.ownerHotels = [action.payload, ...state.ownerHotels];
        state.isLoading = false;
      })
      .addCase(createHotel.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // update hotel
    builder
      .addCase(updateHotel.fulfilled, (state, action) => {
        state.ownerHotels = state.ownerHotels.map(h =>
          h.id === action.payload.id ? action.payload : h
        );
        state.isLoading = false;
      })
      .addCase(updateHotel.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // delete hotel
    builder
      .addCase(deleteHotel.fulfilled, (state, action) => {
        state.ownerHotels = state.ownerHotels.filter(h => h.id !== action.payload);
      })
      .addCase(deleteHotel.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { resetHotels, clearError } = hotelSlice.actions;
export default hotelSlice.reducer;