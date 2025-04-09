const express = require('express');
const router = express.Router();
const DiaryEntry = require('../module/DiaryEntry');

// 📌 Middleware to check authentication (Add this if you have JWT auth)
const authMiddleware = require('../middleware/auth');

// 📝 1. Add a new diary entry
router.post('/', authenticate, async (req, res) => {
  const { date, title, content } = req.body;
  const userId = req.user.id;  // Assuming req.user is set by your auth middleware

  try {
    const newEntry = new DiaryEntry({ userId, date, title, content });
    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(500).json({ error: 'Error adding entry' });
  }
});

// 📖 2. Get all diary entries for the logged-in user
router.get('/', authenticate, async (req, res) => {
  const userId = req.user.id;
  try {
    const entries = await DiaryEntry.find({ userId }).sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching entries' });
  }
});

router.get('/all', authenticate, async (req, res) => {
  const entries = await DiaryEntry.find();
  res.json(entries);
})

// 📅 3. Get a specific diary entry by date
router.get('/:date', authenticate, async (req, res) => {
  const userId = req.user.id;
  const { date } = req.params;

  try {
    const entry = await DiaryEntry.findOne({ userId, date });
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching entry' });
  }
});

// ✏️ 4. Update a diary entry by date
router.put('/:date', authenticate, async (req, res) => {
  const userId = req.user.id;
  const { date } = req.params;
  const { title, content } = req.body;

  try {
    const updatedEntry = await DiaryEntry.findOneAndUpdate(
      { userId, date },
      { title, content },
      { new: true }
    );
    if (!updatedEntry) return res.status(404).json({ message: 'Entry not found' });
    res.json(updatedEntry);
  } catch (err) {
    res.status(500).json({ error: 'Error updating entry' });
  }
});

// 🗑️ 5. Delete a diary entry by date
router.delete("/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const entry = await DiaryEntry.findByIdAndDelete(id);
    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }
    res.status(200).json({ message: "Entry deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting entry" });
  }
});

module.exports = router;
