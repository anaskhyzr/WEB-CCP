import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState } from 'react';

export default function Header() {
  const cartCount = useSelector((state) => state.cart.totalQuantity);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header>
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            🛒 ShopHub
          </Link>
          <nav>
            <Link to="/">Products</Link>
            <Link to="/cart" className="cart-icon">
              🛍️
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
