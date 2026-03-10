const express = require('express');
const { auth } = require('../middleware/auth');
const Vehicle = require('../models/Vehicle');

const router = express.Router();

// Get all vehicles (customers see own, admin sees all)
router.get('/', auth, async (req, res) => {
  try {
    let filter = {};
    if (req.user.role !== 'Admin') {
      filter.owner = req.user._id;
    }
    const vehicles = await Vehicle.find(filter).populate('serviceHistory');
    res.send(vehicles);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Create vehicle
router.post('/', auth, async (req, res) => {
  try {
    const vehicle = new Vehicle({ ...req.body, owner: req.user._id });
    await vehicle.save();
    res.status(201).send(vehicle);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Update vehicle
router.put('/:id', auth, async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(vehicle);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Delete vehicle
router.delete('/:id', auth, async (req, res) => {
  try {
    await Vehicle.findByIdAndDelete(req.params.id);
    res.send({ message: 'Vehicle deleted' });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

module.exports = router;