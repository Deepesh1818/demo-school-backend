const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add an exam name'],
    trim: true
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  type: {
    type: String,
    enum: ['Midterm', 'Final', 'Quarterly', 'Unit Test', 'Practical'],
    default: 'Unit Test'
  },
  date: {
    type: Date,
    required: true
  },
  maxMarks: {
    type: Number,
    required: true,
    default: 100
  },
  passingMarks: {
    type: Number,
    required: true,
    default: 33
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Exam', ExamSchema);
