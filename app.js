const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const itemRoutes = require('./routes/itemRoutes'); // Make sure this path is correct

const app = express();
const PORT = process.env.PORT || 3001; // Change port to 3001 if 3000 is already in use

// MongoDB URI
const MONGO_URI = 'mongodb+srv://osomora85:masomoplus24571659@cluster0.9sohx.mongodb.net/masomoplusdb?retryWrites=true&w=majority';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/items', itemRoutes); // Item routes

// Static Route for Testing
app.get('/api/items', (req, res) => {
  const items = [
    { id: 1, name: 'Pre-Primary 1' },
    { id: 2, name: 'Grade 1' },
    { id: 3, name: 'Grade 2' },
  ];
  res.json(items); // Respond with static data
});

// Root Route
app.get('/', (req, res) => {
  res.send('Welcome to the MasomoPlus API!');
});

// MongoDB Connection
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
  });

module.exports = app;
