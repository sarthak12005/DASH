const express = require('express');
const router = express.Router();
const DiaryEntry = require('../module/DiaryEntry');

// 📌 Middleware to check authentication (Add this if you have JWT auth)
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, async (req, res) => {
  const { date, title, content } = req.body;
  const userId = req.user.userId;

  console.log("Incoming Diary Entry:", { userId, date, title, content });

  try {
    const newEntry = new DiaryEntry({ userId, date, title, content });
    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (err) {
    console.error("Error adding diary entry:", err); // 🔍 See exact error in Render logs
    res.status(500).json({ error: 'Error adding entry', message: err.message });
  }
});


// 📖 2. Get all diary entries for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  const userId = req.user.userId;
  try {
    const entries = await DiaryEntry.find({ userId }).sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching entries' });
  }
});

router.get('/all', authMiddleware, async (req, res) => {
  const entries = await DiaryEntry.find();
  res.json(entries);
})

// 📅 3. Get a specific diary entry by date
router.get('/:date', authMiddleware, async (req, res) => {
  const userId = req.user.userId;
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
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const diary = await Diary.findByIdAndUpdate(id, req.body, { new: true });

    if (!diary) {
      return res.status(404).json({ message: "Diary not found" });
    }

    res.status(200).json({ message: "Diary updated", diary });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// 🗑️ 5. Delete a diary entry by date
router.delete("/:id", authMiddleware, async (req, res) => {
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
