const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// GET & PUT /api/auth/profile
router.route('/profile')
  .get(protect, getProfile)
  .put(protect, updateProfile);

module.exports = router;
