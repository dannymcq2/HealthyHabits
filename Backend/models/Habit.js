const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  completedDates: { type: [Date], default: [] },
  streak: { type: Number, default: 0 },
  trackingSessions: { type: [{ date: Date, minutes: Number }], default: [] },
  startTime: { type: Date, default: null } // NEW FIELD for active timers
});

module.exports = mongoose.model('Habit', HabitSchema);