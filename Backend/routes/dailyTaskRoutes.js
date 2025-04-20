const express = require('express');
const router = express.Router();
const DailyTask = require('../module/DailyTask');
const authMiddleware = require('../middleware/auth');

// Fetch tasks for a specific user and date
router.get('/:date',authMiddleware, async (req, res) => {
  const {userId} = req.user;
  const { date } = req.params;

  try {
    let dailyTask = await DailyTask.findOne({ userId, date });

    // ✅ If no tasks found, create an empty task list
    if (!dailyTask) {
      dailyTask = new DailyTask({ userId, date, tasks: [] });
      await dailyTask.save(); 
    }

    res.json({ success: true, tasks: dailyTask.tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Error fetching tasks", error });
  }
});

// Add or update tasks for a specific user and date
router.post('/', async (req, res) => {
  const { userId, date, tasks } = req.body;

  try {
    let dailyTask = await DailyTask.findOne({ userId, date });

    if (dailyTask) {
      // Add new tasks if provided
      if (tasks && tasks.length > 0) {
        dailyTask.tasks.push(...tasks.map(task => ({ task })));
      }
    } else {
      dailyTask = new DailyTask({ userId, date, tasks: tasks || [] });
    }

    await dailyTask.save();
    res.json(dailyTask);
  } catch (error) {
    res.status(500).json({ message: 'Error adding/updating tasks', error });
  }
});

// Mark task as completed
router.put('/:date/:taskId',authMiddleware, async (req, res) => {
  const { date, taskId } = req.params;
  const userId = req.user.userId;

  try {
    const dailyTask = await DailyTask.findOne({ userId, date });

    if (dailyTask) {
      const task = dailyTask.tasks.id(taskId);
      if (task) {
        task.completed = true;
        task.completedAt = new Date();
        await dailyTask.save();
        res.json(dailyTask);
      } else {
        res.status(404).json({ message: 'Task not found' });
      }
    } else {
      res.status(404).json({ message: 'Daily task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error });
  }
});



module.exports = router;
