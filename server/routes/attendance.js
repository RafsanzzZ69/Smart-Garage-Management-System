const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
router.post('/', async (req, res) => {
  try {
    const { employee, date, status, checkIn, checkOut, notes } = req.body;
    const existing = await Attendance.findOne({
      employee,
      date: {
        $gte: new Date(date).setHours(0, 0, 0, 0),
        $lte: new Date(date).setHours(23, 59, 59, 999)
      }
    });
    if (existing) {
      return res.status(400).json({ message: 'Attendance already marked for this employee today' });
    }
    const attendance = new Attendance({ employee, date, status, checkIn, checkOut, notes });
    await attendance.save();
    res.status(201).json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/', async (req, res) => {
  try {
    const { employee, month, year } = req.query;
    const filter = {};
    if (employee) filter.employee = employee;
    if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0, 23, 59, 59);
      filter.date = { $gte: start, $lte: end };
    }
    const records = await Attendance.find(filter)
      .populate('employee', 'name email role')
      .sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/summary/:employeeId', async (req, res) => {
  try {
    const { month, year } = req.query;
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);
    const records = await Attendance.find({
      employee: req.params.employeeId,
      date: { $gte: start, $lte: end }
    });
    const summary = {
      present: records.filter(r => r.status === 'present').length,
      absent: records.filter(r => r.status === 'absent').length,
      halfDay: records.filter(r => r.status === 'half-day').length,
      leave: records.filter(r => r.status === 'leave').length,
      total: records.length
    };
    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.put('/:id', async (req, res) => {
  try {
    const updated = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('employee', 'name email');
    if (!updated) return res.status(404).json({ message: 'Record not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.delete('/:id', async (req, res) => {
  try {
    await Attendance.findByIdAndDelete(req.params.id);
    res.json({ message: 'Attendance record deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
