const Benefit = require('../models/Benefit');

// Sample benefits data for seeding
const sampleBenefits = [
  {
    name: 'National Health Insurance Scheme',
    description:
      'A comprehensive health insurance program providing coverage up to ₹5,00,000 per family per year for secondary and tertiary care hospitalization. This scheme covers over 1,500 procedures including pre and post-hospitalization expenses. Families can avail cashless treatment at any empaneled hospital across the country.',
    shortDescription: 'Free health insurance coverage up to ₹5 lakh for eligible families',
    category: 'healthcare',
    department: 'Ministry of Health & Family Welfare',
    eligibility: {
      minAge: 0,
      maxAge: 150,
      maxIncome: 300000,
      states: [],
      categories: [],
      studentOnly: false,
      unemployedOnly: false,
      disabledOnly: false,
    },
    benefitAmount: 'Up to ₹5,00,000 per year',
    documentsRequired: ['Aadhaar Card', 'Income Certificate', 'Ration Card', 'Family ID'],
    applicationDeadline: 'Open Year Round',
    status: 'active',
    tags: ['health', 'insurance', 'family', 'hospital'],
  },
  {
    name: 'National Scholarship for Higher Education',
    description:
      'Merit-cum-means scholarship for students from economically weaker sections pursuing higher education. Covers tuition fees, book allowance, and monthly stipend for undergraduate and postgraduate courses in recognized institutions.',
    shortDescription: 'Scholarship for students from low-income families pursuing higher education',
    category: 'education',
    department: 'Ministry of Education',
    eligibility: {
      minAge: 16,
      maxAge: 35,
      maxIncome: 250000,
      states: [],
      categories: ['sc', 'st', 'obc', 'ews'],
      studentOnly: true,
      unemployedOnly: false,
      disabledOnly: false,
    },
    benefitAmount: 'Up to ₹50,000 per year',
    documentsRequired: [
      'Aadhaar Card',
      'Income Certificate',
      'Marksheet',
      'Caste Certificate',
      'Bank Passbook',
    ],
    applicationDeadline: 'July 31 each year',
    status: 'active',
    tags: ['education', 'scholarship', 'students', 'college'],
  },
  {
    name: 'Affordable Housing Scheme',
    description:
      'Government subsidized housing program for economically weaker sections and low-income groups. Provides interest subsidy on home loans and direct financial assistance for construction or purchase of houses.',
    shortDescription: 'Subsidized housing and home loan interest subsidy for low-income families',
    category: 'housing',
    department: 'Ministry of Housing & Urban Affairs',
    eligibility: {
      minAge: 21,
      maxAge: 65,
      maxIncome: 600000,
      states: [],
      categories: [],
      studentOnly: false,
      unemployedOnly: false,
      disabledOnly: false,
    },
    benefitAmount: 'Up to ₹2,67,000 subsidy',
    documentsRequired: [
      'Aadhaar Card',
      'Income Certificate',
      'Property Documents',
      'Bank Statement',
    ],
    applicationDeadline: 'Open Year Round',
    status: 'active',
    tags: ['housing', 'home', 'subsidy', 'loan'],
  },
  {
    name: 'Public Distribution System (PDS)',
    description:
      'Food security program providing subsidized food grains (rice, wheat, sugar) to eligible families through a network of fair price shops. Under the National Food Security Act, priority households receive 5 kg of food grains per person per month.',
    shortDescription: 'Subsidized food grains for eligible families through ration shops',
    category: 'food',
    department: 'Ministry of Consumer Affairs, Food & Public Distribution',
    eligibility: {
      minAge: 0,
      maxAge: 150,
      maxIncome: 200000,
      states: [],
      categories: [],
      studentOnly: false,
      unemployedOnly: false,
      disabledOnly: false,
    },
    benefitAmount: '5 kg grains per person at ₹1-3/kg',
    documentsRequired: ['Aadhaar Card', 'Ration Card', 'Income Certificate'],
    applicationDeadline: 'Open Year Round',
    status: 'active',
    tags: ['food', 'ration', 'grains', 'subsidy'],
  },
  {
    name: 'Employment Guarantee Program',
    description:
      'Rural employment guarantee scheme providing at least 100 days of wage employment per financial year to every rural household whose adult members volunteer to do unskilled manual work. Minimum wage of ₹250 per day is guaranteed.',
    shortDescription: 'Guaranteed 100 days of employment for rural households',
    category: 'employment',
    department: 'Ministry of Rural Development',
    eligibility: {
      minAge: 18,
      maxAge: 65,
      maxIncome: 200000,
      states: [],
      categories: [],
      studentOnly: false,
      unemployedOnly: true,
      disabledOnly: false,
    },
    benefitAmount: '₹250/day for 100 days',
    documentsRequired: ['Aadhaar Card', 'Job Card', 'Bank Passbook'],
    applicationDeadline: 'Open Year Round',
    status: 'active',
    tags: ['employment', 'rural', 'jobs', 'wage'],
  },
  {
    name: 'Disability Pension Scheme',
    description:
      'Monthly pension for persons with disabilities who are unable to support themselves financially. The scheme provides financial assistance to help meet daily living expenses and medical needs.',
    shortDescription: 'Monthly financial assistance for persons with disabilities',
    category: 'disability',
    department: 'Ministry of Social Justice & Empowerment',
    eligibility: {
      minAge: 18,
      maxAge: 150,
      maxIncome: 300000,
      states: [],
      categories: [],
      studentOnly: false,
      unemployedOnly: false,
      disabledOnly: true,
    },
    benefitAmount: '₹1,000 - ₹2,500 per month',
    documentsRequired: [
      'Aadhaar Card',
      'Disability Certificate',
      'Income Certificate',
      'Bank Passbook',
    ],
    applicationDeadline: 'Open Year Round',
    status: 'active',
    tags: ['disability', 'pension', 'assistance'],
  },
  {
    name: 'Senior Citizen Pension',
    description:
      'Old age pension scheme providing monthly financial support to senior citizens above 60 years of age who belong to below poverty line families. Additional benefits include free health checkups and travel concessions.',
    shortDescription: 'Monthly pension for senior citizens from BPL families',
    category: 'pension',
    department: 'Ministry of Social Justice & Empowerment',
    eligibility: {
      minAge: 60,
      maxAge: 150,
      maxIncome: 200000,
      states: [],
      categories: [],
      studentOnly: false,
      unemployedOnly: false,
      disabledOnly: false,
    },
    benefitAmount: '₹1,500 - ₹3,000 per month',
    documentsRequired: ['Aadhaar Card', 'Age Proof', 'BPL Certificate', 'Bank Passbook'],
    applicationDeadline: 'Open Year Round',
    status: 'active',
    tags: ['pension', 'senior', 'elderly', 'old age'],
  },
  {
    name: 'Women Empowerment & Self-Help Program',
    description:
      'Comprehensive program for women empowerment including skill development training, micro-finance support through self-help groups, and entrepreneurship development. Provides seed capital and marketing assistance.',
    shortDescription: 'Skill development and financial support for women entrepreneurs',
    category: 'women',
    department: 'Ministry of Women & Child Development',
    eligibility: {
      minAge: 18,
      maxAge: 60,
      maxIncome: 400000,
      states: [],
      categories: [],
      studentOnly: false,
      unemployedOnly: false,
      disabledOnly: false,
    },
    benefitAmount: 'Up to ₹1,00,000 seed capital',
    documentsRequired: ['Aadhaar Card', 'Income Certificate', 'Bank Passbook', 'SHG Registration'],
    applicationDeadline: 'March 31 each year',
    status: 'active',
    tags: ['women', 'empowerment', 'entrepreneurship', 'skill'],
  },
  {
    name: 'Farmer Crop Insurance Scheme',
    description:
      'Crop insurance program to protect farmers against crop loss due to natural calamities, pests, and diseases. Low premium rates of 2% for Kharif crops and 1.5% for Rabi crops. Claims are settled within 2 months.',
    shortDescription: 'Low-cost crop insurance for farmers against natural calamities',
    category: 'agriculture',
    department: 'Ministry of Agriculture & Farmers Welfare',
    eligibility: {
      minAge: 18,
      maxAge: 75,
      maxIncome: 500000,
      states: [],
      categories: [],
      studentOnly: false,
      unemployedOnly: false,
      disabledOnly: false,
    },
    benefitAmount: 'Full crop value insurance',
    documentsRequired: [
      'Aadhaar Card',
      'Land Records',
      'Bank Passbook',
      'Crop Sowing Certificate',
    ],
    applicationDeadline: 'Before sowing season',
    status: 'active',
    tags: ['agriculture', 'farming', 'insurance', 'crop'],
  },
  {
    name: 'Skill Development & Training Program',
    description:
      'Free skill development and vocational training program for youth and unemployed individuals. Courses range from 3 months to 1 year covering IT, healthcare, construction, retail, and more. Placement assistance provided after completion.',
    shortDescription: 'Free vocational training with placement assistance for unemployed youth',
    category: 'employment',
    department: 'Ministry of Skill Development & Entrepreneurship',
    eligibility: {
      minAge: 15,
      maxAge: 45,
      maxIncome: 350000,
      states: [],
      categories: [],
      studentOnly: false,
      unemployedOnly: true,
      disabledOnly: false,
    },
    benefitAmount: 'Free training + ₹8,000 stipend',
    documentsRequired: ['Aadhaar Card', 'Education Certificate', 'Bank Passbook'],
    applicationDeadline: 'Rolling admissions',
    status: 'active',
    tags: ['skill', 'training', 'employment', 'vocational'],
  },
];

