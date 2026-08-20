const express = require('express');
const Notice = require('../models/Notice');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get notices (active ones filterable by category/priority)
// @route   GET /api/notices
// @access  Public
router.get('/', async (req, res) => {
  const { category, priority } = req.query;
  const query = { status: 'Published' };

  if (category) {
    query.category = category;
  }
  if (priority) {
    query.priority = priority;
  }

  try {
    const notices = await Notice.find(query).sort({ publishDate: -1 });
    res.status(200).json({ success: true, count: notices.length, data: notices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get all notices including drafts for Admin panel
// @route   GET /api/notices/all
// @access  Private (Admin/Teacher)
router.get('/all', protect, authorize('admin', 'superadmin', 'teacher'), async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: notices.length, data: notices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create Notice
// @route   POST /api/notices
// @access  Private (Admin)
router.post('/', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const notice = await Notice.create(req.body);
    res.status(201).json({ success: true, message: 'Notice posted successfully', data: notice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update Notice
// @route   PUT /api/notices/:id
// @access  Private (Admin)
router.put('/:id', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!notice) {
      return res.status(404).json({ success: false, message: 'Notice not found' });
    }
    res.status(200).json({ success: true, message: 'Notice updated successfully', data: notice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete Notice
// @route   DELETE /api/notices/:id
// @access  Private (Admin)
router.delete('/:id', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ success: false, message: 'Notice not found' });
    }
    await Notice.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Notice deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
