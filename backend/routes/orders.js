const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderByNumber,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');

// POST /api/orders - Create new order
router.post('/', createOrder);

// GET /api/orders/:orderNumber - Get order by order number
router.get('/:orderNumber', getOrderByNumber);

// GET /api/orders - Get all orders (for admin)
router.get('/', getAllOrders);

// PUT /api/orders/:orderNumber - Update order status (for admin)
router.put('/:orderNumber', updateOrderStatus);

module.exports = router;
