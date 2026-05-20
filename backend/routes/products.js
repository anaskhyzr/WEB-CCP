const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  getCategories,
  getPriceRange,
  createProduct,
} = require('../controllers/productController');

// GET /api/products - Get all products with filtering and search
router.get('/', getProducts);

// GET /api/products/categories - Get available categories
router.get('/categories/list', getCategories);

// GET /api/products/price-range - Get min/max prices
router.get('/price-range/range', getPriceRange);

// GET /api/products/:id - Get single product
router.get('/:id', getProductById);

// POST /api/products - Create product (for seeding)
router.post('/', createProduct);

module.exports = router;
