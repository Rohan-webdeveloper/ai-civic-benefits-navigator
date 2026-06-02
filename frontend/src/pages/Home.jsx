import { Link } from 'react-router-dom';

const Home = () => {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-shapes">
          <div className="hero-shape shape-1"></div>
          <div className="hero-shape shape-2"></div>
          <div className="hero-shape shape-3"></div>
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">
              <span className="badge-icon">🤖</span>
              <span>Powered by Artificial Intelligence</span>
            </div>
            <h1 className="hero-title">
              Discover Your
              <span className="gradient-text"> Government Benefits</span>
              <br />with AI Assistance
            </h1>
            <p className="hero-description">
              Navigate the complex world of public benefits with ease. Our AI-powered platform
              helps you discover eligible schemes, understand them in simple English, apply
              online, and track your applications — all in one place.
            </p>
            <div className="hero-cta">
              {isLoggedIn ? (
                <>
                  <Link to="/eligibility" className="btn-primary-lg">
                    <span>Check Eligibility</span>
                    <span className="btn-arrow">→</span>
                  </Link>
                  <Link to="/benefits" className="btn-secondary-lg">
                    Browse Benefits
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="btn-primary-lg">
                    <span>Get Started Free</span>
                    <span className="btn-arrow">→</span>
                  </Link>
                  <Link to="/benefits" className="btn-secondary-lg">
                    Explore Benefits
                  </Link>
                </>
              )}
            </div>
            <div className="hero-stats-inline">
              <div className="stat-inline">
                <span className="stat-number">50+</span>
                <span className="stat-label">Benefits Listed</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-inline">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Citizens Helped</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-inline">
                <span className="stat-number">99%</span>
                <span className="stat-label">Accuracy Rate</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="glass-card ai-preview-card">
              <div className="ai-preview-header">
                <div className="ai-dot green"></div>
                <div className="ai-dot yellow"></div>
                <div className="ai-dot red"></div>
                <span className="ai-preview-title">AI Benefits Assistant</span>
              </div>
              <div className="ai-preview-body">
                <div className="ai-message bot">
                  <div className="ai-avatar">🤖</div>
                  <div className="ai-bubble">
                    Hello! I can help you find government benefits you're eligible for. What's your age and annual income?
                  </div>
                </div>
                <div className="ai-message user">
                  <div className="ai-bubble user-bubble">
                    I'm 28 years old, earning ₹2.5 lakh/year
                  </div>
                </div>
                <div className="ai-message bot">
                  <div className="ai-avatar">🤖</div>
                  <div className="ai-bubble">
                    Great news! You may be eligible for <strong>5 benefits</strong> including National Health Insurance and Skill Development Program. Shall I explain each one?
                  </div>
                </div>
              </div>
              <div className="ai-preview-input">
                <span>Ask about any government scheme...</span>
                <span className="send-icon">➤</span>
              </div>
            </div>
            <div className="floating-card float-card-1">
              <span className="float-icon">🏥</span>
              <span>Healthcare</span>
            </div>
            <div className="floating-card float-card-2">
              <span className="float-icon">🎓</span>
              <span>Education</span>
            </div>
            <div className="floating-card float-card-3">
              <span className="float-icon">🏠</span>
              <span>Housing</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">Features</span>
            <h2 className="section-title">Everything You Need to Access Benefits</h2>
            <p className="section-subtitle">
              Our comprehensive platform simplifies the entire journey from discovery to application tracking
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">🔍</span>
              </div>
              <h3>Smart Discovery</h3>
              <p>Browse through 50+ government benefits across healthcare, education, housing, and more categories</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">✅</span>
              </div>
              <h3>Eligibility Check</h3>
              <p>Answer simple questions and our rule-based engine finds all benefits you qualify for</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">🤖</span>
              </div>
              <h3>AI Assistant</h3>
              <p>Get any government scheme explained in simple English by our AI-powered assistant</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">📝</span>
              </div>
              <h3>Easy Applications</h3>
              <p>Apply for benefits directly through our platform with a streamlined application process</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">📎</span>
              </div>
              <h3>Document Upload</h3>
              <p>Securely upload and manage your documents — Aadhaar, income proof, certificates, and more</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">📊</span>
              </div>
              <h3>Track Status</h3>
              <p>Monitor your application status with a real-time timeline from submission to approval</p>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="workflow-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">How It Works</span>
            <h2 className="section-title">Simple 4-Step Process</h2>
            <p className="section-subtitle">
              From registration to receiving benefits — we've made every step straightforward
            </p>
          </div>
          <div className="workflow-steps">
            <div className="workflow-step">
              <div className="step-number">01</div>
              <div className="step-content">
                <h3>Create Account</h3>
                <p>Register with your basic details to get started on the platform</p>
              </div>
              <div className="step-connector"></div>
            </div>
            <div className="workflow-step">
              <div className="step-number">02</div>
              <div className="step-content">
                <h3>Check Eligibility</h3>
                <p>Fill a quick questionnaire and discover benefits you qualify for</p>
              </div>
              <div className="step-connector"></div>
            </div>
            <div className="workflow-step">
              <div className="step-number">03</div>
              <div className="step-content">
                <h3>Apply Online</h3>
                <p>Submit applications and upload required documents digitally</p>
              </div>
              <div className="step-connector"></div>
            </div>
            <div className="workflow-step">
              <div className="step-number">04</div>
              <div className="step-content">
                <h3>Track & Receive</h3>
                <p>Monitor your application status and receive your benefits</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="section-container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🏛️</div>
              <div className="stat-value">50+</div>
              <div className="stat-title">Government Schemes</div>
              <div className="stat-desc">Across 10+ categories</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-value">10,000+</div>
              <div className="stat-title">Citizens Served</div>
              <div className="stat-desc">And growing daily</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📋</div>
              <div className="stat-value">25,000+</div>
              <div className="stat-title">Applications Processed</div>
              <div className="stat-desc">With 95% success rate</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-value">4.8/5</div>
              <div className="stat-title">User Rating</div>
              <div className="stat-desc">Trusted by citizens</div>
            </div>
          </div>
        </div>
      </section>

      {/* Security / Trust Section */}
      <section className="trust-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">Trust & Security</span>
            <h2 className="section-title">Your Data is Safe With Us</h2>
            <p className="section-subtitle">
              We follow the highest security standards to protect your personal information
            </p>
          </div>
          <div className="trust-grid">
            <div className="trust-card">
              <span className="trust-icon">🔒</span>
              <h3>End-to-End Encryption</h3>
              <p>All data is encrypted in transit and at rest using industry-standard protocols</p>
            </div>
            <div className="trust-card">
              <span className="trust-icon">🛡️</span>
              <h3>Government Compliant</h3>
              <p>Fully compliant with government data protection and privacy regulations</p>
            </div>
            <div className="trust-card">
              <span className="trust-icon">✅</span>
              <h3>Verified Information</h3>
              <p>All benefit information is sourced from official government databases</p>
            </div>
            <div className="trust-card">
              <span className="trust-icon">🔐</span>
              <h3>Secure Authentication</h3>
              <p>JWT-based authentication with bcrypt password hashing for maximum security</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="section-container">
          <div className="cta-content">
            <h2>Ready to Discover Your Benefits?</h2>
            <p>Join thousands of citizens who have already found and applied for benefits they deserve</p>
            <div className="cta-buttons">
              {isLoggedIn ? (
                <Link to="/eligibility" className="btn-primary-lg">
                  Check My Eligibility
                </Link>
              ) : (
                <Link to="/register" className="btn-primary-lg">
                  Create Free Account
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="section-container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="navbar-logo">
                <span className="logo-icon">⚡</span>
                <div className="logo-text">
                  <span className="logo-title">AI Civic</span>
                  <span className="logo-subtitle">Benefits Navigator</span>
                </div>
              </div>
              <p className="footer-desc">
                Empowering citizens to discover and access government benefits through AI-powered technology.
              </p>
            </div>
            <div className="footer-links-group">
              <h4>Platform</h4>
              <Link to="/benefits">Browse Benefits</Link>
              <Link to="/eligibility">Check Eligibility</Link>
              <Link to="/ai-help">AI Assistant</Link>
            </div>
            <div className="footer-links-group">
              <h4>Account</h4>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
              <Link to="/dashboard">Dashboard</Link>
            </div>
            <div className="footer-links-group">
              <h4>Support</h4>
              <a href="#">Help Center</a>
              <a href="#">Contact Us</a>
              <a href="#">Privacy Policy</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 AI Civic Benefits Navigator. All rights reserved. A Digital India Initiative.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
