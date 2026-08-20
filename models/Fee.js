const mongoose = require('mongoose');

const FeeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  feeType: {
    type: String,
    required: true,
    enum: ['Tuition Fee', 'Admission Fee', 'Transport Fee', 'Library Fee', 'Exam Fee', 'Activity Fee'],
    default: 'Tuition Fee'
  },
  expectedAmount: {
    type: Number,
    required: true
  },
  collectedAmount: {
    type: Number,
    required: true,
    default: 0
  },
  dueDate: {
    type: Date,
    required: true
  },
  paymentDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Paid', 'Pending', 'Overdue'],
    default: 'Pending'
  },
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  paymentMethod: {
    type: String,
    enum: ['Card', 'Cash', 'UPI', 'Bank Transfer', 'None'],
    default: 'None'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Fee', FeeSchema);
