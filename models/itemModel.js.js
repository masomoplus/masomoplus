const mongoose = require('mongoose');

// Define the schema for an Item
const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Item name is required.'], // Custom error message
    },
    price: {
        type: Number,
        required: [true, 'Item price is required.'], // Custom error message
    },
    description: {
        type: String, // Optional field
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically set the creation date
    },
});

// Create the model from the schema
const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
