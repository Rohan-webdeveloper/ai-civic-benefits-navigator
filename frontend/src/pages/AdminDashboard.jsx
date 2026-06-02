import { useState, useEffect } from 'react';
import { getAllApplications, updateApplicationStatus } from '../api/applicationApi';

const AdminDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState({ status: '', note: '' });
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchApplications();
  }, [filter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter !== 'all') params.status = filter;
      const res = await getAllApplications(params);
      setApplications(res.data);
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appId) => {
    if (!statusUpdate.status) return;

    try {
      setUpdating(true);
      await updateApplicationStatus(appId, statusUpdate);
      setMessage({ text: 'Status updated successfully!', type: 'success' });
      setSelectedApp(null);
      setStatusUpdate({ status: '', note: '' });
      fetchApplications();
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Error updating status',
        type: 'error',
      });
    } finally {
      setUpdating(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 4000);
    }
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

  const statusOptions = [
    'submitted',
    'under_review',
    'documents_requested',
    'approved',
    'rejected',
    'on_hold',
  ];

  const statusCounts = {
    all: applications.length,
    submitted: applications.filter((a) => a.status === 'submitted').length,
    under_review: applications.filter((a) => a.status === 'under_review').length,
    documents_requested: applications.filter((a) => a.status === 'documents_requested').length,
    approved: applications.filter((a) => a.status === 'approved').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
    on_hold: applications.filter((a) => a.status === 'on_hold').length,
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="loading-spinner"></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="page-container">
        <div className="page-header">
          <h1>🏛️ Admin / Caseworker Dashboard</h1>
          <p>Review and manage all citizen benefit applications</p>
        </div>

        {message.text && (
          <div className={`alert alert-${message.type}`}>{message.text}</div>
        )}

        {/* Admin Stats */}
        <div className="admin-stats">
          <div className="admin-stat-card">
            <span className="admin-stat-value">{statusCounts.all}</span>
            <span className="admin-stat-label">Total</span>
          </div>
          <div className="admin-stat-card" style={{ borderLeftColor: '#f59e0b' }}>
            <span className="admin-stat-value">{statusCounts.submitted}</span>
            <span className="admin-stat-label">Submitted</span>
          </div>
          <div className="admin-stat-card" style={{ borderLeftColor: '#3b82f6' }}>
            <span className="admin-stat-value">{statusCounts.under_review}</span>
            <span className="admin-stat-label">Reviewing</span>
          </div>
          <div className="admin-stat-card" style={{ borderLeftColor: '#10b981' }}>
            <span className="admin-stat-value">{statusCounts.approved}</span>
            <span className="admin-stat-label">Approved</span>
          </div>
          <div className="admin-stat-card" style={{ borderLeftColor: '#ef4444' }}>
            <span className="admin-stat-value">{statusCounts.rejected}</span>
            <span className="admin-stat-label">Rejected</span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="admin-filters">
          {['all', ...statusOptions].map((s) => (
            <button
              key={s}
              className={`filter-tab ${filter === s ? 'active' : ''}`}
              onClick={() => setFilter(s)}
            >
              {formatStatus(s)} ({statusCounts[s] || 0})
            </button>
          ))}
        </div>

        {/* Applications Table */}
        {applications.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📋</span>
            <h3>No applications found</h3>
            <p>No applications match the selected filter</p>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Benefit</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Applied Date</th>
                  <th>Documents</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id}>
                    <td>
                      <div className="applicant-info">
                        <span className="applicant-name">{app.user?.name || 'N/A'}</span>
                        <span className="applicant-email">{app.user?.email || 'N/A'}</span>
                      </div>
                    </td>
                    <td>{app.benefit?.name || 'N/A'}</td>
                    <td>{app.benefit?.department || 'N/A'}</td>
                    <td>
                      <span
                        className="status-badge"
                        style={{
                          background: getStatusColor(app.status) + '20',
                          color: getStatusColor(app.status),
                        }}
                      >
                        {formatStatus(app.status)}
                      </span>
                    </td>
                    <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                    <td>{app.documents?.length || 0} files</td>
                    <td>
                      <button
                        className="btn-primary btn-sm"
                        onClick={() => {
                          setSelectedApp(app);
                          setStatusUpdate({ status: app.status, note: '' });
                        }}
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Review Modal */}
        {selectedApp && (
          <div className="modal-overlay" onClick={() => setSelectedApp(null)}>
            <div className="modal-content admin-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Review Application</h2>
                <button className="modal-close" onClick={() => setSelectedApp(null)}>
                  ✕
                </button>
              </div>
              <div className="modal-body">
                <div className="review-details">
                  <div className="review-row">
                    <span className="review-label">Applicant:</span>
                    <span>{selectedApp.user?.name} ({selectedApp.user?.email})</span>
                  </div>
                  <div className="review-row">
                    <span className="review-label">Benefit:</span>
                    <span>{selectedApp.benefit?.name}</span>
                  </div>
                  <div className="review-row">
                    <span className="review-label">Current Status:</span>
                    <span
                      className="status-badge"
                      style={{
                        background: getStatusColor(selectedApp.status) + '20',
                        color: getStatusColor(selectedApp.status),
                      }}
                    >
                      {formatStatus(selectedApp.status)}
                    </span>
                  </div>
                  <div className="review-row">
                    <span className="review-label">Documents:</span>
                    <span>{selectedApp.documents?.length || 0} uploaded</span>
                  </div>

                  {selectedApp.documents?.length > 0 && (
                    <div className="review-docs">
                      <h4>Uploaded Documents:</h4>
                      {selectedApp.documents.map((doc, i) => (
                        <div key={i} className="doc-item">
                          <span className="doc-icon">📄</span>
                          <span>{doc.originalName}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Timeline */}
                  {selectedApp.timeline?.length > 0 && (
                    <div className="review-timeline">
                      <h4>Timeline:</h4>
                      {selectedApp.timeline.map((entry, i) => (
                        <div key={i} className="timeline-mini">
                          <span
                            className="timeline-dot-sm"
                            style={{ background: getStatusColor(entry.status) }}
                          ></span>
                          <span>{formatStatus(entry.status)}</span>
                          <span className="timeline-date-sm">
                            {new Date(entry.date).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Update Form */}
                <div className="update-form">
                  <h4>Update Status</h4>
                  <div className="form-group">
                    <label>New Status</label>
                    <select
                      value={statusUpdate.status}
                      onChange={(e) =>
                        setStatusUpdate({ ...statusUpdate, status: e.target.value })
                      }
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>
                          {formatStatus(s)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Note / Reason</label>
                    <textarea
                      placeholder="Add a note about this status change..."
                      value={statusUpdate.note}
                      onChange={(e) =>
                        setStatusUpdate({ ...statusUpdate, note: e.target.value })
                      }
                      rows={3}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn-primary"
                  onClick={() => handleStatusUpdate(selectedApp._id)}
                  disabled={updating}
                >
                  {updating ? 'Updating...' : 'Update Status'}
                </button>
                <button className="btn-secondary" onClick={() => setSelectedApp(null)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
