const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Late', 'Leave'],
    required: true
  },
  markedBy: {
    type: String,
    default: 'System Admin'
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate attendance entry for same student on same date
AttendanceSchema.index({ date: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
