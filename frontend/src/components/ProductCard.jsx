import { useState } from 'react';

function ProductCard({ product, onAdd }) {
  const [src, setSrc] = useState(product.image_url || '');
  const fallback = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect width="100%" height="100%" fill="%23121620"/><text x="50%" y="50%" fill="%23ffffff" font-size="24" font-family="Arial" text-anchor="middle" dominant-baseline="central">No Image</text></svg>';

  return (
    <article className="card" aria-label={product.name}>
      <img src={src || fallback} alt={product.name} onError={() => setSrc(fallback)} />
      <div className="card-body">
        <div className="badge">{product.category}</div>
        <h3>{product.name}</h3>
        <p className="status-text">{product.description}</p>
        <div className="cart-row">
          <strong>${Number(product.price).toFixed(2)}</strong>
          <button className="button" type="button" onClick={onAdd} aria-label={`Add ${product.name} to cart`}>Add to cart</button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
