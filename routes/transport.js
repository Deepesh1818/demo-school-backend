const express = require('express');
const TransportRoute = require('../models/TransportRoute');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all transport routes
// @route   GET /api/transport
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const routes = await TransportRoute.find();
    res.status(200).json({ success: true, count: routes.length, data: routes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Add transport route
// @route   POST /api/transport
// @access  Private (Admin)
router.post('/', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const route = await TransportRoute.create(req.body);
    res.status(201).json({ success: true, message: 'Transport route created successfully', data: route });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
