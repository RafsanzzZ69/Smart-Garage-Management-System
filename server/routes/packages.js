const express = require('express');
const { auth, roleAuth } = require('../middleware/auth');
const router = express.Router();
const ServicePackage = require('../models/Servicepackage');
router.get('/', auth, async (req, res) => {
  try {
    const packages = await ServicePackage.find();
    res.json(packages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/:id', auth, async (req, res) => {
  try {
    const pkg = await ServicePackage.findById(req.params.id);
    if (!pkg) return res.status(404).json({ message: 'Package not found' });
    res.json(pkg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post('/', auth, roleAuth(['Admin']), async (req, res) => {
  try {
    const { name, description, price, estimatedDuration, services } = req.body;
    const pkg = new ServicePackage({ name, description, price, estimatedDuration, services });
    await pkg.save();
    res.status(201).json(pkg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.put('/:id', auth, roleAuth(['Admin']), async (req, res) => {
  try {
    const pkg = await ServicePackage.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!pkg) return res.status(404).json({ message: 'Package not found' });
    res.json(pkg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.patch('/:id/toggle', auth, roleAuth(['Admin']), async (req, res) => {
  try {
    const pkg = await ServicePackage.findById(req.params.id);
    if (!pkg) return res.status(404).json({ message: 'Package not found' });
    pkg.isActive = !pkg.isActive;
    await pkg.save();
    res.json(pkg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.delete('/:id', auth, roleAuth(['Admin']), async (req, res) => {
  try {
    await ServicePackage.findByIdAndDelete(req.params.id);
    res.json({ message: 'Package deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
