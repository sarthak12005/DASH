require('dotenv').config();
const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'The user is not authorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded.id }; // ✅ FIXED: use decoded.id
    next();
  } catch (error) {
    console.error("JWT Error:", error);
    res.status(400).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
