import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductCard from '../components/ProductCard.jsx';
import { addItem, changeQuantity, removeItem } from '../features/cart/cartSlice.js';

function HomePage() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/products/categories')
      .then((res) => {
        if (!res.ok) throw new Error('Category fetch failed');
        return res.json();
      })
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const searchParams = new URLSearchParams();
    if (search) searchParams.set('search', search);
    if (category) searchParams.set('category', category);

    fetch(`/api/products?${searchParams.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error('Product fetch failed');
        return res.json();
      })
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setError('Unable to load products.'))
      .finally(() => setLoading(false));
  }, [search, category]);

  const handleAdd = (product) => dispatch(addItem(product));

  const safeAdd = (product) => {
    const safe = {
      id: product.id,
      name: typeof product.name === 'string' ? product.name : String(product.name || ''),
      description: typeof product.description === 'string' ? product.description : String(product.description || ''),
      price: Number(product.price) || 0,
      category: typeof product.category === 'string' ? product.category : String(product.category || ''),
      image_url: typeof product.image_url === 'string' ? product.image_url : String(product.image_url || '')
    };
    dispatch(addItem(safe));
  };

  return (
    <div className="section-grid grid-2">
      <div className="panel">
        <div className="panel-header">
          <div>
            <h1>Shop products</h1>
            <p>Browse our catalog, filter by category, and add items to your cart.</p>
          </div>
          <div className="product-count">{products.length} items</div>
        </div>
        <div className="input-group">
          <label htmlFor="search">Search products</label>
          <input
            id="search"
            type="search"
            value={search}
            placeholder="Search by name or description"
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="category">Filter by category</label>
          <select id="category" value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="">All categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="center">Loading products...</div>
        ) : error ? (
          <div className="center">{error}</div>
        ) : products.length === 0 ? (
          <div className="center">No products matched your search.</div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={() => safeAdd(product)} />
            ))}
          </div>
        )}
      </div>

      <div className="panel">
        <h2>Your Cart</h2>
        {cartItems.length === 0 ? (
          <p className="status-text">Cart is empty. Add an item to start checkout.</p>
        ) : (
          <ul className="list-group">
            {cartItems.map((item) => (
              <li key={item.id} className="cart-item">
                <div>
                  <strong>{String(item.name)}</strong>
                  <span className="status-text">${(Number(item.price) || 0).toFixed(2)} each</span>
                </div>
                <div className="cart-actions">
                  <input
                    type="number"
                    min="1"
                    value={Number(item.quantity) || 1}
                    onChange={(event) => dispatch(changeQuantity({ id: item.id, quantity: Number(event.target.value) }))}
                  />
                  <button className="button secondary" onClick={() => dispatch(removeItem(item.id))}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default HomePage;
