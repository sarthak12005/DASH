const mongoose = require('mongoose');

const diarySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  date: {
    type: String,
    required: true
  },
  title: String,
  content: String,
  seen:{type: Boolean, default: false},
});

module.exports = mongoose.model('DiaryEntry', diarySchema);
