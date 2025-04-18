const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../module/User');
require('dotenv').config();

const router = express.Router();

// Generate Access Token
// const generateAccessToken = (user) => {
//   return jwt.sign(
//     { id: user._id, email: user.email, role: user.role },
//     process.env.JWT_SECRET,
//     { expiresIn: '15m' } // Access Token expires in 15 mins
//   );
// };

// // Generate Refresh Token
// const generateRefreshToken = (user) => {
//   return jwt.sign(
//     { id: user._id },
//     process.env.REFRESH_SECRET,
//     { expiresIn: '7d' } // Refresh Token expires in 7 days
//   );
// };

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt:", email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found!");
      return res.status(400).json({ message: 'User not found!' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      console.log("Invalid password!");
      return res.status(400).json({ message: 'Invalid password!' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log("Login successful:", email, "Role:", user.role);

    res.json({ accessToken: token, role: user.role, email: user.email });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});





module.exports = router;