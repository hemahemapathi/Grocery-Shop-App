import User from '../models/User.js';

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    // User is already attached to req by the protect middleware
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error in admin verification' });
  }
};

export default isAdmin;
