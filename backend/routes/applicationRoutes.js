const express = require('express');
const router = express.Router();
const {
  createApplication,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
} = require('../controllers/applicationController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// POST /api/applications
router.post('/', protect, createApplication);

// GET /api/applications/my
router.get('/my', protect, getMyApplications);

// GET /api/applications (admin)
router.get('/', protect, adminOnly, getAllApplications);

// PUT /api/applications/:id/status (admin)
router.put('/:id/status', protect, adminOnly, updateApplicationStatus);

module.exports = router;
