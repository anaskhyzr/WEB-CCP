import { screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CheckoutPage from './Checkout';
import { renderWithProviders } from '../test-utils';

describe('Checkout flow', () => {
  it('shows validation when name/email missing', async () => {
    const { store } = renderWithProviders(<CheckoutPage />, { preloadedState: { cart: { items: [{ id: 'p1', name: 'A', price: 5, quantity: 1 }] } } });
    const button = screen.getByRole('button', { name: /place order/i });
    fireEvent.click(button);
    expect(screen.getByText(/please fill in your name and email/i)).toBeTruthy();
  });

  it('submits order and clears cart on success', async () => {
    global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ orderId: '123', total: 10 }) }));

    const { store } = renderWithProviders(<CheckoutPage />, { preloadedState: { cart: { items: [{ id: 'p1', name: 'A', price: 5, quantity: 2 }] } } });

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Alice' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'alice@example.com' } });

    fireEvent.click(screen.getByRole('button', { name: /place order/i }));

    await waitFor(() => expect(screen.getByText(/order #123 placed/i)).toBeTruthy());

    // cart should be cleared in the store
    expect(store.getState().cart.items).toHaveLength(0);

    global.fetch.mockRestore && global.fetch.mockRestore();
  });

  it('shows error when server returns non-ok', async () => {
    global.fetch = vi.fn(() => Promise.resolve({ ok: false, json: () => Promise.resolve({ error: 'bad' }) }));

    renderWithProviders(<CheckoutPage />, { preloadedState: { cart: { items: [{ id: 'p1', name: 'A', price: 5, quantity: 1 }] } } });
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Bob' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'bob@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /place order/i }));

    await waitFor(() => expect(screen.getByText(/checkout failed|bad/i)).toBeTruthy());
    global.fetch.mockRestore && global.fetch.mockRestore();
  });
});
