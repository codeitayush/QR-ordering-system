const express = require('express');
const router = express.Router();

const {
  createOrder,
  getAllOrders,
  updateOrderStatus,
  getAnalytics,
  getAdvancedAnalytics // ✅ ADD
} = require('../controllers/orderController');

const authMiddleware = require('../middleware/authMiddleware');

// CREATE ORDER
router.post('/', createOrder);

// GET ALL ORDERS
router.get('/', authMiddleware, getAllOrders);

// UPDATE STATUS
router.put('/:id/status', authMiddleware, updateOrderStatus);

// BASIC ANALYTICS
router.get('/analytics', authMiddleware, getAnalytics);

// 🔥 ADVANCED ANALYTICS (NEW)
router.get('/advanced-analytics', getAdvancedAnalytics);

module.exports = router;