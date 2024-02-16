const express = require("express");
const farmModel = require("../models/farm")
const Crop = require("../models/crops")
const User = require("../models/User")
const router = express.Router();

// create a farm by a stakeholder only
router.post('/', async (req,res)=> {
  const { name, size, planted_percentage, harvest_percentage, crops, workers, equipments, fertilizers, medicines, userId } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).send('User not found');
  }

  if (user.role === 'farmer' || user.role === 'engineer') {
    return res.status(403).send('User does not have permission to create a farm');
  }

  const newFarm = new farmModel({
      name,
      size,
      planted_percentage,
      harvest_percentage,
      stackholders: [userId],
      crops,
      workers,
      equipments,
      fertilizers,
      medicines
  });

  const savedFarm = await newFarm.save();

  res.status(201).json(savedFarm);
})

// get farm data by farm id
router.get('/:farmId', async (req, res) => {
  try {
    const { farmId } = req.params;
    const farm = await farmModel.findById(farmId)
    .populate('crops')
    .populate({ path: 'workers', select: '-password -email -Farm_Id' })
    .populate({ path: 'equipments', select: '-Farm_Id'})
    .populate({ path: 'fertilizers', select: '-Farm_Id'})
    .populate({ path: 'medicines', select: '-Farm_Id'});
    if (!farm) {
      return res.status(404).json({ error: 'Farm not found' });
    }
    res.json(farm);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// get all farms for a specific user like engineer or stakeholder
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    const farms = await farmModel.find({ 
      $or: [
        { workers: userId },
        { stackholders: userId }
      ] 
    }).populate('crops').populate({ path: 'workers', select: '-password' });

    if (!farms) {
      return res.status(404).json({ error: 'No farms found for this user' });
    }

    res.json(farms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:farmId/crops', async (req, res) => {
  try {
    const { farmId } = req.params;

    const farm = await farmModel.findById(farmId).populate('crops');

    if (!farm) {
      return res.status(404).json({ error: 'Farm not found' });
    }

    res.json(farm.crops);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// get all farms only accessd by the creaitor of the application
router.get('/', async (req,res)=> {
  const farms = await farmModel.find();
  res.send(farms)
})

// get a farm by name only accessd by the creaitor of the application
router.get('/:farm', async (req,res)=> {
  let farmName = req.params.farm;
  farmName = farmName.toLowerCase();
  const farm = await farmModel.find({
    farm_Type: { $regex: new RegExp(farmName), $options: 'i' }
  });
  res.send(farm)
})


// add a worker to the farm by farm id and worker id only accessd by the stakeholders
router.post('/:farmId/addWorkers', async (req, res) => {
  const { farmId } = req.params;
  console.log("🚀 ~ router.patch ~ farmId:", farmId)

  const { workerIds } = req.body;
  console.log("🚀 ~ router.patch ~ workerIds:", workerIds)

  try {
    const farm = await farmModel.findById(farmId);
    if (!farm) {
      return res.status(404).send('Farm not found');
    }
    
    for (const workerId of workerIds) {
      // Find the worker by ID
      const worker = await User.findById(workerId);
      if (!worker) {
        return res.status(404).send(`Worker with ID ${workerId} not found`);
      }
      if(!farm.workers.includes(workerId)){
        farm.workers.push(workerId);
      }else{
        return res.status(400).send(`Worker with ID ${workerId} already exists in the farm`);
      }
      worker.Farm_Id = farmId;
      await worker.save();
    }
    await farm.save();

    res.send({message: "Workers added successfully to the farm"});
  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding workers to farm');
  }
});

// edit the farm by farm id only accessd by the stakeholders and engineers
router.patch('/:farmId', async (req, res) => {
  const { farmId } = req.params;
  const { name, size, crops, workerIds, userId } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).send('User not found');
  }

  if(user.role === 'farmer'){
    return res.status(403).send('User does not have permission to update the farm');
  }

  try {
    const farm = await farmModel.findById(farmId);
    if (!farm) {
      return res.status(404).send('Farm not found');
    }

    for (const workerId of workerIds) {
      const worker = await User.findById(workerId);
      if (!worker) {
        return res.status(404).send(`Worker with ID ${workerId} not found`);
      }
      if(!farm.workers.includes(workerId)){
        farm.workers.push(workerId);
        worker.farms.push(farmId);
      }else{
        return res.status(400).send(`Worker with ID ${workerId} already exists in the farm`);
      }
    }

    farm.name = name;
    farm.size = size;
    farm.crops = crops;

    await farm.save();

    res.json(farm);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating farm');
  }
});


module.exports = router;