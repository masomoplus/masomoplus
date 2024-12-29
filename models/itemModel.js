const mongoose = require('mongoose');

// Define the schema for items
const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0.01, // Ensure price is greater than 0
  },
});

// Create the model based on the schema
const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
