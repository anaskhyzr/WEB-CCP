import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { useState } from 'react';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        productId: product._id,
        name: product.name,
        price: product.price,
        thumbnail: product.thumbnail,
      })
    );
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const getRatingStars = (rating) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: 'Out of Stock', className: 'stock-out' };
    if (stock < 10) return { text: `Only ${stock} left!`, className: 'stock-low' };
    return { text: 'In Stock', className: 'stock-available' };
  };

  const stockStatus = getStockStatus(product.stock);

  return (
    <div className="product-card">
      <img
        src={product.thumbnail || 'https://via.placeholder.com/300x300?text=No+Image'}
        alt={product.name}
        className="product-image"
      />
      <div className="product-info">
        <div className="product-category">{product.category}</div>
        <div className="product-name">{product.name}</div>
        {product.rating > 0 && (
          <div className="product-rating">
            <span className="stars">{getRatingStars(product.rating)}</span>
            <span>
              {product.rating.toFixed(1)} ({product.reviews} reviews)
            </span>
          </div>
        )}
        <div className="product-price">${product.price.toFixed(2)}</div>
        <div className={`product-stock ${stockStatus.className}`}>
          {stockStatus.text}
        </div>
        <p className="product-description" title={product.description}>
          {product.description.substring(0, 80)}...
        </p>
        <button
          className="btn btn-primary btn-sm"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          style={{
            width: '100%',
            backgroundColor: addedToCart ? '#10b981' : undefined,
          }}
        >
          {addedToCart ? '✓ Added to Cart' : '+ Add to Cart'}
        </button>
      </div>
    </div>
  );
}
