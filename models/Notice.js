const mongoose = require('mongoose');

const NoticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a notice title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add description details'],
    trim: true
  },
  category: {
    type: String,
    enum: ['Admission', 'Exam', 'Activity', 'Meeting', 'General', 'Urgent'],
    default: 'General'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  publishDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date
  },
  attachment: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Draft', 'Published', 'Archived'],
    default: 'Published'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Notice', NoticeSchema);
