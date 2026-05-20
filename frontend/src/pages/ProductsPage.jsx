import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { productService } from '../services/api';
import {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
  setSearchFilter,
  setCategoryFilter,
  setPriceFilter,
  setSortFilter,
  setPage,
  fetchCategoriesSuccess,
  fetchPriceRangeSuccess,
} from '../store/productsSlice';
import ProductCard from '../components/ProductCard';
import Filters from '../components/Filters';

export default function ProductsPage() {
  const dispatch = useDispatch();
  const { products, loading, error, filters, pagination, categories, priceRange } = useSelector(
    (state) => state.products
  );

  // Fetch categories and price range on mount
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [categoriesData, priceRangeData] = await Promise.all([
          productService.getCategories(),
          productService.getPriceRange(),
        ]);
        dispatch(fetchCategoriesSuccess(categoriesData.categories));
        dispatch(fetchPriceRangeSuccess(priceRangeData));
      } catch (error) {
        console.error('Error fetching metadata:', error);
      }
    };

    fetchMetadata();
  }, [dispatch]);

  // Fetch products when filters change
  useEffect(() => {
    const fetchProducts = async () => {
      dispatch(fetchProductsStart());
      try {
        const data = await productService.fetchProducts({
          ...filters,
          page: pagination.page,
          limit: pagination.limit,
        });
        dispatch(fetchProductsSuccess(data));
      } catch (error) {
        dispatch(fetchProductsFailure(error.message));
      }
    };

    fetchProducts();
  }, [filters, pagination.page, dispatch]);

  const handleSearch = (searchTerm) => {
    dispatch(setSearchFilter(searchTerm));
  };

  const handleCategoryChange = (category) => {
    dispatch(setCategoryFilter(category));
  };

  const handlePriceChange = (minPrice, maxPrice) => {
    dispatch(setPriceFilter({ minPrice, maxPrice }));
  };

  const handleSortChange = (sortBy) => {
    dispatch(setSortFilter(sortBy));
  };

  const handlePageChange = (page) => {
    dispatch(setPage(page));
  };

  return (
    <div className="products-section">
      <h1 style={{ marginBottom: '2rem' }}>Welcome to ShopHub</h1>

      <Filters
        search={filters.search}
        category={filters.category}
        minPrice={filters.minPrice}
        maxPrice={filters.maxPrice}
        sort={filters.sort}
        categories={categories}
        priceRange={priceRange}
        onSearch={handleSearch}
        onCategoryChange={handleCategoryChange}
        onPriceChange={handlePriceChange}
        onSortChange={handleSortChange}
      />

      {error && <div className="alert alert-error">❌ {error}</div>}

      {loading ? (
        <div className="loading-container">
          <div className="loading-text">
            <span className="spinner"></span>
            Loading products...
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="alert alert-info">
          📦 No products found. Try adjusting your filters.
        </div>
      ) : (
        <>
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className="pagination">
              <button
                disabled={pagination.currentPage === 1}
                onClick={() => handlePageChange(pagination.currentPage - 1)}
              >
                ← Previous
              </button>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={pagination.currentPage === page ? 'active' : ''}
                >
                  {page}
                </button>
              ))}
              <button
                disabled={pagination.currentPage === pagination.pages}
                onClick={() => handlePageChange(pagination.currentPage + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
