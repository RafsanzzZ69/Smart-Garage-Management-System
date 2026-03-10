const express = require('express');
const { auth, roleAuth } = require('../middleware/auth');
const Expense = require('../models/Expense');

const router = express.Router();

// Get all expenses
router.get('/', auth, roleAuth(['Admin']), async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.send(expenses);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Create expense
router.post('/', auth, roleAuth(['Admin']), async (req, res) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();
    res.status(201).send(expense);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

module.exports = router;