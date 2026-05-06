const express = require('express');
const { auth, roleAuth } = require('../middleware/auth');
const router = express.Router();
const Promotion = require('../models/Promotion');
router.get('/', auth, async (req, res) => {
  try {
    const promotions = await Promotion.find();
    res.json(promotions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/:id', auth, async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    if (!promotion) return res.status(404).json({ message: 'Promotion not found' });
    res.json(promotion);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post('/validate', auth, async (req, res) => {
  try {
    const { code, orderAmount, serviceName } = req.body;
    if (!code) return res.status(400).json({ message: 'Promo code is required' });
    const promotion = await Promotion.findOne({ code: code.toUpperCase(), isActive: true });
    if (!promotion) return res.status(404).json({ message: 'Promo not found' });
    const now = new Date();
    if (promotion.startDate > now || promotion.endDate < now) {
      return res.status(400).json({ message: 'Promo code is not active' });
    }
    if (promotion.maxUsageCount !== null && promotion.usedCount >= promotion.maxUsageCount) {
      return res.status(400).json({ message: 'Promo code usage limit reached' });
    }
    if (orderAmount < promotion.minOrderAmount) {
      return res.status(400).json({ message: `Minimum order amount is ৳${promotion.minOrderAmount}` });
    }
    if (promotion.applicableServices?.length && serviceName && !promotion.applicableServices.includes(serviceName)) {
      return res.status(400).json({ message: 'Promo code not valid for this service' });
    }
    const discountAmount = promotion.discountType === 'percentage'
      ? Math.round((promotion.discountValue / 100) * orderAmount)
      : promotion.discountValue;
    const finalAmount = Math.max(0, orderAmount - discountAmount);
    res.json({ promoId: promotion._id, discountAmount, finalAmount, message: `Promo applied! You save ৳${discountAmount}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.patch('/:id/use', auth, async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    if (!promotion) return res.status(404).json({ message: 'Promotion not found' });
    if (promotion.maxUsageCount !== null && promotion.usedCount >= promotion.maxUsageCount) {
      return res.status(400).json({ message: 'Promo usage limit reached' });
    }
    promotion.usedCount += 1;
    await promotion.save();
    res.json(promotion);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post('/', auth, roleAuth(['Admin']), async (req, res) => {
  try {
    const { title, code, discountType, discountValue, minOrderAmount, maxUsageCount, startDate, endDate, applicableServices } = req.body;
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
      endDate: new Date(endDate),
      applicableServices: applicableServices || []
    });
    await promotion.save();
    res.status(201).json(promotion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
router.put('/:id', auth, roleAuth(['Admin']), async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!promotion) return res.status(404).json({ message: 'Promotion not found' });
    res.json(promotion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
router.delete('/:id', auth, roleAuth(['Admin']), async (req, res) => {
  try {
    await Promotion.findByIdAndDelete(req.params.id);
    res.json({ message: 'Promotion deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
module.exports = router;
