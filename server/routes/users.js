const express = require('express');
const { auth, roleAuth } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

router.get('/', auth, roleAuth(['Admin']), async (req, res) => {
  const users = await User.find().populate('vehicles');
  res.send(users);
});

router.post('/', auth, roleAuth(['Admin']), async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.status(201).send(user);
});

router.put('/:id', auth, roleAuth(['Admin']), async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(user);
});

module.exports = router;