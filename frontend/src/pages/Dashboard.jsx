import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyApplications } from '../api/applicationApi';
import { getBenefits } from '../api/benefitApi';

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [benefitCount, setBenefitCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsRes, benefitsRes] = await Promise.all([
          getMyApplications(),
          getBenefits(),
        ]);
        setApplications(appsRes.data);
        setBenefitCount(benefitsRes.data.length);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statusCounts = {
    submitted: applications.filter((a) => a.status === 'submitted').length,
    under_review: applications.filter((a) => a.status === 'under_review').length,
    approved: applications.filter((a) => a.status === 'approved').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  };

  const getStatusColor = (status) => {
    const colors = {
      submitted: '#f59e0b',
      under_review: '#3b82f6',
      documents_requested: '#f97316',
      approved: '#10b981',
      rejected: '#ef4444',
      on_hold: '#6b7280',
    };
    return colors[status] || '#6b7280';
  };

  const formatStatus = (status) =>
    status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  if (loading) {
    return (
      <div className="page-loading">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-container">
        {/* Welcome Header */}
        <div className="dashboard-header">
          <div className="dashboard-welcome">
            <h1>Welcome back, {user.name || 'Citizen'} 👋</h1>
            <p>Here's an overview of your benefits and applications</p>
          </div>
          <div className="dashboard-actions">
            <Link to="/eligibility" className="btn-primary">
              Check Eligibility
            </Link>
            <Link to="/benefits" className="btn-secondary">
              Browse Benefits
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="dashboard-stats">
          <div className="dash-stat-card">
            <div className="dash-stat-icon" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
              📋
            </div>
            <div className="dash-stat-info">
              <span className="dash-stat-value">{applications.length}</span>
              <span className="dash-stat-label">Total Applications</span>
            </div>
          </div>
          <div className="dash-stat-card">
            <div className="dash-stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb, #f5576c)' }}>
              🏛️
            </div>
            <div className="dash-stat-info">
              <span className="dash-stat-value">{benefitCount}</span>
              <span className="dash-stat-label">Available Benefits</span>
            </div>
          </div>
          <div className="dash-stat-card">
            <div className="dash-stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe, #00f2fe)' }}>
              🔵
            </div>
            <div className="dash-stat-info">
              <span className="dash-stat-value">{statusCounts.under_review}</span>
              <span className="dash-stat-label">Under Review</span>
            </div>
          </div>
          <div className="dash-stat-card">
            <div className="dash-stat-icon" style={{ background: 'linear-gradient(135deg, #43e97b, #38f9d7)' }}>
              ✅
            </div>
            <div className="dash-stat-info">
              <span className="dash-stat-value">{statusCounts.approved}</span>
              <span className="dash-stat-label">Approved</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-grid">
          <div className="dashboard-main">
            <div className="dashboard-card">
              <div className="card-header">
                <h2>Recent Applications</h2>
                <Link to="/my-applications" className="view-all-link">
                  View All →
                </Link>
              </div>
              {applications.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">📋</span>
                  <h3>No applications yet</h3>
                  <p>Start by checking your eligibility or browsing available benefits</p>
                  <Link to="/eligibility" className="btn-primary">
                    Check Eligibility
                  </Link>
                </div>
              ) : (
                <div className="applications-list">
                  {applications.slice(0, 5).map((app) => (
                    <div key={app._id} className="application-item">
                      <div className="app-info">
                        <h4>{app.benefit?.name || 'Unknown Benefit'}</h4>
                        <span className="app-date">
                          Applied: {new Date(app.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <span
                        className="status-badge"
                        style={{ background: getStatusColor(app.status) + '20', color: getStatusColor(app.status) }}
                      >
                        {formatStatus(app.status)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="dashboard-sidebar">
            <div className="dashboard-card quick-actions-card">
              <h3>Quick Actions</h3>
              <div className="quick-actions">
                <Link to="/eligibility" className="quick-action">
                  <span className="qa-icon">✅</span>
                  <span>Check Eligibility</span>
                </Link>
                <Link to="/ai-help" className="quick-action">
                  <span className="qa-icon">🤖</span>
                  <span>AI Assistant</span>
                </Link>
                <Link to="/benefits" className="quick-action">
                  <span className="qa-icon">🔍</span>
                  <span>Find Benefits</span>
                </Link>
                <Link to="/my-applications" className="quick-action">
                  <span className="qa-icon">📊</span>
                  <span>Track Status</span>
                </Link>
              </div>
            </div>

            <div className="dashboard-card">
              <h3>Application Status</h3>
              <div className="status-summary">
                <div className="status-row">
                  <span className="status-dot" style={{ background: '#f59e0b' }}></span>
                  <span>Submitted</span>
                  <span className="status-count">{statusCounts.submitted}</span>
                </div>
                <div className="status-row">
                  <span className="status-dot" style={{ background: '#3b82f6' }}></span>
                  <span>Under Review</span>
                  <span className="status-count">{statusCounts.under_review}</span>
                </div>
                <div className="status-row">
                  <span className="status-dot" style={{ background: '#10b981' }}></span>
                  <span>Approved</span>
                  <span className="status-count">{statusCounts.approved}</span>
                </div>
                <div className="status-row">
                  <span className="status-dot" style={{ background: '#ef4444' }}></span>
                  <span>Rejected</span>
                  <span className="status-count">{statusCounts.rejected}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
