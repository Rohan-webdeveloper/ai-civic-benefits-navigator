import { useState, useEffect } from 'react';
import { getBenefits } from '../api/benefitApi';
import { createApplication } from '../api/applicationApi';
import { explainBenefit } from '../api/aiApi';

const Benefits = () => {
  const [benefits, setBenefits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [selectedBenefit, setSelectedBenefit] = useState(null);
  const [explanation, setExplanation] = useState('');
  const [explaining, setExplaining] = useState(false);
  const [applyingId, setApplyingId] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });

  const isLoggedIn = !!localStorage.getItem('token');

  const categories = [
    { value: 'all', label: 'All Categories', icon: '📋' },
    { value: 'healthcare', label: 'Healthcare', icon: '🏥' },
    { value: 'education', label: 'Education', icon: '🎓' },
    { value: 'housing', label: 'Housing', icon: '🏠' },
    { value: 'food', label: 'Food', icon: '🍚' },
    { value: 'employment', label: 'Employment', icon: '💼' },
    { value: 'disability', label: 'Disability', icon: '♿' },
    { value: 'pension', label: 'Pension', icon: '👴' },
    { value: 'women', label: 'Women', icon: '👩' },
    { value: 'agriculture', label: 'Agriculture', icon: '🌾' },
  ];

  useEffect(() => {
    fetchBenefits();
  }, [category, search]);

  const fetchBenefits = async () => {
    try {
      setLoading(true);
      const params = {};
      if (category !== 'all') params.category = category;
      if (search) params.search = search;
      const res = await getBenefits(params);
      setBenefits(res.data);
    } catch (err) {
      console.error('Error fetching benefits:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (benefitId) => {
    if (!isLoggedIn) {
      setMessage({ text: 'Please login to apply for benefits', type: 'error' });
      return;
    }
    try {
      setApplyingId(benefitId);
      await createApplication({ benefitId });
      setMessage({ text: 'Application submitted successfully!', type: 'success' });
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Error applying for benefit',
        type: 'error',
      });
    } finally {
      setApplyingId(null);
      setTimeout(() => setMessage({ text: '', type: '' }), 4000);
    }
  };

  const handleExplain = async (benefit) => {
    setSelectedBenefit(benefit);
    setExplanation('');
    setExplaining(true);
    try {
      const res = await explainBenefit(benefit.name, benefit.description);
      setExplanation(res.data.explanation);
    } catch (err) {
      setExplanation('Unable to generate explanation. Please try again later.');
    } finally {
      setExplaining(false);
    }
  };

  const getCategoryIcon = (cat) => {
    const found = categories.find((c) => c.value === cat);
    return found ? found.icon : '📋';
  };

  return (
    <div className="benefits-page">
      <div className="page-container">
        {/* Page Header */}
        <div className="page-header">
          <h1>Government Benefits & Schemes</h1>
          <p>Explore all available government benefits across various categories</p>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`alert alert-${message.type}`}>{message.text}</div>
        )}

        {/* Filters */}
        <div className="filters-section">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search benefits by name, keyword, or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="category-filters">
            {categories.map((cat) => (
              <button
                key={cat.value}
                className={`category-btn ${category === cat.value ? 'active' : ''}`}
                onClick={() => setCategory(cat.value)}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="results-info">
          <span>{benefits.length} benefits found</span>
        </div>

        {/* Benefits Grid */}
        {loading ? (
          <div className="page-loading">
            <div className="loading-spinner"></div>
            <p>Loading benefits...</p>
          </div>
        ) : benefits.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🔍</span>
            <h3>No benefits found</h3>
            <p>Try adjusting your search or category filters</p>
          </div>
        ) : (
          <div className="benefits-grid">
            {benefits.map((benefit) => (
              <div key={benefit._id} className="benefit-card">
                <div className="benefit-card-header">
                  <span className="benefit-category-icon">
                    {getCategoryIcon(benefit.category)}
                  </span>
                  <span className="benefit-category-badge">{benefit.category}</span>
                  <span className={`benefit-status-dot ${benefit.status}`}></span>
                </div>
                <h3 className="benefit-name">{benefit.name}</h3>
                <p className="benefit-short-desc">{benefit.shortDescription}</p>
                <div className="benefit-meta">
                  <div className="benefit-meta-item">
                    <span className="meta-label">Amount:</span>
                    <span className="meta-value">{benefit.benefitAmount}</span>
                  </div>
                  <div className="benefit-meta-item">
                    <span className="meta-label">Department:</span>
                    <span className="meta-value">{benefit.department}</span>
                  </div>
                  <div className="benefit-meta-item">
                    <span className="meta-label">Deadline:</span>
                    <span className="meta-value">{benefit.applicationDeadline}</span>
                  </div>
                </div>
                <div className="benefit-tags">
                  {benefit.tags?.slice(0, 3).map((tag) => (
                    <span key={tag} className="benefit-tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="benefit-actions">
                  <button
                    className="btn-secondary btn-sm"
                    onClick={() => handleExplain(benefit)}
                  >
                    🤖 AI Explain
                  </button>
                  <button
                    className="btn-primary btn-sm"
                    onClick={() => handleApply(benefit._id)}
                    disabled={applyingId === benefit._id}
                  >
                    {applyingId === benefit._id ? 'Applying...' : '📝 Apply Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AI Explanation Modal */}
        {selectedBenefit && (
          <div className="modal-overlay" onClick={() => setSelectedBenefit(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>
                  🤖 AI Explanation: {selectedBenefit.name}
                </h2>
                <button
                  className="modal-close"
                  onClick={() => setSelectedBenefit(null)}
                >
                  ✕
                </button>
              </div>
              <div className="modal-body">
                {explaining ? (
                  <div className="modal-loading">
                    <div className="loading-spinner"></div>
                    <p>AI is generating explanation...</p>
                  </div>
                ) : (
                  <div className="ai-explanation">
                    {explanation.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn-primary"
                  onClick={() => handleApply(selectedBenefit._id)}
                >
                  Apply for this Benefit
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => setSelectedBenefit(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Benefits;
