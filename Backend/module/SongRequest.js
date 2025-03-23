const mongoose = require('mongoose');

const songRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Refers to the User model
    required: true
  },
  songs: [
    {
      type: String,
      required: true
    }
  ],
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const SongRequest = mongoose.model('SongRequest', songRequestSchema);

module.exports = SongRequest;
