const express = require('express');
const Song = require('../module/SongModule');
const fs = require('fs');
const multer = require('multer');
const coludinary = require('../config/CloudinaryConfig');
const streamifier = require('streamifier');



const router = express.Router();

const storage = multer.memoryStorage(); // 👈 Keep file in memory
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // Up to 20MB if needed
});


router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// Get all songs endpoint
router.get('/real-songs', async (req, res) => {
  try {
    const songs = await Song.find({}).lean();
    console.log('Songs from DB:', songs); // Debug log
    
    if (!songs.length) {
      console.warn('No songs found in database');
      return res.status(404).json({ message: 'No songs found' });
    }
    
    res.json(songs);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ 
      error: 'Server error',
      details: err.message 
    });
  }
});


router.post('/upload', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'audio', maxCount: 1 }
]), async (req, res) => {
  try {
    const { image, audio } = req.files;

    const uploadToCloudinary = (fileBuffer, folder, resourceType) => {
      return new Promise((resolve, reject) => {
        const stream = coludinary.uploader.upload_stream(
          { folder, resource_type: resourceType },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    const imageUrl = await uploadToCloudinary(image[0].buffer, 'my-website/images', 'image');
    const audioUrl = await uploadToCloudinary(audio[0].buffer, 'my-website/songs', 'video'); // 'video' for audio/video files

    // Save URLs to MongoDB

    const newSong = new Song({
      title: req.body.title,
      imageUrl,
      audioUrl,
    });

    await newSong.save();

    res.json({ message: 'Upload successful', imageUrl, audioUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
});


module.exports = router;