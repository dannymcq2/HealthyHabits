require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const habitRoutes = require('./routes/habits'); 

const app = express();
app.use(express.json()); 
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Connection Error:', err));

// ✅ Use the Routes
app.use('/api/habits', habitRoutes);

// ✅ Start Server
const PORT = process.env.PORT || 5055;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));