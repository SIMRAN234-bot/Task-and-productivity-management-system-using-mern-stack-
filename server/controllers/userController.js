const User = require('../models/User');

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const { name, bio, avatar, currentPassword, newPassword } = req.body;

    if (name !== undefined) {
      if (!name || name.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Name must be at least 2 characters long',
        });
      }
      user.name = name.trim();
    }

    if (bio !== undefined) {
      user.bio = bio.trim();
    }

    if (avatar !== undefined) {
      user.avatar = avatar.trim();
    }

    // Optional password change
    if (newPassword) {
      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 6 characters long',
        });
      }

      if (currentPassword) {
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
          return res.status(400).json({
            success: false,
            message: 'Current password does not match',
          });
        }
      }

      user.password = newPassword; // Will be hashed by pre-save hook
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateProfile,
};
