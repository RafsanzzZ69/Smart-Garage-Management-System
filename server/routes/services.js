const express = require('express');
const { auth } = require('../middleware/auth');
const Service = require('../models/Service');

const router = express.Router();

// Get all services
router.get('/', auth, async (req, res) => {
  try {
    const services = await Service.find().populate('customer vehicle mechanic partsUsed invoice');
    res.send(services);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Create service
router.post('/', auth, async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).send(service);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Update service
router.put('/:id', auth, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(service);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

module.exports = router;