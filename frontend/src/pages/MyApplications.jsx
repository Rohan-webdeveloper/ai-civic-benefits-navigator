import { useState, useEffect } from 'react';
import { getMyApplications, uploadDocument } from '../api/applicationApi';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await getMyApplications();
      setApplications(res.data);
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e, applicationId) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('document', file);
    formData.append('applicationId', applicationId);

    try {
      setUploading(true);
      await uploadDocument(formData);
      setMessage({ text: 'Document uploaded successfully!', type: 'success' });
      fetchApplications(); // refresh
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Error uploading document',
        type: 'error',
      });
    } finally {
      setUploading(false);
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

  const getStatusIcon = (status) => {
    const icons = {
      submitted: '🟡',
      under_review: '🔵',
      documents_requested: '🟠',
      approved: '🟢',
      rejected: '🔴',
      on_hold: '⚪',
    };
    return icons[status] || '⚪';
  };

  const formatStatus = (status) =>
    status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  if (loading) {
    return (
      <div className="page-loading">
        <div className="loading-spinner"></div>
        <p>Loading your applications...</p>
      </div>
    );
  }

  return (
    <div className="applications-page">
      <div className="page-container">
        <div className="page-header">
          <h1>📋 My Applications</h1>
          <p>Track the status of all your benefit applications</p>
        </div>

        {message.text && (
          <div className={`alert alert-${message.type}`}>{message.text}</div>
        )}

        {applications.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📋</span>
            <h3>No applications yet</h3>
            <p>Browse benefits and apply to see your applications here</p>
          </div>
        ) : (
          <div className="my-apps-list">
            {applications.map((app) => (
              <div key={app._id} className="my-app-card">
                <div className="my-app-header">
                  <div className="my-app-info">
                    <h3>{app.benefit?.name || 'Unknown Benefit'}</h3>
                    <div className="my-app-meta">
                      <span>🏛️ {app.benefit?.department || 'N/A'}</span>
                      <span>📅 Applied: {new Date(app.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <span
                    className="status-badge large"
                    style={{
                      background: getStatusColor(app.status) + '20',
                      color: getStatusColor(app.status),
                      borderColor: getStatusColor(app.status),
                    }}
                  >
                    {getStatusIcon(app.status)} {formatStatus(app.status)}
                  </span>
                </div>

                {/* Timeline */}
                <div className="timeline-section">
                  <h4>Application Timeline</h4>
                  <div className="timeline">
                    {app.timeline?.map((entry, index) => (
                      <div key={index} className="timeline-item">
                        <div
                          className="timeline-dot"
                          style={{ background: getStatusColor(entry.status) }}
                        ></div>
                        <div className="timeline-content">
                          <div className="timeline-header">
                            <span className="timeline-status">
                              {formatStatus(entry.status)}
                            </span>
                            <span className="timeline-date">
                              {new Date(entry.date).toLocaleString()}
                            </span>
                          </div>
                          <p className="timeline-note">{entry.note}</p>
                          <span className="timeline-by">By: {entry.updatedBy}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Documents */}
                <div className="documents-section">
                  <div className="docs-header">
                    <h4>📎 Documents ({app.documents?.length || 0})</h4>
                    <label className="upload-btn">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        onChange={(e) => handleFileUpload(e, app._id)}
                        style={{ display: 'none' }}
                      />
                      {uploading ? 'Uploading...' : '+ Upload Document'}
                    </label>
                  </div>
                  {app.documents?.length > 0 && (
                    <div className="docs-list">
                      {app.documents.map((doc, i) => (
                        <div key={i} className="doc-item">
                          <span className="doc-icon">📄</span>
                          <span className="doc-name">{doc.originalName}</span>
                          <span className="doc-date">
                            {new Date(doc.uploadedAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Admin Notes */}
                {app.adminNotes && (
                  <div className="admin-notes">
                    <h4>📝 Caseworker Notes</h4>
                    <p>{app.adminNotes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
