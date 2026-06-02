const express = require('express');
const router = express.Router();
const {
  getBenefits,
  getBenefitById,
  createBenefit,
} = require('../controllers/benefitController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// GET /api/benefits
router.get('/', getBenefits);

// POST /api/benefits (admin only)
router.post('/', protect, adminOnly, createBenefit);

// GET /api/benefits/:id
router.get('/:id', getBenefitById);

module.exports = router;
