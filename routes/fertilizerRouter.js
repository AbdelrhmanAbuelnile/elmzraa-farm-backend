const express = require('express');
const router = express.Router();
const Fertilizer = require('../models/fertlizers');
const Farm = require('../models/farm');

// create a new fertilizer
router.post('/', async (req, res) => {
  try {
    const fertilizer = new Fertilizer(req.body);
    await fertilizer.save();

    // Find the farm and update it
    const farm = await Farm.findById(req.body.Farm_Id);
    if (!farm) {
      return res.status(404).json({ error: 'Farm not found' });
    }
    farm.fertilizers.push({ name: req.body.Fer_Name, count: req.body.Fer_Quantity, _id: fertilizer._id });
    await farm.save();

    res.status(201).json(fertilizer);
  } catch (error) {
    res.status(400).json({ error: error.toString() });
  }
});

// PATCH route to update an existing fertilizer
router.patch('/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['Fer_Name', 'Fer_Cost', 'Fer_Quantity'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ error: 'Invalid updates!' });
  }

  try {
    const fertilizer = await Fertilizer.findById(req.params.id);
    if (!fertilizer) {
      return res.status(404).json({ error: 'Fertilizer not found' });
    }

    updates.forEach((update) => fertilizer[update] = req.body[update]);
    await fertilizer.save();

    // Find the farm and update the fertilizer
    const farm = await Farm.findOne({ 'fertilizers._id': fertilizer._id });
    if (farm) {
      const fertilizerToUpdate = farm.fertilizers.id(fertilizer._id);
      if (fertilizerToUpdate) {
        fertilizerToUpdate.name = fertilizer.Fer_Name;
        fertilizerToUpdate.count = fertilizer.Fer_Quantity;
        await farm.save();
      }
    }

    res.json(fertilizer);
  } catch (error) {
    res.status(400).json({ error: error.toString() });
  }
});

module.exports = router;