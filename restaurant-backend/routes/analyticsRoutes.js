const express = require('express');
const router = express.Router();

const { getAdvancedAnalytics } = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/analytics/advanced - Admin only - Get advanced analytics
router.get('/advanced', authMiddleware, getAdvancedAnalytics);

module.exports = router;
