const express = require('express');
const router = express.Router();
const DailyTask = require('../module/DailyTask');

// Fetch tasks for a specific user and date
router.get('/:userId/:date', async (req, res) => {
  const { userId, date } = req.params;

  try {
    let dailyTask = await DailyTask.findOne({ userId, date });

    // If no tasks for today, create default tasks
    if (!dailyTask) {
      dailyTask = new DailyTask({ userId, date });
      await dailyTask.save();
    }

    res.json(dailyTask);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error });
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
router.put('/:userId/:date/:taskId', async (req, res) => {
  const { userId, date, taskId } = req.params;

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

router()

module.exports = router;
