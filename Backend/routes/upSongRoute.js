// Imports
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const SongRequest = require('../module/SongRequest');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/songs/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Use original name with timestamp
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit to 10MB
});


// POST: Upload new song (Admin)
router.post('/upload', authMiddleware, upload.single('song'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const newSong = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
    };

    res.status(201).json({ message: 'Song uploaded successfully', song: newSong });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET: Fetch all uploaded songs
router.get('/songs', authMiddleware, async (req, res) => {
  const songsDir = path.join(__dirname, '../uploads/songs/');

  try {
    // Check if the folder exists
    if (!fs.existsSync(songsDir)) {
      return res.status(404).json({ message: 'Songs folder not found' });
    }

    // Read songs from the folder
    const songs = fs.readdirSync(songsDir).map((file) => ({
      filename: file,
      url: `/uploads/songs/${file}`,
    }));

    res.json(songs);
  } catch (error) {
    console.error('Error fetching songs:', error.message);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});


// DELETE: Delete a song (Admin)
router.delete('/songs/:filename', authMiddleware, async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../uploads/songs/', filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ message: 'Song deleted successfully' });
    } else {
      res.status(404).json({ message: 'Song not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// New route for downloading songs (optional but useful)
router.get('/download/:filename', authMiddleware, (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '../uploads/songs/', filename);

  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).json({ message: 'Song not found' });
  }
});

module.exports = router;
