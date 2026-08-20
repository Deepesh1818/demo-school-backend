const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a subject name'],
    unique: true,
    trim: true
  },
  code: {
    type: String,
    required: [true, 'Please add a subject code'],
    unique: true,
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Please add a department'],
    enum: ['Science', 'Commerce', 'Humanities', 'Languages', 'Mathematics', 'Computer Science', 'Sports', 'Arts'],
    default: 'Science'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Subject', SubjectSchema);
