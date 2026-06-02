const Application = require('../models/Application');
const Benefit = require('../models/Benefit');

// @desc    Create a new application
// @route   POST /api/applications
// @access  Private
const createApplication = async (req, res) => {
  try {
    const { benefitId, answers } = req.body;

    // Check if benefit exists
    const benefit = await Benefit.findById(benefitId);
    if (!benefit) {
      return res.status(404).json({ message: 'Benefit not found' });
    }

    // Check for duplicate application
    const existingApp = await Application.findOne({
      user: req.user._id,
      benefit: benefitId,
    });

    if (existingApp) {
      return res.status(400).json({
        message: 'You have already applied for this benefit',
        applicationId: existingApp._id,
      });
    }

    // Create application with initial timeline entry
    const application = await Application.create({
      user: req.user._id,
      benefit: benefitId,
      answers: answers || {},
      status: 'submitted',
      timeline: [
        {
          status: 'submitted',
          note: 'Application submitted successfully',
          updatedBy: req.user.name,
          date: new Date(),
        },
      ],
    });

    const populated = await Application.findById(application._id)
      .populate('benefit', 'name category department')
      .populate('user', 'name email');

    res.status(201).json(populated);
  } catch (error) {
    console.error('Create application error:', error.message);
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: 'You have already applied for this benefit' });
    }
    res.status(500).json({ message: 'Error creating application' });
  }
};

// @desc    Get current user's applications
// @route   GET /api/applications/my
// @access  Private
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user._id })
      .populate('benefit')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Get my applications error:', error.message);
    res.status(500).json({ message: 'Error fetching applications' });
  }
};

// @desc    Get all applications (admin)
// @route   GET /api/applications
// @access  Private/Admin
const getAllApplications = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    const applications = await Application.find(filter)
      .populate('benefit', 'name category department')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Get all applications error:', error.message);
    res.status(500).json({ message: 'Error fetching applications' });
  }
};

// @desc    Update application status (admin)
// @route   PUT /api/applications/:id/status
// @access  Private/Admin
const updateApplicationStatus = async (req, res) => {
  try {
    const { status, note } = req.body;

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const validStatuses = [
      'submitted',
      'under_review',
      'documents_requested',
      'approved',
      'rejected',
      'on_hold',
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // Update status
    application.status = status;

    // Add to timeline
    application.timeline.push({
      status,
      note: note || `Status updated to ${status.replace('_', ' ')}`,
      updatedBy: req.user.name || 'Admin',
      date: new Date(),
    });

    if (note) {
      application.adminNotes = note;
    }

    await application.save();

    const updated = await Application.findById(req.params.id)
      .populate('benefit', 'name category department')
      .populate('user', 'name email');

    res.json(updated);
  } catch (error) {
    console.error('Update application status error:', error.message);
    res.status(500).json({ message: 'Error updating application status' });
  }
};

module.exports = {
  createApplication,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
};
