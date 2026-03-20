import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../config";
import "./activity.css";

const Activity = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Enhanced environmental impact data
  const CATEGORY_CONFIG = {
    paper: { 
      name: "Paper", 
      icon: "📄", 
      co2Savings: 0.3, // kg CO2
      waterSaved: 2.5, // liters
      energySaved: 0.08, // kWh
      landfillReduced: 0.1, // kg
      treesSaved: 0.002,
      cleanlinessScore: 85
    },
    plastic: { 
      name: "Plastic", 
      icon: "🧴", 
      co2Savings: 0.5,
      waterSaved: 5.0,
      energySaved: 0.12,
      landfillReduced: 0.05,
      treesSaved: 0.001,
      cleanlinessScore: 90
    },
    metal: { 
      name: "Metal", 
      icon: "🥫", 
      co2Savings: 0.6,
      waterSaved: 3.0,
      energySaved: 0.15,
      landfillReduced: 0.08,
      treesSaved: 0.001,
      cleanlinessScore: 88
    },
    glass: { 
      name: "Glass", 
      icon: "🍾", 
      co2Savings: 0.4,
      waterSaved: 4.0,
      energySaved: 0.1,
      landfillReduced: 0.15,
      treesSaved: 0.0,
      cleanlinessScore: 92
    },
    cardboard: { 
      name: "Cardboard", 
      icon: "📦", 
      co2Savings: 0.3,
      waterSaved: 2.0,
      energySaved: 0.08,
      landfillReduced: 0.12,
      treesSaved: 0.003,
      cleanlinessScore: 87
    },
    trash: { 
      name: "Trash", 
      icon: "🗑️", 
      co2Savings: 0,
      waterSaved: 0,
      energySaved: 0,
      landfillReduced: 0,
      treesSaved: 0,
      cleanlinessScore: 0
    },
  };

  const categoryIcons = {
    paper: "📄",
    plastic: "🧴",
    metal: "🔩",
    glass: "🍾",
    cardboard: "📦",
    trash: "🗑️",
  };

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch(`${API_BASE_URL}/history`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setHistory(data);
        }
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleString();
  };

  // Calculate total environmental impact
  const calculateEnvironmentalImpact = () => {
    let totalCO2 = 0;
    let totalWater = 0;
    let totalEnergy = 0;
    let totalLandfill = 0;
    let totalTrees = 0;
    let totalCleanlinessScore = 0;
    let recyclableItems = 0;

    history.forEach(item => {
      const config = CATEGORY_CONFIG[item.category?.toLowerCase()];
      if (config && item.category?.toLowerCase() !== 'trash') {
        totalCO2 += config.co2Savings;
        totalWater += config.waterSaved;
        totalEnergy += config.energySaved;
        totalLandfill += config.landfillReduced;
        totalTrees += config.treesSaved;
        totalCleanlinessScore += config.cleanlinessScore;
        recyclableItems += 1;
      }
    });

    const avgCleanlinessScore = recyclableItems > 0 
      ? (totalCleanlinessScore / recyclableItems).toFixed(1) 
      : 0;

    return {
      totalCO2: totalCO2.toFixed(2),
      totalWater: totalWater.toFixed(1),
      totalEnergy: totalEnergy.toFixed(2),
      totalLandfill: totalLandfill.toFixed(2),
      totalTrees: totalTrees.toFixed(3),
      avgCleanlinessScore,
      recyclableItems,
      totalItems: history.length
    };
  };

  if (loading) return (
    <div className="home-wrapper">
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
      <div className="main-content">
        <div className="content-inner">
          <div className="activity-container">
            <div className="activity-header">
              <h1>Activity & Environmental Impact</h1>
              <p>Loading your recycling history and environmental impact...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="home-wrapper">
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
      <div className="main-content">
        <div className="content-inner">
    <div className="activity-container">
      <div className="activity-header">
        <h1>Activity Log <span className="header-icon">🕒</span></h1>
        <p>Review your classifications and environmental impact.</p>
      </div>

      {history.length > 0 && (() => {
        const impact = calculateEnvironmentalImpact();
        return (
          <div className="environmental-impact-section">
            <div className="impact-header">
              <h2>🌍 Your Environmental Impact</h2>
              <p>How much pollution you've reduced and cleanliness you've maintained</p>
            </div>

            <div className="impact-stats-grid">
              <div className="impact-card pollution-reduced">
                <div className="impact-icon">💨</div>
                <div className="impact-content">
                  <h3>Pollution Reduced</h3>
                  <p className="impact-value">{impact.totalCO2} kg</p>
                  <p className="impact-label">CO₂ Emissions Prevented</p>
                </div>
              </div>

              <div className="impact-card water-saved">
                <div className="impact-icon">💧</div>
                <div className="impact-content">
                  <h3>Water Conserved</h3>
                  <p className="impact-value">{impact.totalWater} L</p>
                  <p className="impact-label">Liters Saved</p>
                </div>
              </div>

              <div className="impact-card energy-saved">
                <div className="impact-icon">⚡</div>
                <div className="impact-content">
                  <h3>Energy Saved</h3>
                  <p className="impact-value">{impact.totalEnergy} kWh</p>
                  <p className="impact-label">Kilowatt Hours</p>
                </div>
              </div>

              <div className="impact-card landfill-reduced">
                <div className="impact-icon">🏔️</div>
                <div className="impact-content">
                  <h3>Landfill Diverted</h3>
                  <p className="impact-value">{impact.totalLandfill} kg</p>
                  <p className="impact-label">Waste from Landfill</p>
                </div>
              </div>

              <div className="impact-card trees-saved">
                <div className="impact-icon">🌳</div>
                <div className="impact-content">
                  <h3>Trees Preserved</h3>
                  <p className="impact-value">{impact.totalTrees}</p>
                  <p className="impact-label">Equivalent Trees Saved</p>
                </div>
              </div>

              <div className="impact-card cleanliness-score">
                <div className="impact-icon">🧹</div>
                <div className="impact-content">
                  <h3>Cleanliness Score</h3>
                  <p className="impact-value">{impact.avgCleanlinessScore}/100</p>
                  <p className="impact-label">Environmental Responsibility</p>
                </div>
              </div>
            </div>

            <div className="impact-summary">
              <div className="summary-item">
                <span className="summary-label">Total Items Classified:</span>
                <span className="summary-value">{impact.totalItems}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Recyclable Items:</span>
                <span className="summary-value">{impact.recyclableItems}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Recycling Rate:</span>
                <span className="summary-value">{impact.totalItems > 0 ? ((impact.recyclableItems / impact.totalItems) * 100).toFixed(1) : 0}%</span>
              </div>
            </div>
          </div>
        );
      })()}

      {history.length === 0 ? (
        <div className="no-history">
          <span>♻️</span>
          <h3>No activity yet</h3>
          <p>Start classifying waste to build your history and see your environmental impact!</p>
        </div>
      ) : (
        <div className="activity-history">
          <h2>Classification History</h2>
          <ul className="activity-list">
            {history.map((item, index) => (
              <li key={index} className="activity-item">
                <div className="activity-info">
                  <div className="category-icon">
                    {categoryIcons[item.category.toLowerCase()] || "❓"}
                  </div>
                  <div className="item-details">
                    <h3>{item.category}</h3>
                    <p>Classification #{history.length - index}</p>
                  </div>
                </div>
                
                <div className="activity-meta">
                  <span className="confidence-badge">
                    {item.confidence}% Match
                  </span>
                  <span className="item-date">
                    {formatDate(item.timestamp)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
        </div>
      </div>
    </div>
  );
};

export default Activity;
