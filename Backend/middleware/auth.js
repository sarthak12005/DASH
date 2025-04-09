require('dotenv').require();
const express = require('express');
const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("AUTH HEADER:", authHeader); // Debug log

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log("Authorization header missing or malformed");
      return res.status(401).json({ message: 'The user is not authorized' });
  }

  const token = authHeader.split(" ")[1];

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded JWT:", decoded); // Debug log

      req.user = { userId: decoded.userId }; // ✅ FIXED here
      next();
  } catch (error) {
      console.error("JWT verification failed:", error); // Debug log
      return res.status(400).json({ message: "Invalid token" });
  }
};


module.exports = authMiddleware;