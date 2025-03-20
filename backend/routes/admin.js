// routes/admin.js
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth'); // Assuming auth.js exists
const adminMiddleware = require('../middleware/admin');
const { getAllUsers, deleteUser } = require('../controllers/adminController');

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private (admin only)
router.get('/users', authMiddleware, adminMiddleware, getAllUsers);

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user
// @access  Private (admin only)
router.delete('/users/:id', authMiddleware, adminMiddleware, deleteUser);

module.exports = router;