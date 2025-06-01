const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    trim: true
  },
  online: {
    type: Boolean,
    default: false
  },
  socketId: {
    type: String,
    default: ''
  },
  lastSeen: {
    type: Date,
    default: Date.now
  }
}, {timestamps: true}
);

module.exports = mongoose.model('User', userSchema);