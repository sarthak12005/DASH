const mongoose = require('mongoose');

const diaryEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },  // Format: "YYYY-MM-DD"
  title: { type: String },
  content: { type: String, required: true },
}, { timestamps: true });

const DiaryEntry = mongoose.model('DiaryEntry', diaryEntrySchema);

module.exports = DiaryEntry;
