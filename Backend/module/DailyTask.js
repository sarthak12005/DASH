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
    "Wake up at 6 AM",
    "Excersize for 20 min",
    "Meditation for 10 min For stress Free mind",
    "Brush teeth and drink 2 glass of water",
    "Help mom and touch there feet and pray to god",
    "Breakfast and 2 glass of water 1.5 roti",
    "Study session for 2 hours",
    "1-hour break and drink 2 glass of water",
    "Go to college / Study session for 2 hours drink 2 glass of water",
    "Lunch and 2 glass of water 1.5 roti",
    "Sleep 1.5 hours",
    "Study session 2 hours drink 2 glass of water every hour",
    "help mom and pray to god and 2 glass of water",
    "Dinner 1.5 roti and 2 glass of water",
    "1 hour break from 11PM to 12PM drink 2 glass of water",
    "Sleep at 12AM"
  ];

  if (this.tasks.length === 0) {
    this.tasks = defaultTasks.map(task => ({ task }));
  }
  
  next();
});

const DailyTask = mongoose.model('DailyTask', dailyTaskSchema);

module.exports = DailyTask;
