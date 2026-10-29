const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Helper to generate signed JWT token
 */
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'taskflow_dev_secret_fallback',
    {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    }
  );
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const sanitizedEmail = email.toLowerCase().trim();

    console.log(`📝 [Registration Request] Received registration for: ${sanitizedEmail}`);

    // Check if user already exists
    const existingUser = await User.findOne({ email: sanitizedEmail });
    if (existingUser) {
      console.warn(`⚠️ [Registration Duplicate] User already exists with email: ${sanitizedEmail}`);
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists. Please sign in or use a different email.',
      });
    }

    // Create user in database (pre-save hook hashes password with bcrypt)
    const user = await User.create({
      name: name.trim(),
      email: sanitizedEmail,
      password,
    });

    console.log(`✅ [Registration Success] User created successfully: ${sanitizedEmail} (ID: ${user._id})`);

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: user.toSafeObject(),
    });
  } catch (error) {
    console.error(`❌ [Registration Error] Failed registering user:`, error.message);
    next(error);
  }
};

/**
 * @desc    Authenticate user & get JWT token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const sanitizedEmail = email.toLowerCase().trim();

    console.log(`🔑 [Login Request] Attempting login for: ${sanitizedEmail}`);

    // Retrieve user including hashed password for verification
    const user = await User.findOne({ email: sanitizedEmail }).select('+password');
    if (!user) {
      console.warn(`⚠️ [Login Failed] User not found: ${sanitizedEmail}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Verify password with bcrypt
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.warn(`⚠️ [Login Failed] Password mismatch for: ${sanitizedEmail}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    console.log(`✅ [Login Success] User authenticated: ${sanitizedEmail} (ID: ${user._id})`);

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: user.toSafeObject(),
    });
  } catch (error) {
    console.error(`❌ [Login Error] ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Get current authenticated user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found',
      });
    }

    res.status(200).json({
      success: true,
      user: user.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  generateToken,
};
