const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
router.post('/', async (req, res) => {
  try {
    const { customer, mechanic, booking, rating, comment } = req.body;
    const existing = await Review.findOne({ customer, booking });
    if (existing) {
      return res.status(400).json({ message: 'You have already reviewed this service' });
    }
    const review = new Review({ customer, mechanic, booking, rating, comment });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('customer', 'name')
      .populate('mechanic', 'name')
      .populate('booking')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/mechanic/:mechanicId', async (req, res) => {
  try {
    const reviews = await Review.find({ mechanic: req.params.mechanicId })
      .populate('customer', 'name')
      .sort({ createdAt: -1 });
    const avgRating = reviews.length
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;
    res.json({ reviews, avgRating, total: reviews.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/customer/:customerId', async (req, res) => {
  try {
    const reviews = await Review.find({ customer: req.params.customerId })
      .populate('mechanic', 'name')
      .populate('booking')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.delete('/:id', async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;