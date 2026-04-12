const express = require('express');
const router = express.Router();
const ServicePackage = require('../models/Servicepackage');
router.get('/', async (req, res) => {
  try {
    const packages = await ServicePackage.find();
    res.json(packages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/:id', async (req, res) => {
  try {
    const pkg = await ServicePackage.findById(req.params.id);
    if (!pkg) return res.status(404).json({ message: 'Package not found' });
    res.json(pkg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post('/', async (req, res) => {
  try {
    const { name, description, price, duration, services } = req.body;
    const pkg = new ServicePackage({ name, description, price, duration, services });
    await pkg.save();
    res.status(201).json(pkg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.put('/:id', async (req, res) => {
  try {
    const pkg = await ServicePackage.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!pkg) return res.status(404).json({ message: 'Package not found' });
    res.json(pkg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.delete('/:id', async (req, res) => {
  try {
    await ServicePackage.findByIdAndDelete(req.params.id);
    res.json({ message: 'Package deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
