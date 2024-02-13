const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).send('Access Denied');

  jwt.verify(token, 'secretkey', async (err, decoded) => {
    if (err) return res.status(403).send('Invalid Token');

    try {
      const user = await User.findOne({ username: decoded.username });
      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });
};

const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).send('Unauthorized');
    }
    next();
  };
};

module.exports = { authenticateToken, authorizeRole };
