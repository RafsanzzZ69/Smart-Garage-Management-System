const express = require('express');
const { auth } = require('../middleware/auth');
const Booking = require('../models/Booking');

const router = express.Router();

// Get all bookings
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find().populate('customer vehicle mechanic');
    res.send(bookings);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Create booking
router.post('/', auth, async (req, res) => {
  try {
    const booking = new Booking({ ...req.body, customer: req.user._id });
    await booking.save();
    res.status(201).send(booking);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Update booking
router.put('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(booking);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Delete (cancel) booking
router.delete('/:id', auth, async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.send({ success: true });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

module.exports = router;