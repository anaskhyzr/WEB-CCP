import { describe, it, expect, vi } from 'vitest';
import { submitOrder } from './checkout';

describe('submitOrder', () => {
  it('resolves with data on success', async () => {
    global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ orderId: 'abc', total: 15 }) }));
    const data = await submitOrder({ name: 'A' }, [{ id: 'p1', quantity: 1 }]);
    expect(data.orderId).toBe('abc');
    expect(data.total).toBe(15);
    global.fetch.mockRestore && global.fetch.mockRestore();
  });

  it('throws on server error', async () => {
    global.fetch = vi.fn(() => Promise.resolve({ ok: false, json: () => Promise.resolve({ error: 'bad' }) }));
    await expect(submitOrder({ name: 'B' }, [])).rejects.toThrow('bad');
    global.fetch.mockRestore && global.fetch.mockRestore();
  });
});
