// controllers/adminController.js
const { sendSuccessResponse, sendErrorResponse } = require('../utils/responseHandler');
const User = require('../models/User');

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    sendSuccessResponse(res, users, 'Users retrieved successfully');
  } catch (error) {
    sendErrorResponse(res, 'Error fetching users', 500, error);
  }
};

// Delete a user (admin only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return sendErrorResponse(res, 'User not found', 404);
    }
    sendSuccessResponse(res, null, 'User deleted successfully');
  } catch (error) {
    sendErrorResponse(res, 'Error deleting user', 500, error);
  }
};

module.exports = { getAllUsers, deleteUser };