const mongoose = require('mongoose');

const LibraryTransactionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LibraryBook',
    required: true
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true,
    default: () => new Date(+new Date() + 14 * 24 * 60 * 60 * 1000) // Default 14 days
  },
  returnDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Issued', 'Returned', 'Overdue'],
    default: 'Issued'
  },
  fine: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('LibraryTransaction', LibraryTransactionSchema);
