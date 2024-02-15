const express = require("express");
const Crop = require("../models/crops")
const Farm = require("../models/farm")

const router = express.Router();

// create a crop
router.post('/', async (req,res)=> {
  const { name, plantDate, harvestDate,count, farmId } = req.body;

  if (!farmId) {
    return res.status(400).send('Farm ID is required');
  }

  const farm = await Farm.findById(farmId);
  if (!farm) {
    return res.status(404).send('Farm not found');
  }

  const crop = await Crop.create({ name, plantDate, harvestDate, count, farm: farm._id});

  farm.crops.push(crop._id);
  await farm.save();

  res.send(crop);
});

// get all crops
router.get('/', async (req,res)=> {
  const {farmId} = req.body;
  try {
    if (farmId) {
      const farm = await Farm.findById(farmId).populate('crops');
      if (!farm) {
        return res.status(404).send('Farm not found');
      }
      return res.send(farm.crops);
    }else{
      res.send("Please provide a farm ID")
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while processing your request');
  }
});

// search for a crop by name
router.get('/:crop', async (req,res)=> {
  const { crop } = req.params;
  const { farmId } = req.body;

  // Check if farmId is provided
  if (!farmId) {
    return res.status(400).send('Farm ID is required');
  }

  // Find the farm by ID
  const farm = await Farm.findById(farmId);
  if (!farm) {
    return res.status(404).send('Farm not found');
  }

  // Find the crop by name and farm
  const crops = await Crop.find({
    name: { $regex: new RegExp(crop), $options: 'i' },
    farm: farmId
  });

  res.send(crops);
});


module.exports = router;