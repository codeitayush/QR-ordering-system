const express = require('express');
const router = express.Router();

const {
  createOrder,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');

const authMiddleware = require('../middleware/authMiddleware');

// POST /api/orders - Public route for customers to create orders
router.post('/', createOrder);

// GET /api/orders - Admin only - Get all orders
router.get('/', authMiddleware, getAllOrders);

// PUT /api/orders/:id/status - Admin only - Update order status
router.put('/:id/status', authMiddleware, updateOrderStatus);

module.exports = router;