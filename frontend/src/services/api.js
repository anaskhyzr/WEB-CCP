import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productService = {
  fetchProducts: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.search) params.append('search', filters.search);

      const response = await axiosInstance.get(`/products?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  getProduct: async (productId) => {
    try {
      const response = await axiosInstance.get(`/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  getCategories: async () => {
    try {
      const response = await axiosInstance.get('/products/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  getPriceRange: async () => {
    try {
      const response = await axiosInstance.get('/products/price-range');
      return response.data;
    } catch (error) {
      console.error('Error fetching price range:', error);
      throw error;
    }
  },
};

export const orderService = {
  createOrder: async (orderData) => {
    try {
      const response = await axiosInstance.post('/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  getOrder: async (orderNumber) => {
    try {
      const response = await axiosInstance.get(`/orders/${orderNumber}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  getAllOrders: async (page = 1, limit = 20, status = '') => {
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      if (status) params.append('status', status);

      const response = await axiosInstance.get(`/orders?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  updateOrderStatus: async (orderNumber, status) => {
    try {
      const response = await axiosInstance.patch(`/orders/${orderNumber}`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },
};
