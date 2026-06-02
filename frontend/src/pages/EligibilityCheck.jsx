import { useState } from 'react';
import { checkEligibility } from '../api/eligibilityApi';
import { createApplication } from '../api/applicationApi';

const EligibilityCheck = () => {
  const [formData, setFormData] = useState({
    age: '',
    income: '',
    state: '',
    category: '',
    isStudent: false,
    isUnemployed: false,
    isDisabled: false,
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [applyingId, setApplyingId] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });

  const states = [
    'andhra pradesh', 'arunachal pradesh', 'assam', 'bihar', 'chhattisgarh',
    'goa', 'gujarat', 'haryana', 'himachal pradesh', 'jharkhand',
    'karnataka', 'kerala', 'madhya pradesh', 'maharashtra', 'manipur',
    'meghalaya', 'mizoram', 'nagaland', 'odisha', 'punjab',
    'rajasthan', 'sikkim', 'tamil nadu', 'telangana', 'tripura',
    'uttar pradesh', 'uttarakhand', 'west bengal', 'delhi', 'jammu and kashmir',
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResults(null);

    try {
      const payload = {
        ...formData,
        age: parseInt(formData.age),
        income: parseInt(formData.income),
      };
      const res = await checkEligibility(payload);
      setResults(res.data);
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Error checking eligibility',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (benefitId) => {
    try {
      setApplyingId(benefitId);
      await createApplication({ benefitId });
      setMessage({ text: 'Application submitted successfully!', type: 'success' });
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Error applying',
        type: 'error',
      });
    } finally {
      setApplyingId(null);
      setTimeout(() => setMessage({ text: '', type: '' }), 4000);
    }
  };

  return (
    <div className="eligibility-page">
      <div className="page-container">
        <div className="page-header">
          <h1>✅ Eligibility Checker</h1>
          <p>Answer a few questions to discover government benefits you qualify for</p>
        </div>

        {message.text && (
          <div className={`alert alert-${message.type}`}>{message.text}</div>
        )}

        <div className="eligibility-layout">
          {/* Form */}
          <div className="eligibility-form-section">
            <div className="dashboard-card">
              <h2>Your Information</h2>
              <p className="form-help-text">
                Fill in your details below. All information is used only for matching and is never shared.
              </p>
              <form onSubmit={handleSubmit} className="eligibility-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="age">Age (years)</label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      placeholder="e.g., 25"
                      value={formData.age}
                      onChange={handleChange}
                      min="0"
                      max="150"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="income">Annual Income (₹)</label>
                    <input
                      type="number"
                      id="income"
                      name="income"
                      placeholder="e.g., 200000"
                      value={formData.income}
                      onChange={handleChange}
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="state">State</label>
                    <select
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                    >
                      <option value="">Select State (Optional)</option>
                      {states.map((s) => (
                        <option key={s} value={s}>
                          {s.replace(/\b\w/g, (l) => l.toUpperCase())}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      <option value="">Select Category (Optional)</option>
                      <option value="general">General</option>
                      <option value="obc">OBC</option>
                      <option value="sc">SC</option>
                      <option value="st">ST</option>
                      <option value="ews">EWS</option>
                    </select>
                  </div>
                </div>

                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isStudent"
                      checked={formData.isStudent}
                      onChange={handleChange}
                    />
                    <span className="checkmark"></span>
                    <span>I am a Student</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isUnemployed"
                      checked={formData.isUnemployed}
                      onChange={handleChange}
                    />
                    <span className="checkmark"></span>
                    <span>I am Unemployed</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isDisabled"
                      checked={formData.isDisabled}
                      onChange={handleChange}
                    />
                    <span className="checkmark"></span>
                    <span>I have a Disability</span>
                  </label>
                </div>

                <button type="submit" className="btn-primary btn-full" disabled={loading}>
                  {loading ? (
                    <span className="btn-loading">
                      <span className="spinner"></span> Checking Eligibility...
                    </span>
                  ) : (
                    '✅ Check My Eligibility'
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Results */}
          <div className="eligibility-results-section">
            {results ? (
              <>
                <div className="results-summary">
                  <div className="summary-card eligible">
                    <span className="summary-number">{results.summary.fullyEligible}</span>
                    <span className="summary-label">Fully Eligible</span>
                  </div>
                  <div className="summary-card partial">
                    <span className="summary-number">{results.summary.partiallyEligible}</span>
                    <span className="summary-label">Partially Eligible</span>
                  </div>
                  <div className="summary-card total">
                    <span className="summary-number">{results.totalChecked}</span>
                    <span className="summary-label">Benefits Checked</span>
                  </div>
                </div>

                {results.eligible.length > 0 && (
                  <div className="results-group">
                    <h3 className="results-group-title">
                      🎉 Fully Eligible Benefits
                    </h3>
                    {results.eligible.map((item) => (
                      <div key={item.benefit._id} className="result-card eligible">
                        <div className="result-header">
                          <h4>{item.benefit.name}</h4>
                          <span className="match-badge">{item.matchPercentage}% Match</span>
                        </div>
                        <p>{item.benefit.shortDescription}</p>
                        <div className="result-meta">
                          <span>💰 {item.benefit.benefitAmount}</span>
                          <span>🏛️ {item.benefit.department}</span>
                        </div>
                        <button
                          className="btn-primary btn-sm"
                          onClick={() => handleApply(item.benefit._id)}
                          disabled={applyingId === item.benefit._id}
                        >
                          {applyingId === item.benefit._id ? 'Applying...' : 'Apply Now →'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {results.partial.length > 0 && (
                  <div className="results-group">
                    <h3 className="results-group-title">
                      📋 Partially Eligible Benefits
                    </h3>
                    {results.partial.map((item) => (
                      <div key={item.benefit._id} className="result-card partial">
                        <div className="result-header">
                          <h4>{item.benefit.name}</h4>
                          <span className="match-badge partial">{item.matchPercentage}% Match</span>
                        </div>
                        <p>{item.benefit.shortDescription}</p>
                        <div className="result-reasons">
                          <span className="reasons-label">Missing criteria:</span>
                          <ul>
                            {item.reasons.map((r, i) => (
                              <li key={i}>{r}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {results.eligible.length === 0 && results.partial.length === 0 && (
                  <div className="empty-state">
                    <span className="empty-icon">😔</span>
                    <h3>No matching benefits found</h3>
                    <p>Try adjusting your criteria or browse all available benefits</p>
                  </div>
                )}
              </>
            ) : (
              <div className="results-placeholder">
                <span className="placeholder-icon">📋</span>
                <h3>Your Results Will Appear Here</h3>
                <p>Fill in your details and click "Check My Eligibility" to see which benefits you qualify for</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EligibilityCheck;
