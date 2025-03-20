// middleware/admin.js
const jwt = require('jsonwebtoken');

const adminMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Assuming the User model has a 'role' field, check if the user is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied, admin only' });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = adminMiddleware;