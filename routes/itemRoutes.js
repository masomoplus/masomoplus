const express = require('express');
const { getItems, addItem, updateItem, deleteItem } = require('../controllers/itemController');

const router = express.Router();

// Route to get all items
router.get('/', getItems);

// Route to add a new item
router.post('/', addItem);

// Route to update an existing item
router.put('/:id', updateItem);

// Route to delete an item
router.delete('/:id', deleteItem);

module.exports = router;
