const express = require('express');
const router = express.Router();

const {
  createOrder,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');

// ✅ FIX: correct import (your middleware export style)
const authMiddleware = require('../middleware/authMiddleware');


// ✅ PUBLIC ROUTE (CUSTOMER - QR USERS)
router.post('/', createOrder);


// 🔒 ADMIN ONLY ROUTES
router.get('/', authMiddleware, getAllOrders);
router.put('/:id/status', authMiddleware, updateOrderStatus);


module.exports = router;