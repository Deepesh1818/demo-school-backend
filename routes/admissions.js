const express = require('express');
const Enquiry = require('../models/Enquiry');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Submit public admission enquiry
// @route   POST /api/admissions/enquiry
// @access  Public
router.post('/enquiry', async (req, res) => {
  const { parentName, email, phone, studentName, class: targetClass, message } = req.body;

  try {
    const enquiry = await Enquiry.create({
      parentName,
      email,
      phone,
      studentName,
      targetClass,
      message
    });

    res.status(201).json({
      success: true,
      message: 'Admission Enquiry submitted successfully! Our desk will contact you soon.',
      data: enquiry
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get all enquiries for Admin dashboard
// @route   GET /api/admissions/enquiries
// @access  Private (Admin)
router.get('/enquiries', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: enquiries.length, data: enquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update enquiry status
// @route   PUT /api/admissions/enquiry/:id
// @access  Private (Admin)
router.put('/enquiry/:id', protect, authorize('admin', 'superadmin'), async (req, res) => {
  const { status } = req.body; // 'New', 'Contacted', 'Follow-up', 'Converted', 'Rejected'
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }
    res.status(200).json({ success: true, message: 'Status updated successfully', data: enquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
