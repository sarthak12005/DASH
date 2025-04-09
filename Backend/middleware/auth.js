require('dotenv').require();
const express = require('express');
const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log("No token provided");
    return res.status(401).json({ message: `User is not authorized` });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);
    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    console.log("Invalid token:", error.message);
    return res.status(400).json({ message: "Invalid token", error: error.message });
  }
};



module.exports = authMiddleware;