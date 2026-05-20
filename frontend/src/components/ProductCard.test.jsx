import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProductCard from './ProductCard';

describe('ProductCard', () => {
  const product = { id: 'p1', name: 'Test product', price: 5, description: 'Nice', category: 'cat', image_url: '' };

  it('renders product details and calls onAdd when clicking button', async () => {
    const onAdd = vi.fn();
    render(<ProductCard product={product} onAdd={onAdd} />);

    expect(screen.getByRole('article', { name: /test product/i })).toBeTruthy();
    expect(screen.getByText(/test product/i)).toBeTruthy();
    const button = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(button);
    expect(onAdd).toHaveBeenCalled();
  });
});
