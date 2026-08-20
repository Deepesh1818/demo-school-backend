const express = require('express');
const Class = require('../models/Class');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all classes
// @route   GET /api/classes
// @access  Public/Private (depending on access, let's allow read for all authenticated)
router.get('/', protect, async (req, res) => {
  try {
    const classes = await Class.find().populate('classTeacher').populate('subjects');
    res.status(200).json({ success: true, count: classes.length, data: classes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create Class
// @route   POST /api/classes
// @access  Private (Admin)
router.post('/', protect, authorize('admin', 'superadmin'), async (req, res) => {
  const { name, code, section, room, classTeacher, subjects } = req.body;
  try {
    const exists = await Class.findOne({ code });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Class code already exists' });
    }

    const newClass = await Class.create({ name, code, section, room, classTeacher, subjects });
    const populated = await Class.findById(newClass._id).populate('classTeacher').populate('subjects');
    res.status(201).json({ success: true, message: 'Class created successfully', data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update Class
// @route   PUT /api/classes/:id
// @access  Private (Admin)
router.put('/:id', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const updated = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('classTeacher')
      .populate('subjects');
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }
    res.status(200).json({ success: true, message: 'Class updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete Class
// @route   DELETE /api/classes/:id
// @access  Private (Admin)
router.delete('/:id', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id);
    if (!classItem) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }
    await Class.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Class deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
