const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, password, role, email } = req.body;
    console.log("🚀 ~ router.post ~ username, password, role:", username, password, role)

    
    // Check if role is valid
    if (!['farmer', 'engineer', 'stakeholder'].includes(role)) {
      return res.status(400).send('Invalid role');
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).send('Email already in use');
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).send('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, role, email });
    await user.save();
    
    res.status(201).send('User registered successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error registering user');
  }
});


router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    // Check if user exists
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).send('Invalid password');
    }

    // Generate JWT token
    const token = jwt.sign({ username: user.username, role: user.role }, 'secretkey');

    // Send token, role and username
    res.status(200).json({ token, user: { role: user.role, username: user.username} }); 
  } catch (error) {
    console.error(error);
    res.status(500).send('Error logging in');
  }
});


// Example of route with role-based authorization
router.get('/protected-route', authenticateToken, authorizeRole(['engineer']), (req, res) => {
  res.send('You have access to this protected route');
});

module.exports = router;
