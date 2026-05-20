import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orderNumber: null,
  orderData: null,
  loading: false,
  error: null,
  success: false,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    createOrderStart: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    createOrderSuccess: (state, action) => {
      state.loading = false;
      state.orderNumber = action.payload.orderNumber;
      state.orderData = action.payload;
      state.success = true;
    },
    createOrderFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    fetchOrderStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchOrderSuccess: (state, action) => {
      state.loading = false;
      state.orderData = action.payload;
    },
    fetchOrderFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    resetOrder: (state) => {
      state.orderNumber = null;
      state.orderData = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
});

export const {
  createOrderStart,
  createOrderSuccess,
  createOrderFailure,
  fetchOrderStart,
  fetchOrderSuccess,
  fetchOrderFailure,
  resetOrder,
} = orderSlice.actions;

export default orderSlice.reducer;
