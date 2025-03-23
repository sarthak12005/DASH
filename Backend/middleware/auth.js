const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
  let token = req.headers['authorization']?.split(' ')[1]; // From header

  // If no token in header, check query parameters
  if (!token && req.query.token) {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid access token' });
    }
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
