const Benefit = require('../models/Benefit');

// @desc    Check eligibility for benefits
// @route   POST /api/eligibility/check
// @access  Private
const checkEligibility = async (req, res) => {
  try {
    const { age, income, state, category, isStudent, isUnemployed, isDisabled } = req.body;

    // Validate required fields
    if (age === undefined || income === undefined) {
      return res.status(400).json({
        message: 'Age and income are required for eligibility check',
      });
    }

    // Fetch all active benefits
    const allBenefits = await Benefit.find({ status: 'active' });

    const eligibleBenefits = [];
    const partialBenefits = [];

    for (const benefit of allBenefits) {
      const elig = benefit.eligibility;
      let score = 0;
      let maxScore = 0;
      const reasons = [];

      // Check age
      maxScore++;
      if (age >= elig.minAge && age <= elig.maxAge) {
        score++;
      } else {
        reasons.push(
          `Age requirement: ${elig.minAge}-${elig.maxAge} years (your age: ${age})`
        );
      }

      // Check income
      maxScore++;
      if (income <= elig.maxIncome) {
        score++;
      } else {
        reasons.push(
          `Maximum income: ₹${elig.maxIncome.toLocaleString()} (your income: ₹${income.toLocaleString()})`
        );
      }

      // Check state (if specified)
      if (elig.states && elig.states.length > 0) {
        maxScore++;
        if (state && elig.states.includes(state.toLowerCase())) {
          score++;
        } else {
          reasons.push(`Available in: ${elig.states.join(', ')}`);
        }
      }

      // Check category (if specified)
      if (elig.categories && elig.categories.length > 0) {
        maxScore++;
        if (category && elig.categories.includes(category.toLowerCase())) {
          score++;
        } else {
          reasons.push(`For categories: ${elig.categories.join(', ').toUpperCase()}`);
        }
      }

      // Check student requirement
      if (elig.studentOnly) {
        maxScore++;
        if (isStudent) {
          score++;
        } else {
          reasons.push('Only for students');
        }
      }

      // Check unemployment requirement
      if (elig.unemployedOnly) {
        maxScore++;
        if (isUnemployed) {
          score++;
        } else {
          reasons.push('Only for unemployed individuals');
        }
      }

      // Check disability requirement
      if (elig.disabledOnly) {
        maxScore++;
        if (isDisabled) {
          score++;
        } else {
          reasons.push('Only for persons with disabilities');
        }
      }

      const matchPercentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

      if (score === maxScore) {
        eligibleBenefits.push({
          benefit,
          matchPercentage: 100,
          status: 'eligible',
          reasons: ['You meet all eligibility criteria!'],
        });
      } else if (matchPercentage >= 60) {
        partialBenefits.push({
          benefit,
          matchPercentage,
          status: 'partial',
          reasons,
        });
      }
    }

    // Sort by match percentage
    eligibleBenefits.sort((a, b) => b.matchPercentage - a.matchPercentage);
    partialBenefits.sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.json({
      totalChecked: allBenefits.length,
      eligible: eligibleBenefits,
      partial: partialBenefits,
      summary: {
        fullyEligible: eligibleBenefits.length,
        partiallyEligible: partialBenefits.length,
      },
    });
  } catch (error) {
    console.error('Eligibility check error:', error.message);
    res.status(500).json({ message: 'Error checking eligibility' });
  }
};

module.exports = { checkEligibility };
