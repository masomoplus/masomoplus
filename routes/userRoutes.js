const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    getUserProfile, 
    updateUserProfile 
} = require('../controllers/userController');

// Middleware for protecting routes (optional, if you have an authMiddleware.js)
const { protect } = require('../middleware/authMiddleware');

// Routes
// Register a new user
router.post('/register', registerUser);

// Log in a user
router.post('/login', loginUser);

// Get user profile (protected route)
router.get('/profile', protect, getUserProfile);

// Update user profile (protected route)
router.put('/profile', protect, updateUserProfile);

module.exports = router;
