const express = require('express');
const { auth, roleAuth } = require('../middleware/auth');
const { getFinancials } = require('../services/financeService');

const router = express.Router();

router.get('/', auth, roleAuth(['Admin']), async (req, res) => {
  const data = await getFinancials();
  res.send(data);
});

module.exports = router;