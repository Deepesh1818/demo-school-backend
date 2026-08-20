const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a class name (e.g. Class X)'],
    trim: true
  },
  code: {
    type: String,
    required: [true, 'Please add a class code (e.g. CL10)'],
    unique: true,
    trim: true
  },
  section: {
    type: String,
    required: [true, 'Please add a section (e.g. A)'],
    default: 'A',
    trim: true
  },
  room: {
    type: String,
    required: [true, 'Please add a room number'],
    trim: true
  },
  classTeacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  subjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Class', ClassSchema);
