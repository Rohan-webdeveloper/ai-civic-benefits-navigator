const express = require('express');
const router = express.Router();
const { aiAssistant, explainBenefit } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/ai/assistant
router.post('/assistant', protect, aiAssistant);

// POST /api/ai/explain-benefit
router.post('/explain-benefit', protect, explainBenefit);

module.exports = router;
