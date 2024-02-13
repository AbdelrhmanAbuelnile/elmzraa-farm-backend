const express = require("express");
const Crop = require("../models/crops")

const router = express.Router();

// create a crop
router.post('/', async (req,res)=> {
  const { Crop_Type, Crop_PlantDate, Crop_HarvestDate} = req.body;
  const crop = await Crop.create({ Crop_Type, Crop_PlantDate, Crop_HarvestDate})
  res.send(crop) 
})

// get all crops
router.get('/', async (req,res)=> {
  const crops = await Crop.find();
  res.send(crops)
})

// get a crop by name
router.get('/:crop', async (req,res)=> {
  let cropName = req.params.crop;
  cropName = cropName.toLowerCase();
  const crop = await Crop.find({
    Crop_Type: { $regex: new RegExp(cropName), $options: 'i' }
  });
  res.send(crop)
})


module.exports = router;