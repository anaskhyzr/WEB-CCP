import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../features/cart/cartSlice.js';

function CheckoutPage() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name || !email) {
      setMessage('Please fill in your name and email.');
      return;
    }
    if (cartItems.length === 0) {
      setMessage('Add items to your cart before checkout.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: { name, email },
          items: cartItems
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Checkout failed');

      setStatus('success');
      setMessage(`Order #${data.orderId} placed. Total: $${data.total.toFixed(2)}`);
      dispatch(clearCart());
      setName('');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage(error.message);
    }
  };

  return (
    <div className="panel">
      <h1>Checkout</h1>
      <div className="input-group">
        <label>Your items</label>
        {cartItems.length === 0 ? (
          <p className="status-text">Cart is empty. Please add items from the shop first.</p>
        ) : (
          <ul className="list-group">
            {cartItems.map((item) => (
              <li key={item.id} className="cart-row">
                <div>{String(item.name)} × {Number(item.quantity) || 1}</div>
                <div>${((Number(item.price) || 0) * (Number(item.quantity) || 1)).toFixed(2)}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="input-group">
        <label>Total</label>
        <strong>${total.toFixed(2)}</strong>
      </div>

      <form onSubmit={handleSubmit} className="input-group">
        <label htmlFor="name">Name</label>
        <input id="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your full name" />

        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />

        <button className="button" type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Submitting...' : 'Place Order'}
        </button>
      </form>

      {message && <p className={status === 'error' ? 'status status-error' : 'status status-ok'}>{message}</p>}
    </div>
  );
}

export default CheckoutPage;
