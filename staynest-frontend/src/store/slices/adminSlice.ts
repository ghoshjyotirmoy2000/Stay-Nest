import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import { getErrorMessage } from "../../utils/getErrorMessage";

type HotelAdmin = {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
  role: "OWNER";
  createdAt: string;
  _count: { hotels: number };
};

type AppUser = {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
  role: "CUSTOMER" | "OWNER" | "SUPERADMIN";
  createdAt: string;
};

type OwnerHotel = {
  id: string;
  name: string;
  city: string;
  country: string;
  rating: string;
  totalReviews: number;
};

type AdminState = {
  hotelAdmins: HotelAdmin[];
  allUsers: AppUser[];
  ownerHotelsById: Record<string, OwnerHotel[]>;
  isLoading: boolean;
  error: string | null;
};

const initialState: AdminState = {
  hotelAdmins: [],
  allUsers: [],
  ownerHotelsById: {},
  isLoading: false,
  error: null,
};

// ==================== THUNKS ====================

export const getHotelAdmins = createAsyncThunk(
  "admin/getHotelAdmins",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/user/hotel-admins");
      return res.data.data.hotelAdmins;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to fetch hotel admins"));
    }
  }
);

export const getAllUsers = createAsyncThunk(
  "admin/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/user/all-users");
      return res.data.data.users;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to fetch users"));
    }
  }
);

export const getHotelsByOwner = createAsyncThunk(
  "admin/getHotelsByOwner",
  async (ownerId: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/hotel/admin/hotels-by-owner/${ownerId}`);
      return { ownerId, hotels: res.data.data.hotels };
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to fetch owner's hotels"));
    }
  }
);

// ==================== SLICE ====================

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getHotelAdmins.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getHotelAdmins.fulfilled, (state, action) => {
        state.hotelAdmins = action.payload;
        state.isLoading = false;
      })
      .addCase(getHotelAdmins.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.allUsers = action.payload;
        state.isLoading = false;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(getHotelsByOwner.fulfilled, (state, action) => {
        state.ownerHotelsById[action.payload.ownerId] = action.payload.hotels;
      })
      .addCase(getHotelsByOwner.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;
