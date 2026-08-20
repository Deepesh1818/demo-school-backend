const express = require('express');
const Student = require('../models/Student');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all students (with search, filter, pagination)
// @route   GET /api/students
// @access  Private (Admin/Teacher)
router.get('/', protect, authorize('admin', 'superadmin', 'teacher'), async (req, res) => {
  try {
    const { search, classId, status, page = 1, limit = 10 } = req.query;
    const query = {};

    if (classId) {
      query.class = classId;
    }
    if (status) {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } }
      ];
    }

    const count = await Student.countDocuments(query);
    const students = await Student.find(query)
      .populate('class')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    res.status(200).json({
      success: true,
      data: students,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalCount: count
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('class');
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Role check: Students can only view their own profile, Parents can view their child's profile
    if (req.user.role === 'student' && req.user.referenceId.toString() !== student._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this profile' });
    }
    if (req.user.role === 'parent' && req.user.email !== student.email) {
      // Parents match by child email or phone
      const matched = await Student.findOne({ _id: student._id, email: req.user.email });
      if (!matched) {
        return res.status(403).json({ success: false, message: 'Not authorized to view this profile' });
      }
    }

    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create student & user account
// @route   POST /api/students
// @access  Private (Admin)
router.post('/', protect, authorize('admin', 'superadmin'), async (req, res) => {
  const { studentId, firstName, lastName, dateOfBirth, gender, class: classId, rollNumber, parentName, phone, email, address } = req.body;

  try {
    // Check if studentId already exists
    const studentExists = await Student.findOne({ studentId });
    if (studentExists) {
      return res.status(400).json({ success: false, message: 'Student ID already exists' });
    }

    const student = await Student.create({
      studentId,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      class: classId,
      rollNumber,
      parentName,
      phone,
      email,
      address
    });

    // Automatically create a student user account
    // Default password is standard structure e.g., Student@123
    await User.create({
      email,
      password: 'Student@123',
      role: 'student',
      referenceId: student._id,
      roleRefModel: 'Student'
    });

    // Also automatically create parent user account
    const parentEmail = `parent.${studentId.toLowerCase()}@goshenschool.demo`;
    await User.create({
      email: parentEmail,
      password: 'Parent@123',
      role: 'parent',
      referenceId: student._id,
      roleRefModel: 'Student'
    });

    res.status(201).json({ success: true, message: 'Student and login accounts created successfully', data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private (Admin)
router.put('/:id', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('class');
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Update email in corresponding User account
    await User.findOneAndUpdate({ referenceId: student._id, role: 'student' }, { email: student.email });

    res.status(200).json({ success: true, message: 'Student updated successfully', data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete student & user accounts
// @route   DELETE /api/students/:id
// @access  Private (Admin)
router.delete('/:id', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Delete Student
    await Student.findByIdAndDelete(req.params.id);

    // Delete user login accounts for both student and parent
    await User.deleteMany({ referenceId: student._id });

    res.status(200).json({ success: true, message: 'Student and related portal accounts deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