// @desc    Seed benefits into database
const seedBenefits = async () => {
  try {
    const count = await Benefit.countDocuments();
    if (count === 0) {
      await Benefit.insertMany(sampleBenefits);
      console.log('✅ Sample benefits seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding benefits:', error.message);
  }
};

// @desc    Get all benefits
// @route   GET /api/benefits
// @access  Public
const getBenefits = async (req, res) => {
  try {
    const { category, search, status } = req.query;
    const filter = {};

    if (category && category !== 'all') {
      filter.category = category;
    }
    if (status) {
      filter.status = status;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const benefits = await Benefit.find(filter).sort({ createdAt: -1 });
    res.json(benefits);
  } catch (error) {
    console.error('Get benefits error:', error.message);
    res.status(500).json({ message: 'Error fetching benefits' });
  }
};

// @desc    Get benefit by ID
// @route   GET /api/benefits/:id
// @access  Public
const getBenefitById = async (req, res) => {
  try {
    const benefit = await Benefit.findById(req.params.id);
    if (!benefit) {
      return res.status(404).json({ message: 'Benefit not found' });
    }
    res.json(benefit);
  } catch (error) {
    console.error('Get benefit by ID error:', error.message);
    res.status(500).json({ message: 'Error fetching benefit' });
  }
};

// @desc    Create a new benefit
// @route   POST /api/benefits
// @access  Private/Admin
const createBenefit = async (req, res) => {
  try {
    const benefit = await Benefit.create(req.body);
    res.status(201).json(benefit);
  } catch (error) {
    console.error('Create benefit error:', error.message);
    res.status(500).json({ message: 'Error creating benefit' });
  }
};

module.exports = { getBenefits, getBenefitById, createBenefit, seedBenefits };
