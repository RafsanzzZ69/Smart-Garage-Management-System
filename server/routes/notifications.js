const express = require('express');
const { auth } = require('../middleware/auth');
const Notification = require('../models/Notification');

const router = express.Router();

// Get user notifications
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id });
    res.send(notifications);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Create notification
router.post('/', auth, async (req, res) => {
  try {
    const notification = new Notification({ ...req.body, user: req.user._id });
    await notification.save();
    res.status(201).send(notification);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Mark as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    res.send(notification);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

module.exports = router;