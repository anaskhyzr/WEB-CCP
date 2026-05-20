import { useState } from 'react';

export default function Filters({
  search,
  category,
  minPrice,
  maxPrice,
  sort,
  categories,
  priceRange,
  onSearch,
  onCategoryChange,
  onPriceChange,
  onSortChange,
}) {
  const [localMinPrice, setLocalMinPrice] = useState(minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice);

  const handlePriceApply = () => {
    onPriceChange(localMinPrice, localMaxPrice);
  };

  return (
    <div className="filters-section">
      <h3 style={{ marginBottom: '1rem' }}>🔍 Search & Filter</h3>
      <div className="filters-grid">
        {/* Search */}
        <div className="filter-group">
          <label className="filter-label">Search Products</label>
          <input
            type="text"
            placeholder="Search by name or description..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        {/* Category */}
        <div className="filter-group">
          <label className="filter-label">Category</label>
          <select value={category} onChange={(e) => onCategoryChange(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="filter-group">
          <label className="filter-label">Price Range</label>
          <div className="price-range">
            <input
              type="number"
              min="0"
              placeholder="Min"
              value={localMinPrice}
              onChange={(e) => setLocalMinPrice(Number(e.target.value))}
            />
            <span className="price-separator">-</span>
            <input
              type="number"
              min="0"
              placeholder="Max"
              value={localMaxPrice}
              onChange={(e) => setLocalMaxPrice(Number(e.target.value))}
            />
            <button className="btn btn-sm btn-primary" onClick={handlePriceApply}>
              Apply
            </button>
          </div>
        </div>

        {/* Sort */}
        <div className="filter-group">
          <label className="filter-label">Sort By</label>
          <select value={sort} onChange={(e) => onSortChange(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>
    </div>
  );
}
