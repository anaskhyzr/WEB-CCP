import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: []
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action) {
      const product = action.payload;
      const safe = {
        id: product.id,
        name: typeof product.name === 'string' ? product.name : String(product.name || ''),
        description: typeof product.description === 'string' ? product.description : String(product.description || ''),
        price: Number(product.price) || 0,
        category: typeof product.category === 'string' ? product.category : String(product.category || ''),
        image_url: typeof product.image_url === 'string' ? product.image_url : String(product.image_url || '')
      };

      const existing = state.items.find((item) => item.id === safe.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...safe, quantity: 1 });
      }
    },
    removeItem(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    changeQuantity(state, action) {
      const { id, quantity } = action.payload;
      const existing = state.items.find((item) => item.id === id);
      if (existing) {
        existing.quantity = Math.max(1, quantity);
      }
    },
    clearCart(state) {
      state.items = [];
    }
  }
});

export const { addItem, removeItem, changeQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
