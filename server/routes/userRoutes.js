const express = require('express');
const router = express.Router();
const { updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile data & optional password
 * @access  Private
 */
router.put('/profile', protect, updateProfile);

module.exports = router;
