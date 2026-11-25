const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('-> No Authorization header or Bearer token found.');
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token',
    });
  }

  try {
    const token = authHeader.split(' ')[1];

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId || decoded.id || decoded._id;

    // Optional: fetch user without password so routes can access user fields directly
    if (userId) {
      const user = await User.findById(userId).select('-password');
      req.user = user || decoded;
    } else {
      req.user = decoded;
    }

    return next();
  } catch (error) {
    console.error('-> JWT Verification Failed Error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token failed: ' + error.message,
    });
  }
};

module.exports = protect;