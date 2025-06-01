const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  recipient: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  delivered: { 
    type: Boolean, 
    default: false 
  },
  read: { 
    type: Boolean, 
    default: false 
  }
}, { 
  timestamps: true 
});

messageSchema.index({ sender: 1, recipient: 1 });
module.exports = mongoose.model('Message', messageSchema);

// In your Message model