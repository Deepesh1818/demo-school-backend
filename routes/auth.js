const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Helper to sign JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'goshen_school_demo_super_secret_key_12345', {
    expiresIn: '30d'
  });
};

// @desc    Authenticate User & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide an email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    // Save in HTTP-only Cookie
    const options = {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    };

    // Return response with user details
    res.cookie('token', token, options).status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        referenceId: user.referenceId
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Log user out & clear token cookie
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', protect, (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    let populatedUser = req.user.toObject();

    // Populate role reference details
    if (req.user.referenceId) {
      if (req.user.role === 'student') {
        const studentInfo = await Student.findById(req.user.referenceId).populate('class');
        populatedUser.profile = studentInfo;
      } else if (req.user.role === 'teacher') {
        const teacherInfo = await Teacher.findById(req.user.referenceId);
        populatedUser.profile = teacherInfo;
      } else if (req.user.role === 'parent') {
        // Find children linked to this parent (we can match by email or phone)
        const children = await Student.find({ email: req.user.email }).populate('class');
        populatedUser.profile = {
          name: req.user.email.split('@')[0],
          children: children
        };
      }
    }

    res.status(200).json({
      success: true,
      user: populatedUser
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
