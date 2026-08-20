const express = require('express');
const LibraryBook = require('../models/LibraryBook');
const LibraryTransaction = require('../models/LibraryTransaction');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all books
// @route   GET /api/library/books
// @access  Private
router.get('/books', protect, async (req, res) => {
  try {
    const books = await LibraryBook.find();
    res.status(200).json({ success: true, count: books.length, data: books });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Add book to inventory
// @route   POST /api/library/books
// @access  Private (Admin)
router.post('/books', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const book = await LibraryBook.create(req.body);
    res.status(201).json({ success: true, message: 'Book cataloged successfully', data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get borrow logs (student or all admin logs)
// @route   GET /api/library/transactions
// @access  Private
router.get('/transactions', protect, async (req, res) => {
  const { studentId } = req.query;
  const query = {};

  if (studentId) {
    query.student = studentId;
  }

  try {
    const logs = await LibraryTransaction.find(query).populate('student').populate('book');
    res.status(200).json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Issue a book
// @route   POST /api/library/issue
// @access  Private (Admin)
router.post('/issue', protect, authorize('admin', 'superadmin'), async (req, res) => {
  const { studentId, bookId, dueDate } = req.body;

  try {
    const book = await LibraryBook.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    if (book.availableCopies <= 0) {
      return res.status(400).json({ success: false, message: 'No copies available currently' });
    }

    // Issue Book
    const transaction = await LibraryTransaction.create({
      student: studentId,
      book: bookId,
      dueDate: dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    });

    // Reduce copies count
    book.availableCopies -= 1;
    await book.save();

    res.status(201).json({ success: true, message: 'Book issued successfully', data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Return a book
// @route   PUT /api/library/return/:id
// @access  Private (Admin)
router.put('/return/:id', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const transaction = await LibraryTransaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Borrow record not found' });
    }
    if (transaction.status === 'Returned') {
      return res.status(400).json({ success: false, message: 'Book already marked returned' });
    }

    transaction.returnDate = new Date();
    transaction.status = 'Returned';

    // Calculate fine if overdue (e.g. $1 / day fine)
    const due = new Date(transaction.dueDate);
    const ret = new Date(transaction.returnDate);
    if (ret > due) {
      const daysOver = Math.ceil((ret - due) / (1000 * 60 * 60 * 24));
      transaction.fine = daysOver * 10; // Rs. 10 per day
    }

    await transaction.save();

    // Restock book copies
    const book = await LibraryBook.findById(transaction.book);
    if (book) {
      book.availableCopies += 1;
      await book.save();
    }

    res.status(200).json({ success: true, message: 'Book returned successfully', data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
