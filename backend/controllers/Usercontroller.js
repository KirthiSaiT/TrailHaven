// controllers/userController.js
const { sendSuccessResponse, sendErrorResponse } = require('../utils/responseHandler');
const User = require('../models/User');

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return sendErrorResponse(res, 'User not found', 404);
    }
    sendSuccessResponse(res, user, 'User profile retrieved successfully');
  } catch (error) {
    sendErrorResponse(res, 'Error fetching user profile', 500, error);
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return sendErrorResponse(res, 'User not found', 404);
    }
    sendSuccessResponse(res, user, 'User profile updated successfully');
  } catch (error) {
    sendErrorResponse(res, 'Error updating user profile', 500, error);
  }
};

module.exports = { getUserProfile, updateUserProfile };