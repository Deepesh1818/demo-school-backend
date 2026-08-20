const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  marks: {
    type: Number,
    required: true
  },
  grade: {
    type: String,
    required: true,
    default: 'F'
  },
  remarks: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

// Enforce unique composite key to prevent multiple grades for same student, exam and subject
ResultSchema.index({ student: 1, exam: 1, subject: 1 }, { unique: true });

module.exports = mongoose.model('Result', ResultSchema);
