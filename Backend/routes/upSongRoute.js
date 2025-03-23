const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const SongRequest = require('../module/SongRequest');
const router = express.Router();
const authMiddleware = require('../middleware/auth'); // Auth middleware

// Set up storage for song uploads
const upload = multer({
  dest: 'uploads/songs/', // Store in uploads/songs/ directory
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
  try {
    const songs = fs.readdirSync('uploads/songs/').map((file) => ({
      filename: file,
      url: `/uploads/songs/${file}`,
    }));

    res.json(songs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// DELETE: Delete a song (Admin)
// DELETE: Delete a song (Admin)
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
  
  

module.exports = router;
