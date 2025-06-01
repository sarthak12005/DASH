const express = require('express');
const router = express.Router();
const User = require('../module/User');
const Message = require('../module/Message');
const auth = require('../middleware/auth');

// Get all users except current user
router.get('/users', auth, async (req, res) => {
  try {
    const users = await User.find(
      { _id: { $ne: req.user._id } },
      { password: 0, __v: 0 }
    ).sort({ online: -1, name: 1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single user by ID
router.get('/users/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(
      req.params.id,
      { password: 0, __v: 0 }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get conversation between two users
router.get('/messages/:userId1/:userId2', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.params.userId1, recipient: req.params.userId2 },
        { sender: req.params.userId2, recipient: req.params.userId1 }
      ]
    })
      .sort({ createdAt: 1 })
      .populate('sender', 'name email')
      .populate('recipient', 'name email');

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.delete('/delete-msg', auth, async (req, res) => {
  try {
      const {otherUser, currentUser} = req.body;

    if (!otherUser || !currentUser) {
      return res.status(400).json({ error: 'Other user ID is required' });
    }

    // Delete messages where:
    // (sender is current user AND recipient is other user) OR
    // (sender is other user AND recipient is current user)
    const result = await Message.deleteMany({
      $or: [
        { sender: currentUser, recipient: otherUser },
        { sender: otherUser, recipient: currentUser}
      ]
    });

    res.json({
      success: true,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error deleting messages:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;