// src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') }); // Correct path from src/middlewares
const User = require('../models/User'); // To fetch full user if needed, or just use ID/role from token

module.exports = function(roles = []) {
  // roles param can be a single role string (e.g., 'ADMIN')
  // or an array of roles (e.g., ['ADMIN', 'SUPPORT'])
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return async (req, res, next) => {
    const token = req.header('x-auth-token');

    // Check if no token
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied.' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded.user; // Attach user payload (id, role) to request object

      // Role-based access control
      if (roles.length > 0 && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied. Insufficient role.' });
      }

      // Optional: Fetch full user object from DB if needed for further operations
      // const userDetails = await User.findById(req.user.id);
      // if (!userDetails) {
      //   return res.status(401).json({ message: 'User not found, token invalid.' });
      // }
      // req.userDetails = userDetails; // Attach full user details if fetched

      next();
    } catch (err) {
      console.error('Token verification error:', err.message);
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token is expired.'});
      }
      res.status(401).json({ message: 'Token is not valid.' });
    }
  };
};
