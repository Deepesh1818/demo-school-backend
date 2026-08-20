const express = require('express');
const Fee = require('../models/Fee');
const Student = require('../models/Student');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all fee invoices (with filter by student)
// @route   GET /api/fees
// @access  Private
router.get('/', protect, async (req, res) => {
  const { studentId, status } = req.query;
  const query = {};

  if (studentId) {
    query.student = studentId;
  }
  if (status) {
    query.status = status;
  }

  try {
    const invoices = await Fee.find(query).populate({
      path: 'student',
      populate: { path: 'class' }
    });
    res.status(200).json({ success: true, count: invoices.length, data: invoices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create fee invoice
// @route   POST /api/fees
// @access  Private (Admin)
router.post('/', protect, authorize('admin', 'superadmin'), async (req, res) => {
  const { student, feeType, expectedAmount, dueDate } = req.body;
  try {
    const invoiceNumber = `INV-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const invoice = await Fee.create({
      student,
      feeType,
      expectedAmount,
      dueDate,
      invoiceNumber,
      status: 'Pending'
    });
    res.status(201).json({ success: true, message: 'Fee Invoice generated', data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Pay invoice (Simulated card/UPI transaction)
// @route   PUT /api/fees/:id/pay
// @access  Private (Student/Parent/Admin)
router.put('/:id/pay', protect, async (req, res) => {
  const { paymentMethod } = req.body;
  try {
    const invoice = await Fee.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    invoice.collectedAmount = invoice.expectedAmount;
    invoice.status = 'Paid';
    invoice.paymentDate = new Date();
    invoice.paymentMethod = paymentMethod || 'Card';

    await invoice.save();

    res.status(200).json({ success: true, message: 'Payment simulated successfully', data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get dashboard metrics for collection
// @route   GET /api/fees/stats
// @access  Private (Admin)
router.get('/stats', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const invoices = await Fee.find();
    let expected = 0;
    let collected = 0;
    let pending = 0;
    let overdue = 0;

    const now = new Date();

    invoices.forEach(inv => {
      expected += inv.expectedAmount;
      collected += inv.collectedAmount;

      if (inv.status === 'Paid') {
        // Already collected
      } else {
        const remaining = inv.expectedAmount - inv.collectedAmount;
        pending += remaining;

        if (new Date(inv.dueDate) < now) {
          overdue += remaining;
        }
      }
    });

    res.status(200).json({
      success: true,
      data: { expected, collected, pending, overdue }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
