import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  loading: false,
  error: null,
  filters: {
    search: '',
    category: '',
    minPrice: 0,
    maxPrice: 1000,
    sort: 'newest',
  },
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
  },
  categories: [],
  priceRange: { minPrice: 0, maxPrice: 1000 },
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Products
    fetchProductsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchProductsSuccess: (state, action) => {
      state.loading = false;
      state.products = action.payload.products;
      state.pagination = action.payload.pagination;
    },
    fetchProductsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Filters
    setSearchFilter: (state, action) => {
      state.filters.search = action.payload;
      state.pagination.page = 1;
    },
    setCategoryFilter: (state, action) => {
      state.filters.category = action.payload;
      state.pagination.page = 1;
    },
    setPriceFilter: (state, action) => {
      const { minPrice, maxPrice } = action.payload;
      state.filters.minPrice = minPrice;
      state.filters.maxPrice = maxPrice;
      state.pagination.page = 1;
    },
    setSortFilter: (state, action) => {
      state.filters.sort = action.payload;
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },

    // Categories and Price Range
    fetchCategoriesStart: (state) => {
      state.loading = true;
    },
    fetchCategoriesSuccess: (state, action) => {
      state.loading = false;
      state.categories = action.payload;
    },
    fetchPriceRangeSuccess: (state, action) => {
      state.priceRange = action.payload;
      state.filters.minPrice = action.payload.minPrice;
      state.filters.maxPrice = action.payload.maxPrice;
    },
  },
});

export const {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
  setSearchFilter,
  setCategoryFilter,
  setPriceFilter,
  setSortFilter,
  setPage,
  fetchCategoriesStart,
  fetchCategoriesSuccess,
  fetchPriceRangeSuccess,
} = productsSlice.actions;

export default productsSlice.reducer;
