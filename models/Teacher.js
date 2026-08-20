const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  designation: {
    type: String,
    required: [true, 'Please add a designation'],
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Please add a department'],
    enum: ['Science', 'Commerce', 'Humanities', 'Languages', 'Mathematics', 'Computer Science', 'Sports', 'Arts'],
    default: 'Science'
  },
  experience: {
    type: Number,
    required: [true, 'Please add years of experience']
  },
  subjects: [{
    type: String,
    trim: true
  }],
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    trim: true
  },
  photo: {
    type: String,
    default: '/uploads/default-teacher.png'
  },
  bio: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Active', 'On Leave', 'Inactive'],
    default: 'Active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Teacher', TeacherSchema);
