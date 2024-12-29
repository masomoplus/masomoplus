const mongoose = require('mongoose');

// Define the schema for an item
const itemSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,  // Name is required
    trim: true       // Automatically trims whitespace from both ends of the string
  },
  price: { 
    type: Number, 
    required: true,  // Price is required
    min: 0           // Ensures that the price can't be negative
  }
}, {
  timestamps: true // Automatically adds 'createdAt' and 'updatedAt' fields
});

// Create a model from the schema
const Item = mongoose.model('Item', itemSchema);

// Export the model so it can be used in other parts of the application
module.exports = Item;
