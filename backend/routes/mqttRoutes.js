const express = require('express');
const router = express.Router();
const Location = require('../models/locationModel');
const { getActiveDevices } = require('../mqtt/tracker');

router.get('/locations', async (req, res) => {
  try {
    const data = await Location.find().sort({ timestamp: -1 }).limit(100);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Napaka pri pridobivanju lokacij' });
  }
});

router.get('/active-devices', (req, res) => {
  res.json(getActiveDevices());
});

module.exports = router;
