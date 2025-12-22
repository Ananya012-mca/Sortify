import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import "../styles.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <div className="dashboard-page">
      <h2 className="dashboard-title">👋 Welcome back, {user.name}</h2>

      {/* STATS */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <span>💎</span>
          <h3>{user.points}</h3>
          <p>Eco Points</p>
        </div>
        <div className="stat-card">
          <span>📸</span>
          <h3>{user.scans}</h3>
          <p>Total Scans</p>
        </div>
        <div className="stat-card">
          <span>♻️</span>
          <h3>{user.categories}</h3>
          <p>Categories Explored</p>
        </div>
        <div className="stat-card">
          <span>📝</span>
          <h3>{user.feedbacks}</h3>
          <p>Feedback Given</p>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="dashboard-actions">
        <button onClick={() => navigate("/")}>📷 Scan Waste</button>
        <button onClick={() => navigate("/profile")}>👤 Profile</button>
        <button onClick={() => navigate("/rewards")}>🎁 Rewards</button>
        <button onClick={() => navigate("/")}>💬 Feedback</button>
      </div>

      {/* RECENT ACTIVITY */}
      <div className="dashboard-activity">
        <h3>Recent Activity</h3>
        <ul>
          {user.activity.slice(0, 5).map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
