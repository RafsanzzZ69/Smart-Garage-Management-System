const express = require('express');
const router = express.Router();
const ServiceHistory = require('../models/Servicehistory');
router.get('/', async (req, res) => {
  try {
    const history = await ServiceHistory.find()
      .populate('booking')
      .populate('mechanic', 'name email')
      .sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/:id', async (req, res) => {
  try {
    const history = await ServiceHistory.findById(req.params.id)
      .populate('booking')
      .populate('mechanic', 'name email');
    if (!history) return res.status(404).json({ message: 'Record not found' });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post('/', async (req, res) => {
  try {
    const { booking, mechanic, workDescription, partUsed, laborCost, totalCost, completionDate } = req.body;
    const history = new ServiceHistory({ 
      booking, 
      mechanic, 
      workDescription, 
      partUsed, 
      laborCost, 
      totalCost, 
      completionDate 
    });
    await history.save();
    res.status(201).json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.put('/:id', async (req, res) => {
  try {
    const history = await ServiceHistory.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('booking')
      .populate('mechanic', 'name email');
    if (!history) return res.status(404).json({ message: 'Record not found' });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.delete('/:id', async (req, res) => {
  try {
    await ServiceHistory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service history record deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
