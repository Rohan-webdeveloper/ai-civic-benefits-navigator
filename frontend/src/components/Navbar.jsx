import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = !!token;
  const isAdmin = user.role === 'admin';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Government Top Bar */}
      <div className="gov-topbar">
        <div className="gov-topbar-content">
          <div className="gov-topbar-left">
            <span className="gov-emblem">🏛️</span>
            <span>Government of India — Digital Services Portal</span>
          </div>
          <div className="gov-topbar-right">
            <span>🌐 English</span>
            <span>📞 Helpline: 1800-XXX-XXXX</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
            <div className="navbar-logo">
              <span className="logo-icon">⚡</span>
              <div className="logo-text">
                <span className="logo-title">AI Civic</span>
                <span className="logo-subtitle">Benefits Navigator</span>
              </div>
            </div>
          </Link>

          <button
            className="navbar-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            <span className={`hamburger ${menuOpen ? 'active' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>

          <div className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
            <div className="navbar-links">
              <Link
                to="/"
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/benefits"
                className={`nav-link ${isActive('/benefits') ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                Benefits
              </Link>

              {isLoggedIn && (
                <>
                  <Link
                    to="/dashboard"
                    className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/eligibility"
                    className={`nav-link ${isActive('/eligibility') ? 'active' : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    Eligibility
                  </Link>
                  <Link
                    to="/ai-help"
                    className={`nav-link ${isActive('/ai-help') ? 'active' : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className="ai-badge">AI</span> Assistant
                  </Link>
                  <Link
                    to="/my-applications"
                    className={`nav-link ${isActive('/my-applications') ? 'active' : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    My Applications
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className={`nav-link admin-link ${isActive('/admin') ? 'active' : ''}`}
                      onClick={() => setMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                </>
              )}
            </div>

            <div className="navbar-auth">
              {isLoggedIn ? (
                <div className="navbar-user">
                  <div className="user-avatar">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="user-name">{user.name || 'User'}</span>
                  <button className="btn-logout" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              ) : (
                <div className="auth-buttons">
                  <Link
                    to="/login"
                    className="btn-nav-login"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn-nav-register"
                    onClick={() => setMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
