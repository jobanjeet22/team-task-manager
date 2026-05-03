// const express = require('express');
// const router = express.Router();
// const { updateProfile, changePassword } = require('../controllers/authController');
// const { getAllUsers, getUserById, updateProfile, searchUsers } = require('../controllers/userController');
// const { protect } = require('../middleware/auth');
// const { isAdmin } = require('../middleware/roleCheck');

// router.use(protect);

// router.get('/', isAdmin, getAllUsers);
// router.get('/search', searchUsers);
// router.put('/profile', updateProfile);
// router.get('/:id', getUserById);

// module.exports = router;


const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/roleCheck');
const { updateProfile, changePassword } = require('../controllers/authController');
const User = require('../models/User');

// GET all users (admin only) — used for adding members to projects
router.get('/', protect, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Search users by email — used in add member modal
router.get('/search', protect, async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ success: false, message: 'Email query required' });
    const users = await User.find({
      email: { $regex: email, $options: 'i' },
      _id: { $ne: req.user._id }
    }).select('name email role').limit(10);
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update profile name (and avatar color)
router.put('/profile', protect, updateProfile);

// Change password
router.put('/password', protect, changePassword);

module.exports = router;