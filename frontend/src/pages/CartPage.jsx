import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeFromCart, updateQuantity } from '../store/cartSlice';

export default function CartPage() {
  const dispatch = useDispatch();
  const { items, totalPrice, totalQuantity } = useSelector((state) => state.cart);

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart({ productId }));
  };

  const handleQuantityChange = (productId, quantity) => {
    if (quantity > 0) {
      dispatch(updateQuantity({ productId, quantity }));
    }
  };

  const TAX_RATE = 0.08;
  const SHIPPING_COST = totalPrice > 100 ? 0 : 10;
  const tax = totalPrice * TAX_RATE;
  const finalTotal = totalPrice + tax + SHIPPING_COST;

  if (items.length === 0) {
    return (
      <div className="cart-section">
        <h1>🛒 Shopping Cart</h1>
        <div className="cart-empty">
          <div className="cart-empty-icon">📦</div>
          <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Your cart is empty</p>
          <Link to="/" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-section">
      <h1>🛒 Shopping Cart ({totalQuantity} items)</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', marginTop: '2rem' }}>
        {/* Cart Items */}
        <div>
          <div className="cart-items">
            {items.map((item) => (
              <div key={item.productId} className="cart-item">
                <img
                  src={item.thumbnail || 'https://via.placeholder.com/80x80?text=No+Image'}
                  alt={item.name}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">${item.price.toFixed(2)} each</div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    alignItems: 'flex-end',
                  }}
                >
                  <div className="quantity-control">
                    <button onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}>
                      −
                    </button>
                    <input type="number" value={item.quantity} readOnly />
                    <button onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}>
                      +
                    </button>
                  </div>
                  <div className="cart-item-subtotal">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleRemoveItem(item.productId)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="cart-summary">
            <h3 style={{ marginBottom: '1rem', textAlign: 'center' }}>📋 Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax (8%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>{SHIPPING_COST === 0 ? 'FREE 🎉' : `$${SHIPPING_COST.toFixed(2)}`}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
            {totalPrice <= 100 && (
              <div className="alert alert-info" style={{ marginTop: '1rem' }}>
                ℹ️ Add ${(100 - totalPrice).toFixed(2)} more for free shipping!
              </div>
            )}
            <Link to="/checkout" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              Proceed to Checkout →
            </Link>
            <Link to="/" className="btn btn-secondary" style={{ width: '100%', marginTop: '0.5rem' }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
