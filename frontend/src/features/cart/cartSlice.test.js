import { describe, it, expect } from 'vitest';
import cartReducer, { addItem, removeItem, changeQuantity, clearCart } from './cartSlice';

describe('cart slice reducers', () => {
  const sampleProduct = { id: 'p1', name: 'Sample', price: 9.99 };

  it('should return the initial state', () => {
    const initial = cartReducer(undefined, { type: '@@INIT' });
    expect(initial).toEqual({ items: [] });
  });

  it('adds a new item', () => {
    const state = cartReducer({ items: [] }, addItem(sampleProduct));
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toMatchObject({ id: 'p1', quantity: 1 });
  });

  it('increments quantity when adding same product', () => {
    const state1 = cartReducer({ items: [{ id: 'p1', name: 'Sample', price: 9.99, quantity: 1 }] }, addItem(sampleProduct));
    expect(state1.items[0].quantity).toBe(2);
  });

  it('removes an item by id', () => {
    const state = cartReducer({ items: [{ id: 'p1', quantity: 2 }] }, removeItem('p1'));
    expect(state.items).toHaveLength(0);
  });

  it('changes quantity but enforces minimum of 1', () => {
    const state = cartReducer({ items: [{ id: 'p1', quantity: 2 }] }, changeQuantity({ id: 'p1', quantity: 0 }));
    expect(state.items[0].quantity).toBe(1);
  });

  it('clears the cart', () => {
    const state = cartReducer({ items: [{ id: 'p1', quantity: 2 }] }, clearCart());
    expect(state.items).toHaveLength(0);
  });
});
