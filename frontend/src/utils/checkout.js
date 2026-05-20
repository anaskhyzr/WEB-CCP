export async function submitOrder(customer, items) {
  const response = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customer, items })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Checkout failed');
  return data;
}
