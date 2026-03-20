import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="about-wrapper">
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
          {/* ABOUT HEADER */}
          <div className="about-header">
            <h1>About SORTIFY</h1>
            <p className="subtitle">Revolutionizing Waste Management Through AI</p>
          </div>

          {/* MISSION SECTION */}
          <section className="about-section">
            <h2>Our Mission</h2>
            <div className="section-content">
              <p>
                SORTIFY is dedicated to transforming waste management through artificial intelligence and machine learning. 
                Our mission is to make waste classification accessible, accurate, and impactful for everyone, creating a 
                more sustainable future for our planet.
              </p>
              <p>
                We believe that proper waste segregation is the foundation of effective recycling and environmental protection. 
                By making it easy and rewarding, we empower individuals to make a positive impact every day.
              </p>
            </div>
          </section>

          {/* WASTE MANAGEMENT SECTION */}
          <section className="about-section">
            <h2>Understanding Waste Management</h2>
            <div className="section-content">
              <p>
                Waste management is a critical global challenge. Each year, billions of tons of waste end up in landfills, 
                causing environmental degradation and resource depletion. Proper waste classification and recycling can:
              </p>
              <ul className="benefits-list">
                <li>🌍 Reduce landfill pressure by up to 75%</li>
                <li>♻️ Recover valuable materials for reuse</li>
                <li>💨 Minimize greenhouse gas emissions</li>
                <li>💰 Create economic value from waste</li>
                <li>🌱 Conserve natural resources</li>
                <li>🏭 Reduce industrial production needs</li>
              </ul>
            </div>
          </section>

          {/* TYPES OF WASTE SECTION */}
          <section className="about-section">
            <h2>Types of Waste We Classify</h2>
            <div className="waste-types-grid">
              <div className="waste-type-card">
                <div className="waste-type-icon">📄</div>
                <h3>Paper</h3>
                <p>Includes newspapers, cardboard, magazines, and other paper products. Recyclable and biodegradable.</p>
                <div className="tips">
                  <strong>Tips:</strong> Remove plastic windows, flatten boxes, keep dry
                </div>
              </div>

              <div className="waste-type-card">
                <div className="waste-type-icon">🧴</div>
                <h3>Plastic</h3>
                <p>Plastic bottles, bags, containers, and packaging. Most common waste type requiring careful handling.</p>
                <div className="tips">
                  <strong>Tips:</strong> Rinse containers, remove caps, crush bottles to save space
                </div>
              </div>

              <div className="waste-type-card">
                <div className="waste-type-icon">🔩</div>
                <h3>Metal</h3>
                <p>Aluminum cans, steel containers, and metal scraps. Highly recyclable and valuable.</p>
                <div className="tips">
                  <strong>Tips:</strong> Rinse cans, separate iron from aluminum, remove sharp edges
                </div>
              </div>

              <div className="waste-type-card">
                <div className="waste-type-icon">🍾</div>
                <h3>Glass</h3>
                <p>Glass bottles, jars, and containers. Infinitely recyclable without quality loss.</p>
                <div className="tips">
                  <strong>Tips:</strong> Rinse thoroughly, separate by color if required, handle carefully
                </div>
              </div>

              <div className="waste-type-card">
                <div className="waste-type-icon">📦</div>
                <h3>Cardboard</h3>
                <p>Boxes, packaging materials, and corrugated cardboard. Important for protective recycling.</p>
                <div className="tips">
                  <strong>Tips:</strong> Flatten boxes, remove tape, keep dry before recycling
                </div>
              </div>

              <div className="waste-type-card">
                <div className="waste-type-icon">🗑️</div>
                <h3>Trash</h3>
                <p>Non-recyclable waste including food waste and contaminated materials. Requires proper disposal.</p>
                <div className="tips">
                  <strong>Tips:</strong> Separate organic from inorganic, compost when possible
                </div>
              </div>
            </div>
          </section>

          {/* WHY SORTIFY SECTION */}
          <section className="about-section">
            <h2>Why Choose SORTIFY?</h2>
            <div className="why-sortify-grid">
              <div className="why-card">
                <div className="why-icon">🤖</div>
                <h3>AI-Powered Accuracy</h3>
                <p>Our advanced machine learning model achieves 81.5% accuracy in waste classification, ensuring correct segregation.</p>
              </div>

              <div className="why-card">
                <div className="why-icon">⚡</div>
                <h3>Instant Results</h3>
                <p>Get classification results in real-time using your smartphone camera or image upload.</p>
              </div>

              <div className="why-card">
                <div className="why-icon">🏆</div>
                <h3>Earn Rewards</h3>
                <p>Contribute to sustainability and earn points that can be redeemed for exciting rewards.</p>
              </div>

              <div className="why-card">
                <div className="why-icon">📊</div>
                <h3>Track Impact</h3>
                <p>Monitor your environmental contribution with detailed analytics and progress visualization.</p>
              </div>

              <div className="why-card">
                <div className="why-icon">🌍</div>
                <h3>Make a Difference</h3>
                <p>Join thousands of users making a collective impact on environmental sustainability.</p>
              </div>

              <div className="why-card">
                <div className="why-icon">🔒</div>
                <h3>Safe & Secure</h3>
                <p>Your data is protected with enterprise-grade security and privacy measures.</p>
              </div>
            </div>
          </section>

          {/* ENVIRONMENTAL IMPACT SECTION */}
          <section className="about-section last-section">
            <h2>Your Environmental Impact Matters</h2>
            <div className="section-content">
              <p>
                Every waste item you classify and recycle contributes to a larger environmental movement. 
                Here's what we've achieved together:
              </p>
              <div className="impact-stats">
                <div className="stat">
                  <div className="stat-big">10,000+</div>
                  <div className="stat-label">Items Classified</div>
                </div>
                <div className="stat">
                  <div className="stat-big">500kg</div>
                  <div className="stat-label">CO₂ Emissions Prevented</div>
                </div>
                <div className="stat">
                  <div className="stat-big">1,000+</div>
                  <div className="stat-label">Active Participants</div>
                </div>
              </div>
              <p style={{marginTop: '32px'}}>
                Together, we're proving that technology and individual action can create meaningful environmental change. 
                <strong> Start your sustainable journey today with SORTIFY!</strong>
              </p>
              <Link to="/dashboard" className="cta-button primary" style={{marginTop: '32px'}}>
                <span className="button-icon">📸</span>
                Start Classifying Now
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
