const express = require('express');
const { auth, roleAuth } = require('../middleware/auth');
const Inventory = require('../models/Inventory');

const router = express.Router();

// Get all inventory
router.get('/', auth, roleAuth(['Admin']), async (req, res) => {
  try {
    const inventory = await Inventory.find();
    res.send(inventory);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Create inventory item
router.post('/', auth, roleAuth(['Admin']), async (req, res) => {
  try {
    const item = new Inventory(req.body);
    await item.save();
    res.status(201).send(item);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Update inventory
router.put('/:id', auth, roleAuth(['Admin']), async (req, res) => {
  try {
    const item = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(item);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

module.exports = router;