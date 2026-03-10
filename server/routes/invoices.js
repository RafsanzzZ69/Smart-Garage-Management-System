const express = require('express');
const { auth } = require('../middleware/auth');
const Invoice = require('../models/Invoice');

const router = express.Router();

// Get all invoices
router.get('/', auth, async (req, res) => {
  try {
    const invoices = await Invoice.find().populate('service customer vehicle');
    res.send(invoices);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Create invoice
router.post('/', auth, async (req, res) => {
  try {
    const invoice = new Invoice(req.body);
    await invoice.save();
    res.status(201).send(invoice);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

module.exports = router;