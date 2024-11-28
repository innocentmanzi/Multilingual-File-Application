// middlewares/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes and check authorization
const protect = async (req, res, next) => {
  // Extract the token from the Authorization header
  const token = req.headers.authorization?.split(' ')[1]; // Extract Bearer token

  // If no token is provided
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN);

    // Fetch the user based on the decoded ID and attach user info to the request object
    const user = await User.findById(decoded.id).select('-password');
   
    // If the user does not exist, send an error
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach the user data to the request object
    req.user = user;
    next();
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};

module.exports = { protect };
