import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    const initialTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', initialTheme);
    return initialTheme;
  });

  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || '{}'));
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;
  const isAdmin = user.role === 'admin';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user') || '{}'));
  }, [location.pathname]);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest('.navbar-user-container')) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

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
              <svg className="logo-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L4 5V11C4 16.55 7.42 21.74 12 23C16.58 21.74 20 16.55 20 11V5L12 2Z" fill="url(#logo-grad)" />
                <path d="M12 6L9 11H15L12 18L12 6Z" fill="#FFF" />
                <defs>
                  <linearGradient id="logo-grad" x1="4" y1="2" x2="20" y2="23" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#1a3fa3" />
                    <stop offset="1" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="logo-text">
                <span className="logo-title">AI CIVIC</span>
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
              <button 
                className="theme-toggle-btn"
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? (
                  <svg className="theme-toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                ) : (
                  <svg className="theme-toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                )}
              </button>

              {isLoggedIn ? (
                <div className="navbar-user-container">
                  <button 
                    className="navbar-profile-trigger"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    aria-label="User menu"
                  >
                    <div className="user-avatar">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  </button>
                  
                  {dropdownOpen && (
                    <div className="profile-dropdown">
                      <div className="dropdown-user-info">
                        <div className="dropdown-avatar">
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="dropdown-user-details">
                          <h4 className="dropdown-name">{user.name || 'User'}</h4>
                          <p className="dropdown-email">{user.email || 'user@example.com'}</p>
                        </div>
                      </div>
                      <div className="dropdown-divider"></div>
                      <Link 
                        to="/dashboard" 
                        className="dropdown-item"
                        onClick={() => { setDropdownOpen(false); setMenuOpen(false); }}
                      >
                        📊 Citizen Dashboard
                      </Link>
                      <Link 
                        to="/profile" 
                        className="dropdown-item"
                        onClick={() => { setDropdownOpen(false); setMenuOpen(false); }}
                      >
                        👤 View Profile
                      </Link>
                      <Link 
                        to="/my-applications" 
                        className="dropdown-item"
                        onClick={() => { setDropdownOpen(false); setMenuOpen(false); }}
                      >
                        📋 My Applications
                      </Link>
                      <div className="dropdown-divider"></div>
                      <button 
                        className="dropdown-logout-btn" 
                        onClick={() => { handleLogout(); setDropdownOpen(false); }}
                      >
                        🚪 Logout
                      </button>
                    </div>
                  )}
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
