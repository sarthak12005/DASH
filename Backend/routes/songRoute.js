const express = require('express');
const SongRequest = require('../module/SongRequest');
const router = express.Router();
const authMiddleware = require('../middleware/auth'); // Ensure you have this middleware to verify tokens

// POST: Create a new song request
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {userId} = req.user;
    const { songs } = req.body;

    if (!Array.isArray(songs) || songs.length === 0) {
      return res.status(400).json({ message: 'Songs must be an array with at least one song' });
    }

    const newRequest = new SongRequest({
      userId,
      songs
    });

    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET: Fetch all song requests (For admin)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const requests = await SongRequest.find().populate('userId', 'email');
    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// DELETE: Delete a song request (Admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await SongRequest.findByIdAndDelete(id);
    res.json({ message: 'Request deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
