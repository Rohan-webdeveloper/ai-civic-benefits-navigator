import { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../api/authApi';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    income: '',
    state: '',
    category: '',
    isStudent: false,
    isUnemployed: false,
    isDisabled: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await getProfile();
      setProfileData({
        name: res.data.name || '',
        email: res.data.email || '',
        phone: res.data.phone || '',
        age: res.data.age || '',
        income: res.data.income || '',
        state: res.data.state || '',
        category: res.data.category || '',
        isStudent: res.data.isStudent || false,
        isUnemployed: res.data.isUnemployed || false,
        isDisabled: res.data.isDisabled || false,
      });
    } catch (err) {
      setError('Failed to fetch profile details.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileData({
      ...profileData,
      [name]: type === 'checkbox' ? checked : value,
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await updateProfile(profileData);
      
      // Update local storage user data
      const localUser = JSON.parse(localStorage.getItem('user') || '{}');
      localUser.name = res.data.name;
      localUser.email = res.data.email;
      localStorage.setItem('user', JSON.stringify(localUser));
      
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      // Refresh local user information in navbar
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="loading-spinner"></div>
        <p>Loading your profile details...</p>
      </div>
    );
  }

  return (
    <div className="page-container profile-page">
      <div className="page-header">
        <h1>Citizen Profile</h1>
        <p>Manage your personal profile details to discover matching public benefit schemes.</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="profile-layout">
        {/* Left Side Card: Avatar & Summary */}
        <div className="profile-sidebar-card">
          <div className="profile-avatar-large">
            {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <h2 className="profile-user-name">{profileData.name}</h2>
          <p className="profile-user-email">{profileData.email}</p>
          <span className="profile-role-badge">Citizen Account</span>

          <div className="profile-completion-notice">
            <span className="completion-icon">💡</span>
            <p>Keeping your profile updated helps our AI Assistant recommend benefits with 100% accuracy.</p>
          </div>
        </div>

        {/* Right Side Form: Profile details */}
        <div className="profile-content-card">
          <div className="profile-card-header">
            <h3>Personal & Eligibility Details</h3>
            {!isEditing && (
              <button 
                type="button" 
                className="btn-secondary btn-sm"
                onClick={() => setIsEditing(true)}
              >
                ✏️ Edit Profile
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="profile-details-form">
            <div className="profile-form-grid">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={profileData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleChange}
                  disabled={true} // Email is login identifier, disable editing
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={profileData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="form-group">
                <label htmlFor="age">Age (Years)</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  min="0"
                  max="120"
                  placeholder="Enter your age"
                  value={profileData.age}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="form-group">
                <label htmlFor="income">Annual Income (₹)</label>
                <input
                  type="number"
                  id="income"
                  name="income"
                  min="0"
                  placeholder="Enter annual income in ₹"
                  value={profileData.income}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="form-group">
                <label htmlFor="state">State of Residence</label>
                <select
                  id="state"
                  name="state"
                  value={profileData.state}
                  onChange={handleChange}
                  disabled={!isEditing}
                >
                  <option value="">Select your State</option>
                  {indianStates.map((s, idx) => (
                    <option key={idx} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="category">Category (Caste)</label>
                <select
                  id="category"
                  name="category"
                  value={profileData.category}
                  onChange={handleChange}
                  disabled={!isEditing}
                >
                  <option value="">Select Category</option>
                  <option value="general">General</option>
                  <option value="obc">OBC (Other Backward Classes)</option>
                  <option value="sc">SC (Scheduled Caste)</option>
                  <option value="st">ST (Scheduled Tribe)</option>
                  <option value="ews">EWS (Economically Weaker Section)</option>
                </select>
              </div>
            </div>

            <div className="profile-checkboxes-section">
              <h4>Additional Criteria</h4>
              <div className="profile-checkbox-grid">
                <label className={`checkbox-card ${profileData.isStudent ? 'active' : ''} ${!isEditing ? 'disabled' : ''}`}>
                  <input
                    type="checkbox"
                    name="isStudent"
                    checked={profileData.isStudent}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                  <div className="checkbox-card-content">
                    <span className="checkbox-card-icon">🎓</span>
                    <div>
                      <h5>I am a Student</h5>
                      <p>For scholarship and education benefits</p>
                    </div>
                  </div>
                </label>

                <label className={`checkbox-card ${profileData.isUnemployed ? 'active' : ''} ${!isEditing ? 'disabled' : ''}`}>
                  <input
                    type="checkbox"
                    name="isUnemployed"
                    checked={profileData.isUnemployed}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                  <div className="checkbox-card-content">
                    <span className="checkbox-card-icon">💼</span>
                    <div>
                      <h5>I am Unemployed</h5>
                      <p>For job training and unemployment allowance</p>
                    </div>
                  </div>
                </label>

                <label className={`checkbox-card ${profileData.isDisabled ? 'active' : ''} ${!isEditing ? 'disabled' : ''}`}>
                  <input
                    type="checkbox"
                    name="isDisabled"
                    checked={profileData.isDisabled}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                  <div className="checkbox-card-content">
                    <span className="checkbox-card-icon">♿</span>
                    <div>
                      <h5>Differently Abled</h5>
                      <p>For accessibility and disability schemes</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {isEditing && (
              <div className="profile-form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setIsEditing(false);
                    fetchProfile(); // Reset fields
                  }}
                  disabled={saveLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={saveLoading}
                >
                  {saveLoading ? 'Saving Changes...' : 'Save Profile'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
