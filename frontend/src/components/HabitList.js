import React, { useState } from "react";
import axios from "axios";
import "./HabitList.css";

function HabitList({ habits, onDelete }) {
  const [timers, setTimers] = useState({});

  const startTimer = (habitId) => {
    setTimers((prev) => ({
      ...prev,
      [habitId]: Date.now(),
    }));
  };

  const stopTimer = (habitId) => {
    if (!timers[habitId]) return;

    const elapsedTime = Math.round((Date.now() - timers[habitId]) / 60000);
    setTimers((prev) => ({ ...prev, [habitId]: null }));

    axios
      .patch(`http://localhost:5055/api/habits/${habitId}/track-time`, { minutes: elapsedTime })
      .then(() => console.log(`Time added: ${elapsedTime} min`))
      .catch((error) => console.error("Error tracking time:", error));
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div>
      <h2>My Habits</h2>
      <ul className="habit-list">
        {habits.length > 0 ? (
          habits.map((habit) => {
            const totalTime = habit.trackingSessions?.reduce((acc, session) => acc + session.minutes, 0) || 0;

            const hasTrackedToday = habit.trackingSessions?.some(
              (session) => session.date.split("T")[0] === today
            );

            return (
              <li key={habit._id} className="habit-item">
                <span>{habit.name} - {habit.category} ({totalTime} min)</span>
                <div className="habit-actions">
                  {hasTrackedToday ? (
                    <span className="completed">✅ Done for Today</span>
                  ) : !timers[habit._id] ? (
                    <button className="start-btn" onClick={() => startTimer(habit._id)}>⏱ Start</button>
                  ) : (
                    <button className="stop-btn" onClick={() => stopTimer(habit._id)}>⏹ Stop</button>
                  )}
                  <button className="delete-btn" onClick={() => onDelete(habit._id)}>🗑️</button>
                </div>
              </li>
            );
          })
        ) : (
          <p>No habits found. Add a new habit below!</p>
        )}
      </ul>
    </div>
  );
}

export default HabitList;