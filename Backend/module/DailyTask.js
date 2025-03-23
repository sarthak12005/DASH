const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  task: { type: String, required: true },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date, default: null },
});

const dailyTaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  tasks: { type: [taskSchema], default: [] },
});

// Pre-save hook to add default tasks if none exist
dailyTaskSchema.pre('save', function (next) {
  const defaultTasks = [
    "Wake up at 5:30 AM",
    "Drink 2 glasses of water",
    "Exercise for 15 minutes",
    "Meditation for 10 minutes",
    "Get freshened up",
    "Learn 10 words & sentences",
    "Breakfast",
    "1-hour break",
    "Go to college / Study session for 2 hours",
    "Lunch",
    "Sleep 2 hours",
    "Study session 2 hours",
    "Drink plenty of water",
    "Sleep before 11:30 PM"
  ];

  if (this.tasks.length === 0) {
    this.tasks = defaultTasks.map(task => ({ task }));
  }
  
  next();
});

const DailyTask = mongoose.model('DailyTask', dailyTaskSchema);

module.exports = DailyTask;
