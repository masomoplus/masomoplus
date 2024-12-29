const Item = require('../models/item'); // Ensure the correct path to the item model

// Get all items
const getItems = async (req, res) => {
  try {
    const items = await Item.find(); // Fetch all items from MongoDB
    res.json(items); // Return the items in the response
  } catch (error) {
    res.status(500).json({ message: error.message }); // Handle error if database query fails
  }
};

// Add a new item
const addItem = async (req, res) => {
  try {
    const { name, price } = req.body;
    
    // Validation for required fields
    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price are required' });
    }

    const newItem = new Item({ name, price }); // Create a new item with name and price
    await newItem.save(); // Save the item to the database
    res.status(201).json(newItem); // Return the newly created item in the response
  } catch (error) {
    res.status(500).json({ message: error.message }); // Handle error if item creation fails
  }
};

// Update an existing item by ID
const updateItem = async (req, res) => {
  try {
    const { id } = req.params; // Get the item ID from the URL params
    const { name, price } = req.body; // Get the updated name and price from the request body
    
    // Validation for required fields
    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price are required' });
    }

    // Find the item by ID and update it
    const updatedItem = await Item.findByIdAndUpdate(
      id,
      { name, price },
      { new: true } // Return the updated item
    );
    
    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(updatedItem); // Return the updated item
  } catch (error) {
    res.status(500).json({ message: error.message }); // Handle error if update fails
  }
};

// Delete an item by ID
const deleteItem = async (req, res) => {
  try {
    const { id } = req.params; // Get the item ID from the URL params
    
    // Find the item by ID and delete it
    const deletedItem = await Item.findByIdAndDelete(id);
    
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json({ message: 'Item deleted successfully' }); // Return success message
  } catch (error) {
    res.status(500).json({ message: error.message }); // Handle error if delete fails
  }
};

module.exports = { getItems, addItem, updateItem, deleteItem }; // Export the functions to be used in routes
