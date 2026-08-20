const express = require('express');
const Subject = require('../models/Subject');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all subjects
// @route   GET /api/subjects
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.status(200).json({ success: true, count: subjects.length, data: subjects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create subject
// @route   POST /api/subjects
// @access  Private (Admin)
router.post('/', protect, authorize('admin', 'superadmin'), async (req, res) => {
  const { name, code, department } = req.body;
  try {
    const subject = await Subject.create({ name, code, department });
    res.status(201).json({ success: true, message: 'Subject created successfully', data: subject });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update subject
// @route   PUT /api/subjects/:id
// @access  Private (Admin)
router.put('/:id', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }
    res.status(200).json({ success: true, message: 'Subject updated successfully', data: subject });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete subject
// @route   DELETE /api/subjects/:id
// @access  Private (Admin)
router.delete('/:id', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }
    await Subject.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Subject deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
