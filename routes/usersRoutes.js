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

// delete a user by id
router.delete('/:id', async (req,res)=> {
  const { id } = req.params;
  await User.findByIdAndDelete(id);
  res.send({message: "User deleted successfully"})
})



module.exports = router;