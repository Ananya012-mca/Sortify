import React from "react";
import { Link } from "react-router-dom";
import Chatbot from "../components/chatbot";
import "./ChatbotPage.css";

const ChatbotPage = () => {
  return (
    <div className="chatbot-wrapper">
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
        <div className="chatbot-page">
          <div className="chatbot-page-container">
            <div className="chatbot-page-header">
              <h1>💬 Waste Classification Assistant</h1>
              <p>Get instant help about waste classification, recycling tips, and environmental guidance</p>
            </div>

            <div className="chatbot-content">
              <Chatbot />
            </div>

            <div className="chatbot-footer">
              <div className="footer-tips">
                <div className="tips-header">
                  <span className="tips-icon">💡</span>
                  <h3>Quick Tips</h3>
                </div>
                <div className="tips-grid">
                  <div className="tip-item">
                    <span className="tip-check">✓</span>
                    <p>Ask about specific waste categories <strong>(cardboard, glass, metal, paper, plastic)</strong></p>
                  </div>
                  <div className="tip-item">
                    <span className="tip-check">✓</span>
                    <p>Request <strong>recycling tips</strong> for any waste type</p>
                  </div>
                  <div className="tip-item">
                    <span className="tip-check">✓</span>
                    <p>Get <strong>creative reuse ideas</strong> to reduce waste</p>
                  </div>
                  <div className="tip-item">
                    <span className="tip-check">✓</span>
                    <p>Ask <strong>FAQs</strong> about recycling practices</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
