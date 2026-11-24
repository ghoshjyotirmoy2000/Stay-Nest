import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import { getErrorMessage } from "../../utils/getErrorMessage";

type User = {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  role: "CUSTOMER" | "OWNER" | "SUPERADMIN";
  phone: string;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,
};

// ==================== THUNKS ====================

export const signUp = createAsyncThunk(
  "auth/signUp",
  async (
    data: {
      email: string;
      firstname: string;
      lastname: string;
      password: string;
      role: "CUSTOMER" | "OWNER" | "SUPERADMIN";
      phone: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const res = await api.post("/auth/signup", data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Signup failed"));
    }
  },
);

export const signIn = createAsyncThunk(
  "auth/signIn",
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/signin", data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Signin failed"));
    }
  },
);

export const signOut = createAsyncThunk("auth/signOut", async () => {
  try {
    // try backend logout — ignore if fails
    await api.post("/auth/signout").catch(() => {});
  } catch {
    // silent fail
  }
});

export const getMe = createAsyncThunk(
  "auth/getMe",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/user/me");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to get user"));
    }
  },
);

// ==================== SLICE ====================

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // signUp
    builder
      .addCase(signUp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // signIn
    builder
      .addCase(signIn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // signOut
    builder.addCase(signOut.fulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    });

    // getMe
    builder
      .addCase(getMe.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.isInitialized = true;
      })
      .addCase(getMe.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.isInitialized = true;
      });
  },
});

export const { clearError, resetAuth } = authSlice.actions;
export default authSlice.reducer;
