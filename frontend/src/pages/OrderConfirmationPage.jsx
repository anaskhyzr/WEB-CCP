import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../services/api';

export default function OrderConfirmationPage() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await orderService.getOrder(orderNumber);
        setOrder(data);
        setError(null);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-text">
          <span className="spinner"></span>
          Loading order details...
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="checkout-section">
        <div className="alert alert-error">❌ {error || 'Order not found'}</div>
        <Link to="/" className="btn btn-primary">
          Back to Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-section">
      <div className="order-confirmation">
        <div className="confirmation-icon">✓</div>
        <div className="confirmation-title">Order Confirmed!</div>
        <div className="confirmation-message">
          Thank you for your purchase, {order.customerName}!
          <br />
          Your order has been received and is being processed.
        </div>

        <div className="order-number">Order #{order.orderNumber}</div>

        {/* Order Details */}
        <div
          style={{
            textAlign: 'left',
            background: 'var(--light-gray)',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem',
          }}
        >
          <h3 style={{ marginBottom: '1rem' }}>📦 Order Details</h3>

          <div style={{ marginBottom: '1rem' }}>
            <strong>Shipping To:</strong>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              {order.customerName}
              <br />
              {order.shippingAddress}
              <br />
              {order.city}, {order.zipCode}
            </p>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <strong>Email:</strong>
            <p style={{ color: 'var(--text-secondary)' }}>{order.customerEmail}</p>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '1rem' }}>
            <h4 style={{ marginBottom: '1rem' }}>Items Ordered:</h4>
            {order.items.map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingBottom: '0.5rem',
                  borderBottom: '1px solid var(--border-color)',
                }}
              >
                <span>
                  {item.name} <em style={{ color: 'var(--text-secondary)' }}>x{item.quantity}</em>
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}

            <div
              style={{
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '2px solid var(--border-color)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Subtotal:</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Tax:</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Shipping:</span>
                <span>{order.shipping === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}`}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  color: 'var(--primary-color)',
                }}
              >
                <span>Total:</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: '1rem',
              padding: '1rem',
              background: '#d1fae5',
              borderRadius: '0.5rem',
              borderLeft: '4px solid var(--success-color)',
            }}
          >
            <strong>Order Status:</strong>
            <p style={{ marginTop: '0.25rem', textTransform: 'capitalize' }}>
              {order.status}
            </p>
          </div>
        </div>

        <div
          style={{
            background: 'var(--light-gray)',
            padding: '1rem',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            textAlign: 'left',
          }}
        >
          <strong>📧 Confirmation Email:</strong>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            A detailed confirmation email has been sent to {order.customerEmail}
          </p>
        </div>

        <Link to="/" className="btn btn-primary" style={{ width: '100%', marginBottom: '0.5rem' }}>
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
