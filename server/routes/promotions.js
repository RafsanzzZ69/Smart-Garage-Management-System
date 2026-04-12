const express = require('express');
const router = express.Router();
const Promotion = require('../models/Promotion');
router.get('/', async (req, res) => {
  try {
    const promotions = await Promotion.find();
    res.json(promotions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/:id', async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    if (!promotion) return res.status(404).json({ message: 'Promotion not found' });
    res.json(promotion);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post('/', async (req, res) => {
  try {
    const { title, code, discountType, discountValue, minOrderAmount, maxUsageCount, startDate, endDate } = req.body;
    if (!title || !code || !discountType || !discountValue || !startDate || !endDate) {
      return res.status(400).json({ message: 'Missing required fields: title, code, discountType, discountValue, startDate, endDate' });
    }
    const promotion = new Promotion({
      title,
      code,
      discountType,
      discountValue: Number(discountValue),
      minOrderAmount: minOrderAmount ? Number(minOrderAmount) : 0,
      maxUsageCount: maxUsageCount ? Number(maxUsageCount) : null,
      startDate: new Date(startDate),
      endDate: new Date(endDate)
    });
    await promotion.save();
    res.status(201).json(promotion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
router.put('/:id', async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!promotion) return res.status(404).json({ message: 'Promotion not found' });
    res.json(promotion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
router.delete('/:id', async (req, res) => {
  try {
    await Promotion.findByIdAndDelete(req.params.id);
    res.json({ message: 'Promotion deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
module.exports = router;
