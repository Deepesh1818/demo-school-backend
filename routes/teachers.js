const express = require('express');
const Teacher = require('../models/Teacher');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all teachers
// @route   GET /api/teachers
// @access  Public (so users can view faculty list on public site)
router.get('/', async (req, res) => {
  try {
    const { department, status } = req.query;
    const query = {};

    if (department) {
      query.department = department;
    }
    if (status) {
      query.status = status;
    }

    const teachers = await Teacher.find(query);
    res.status(200).json({ success: true, count: teachers.length, data: teachers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get single teacher
// @route   GET /api/teachers/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }
    res.status(200).json({ success: true, data: teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create teacher & user login
// @route   POST /api/teachers
// @access  Private (Admin)
router.post('/', protect, authorize('admin', 'superadmin'), async (req, res) => {
  const { name, designation, department, experience, subjects, email, bio } = req.body;

  try {
    const teacherExists = await Teacher.findOne({ email });
    if (teacherExists) {
      return res.status(400).json({ success: false, message: 'Teacher email already registered' });
    }

    const teacher = await Teacher.create({
      name,
      designation,
      department,
      experience,
      subjects: Array.isArray(subjects) ? subjects : subjects.split(','),
      email,
      bio
    });

    // Create teacher user account
    await User.create({
      email,
      password: 'Teacher@123',
      role: 'teacher',
      referenceId: teacher._id,
      roleRefModel: 'Teacher'
    });

    res.status(201).json({ success: true, message: 'Teacher and login account created successfully', data: teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update teacher
// @route   PUT /api/teachers/:id
// @access  Private (Admin)
router.put('/:id', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    // Sync user email
    if (req.body.email) {
      await User.findOneAndUpdate({ referenceId: teacher._id, role: 'teacher' }, { email: teacher.email });
    }

    res.status(200).json({ success: true, message: 'Teacher details updated', data: teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete teacher
// @route   DELETE /api/teachers/:id
// @access  Private (Admin)
router.delete('/:id', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    await Teacher.findByIdAndDelete(req.params.id);
    await User.findOneAndDelete({ referenceId: teacher._id });

    res.status(200).json({ success: true, message: 'Teacher and login account deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
