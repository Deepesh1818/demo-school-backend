const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add an event title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add an event description'],
    trim: true
  },
  category: {
    type: String,
    enum: ['Cultural', 'Sports', 'Academic', 'National', 'Excursion'],
    default: 'Academic'
  },
  date: {
    type: Date,
    required: [true, 'Please add an event date']
  },
  time: {
    type: String,
    required: [true, 'Please add event timing details (e.g. 09:00 AM - 02:00 PM)']
  },
  location: {
    type: String,
    required: [true, 'Please add a location'],
    default: 'Goshen Campus Auditorium'
  },
  coverImage: {
    type: String,
    default: '/uploads/default-event.png'
  },
  gallery: [{
    type: String
  }],
  registrationRequired: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['Draft', 'Published', 'Completed'],
    default: 'Published'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', EventSchema);
