const express = require('express');
const Farm = require("../models/farm")
const Medicine = require("../models/medicines")

const router = express.Router();

// create a medicine
router.post('/', async (req,res)=> {
  const { name, count, cost, schedule, Farm_Id } = req.body;

  if (!Farm_Id) {
    return res.status(400).send('Farm ID is required');
  }

  const farm = await Farm.findById(Farm_Id);
  if (!farm) {
    return res.status(404).send('Farm not found');
  }

  const medicine = await Medicine.create({ name, count, cost, schedule, Farm_Id: farm._id});

  farm.medicines.push(medicine._id);
  await farm.save();

  res.send(medicine);
});

module.exports = router;