const express = require('express');
const router = express.Router();
const {
  getMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} = require('../controllers/menuController');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/menu - Public route for customers
router.get('/', getMenu);

// POST /api/menu - Admin only - Create new menu item
router.post('/', authMiddleware, createMenuItem);

// PUT /api/menu/:id - Admin only - Update menu item
router.put('/:id', authMiddleware, updateMenuItem);

// DELETE /api/menu/:id - Admin only - Delete menu item
router.delete('/:id', authMiddleware, deleteMenuItem);

module.exports = router;
