const mongoose = require('mongoose');

const benefitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'healthcare',
        'education',
        'housing',
        'food',
        'employment',
        'disability',
        'pension',
        'women',
        'agriculture',
        'other',
      ],
    },
    department: {
      type: String,
      required: true,
    },
    eligibility: {
      minAge: { type: Number, default: 0 },
      maxAge: { type: Number, default: 150 },
      maxIncome: { type: Number, default: Infinity },
      states: { type: [String], default: [] }, // empty = all states
      categories: { type: [String], default: [] }, // empty = all categories
      studentOnly: { type: Boolean, default: false },
      unemployedOnly: { type: Boolean, default: false },
      disabledOnly: { type: Boolean, default: false },
    },
    benefitAmount: {
      type: String,
      default: 'Varies',
    },
    documentsRequired: {
      type: [String],
      default: [],
    },
    applicationDeadline: {
      type: String,
      default: 'Open Year Round',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'upcoming'],
      default: 'active',
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const createModelProxy = require('../config/modelWrapper');
module.exports = createModelProxy('Benefit', benefitSchema);
