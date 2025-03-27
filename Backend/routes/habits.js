const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit'); 

// ✅ Get all habits (or filter by category)
router.get('/', async (req, res) => {
  try {
    const category = req.query.category;
    const query = category ? { category } : {};
    const habits = await Habit.find(query);
    res.json(habits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Add a new habit
router.post('/', async (req, res) => {
  try {
    const { name, category } = req.body;
    if (!name || !category) {
      return res.status(400).json({ error: 'Name and category are required' });
    }
    const newHabit = new Habit({ name, category });
    await newHabit.save();
    res.status(201).json(newHabit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Mark a habit as completed for today
router.patch('/:id/complete', async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }
    
    const today = new Date().toISOString().split('T')[0]; // Get today’s date (YYYY-MM-DD)
    
    if (!habit.completedDates.includes(today)) {
      habit.completedDates.push(today);
      habit.streak += 1;
    }

    await habit.save();
    res.json(habit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/start-timer', async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) return res.status(404).json({ error: "Habit not found" });

    if (habit.startTime) {
      return res.status(400).json({ error: "Timer is already running for this habit." });
    }

    habit.startTime = new Date();
    await habit.save();
    res.json({ message: "Timer started", habit });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/stop-timer', async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit || !habit.startTime) return res.status(400).json({ error: "No active timer" });

    const elapsedTime = Math.round((Date.now() - new Date(habit.startTime)) / 60000);
    habit.trackingSessions.push({ date: new Date(), minutes: elapsedTime });
    habit.startTime = null; // Reset timer
    await habit.save();

    res.json({ message: `Timer stopped, ${elapsedTime} min logged`, habit });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete a habit
router.delete('/:id', async (req, res) => {
  try {
    const habit = await Habit.findByIdAndDelete(req.params.id);
    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }
    res.json({ message: 'Habit deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;