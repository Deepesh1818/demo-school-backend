const express = require('express');
const Achievement = require('../models/Achievement');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all achievements
// @route   GET /api/achievements
// @access  Public
router.get('/', async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({ year: -1 });
    res.status(200).json({ success: true, count: achievements.length, data: achievements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create Achievement
// @route   POST /api/achievements
// @access  Private (Admin)
router.post('/', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const achievement = await Achievement.create(req.body);
    res.status(201).json({ success: true, message: 'Laurel added successfully', data: achievement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update Achievement
// @route   PUT /api/achievements/:id
// @access  Private (Admin)
router.put('/:id', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const achievement = await Achievement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!achievement) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    res.status(200).json({ success: true, message: 'Achievement updated successfully', data: achievement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete Achievement
// @route   DELETE /api/achievements/:id
// @access  Private (Admin)
router.delete('/:id', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    if (!achievement) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    await Achievement.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Achievement deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
