import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { orderService } from '../services/api';
import {
  createOrderStart,
  createOrderSuccess,
  createOrderFailure,
} from '../store/orderSlice';
import { clearCart } from '../store/cartSlice';

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalPrice } = useSelector((state) => state.cart);
  const { loading, error, success } = useSelector((state) => state.order);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    city: '',
    zipCode: '',
  });
  const [validationErrors, setValidationErrors] = useState({});

  if (items.length === 0) {
    return (
      <div className="checkout-section">
        <h1>Checkout</h1>
        <div className="alert alert-warning">
          ⚠️ Your cart is empty. Please add items before checkout.
        </div>
        <Link to="/" className="btn btn-primary">
          Back to Shopping
        </Link>
      </div>
    );
  }

  const validateForm = () => {
    const errors = {};
    if (!formData.customerName.trim()) errors.customerName = 'Name is required';
    if (!formData.customerEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      errors.customerEmail = 'Valid email is required';
    if (!formData.customerPhone.trim()) errors.customerPhone = 'Phone is required';
    if (!formData.shippingAddress.trim()) errors.shippingAddress = 'Address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.zipCode.trim()) errors.zipCode = 'Zip code is required';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    dispatch(createOrderStart());

    try {
      const TAX_RATE = 0.08;
      const SHIPPING_COST = totalPrice > 100 ? 0 : 10;
      const tax = totalPrice * TAX_RATE;
      const total = totalPrice + tax + SHIPPING_COST;

      const orderData = {
        ...formData,
        items: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        subtotal: totalPrice,
        tax,
        shipping: SHIPPING_COST,
        total,
      };

      const response = await orderService.createOrder(orderData);
      
      dispatch(createOrderSuccess(response.order));
      dispatch(clearCart());
      
      // Redirect to confirmation page
      setTimeout(() => {
        navigate(`/order-confirmation/${response.order.orderNumber}`);
      }, 500);
    } catch (error) {
      dispatch(createOrderFailure(error.message));
    }
  };

  const TAX_RATE = 0.08;
  const SHIPPING_COST = totalPrice > 100 ? 0 : 10;
  const tax = totalPrice * TAX_RATE;
  const finalTotal = totalPrice + tax + SHIPPING_COST;

  return (
    <div className="checkout-section">
      <h1>Checkout</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', marginTop: '2rem' }}>
        {/* Checkout Form */}
        <form onSubmit={handleSubmitOrder} className="checkout-form">
          {error && <div className="alert alert-error">❌ {error}</div>}

          <div className="form-section-title">📦 Shipping Information</div>

          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                placeholder="John Doe"
              />
              {validationErrors.customerName && (
                <small style={{ color: 'var(--danger-color)' }}>
                  {validationErrors.customerName}
                </small>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleInputChange}
                placeholder="john@example.com"
              />
              {validationErrors.customerEmail && (
                <small style={{ color: 'var(--danger-color)' }}>
                  {validationErrors.customerEmail}
                </small>
              )}
            </div>
            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleInputChange}
                placeholder="+1 (555) 000-0000"
              />
              {validationErrors.customerPhone && (
                <small style={{ color: 'var(--danger-color)' }}>
                  {validationErrors.customerPhone}
                </small>
              )}
            </div>
          </div>

          <div className="form-section-title" style={{ marginTop: '2rem' }}>
            📍 Shipping Address
          </div>

          <div className="form-row full">
            <div className="form-group">
              <label>Street Address *</label>
              <input
                type="text"
                name="shippingAddress"
                value={formData.shippingAddress}
                onChange={handleInputChange}
                placeholder="123 Main Street, Apt 4B"
              />
              {validationErrors.shippingAddress && (
                <small style={{ color: 'var(--danger-color)' }}>
                  {validationErrors.shippingAddress}
                </small>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="New York"
              />
              {validationErrors.city && (
                <small style={{ color: 'var(--danger-color)' }}>
                  {validationErrors.city}
                </small>
              )}
            </div>
            <div className="form-group">
              <label>Zip Code *</label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                placeholder="10001"
              />
              {validationErrors.zipCode && (
                <small style={{ color: 'var(--danger-color)' }}>
                  {validationErrors.zipCode}
                </small>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '2rem' }}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span> Processing Order...
              </>
            ) : (
              'Place Order'
            )}
          </button>
          <Link to="/cart" className="btn btn-secondary" style={{ width: '100%', marginTop: '0.5rem' }}>
            Back to Cart
          </Link>
        </form>

        {/* Order Summary */}
        <div>
          <div className="cart-summary">
            <h3 style={{ marginBottom: '1rem', textAlign: 'center' }}>📋 Order Summary</h3>

            {/* Items List */}
            <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
              {items.map((item) => (
                <div
                  key={item.productId}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                  }}
                >
                  <span>
                    {item.name} x{item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

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
          </div>
        </div>
      </div>
    </div>
  );
}
