// src/reducers/orderSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("Token not found in local storage");
      }

      const response = await axios.get("http://localhost:4000/orders/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "An error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);

export const searchOrders = createAsyncThunk(
  "orders/searchOrders",
  async (query, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:4000/orders/search?query=${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const filterOrdersByStatus = createAsyncThunk(
  "orders/filterOrdersByStatus",
  async (status, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/orders/status/${status}`
      );
      console.log("Response data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const getSalesData = createAsyncThunk(
  "orders/getSalesData",
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:4000/orders/sales-data",
        {
          params: { startDate, endDate },
        }
      );
      console.log("API response:", response);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "An error occurred";
      console.error("Error fetching sales data:", error);
      return rejectWithValue(errorMessage);
    }
  }
);

export const editOrder = createAsyncThunk(
  "orders/editOrder",
  async ({ orderId, updateData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:4000/orders/edit/${orderId}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteOrder = createAsyncThunk(
  "orders/deleteOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:4000/orders/delete/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return orderId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(searchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.isLoading = false;
      })
      .addCase(searchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(editOrder.fulfilled, (state, action) => {
        state.orders = state.orders.map((order) =>
          order._id === action.payload._id ? action.payload : order
        );
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter(
          (order) => order._id !== action.payload
        );
      })
      .addCase(filterOrdersByStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(filterOrdersByStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(filterOrdersByStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getSalesData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSalesData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.salesData = action.payload;
      })
      .addCase(getSalesData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;
