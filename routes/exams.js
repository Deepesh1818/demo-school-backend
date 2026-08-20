const express = require('express');
const Exam = require('../models/Exam');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all exams
// @route   GET /api/exams
// @access  Private
router.get('/', protect, async (req, res) => {
  const { classId } = req.query;
  const query = {};
  if (classId) {
    query.class = classId;
  }

  try {
    const exams = await Exam.find(query).populate('class');
    res.status(200).json({ success: true, count: exams.length, data: exams });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create Exam
// @route   POST /api/exams
// @access  Private (Admin)
router.post('/', protect, authorize('admin', 'superadmin'), async (req, res) => {
  const { name, class: classId, type, date, maxMarks, passingMarks } = req.body;
  try {
    const exam = await Exam.create({ name, class: classId, type, date, maxMarks, passingMarks });
    res.status(201).json({ success: true, message: 'Exam scheduled successfully', data: exam });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete Exam
// @route   DELETE /api/exams/:id
// @access  Private (Admin)
router.delete('/:id', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    await Exam.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Exam cancelled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
