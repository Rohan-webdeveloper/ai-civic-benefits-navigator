const mongoose = require('mongoose');

const timelineEntrySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      default: '',
    },
    updatedBy: {
      type: String,
      default: 'system',
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    benefit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Benefit',
      required: true,
    },
    status: {
      type: String,
      enum: [
        'submitted',
        'under_review',
        'documents_requested',
        'approved',
        'rejected',
        'on_hold',
      ],
      default: 'submitted',
    },
    documents: [
      {
        filename: String,
        originalName: String,
        path: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    answers: {
      type: Map,
      of: String,
      default: {},
    },
    adminNotes: {
      type: String,
      default: '',
    },
    timeline: {
      type: [timelineEntrySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate applications
applicationSchema.index({ user: 1, benefit: 1 }, { unique: true });

const createModelProxy = require('../config/modelWrapper');
module.exports = createModelProxy('Application', applicationSchema);
