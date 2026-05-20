import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './features/cart/cartSlice';

export function renderWithProviders(ui, { preloadedState = {}, store = configureStore({ reducer: { cart: cartReducer }, preloadedState }), route = '/' } = {}) {
  window.history.pushState({}, 'Test page', route);

  return {
    store,
    ...render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
      </Provider>
    )
  };
}
