const mongoose = require('mongoose');

const LibraryBookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a book title'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Please add an author name'],
    trim: true
  },
  isbn: {
    type: String,
    required: [true, 'Please add an ISBN'],
    unique: true,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Science', 'Mathematics', 'Literature', 'History', 'Fiction', 'Biography', 'Computers', 'Reference'],
    default: 'Science'
  },
  totalCopies: {
    type: Number,
    required: true,
    default: 1
  },
  availableCopies: {
    type: Number,
    required: true,
    default: 1
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('LibraryBook', LibraryBookSchema);
