const express = require('express');
const Result = require('../models/Result');
const Exam = require('../models/Exam');
const Student = require('../models/Student');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Helper to compute grade based on scores
const calculateGrade = (score, maxMarks) => {
  const percentage = (score / maxMarks) * 100;
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  if (percentage >= 50) return 'D';
  if (percentage >= 33) return 'E';
  return 'F';
};

// @desc    Get results (filters: class, exam, student)
// @route   GET /api/results
// @access  Private
router.get('/', protect, async (req, res) => {
  const { studentId, examId, classId } = req.query;
  const query = {};

  try {
    if (studentId) {
      query.student = studentId;
    }
    if (examId) {
      query.exam = examId;
    }

    if (classId) {
      // Find students in class first
      const students = await Student.find({ class: classId }).select('_id');
      query.student = { $in: students.map(s => s._id) };
    }

    const results = await Result.find(query)
      .populate('student')
      .populate({
        path: 'exam',
        populate: { path: 'class' }
      })
      .populate('subject');

    res.status(200).json({ success: true, count: results.length, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Save/Post student result
// @route   POST /api/results
// @access  Private (Admin/Teacher)
router.post('/', protect, authorize('admin', 'superadmin', 'teacher'), async (req, res) => {
  const { student, exam: examId, subject, marks, remarks } = req.body;

  try {
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }

    if (marks > exam.maxMarks) {
      return res.status(400).json({ success: false, message: `Marks cannot exceed exam max marks (${exam.maxMarks})` });
    }

    const grade = calculateGrade(marks, exam.maxMarks);

    // Upsert Result record
    const result = await Result.findOneAndUpdate(
      { student, exam: examId, subject },
      { marks, grade, remarks },
      { new: true, upsert: true }
    );

    res.status(201).json({ success: true, message: 'Result uploaded successfully', data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get dashboard topper and class summary charts
// @route   GET /api/results/analytics
// @access  Public (for board results display on website)
router.get('/analytics', async (req, res) => {
  try {
    // Return sample static CBSE Board toppers lists & stream wise averages to populate Recharts
    const boardAnalytics = {
      years: ['2022', '2023', '2024', '2025', '2026'],
      classXPassRate: [98.2, 99.1, 98.9, 99.5, 100],
      classXIIPassRate: [97.5, 98.4, 98.7, 99.2, 99.8],
      streamPerformance: [
        { name: 'Science', average: 88 },
        { name: 'Commerce', average: 85 },
        { name: 'Humanities', average: 89 }
      ],
      toppers: [
        { name: 'Priyanjali Sharma', class: 'XII Science', score: '98.8%', rank: 1, year: '2026', photo: '/uploads/topper1.png' },
        { name: 'Rohan Malhotra', class: 'XII Commerce', score: '98.2%', rank: 2, year: '2026', photo: '/uploads/topper2.png' },
        { name: 'Ananya Iyer', class: 'X General', score: '99.2%', rank: 1, year: '2026', photo: '/uploads/topper3.png' }
      ]
    };

    res.status(200).json({ success: true, data: boardAnalytics });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
