const express = require('express');
const router = express.Router();
const { checkEligibility } = require('../controllers/eligibilityController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/eligibility/check
router.post('/check', protect, checkEligibility);

module.exports = router;
