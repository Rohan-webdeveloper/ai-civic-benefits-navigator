const Application = require('../models/Application');

// @desc    Upload document for an application
// @route   POST /api/documents/upload
// @access  Private
const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { applicationId } = req.body;

    if (!applicationId) {
      return res.status(400).json({ message: 'Application ID is required' });
    }

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Verify the application belongs to the user
    if (application.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: 'Not authorized to upload documents for this application' });
    }

    // Add document to application
    const doc = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      uploadedAt: new Date(),
    };

    application.documents.push(doc);

    // Add timeline entry for document upload
    application.timeline.push({
      status: application.status,
      note: `Document uploaded: ${req.file.originalname}`,
      updatedBy: req.user.name,
      date: new Date(),
    });

    await application.save();

    res.json({
      message: 'Document uploaded successfully',
      document: doc,
      application: application._id,
    });
  } catch (error) {
    console.error('Upload document error:', error.message);
    res.status(500).json({ message: 'Error uploading document' });
  }
};

module.exports = { uploadDocument };
