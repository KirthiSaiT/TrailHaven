// utils/responseHandler.js
const sendSuccessResponse = (res, data, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  };
  
  const sendErrorResponse = (res, message = 'An error occurred', statusCode = 500, error = null) => {
    return res.status(statusCode).json({
      success: false,
      message,
      error: error ? error.message : undefined,
    });
  };
  
  module.exports = { sendSuccessResponse, sendErrorResponse };