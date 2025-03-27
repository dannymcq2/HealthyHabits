import React, { useState } from "react";
import axios from "axios";
import "./HabitForm.css"; // Importing external CSS file

function HabitForm({ onHabitAdded }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !category) return;

    axios
      .post("http://localhost:5055/api/habits", { name, category })
      .then((response) => {
        onHabitAdded(response.data);
        setName("");
        setCategory("");
      })
      .catch((error) => console.error("Error adding habit:", error));
  };

  return (
    <div className="habit-form-container">
      <h2>Add a New Habit</h2>
      <form onSubmit={handleSubmit} className="habit-form">
        <input
          type="text"
          placeholder="Habit Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field"
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input-field"
        />
        <button type="submit" className="submit-btn">Add Habit</button>
      </form>
    </div>
  );
}

export default HabitForm;