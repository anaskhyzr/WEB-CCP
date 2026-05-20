import { useState, useEffect } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import HomePage from './pages/Home.jsx';
import CheckoutPage from './pages/Checkout.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { useSelector } from 'react-redux';
import './App.css';

function App() {
  const cartItems = useSelector((state) => state.cart.items);
  const [loadingHealth, setLoadingHealth] = useState(true);
  const [apiStatus, setApiStatus] = useState(false);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then(() => setApiStatus(true))
      .catch(() => setApiStatus(false))
      .finally(() => setLoadingHealth(false));
  }, []);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">Mini E-Commerce</div>
        <nav className="topnav">
          <NavLink to="/" end>Shop</NavLink>
          <NavLink to="/checkout">Checkout</NavLink>
        </nav>
        <div className="status-row">
          <span className={apiStatus ? 'status status-ok' : 'status status-error'}>
            {loadingHealth ? 'Checking API...' : apiStatus ? 'API Online' : 'API Offline'}
          </span>
          <span className="cart-pill">Cart: {cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
        </div>
      </header>

      <main>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="*" element={<div className="center">Page not found.</div>} />
          </Routes>
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default App;
