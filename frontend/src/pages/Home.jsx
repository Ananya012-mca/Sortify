import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-wrapper">
      {/* SIDEBAR NAVIGATION */}
      <div className="sidebar">
        <div className="home-navigation">
          <div className="nav-item">
            <span className="nav-number">1.</span>
            <Link to="/" className="nav-link">Home</Link>
          </div>
          <div className="nav-item">
            <span className="nav-number">2.</span>
            <Link to="/dashboard" className="nav-link">Analytics</Link>
          </div>
          <div className="nav-item">
            <span className="nav-number">3.</span>
            <Link to="/upload" className="nav-link">Classify</Link>
          </div>
          <div className="nav-item">
            <span className="nav-number">4.</span>
            <Link to="/rewards" className="nav-link">Rewards</Link>
          </div>
          <div className="nav-item">
            <span className="nav-number">5.</span>
            <Link to="/profile" className="nav-link">Profile</Link>
          </div>
          <div className="nav-item">
            <span className="nav-number">6.</span>
            <button className="nav-link" style={{background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left'}} onClick={() => { localStorage.clear(); window.location.href = '/login'; }}>Logout</button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">
        <div className="content-inner">
        {/* HERO SECTION */}
        <div className="hero-section">
          <div className="hero-decoration">
            <div className="floating-icon">♻️</div>
            <div className="floating-icon delay-1">🌱</div>
            <div className="floating-icon delay-2">🌍</div>
            <div className="floating-icon delay-3">🚀</div>
          </div>

          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-icon">🎯</span>
              <span>AI-Powered Waste Classification</span>
            </div>

            <h1 className="brand-title">
              SORTIFY
              <span>Where Smartness Turns Trash into Treasure</span>
            </h1>

            <p className="hero-description">
              Join the revolution in sustainable waste management. Our advanced AI technology
              transforms how we classify, recycle, and reduce environmental impact.
              <strong> 81.5% accuracy</strong> in waste identification.
            </p>

            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Items Classified</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">500kg</div>
                <div className="stat-label">CO₂ Saved</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">1K+</div>
                <div className="stat-label">Happy Users</div>
              </div>
            </div>

            <div className="hero-actions">
              <Link to="/upload" className="cta-button primary">
                <span className="button-icon">📸</span>
                Classify
              </Link>
              <Link to="/about" className="cta-button secondary">
                <span className="button-icon">ℹ️</span>
                Learn About SORTIFY
              </Link>
            </div>
          </div>

          <div className="hero-visual">
            <div className="waste-icons">
              <div className="waste-item paper">📄</div>
              <div className="waste-item plastic">🧴</div>
              <div className="waste-item metal">🔩</div>
              <div className="waste-item glass">🍾</div>
              <div className="waste-item cardboard">📦</div>
            </div>
          </div>
        </div>

        {/* IMPACT QUOTE */}
        <div className="impact-quote">
          <div className="quote-container">
            <blockquote>
              "Every piece of waste you classify helps create a cleaner, greener planet.
              Your small actions today build a sustainable tomorrow."
            </blockquote>
            <cite>- SORTIFY Mission</cite>
          </div>
        </div>

        <div className="features-section">
          <h2>Why Choose SORTIFY?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Accurate Classification</h3>
              <p>Advanced AI technology ensures precise waste categorization with 81.5% accuracy</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Easy to Use</h3>
              <p>Simple upload or camera capture for instant results on any device</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌱</div>
              <h3>Eco-Friendly</h3>
              <p>Help reduce landfill waste through proper recycling and environmental education</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3>Earn Rewards</h3>
              <p>Get points for each classification and redeem rewards while making a difference</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Real-time Analytics</h3>
              <p>Track your environmental impact with detailed statistics and progress visualization</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3>Community Impact</h3>
              <p>Join thousands of users making a collective difference for our planet</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure & Private</h3>
              <p>Your data is protected with enterprise-grade security and privacy measures</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Lightning Fast</h3>
              <p>Get instant results with our optimized AI model running on cloud infrastructure</p>
            </div>
          </div>
        </div>

        <div className="categories">
          <h3>Supported Waste Categories</h3>
          <div className="category-list">
            <span>📄 Paper</span>
            <span>🧴 Plastic</span>
            <span>🔩 Metal</span>
            <span>🍾 Glass</span>
            <span>📦 Cardboard</span>
            <span>🗑️ Trash</span>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
