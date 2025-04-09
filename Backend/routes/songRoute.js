const express = require('express');
const router = express.Router();
const SongRequest = require('../module/SongRequest');
const authMiddleware = require('../middleware/auth');

// POST: Create a new song request
router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { songs } = req.body;

    if (!Array.isArray(songs) || songs.length === 0) {
      return res.status(400).json({ message: 'Songs must be an array with at least one song' });
    }

    const newRequest = new SongRequest({ userId, songs });
    await newRequest.save();

    res.status(201).json(newRequest);
  } catch (error) {
    console.error("POST /api/songs Error:", error.message);
    console.error(error); // FULL error including stack trace
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});


// GET: Fetch all song requests (For admin)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const requests = await SongRequest.find().populate('userId', 'email');
    res.json(requests);
  } catch (error) {
    console.error("GET /api/songs Error:", error);
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
    console.error("DELETE /api/songs/:id Error:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
