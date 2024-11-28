const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');
const User = require('../models/User');

// Generate JWT for Access Token
const generateToken = (id) => {
  if (!process.env.JWT_SECRET_TOKEN) {
    throw new Error('JWT_SECRET_TOKEN is not defined in the environment variables');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET_TOKEN, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  });
};

// Create a new user (POST /api/users)
const createUser = async (req, res) => {
  const { username, email, password, language } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: res.__('user_already_exists') }); // Internationalized message
    }

    // Create new user
    const user = await User.create({ username, email, password, language });
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.status(201).json({
      id: user._id,
      username: user.username,
      email: user.email,
      language: user.language,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ message: res.__('user_creation_failed'), error: err.message });
  }
};

// Login a user (POST /api/users/login)
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: res.__('invalid_email_or_password') }); // Internationalized message
    }

    // Check password match
    const isPasswordMatch = await user.matchPassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: res.__('invalid_email_or_password') });
    }

    // Generate JWT tokens
    const token = generateToken(user._id);
    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      language: user.language,
      token,
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: res.__('login_failed'), error: err.message });
  }
};

// Refresh the access token (POST /api/users/refresh-token)
const refreshAccessToken = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: res.__('refresh_token_required') }); // Internationalized message
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN);
    const newAccessToken = generateAccessToken(decoded.id);

    res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    console.error('Error verifying refresh token:', err);
    res.status(403).json({ message: res.__('invalid_or_expired_refresh_token') });
  }
};

// Get all users (GET /api/users)
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude password field
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: res.__('fetch_users_failed'), error: err.message });
  }
};

// Get a single user by ID (GET /api/users/:id)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: res.__('user_not_found') }); // Internationalized message
    }
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ message: res.__('fetch_user_failed'), error: err.message });
  }
};

// Update a user (PUT /api/users/:id)
const updateUser = async (req, res) => {
  const { username, email, language } = req.body;

  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.username = username || user.username;
      user.email = email || user.email;
      user.language = language || user.language;

      const updatedUser = await user.save();
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: res.__('user_not_found') });
    }
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: res.__('update_user_failed'), error: err.message });
  }
};

// Delete a user (DELETE /api/users/:id)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      await user.deleteOne();
      res.status(200).json({ message: res.__('user_deleted_successfully') }); // Internationalized message
    } else {
      res.status(404).json({ message: res.__('user_not_found') });
    }
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: res.__('delete_user_failed'), error: err.message });
  }
};

module.exports = {
  createUser,
  loginUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  refreshAccessToken,
};
