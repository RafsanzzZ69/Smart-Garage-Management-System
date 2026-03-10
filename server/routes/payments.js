const express = require('express');
const { auth } = require('../middleware/auth');
const Payment = require('../models/Payment');

const router = express.Router();

// Get all payments
router.get('/', auth, async (req, res) => {
  try {
    const payments = await Payment.find().populate('booking');
    res.send(payments);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Create payment
router.post('/', auth, async (req, res) => {
  try {
    const payment = new Payment(req.body);
    await payment.save();
    res.status(201).send(payment);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Update payment
router.put('/:id', auth, async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(payment);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

module.exports = router;