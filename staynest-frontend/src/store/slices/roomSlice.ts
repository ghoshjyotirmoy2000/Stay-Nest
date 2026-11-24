import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import { getErrorMessage } from "../../utils/getErrorMessage";

type Room = {
  id: string;
  hotelId: string;
  roomNumber: string;
  roomType: string;
  pricePerNight: number;
  maxOccupancy: number;
  images: string[];
  createdAt: string;
};

type RoomState = {
  rooms: Room[];
  isLoading: boolean;
  error: string | null;
};

const initialState: RoomState = {
  rooms: [],
  isLoading: false,
  error: null,
};

// ==================== THUNKS ====================

export const getRoomsByHotel = createAsyncThunk(
  "room/getRoomsByHotel",
  async (hotelId: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/room/rooms-by-hotel/${hotelId}`);
      return res.data.data.rooms;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to fetch rooms"));
    }
  }
);

export const createRoom = createAsyncThunk(
  "room/createRoom",
  async (data: { hotelId: string; roomNumber: string; roomType: string; pricePerNight: number; maxOccupancy: number; images?: string[] }, { rejectWithValue }) => {
    try {
      const { hotelId, ...rest } = data;
      const res = await api.post(`/room/create-room/${hotelId}`, rest);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to create room"));
    }
  }
);

export const deleteRoom = createAsyncThunk(
  "room/deleteRoom",
  async (roomId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/room/delete-room/${roomId}`);
      return roomId;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to delete room"));
    }
  }
);

// ==================== SLICE ====================

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // get rooms by hotel
    builder
      .addCase(getRoomsByHotel.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getRoomsByHotel.fulfilled, (state, action) => {
        state.rooms = action.payload;
        state.isLoading = false;
      })
      .addCase(getRoomsByHotel.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // create room
    builder
      .addCase(createRoom.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        state.rooms = [action.payload, ...state.rooms];
        state.isLoading = false;
      })
      .addCase(createRoom.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // delete room
    builder
      .addCase(deleteRoom.fulfilled, (state, action) => {
        state.rooms = state.rooms.filter(r => r.id !== action.payload);
      })
      .addCase(deleteRoom.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = roomSlice.actions;
export default roomSlice.reducer;