const express = require("express");
const farmModel = require("../models/farm")
const Crop = require("../models/crops")
const router = express.Router();

// create a farm
router.post('/', async (req,res)=> {
  const { name, size, planted_percentage, harvest_percentage, crops, workers, equipments, fertilizers, medicines } = req.body;

  // Create a new farm document
  const newFarm = new farmModel({
      name,
      size,
      planted_percentage,
      harvest_percentage,
      crops,
      workers,
      equipments,
      fertilizers,
      medicines
  });

  // Save the farm to the database
  const savedFarm = await newFarm.save();

  // Send a success response with the saved farm data
  res.status(201).json(savedFarm);
})

// get all farms for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Find all farms associated with the user ID and populate the crops field
    const farms = await farmModel.find({ workers: userId }).populate('crops').populate('workers');

    // If no farms are found, return a 404 status code with an error message
    if (!farms) {
      return res.status(404).json({ error: 'No farms found for this user' });
    }

    // Send the farms data in the response
    res.json(farms);
  } catch (error) {
    // If an error occurs, send a 500 status code with the error message
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:farmId/crops', async (req, res) => {
  try {
    const { farmId } = req.params;

    // Find the farm by ID and populate the crops
    const farm = await farmModel.findById(farmId).populate('crops');

    if (!farm) {
      return res.status(404).json({ error: 'Farm not found' });
    }

    // Send the crops data in the response
    res.json(farm.crops);
  } catch (error) {
    // If an error occurs, send a 500 status code with the error message
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: 'Internal server error' });
  }
});


// get all farms
router.get('/', async (req,res)=> {
  const farms = await farmModel.find();
  res.send(farms)
})

// get a farm by name
router.get('/:farm', async (req,res)=> {
  let farmName = req.params.farm;
  farmName = farmName.toLowerCase();
  const farm = await farmModel.find({
    farm_Type: { $regex: new RegExp(farmName), $options: 'i' }
  });
  res.send(farm)
})


module.exports = router;