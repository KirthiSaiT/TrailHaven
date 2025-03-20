// routes/user.js
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth'); // Assuming auth.js exists
const { getUserProfile, updateUserProfile } = require('../controllers/Usercontroller');

// @route   GET /api/user/profile
// @desc    Get user profile
// @access  Private (authenticated users)
router.get('/profile', authMiddleware, getUserProfile);

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private (authenticated users)
router.put('/profile', authMiddleware, updateUserProfile);

module.exports = router;