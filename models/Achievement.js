const mongoose = require('mongoose');

const AchievementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add an achievement title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add description details'],
    trim: true
  },
  category: {
    type: String,
    enum: ['Academic', 'Sports', 'Art & Culture', 'Science & Innovation', 'General'],
    default: 'Academic'
  },
  studentName: {
    type: String,
    required: [true, 'Please specify winner/student/team names'],
    trim: true
  },
  year: {
    type: Number,
    required: true,
    default: () => new Date().getFullYear()
  },
  iconType: {
    type: String,
    enum: ['trophy', 'medal', 'award', 'star'],
    default: 'trophy'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Achievement', AchievementSchema);
