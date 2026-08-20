const express = require('express');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get attendance stats and records (filters: class, student, date)
// @route   GET /api/attendance
// @access  Private
router.get('/', protect, async (req, res) => {
  const { classId, studentId, date, month } = req.query;
  const query = {};

  try {
    if (studentId) {
      query.student = studentId;
    }
    if (date) {
      query.date = new Date(date);
    } else if (month) {
      // Month format: YYYY-MM
      const start = new Date(`${month}-01`);
      const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
      query.date = { $gte: start, $lte: end };
    }

    if (classId) {
      // If filtering by class, first find students in that class
      const students = await Student.find({ class: classId }).select('_id');
      const studentIds = students.map(s => s._id);
      query.student = { $in: studentIds };
    }

    const records = await Attendance.find(query).populate({
      path: 'student',
      populate: { path: 'class' }
    });

    res.status(200).json({ success: true, count: records.length, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Bulk Save/Mark Attendance
// @route   POST /api/attendance/bulk
// @access  Private (Admin/Teacher)
router.post('/bulk', protect, authorize('admin', 'superadmin', 'teacher'), async (req, res) => {
  const { date, attendanceData } = req.body; // attendanceData: [{ student: id, status: 'Present' }]

  if (!date || !attendanceData || !Array.isArray(attendanceData)) {
    return res.status(400).json({ success: false, message: 'Please provide date and attendance records array' });
  }

  try {
    const formattedDate = new Date(date);
    formattedDate.setHours(0, 0, 0, 0); // Normalize time

    const bulkOps = attendanceData.map((item) => ({
      updateOne: {
        filter: { date: formattedDate, student: item.student },
        update: {
          $set: {
            status: item.status,
            markedBy: req.user.email
          }
        },
        upsert: true
      }
    }));

    await Attendance.bulkWrite(bulkOps);

    res.status(200).json({ success: true, message: 'Attendance records saved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get attendance analytics for Dashboard
// @route   GET /api/attendance/stats
// @access  Private (Admin/Teacher)
router.get('/stats', protect, authorize('admin', 'superadmin', 'teacher'), async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayRecords = await Attendance.find({ date: today });

    const stats = {
      Present: 0,
      Absent: 0,
      Late: 0,
      Leave: 0,
      Total: todayRecords.length
    };

    todayRecords.forEach(record => {
      if (stats[record.status] !== undefined) {
        stats[record.status]++;
      }
    });

    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
