import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for login
export const login = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/user/login",
        userData
      );
      const { token, user } = response.data;

      // Save token and userId securely
      localStorage.setItem("token", token);
      localStorage.setItem("userId", user._id);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: !!localStorage.getItem("token"), // Check if token exists
    user: null,
    token: localStorage.getItem("token") || null,
    userId: localStorage.getItem("userId") || null,
    isLoading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      state.userId = null;
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("cart");
      localStorage.removeItem("user");
    },
    setUserFromLocalStorage: (state) => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      if (token && userId) {
        state.token = token;
        state.userId = userId;
        state.isAuthenticated = true;
      } else {
        state.isAuthenticated = false;
      }
    },
    loadUser: (state, action) => {
      console.log("Loading user from token:", action.payload);
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.userId = action.payload.user._id;
        state.isAuthenticated = true; // Authentication status
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      });
  },
});

export const { logout, loadUser } = authSlice.actions;

export const loadUserFromToken = () => async (dispatch) => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      console.log("Loading user from token");
      const response = await axios.get(
        "http://localhost:4000/user/my-details",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const user = response.data.user;
      dispatch(loadUser({ user, token }));
    } catch (error) {
      console.error("Failed to load user from token:", error);
      dispatch(logout());
    }
  }
};

export default authSlice.reducer;
