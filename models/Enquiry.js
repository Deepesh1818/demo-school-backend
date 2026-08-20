const mongoose = require('mongoose');

const EnquirySchema = new mongoose.Schema({
  parentName: {
    type: String,
    required: [true, 'Please provide parent name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Please provide phone number']
  },
  studentName: {
    type: String,
    required: [true, 'Please provide student name'],
    trim: true
  },
  targetClass: {
    type: String,
    required: [true, 'Please specify targeted class'],
    trim: true
  },
  academicYear: {
    type: String,
    required: [true, 'Please specify academic year (e.g. 2026-27)'],
    default: '2026-2027'
  },
  message: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Follow-up', 'Converted', 'Rejected'],
    default: 'New'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Enquiry', EnquirySchema);
