const express = require('express');
const router = express.Router();
const Equipment = require('../models/equipments');

const Farm = require('../models/farm');

router.post('/', async (req, res) => {
  try {
    const equipment = new Equipment(req.body);
    await equipment.save();

    // Find the farm and add the new equipment
    const farm = await Farm.findById(req.body.Farm_Id);
    if (!farm) {
      return res.status(404).json({ error: 'Farm not found' });
    }
    farm.equipments.push({ name: equipment.Eq_Type, count: equipment.Eq_count });
    await farm.save();

    res.status(201).json(equipment);
  } catch (error) {
    res.status(400).json({ error: error.toString() });
  }
});

// PATCH route to update existing equipment
router.patch('/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['Eq_Type', 'Eq_cost', 'Eq_count'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ error: 'Invalid updates!' });
  }

  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    updates.forEach((update) => equipment[update] = req.body[update]);
    await equipment.save();

    // Find the farm and update the equipment
    const farm = await Farm.findOne({ 'equipments._id': equipment._id });
    if (farm) {
      const equipmentToUpdate = farm.equipments.id(equipment._id);
      if (equipmentToUpdate) {
        equipmentToUpdate.name = equipment.Eq_Type;
        equipmentToUpdate.count = equipment.Eq_count;
        await farm.save();
      }
    }

    res.json(equipment);
  } catch (error) {
    res.status(400).json({ error: error.toString() });
  }
});

module.exports = router;