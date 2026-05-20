import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import productsReducer from './productsSlice';
import orderReducer from './orderSlice';

const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productsReducer,
    order: orderReducer,
  },
});

export default store;
