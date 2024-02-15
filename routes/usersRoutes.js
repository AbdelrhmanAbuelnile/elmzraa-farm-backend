const express = require("express");
const User = require("../models/User")

const router = express.Router();

// create a user
router.post('/', async (req,res)=> {
  const {email, password} = req.body;
  console.log("🚀 ~ router.post ~ email, password:", email, password)
  const user = await User.create({email, password})
  user.password = undefined;
  res.send(user) 
})

// get all users
router.get('/', async (req,res)=> {
  const users = await User.find();
  res.send(users)
})

// get a user by id
router.get('/:id', async (req,res)=> {
  const { id } = req.params;
  const user = await User.findById(id);
  res.send(user)
})

// update a user by id
router.patch('/:id', async (req,res)=> {
  const { id } = req.params;
  const { email, password } = req.body;
  const user = await User.findByIdAndUpdate(id, {email, password}, {new: true});
  res.send(user)
})

// update a user farm by id 
router.patch('/farm/:id', async (req, res) => {
  const { id } = req.params;
  const { farmId } = req.body;

  try {
    // Find the user and update the farm field
    const user = await User.findByIdAndUpdate(id, { farm: farmId }, { new: true });
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Find the farm and add the user to the workers field
    const farm = await Farm.findById(farmId);
    if (!farm) {
      return res.status(404).send('Farm not found');
    }
    farm.workers.push(id);
    await farm.save();

    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating user and farm');
  }
});

// delete a user by id from the farm
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Find the user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Find the farm and remove the user from the workers field
    const farm = await Farm.findById(user.farm);
    if (farm) {
      farm.workers.pull(id);
      await farm.save();
    }

    // Remove the farmId from the user document and delete the user
    user.farm = undefined;
    await user.save();
    await User.findByIdAndDelete(id);

    res.send({message: "User deleted successfully"});
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting user');
  }
});



module.exports = router;