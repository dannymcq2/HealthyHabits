import React, { useEffect, useState } from "react";
import axios from "axios";
import HabitList from "./components/HabitList";
import HabitForm from "./components/HabitForm";
import "./App.css";

function App() {
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5055/api/habits")
      .then((response) => setHabits(response.data))
      .catch((error) => console.error("Error fetching habits:", error));
  }, []);

  const addHabitToList = (newHabit) => {
    setHabits([...habits, newHabit]);
  };

  const deleteHabit = (id) => {
    axios
      .delete(`http://localhost:5055/api/habits/${id}`)
      .then(() => {
        setHabits(habits.filter((habit) => habit._id !== id));
      })
      .catch((error) => console.error("Error deleting habit:", error));
  };

  return (
    <div className="container">
      <h1>Healthy Habits</h1>
      <HabitForm onHabitAdded={addHabitToList} />
      <HabitList habits={habits} onDelete={deleteHabit} />
    </div>
  );
}

export default App;