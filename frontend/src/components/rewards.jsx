import React, { useState, useEffect, useContext } from "react";
import { PointsContext } from "../contexts/PointsContext";
import { Link } from "react-router-dom";
import API_BASE_URL from "../config";

const Rewards = () => {
  const { points, setPoints } = useContext(PointsContext);
  const [rewards, setRewards] = useState([]);
  const [redemptions, setRedemptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        // Fetch points
        const profileRes = await fetch(`${API_BASE_URL}/profile`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (profileRes.ok) {
          const data = await profileRes.json();
          setPoints(data.points || 0);
        }

        // Fetch rewards
        const rewardsRes = await fetch(`${API_BASE_URL}/rewards`);
        if (rewardsRes.ok) {
          const data = await rewardsRes.json();
          setRewards(data);
        }

        // Fetch redemption history
        const redemptionsRes = await fetch(`${API_BASE_URL}/redemptions`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (redemptionsRes.ok) {
          const data = await redemptionsRes.json();
          setRedemptions(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const redeemReward = async (reward) => {
    if (points < reward.cost) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/redeem`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          cost: reward.cost,
          reward_id: reward.id,
          reward_title: reward.title
        })
      });

      const data = await response.json();

      if (response.ok) {
      setPoints(data.new_points);
      localStorage.setItem("points", data.new_points);
        
        // Refresh redemptions
        const redemptionsRes = await fetch(`${API_BASE_URL}/redemptions`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (redemptionsRes.ok) {
          const redData = await redemptionsRes.json();
          setRedemptions(redData);
        }

        alert("Reward redeemed successfully 🎉");
      } else {
        alert(data.error || "Redemption failed");
      }
    } catch (error) {
      console.error("Redeem error:", error);
      alert("An error occurred during redemption");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString();
  };

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
    <div className="rewards-page">
      <div className="rewards-header">
        <h1>Eco-Rewards 🌿</h1>
        <p>Turn your recycling efforts into amazing prizes!</p>
      </div>

      <div className="points-container">
        <div className="points-card">
          <span className="points-icon">💎</span>
          <div className="points-info">
            <p className="points-label">Your Balance</p>
            <h2 className="points-value">{points} <span>Points</span></h2>
          </div>
        </div>
      </div>

      <div className="rewards-grid">
        {rewards.map((reward) => (
          <div key={reward.id} className="reward-card">
            <div className="reward-image-container">
              <img src={reward.image} alt={reward.title} />
              <div className="reward-badge">💎 {reward.cost}</div>
            </div>

            <div className="reward-content">
              <h3>{reward.title}</h3>
              <p>{reward.description}</p>

              <button
                className={
                  points >= reward.cost ? "redeem-btn" : "redeem-btn disabled"
                }
                onClick={() => redeemReward(reward)}
                disabled={points < reward.cost}
              >
                {points >= reward.cost ? "Redeem Reward" : "Earn More Points"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {redemptions.length > 0 && (
        <div className="redemption-history">
          <h2 className="history-title">Redemption History 🕒</h2>
          <div className="history-list">
            {redemptions.map((redemption, index) => (
              <div key={index} className="history-item">
                <div className="history-info">
                  <span className="history-reward">{redemption.reward_title}</span>
                  <span className="history-date">
                    {formatDate(redemption.timestamp)}
                  </span>
                </div>
                <div className="history-cost">
                  - {redemption.cost} 💎
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
        </div>
      </div>
    </div>
  );
};

export default Rewards;
