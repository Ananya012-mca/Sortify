import "../styles.css";
import { Link } from "react-router-dom";
import profilePic from "../assets/images/profile.png";

export default function Profile() {
  const user = {
    name: "Ananya",
    email: "ananya@gmail.com",
    role: "User",
    phone: "+91 98765 43210",
    scans: 28,
    categories: 4,
    feedbacks: 6,
    points: 150
  };

  return (
    <div className="profile-page">
      <div className="profile-card wide">

        {/* HEADER */}
        <div className="profile-header">
          <img src={profilePic} alt="Profile" className="profile-pic" />
          <div>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <span className="role-badge">{user.role}</span>
          </div>
        </div>

        {/* DETAILS */}
        <div className="profile-details">
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>Total Scans:</strong> {user.scans}</p>
          <p><strong>Waste Categories Explored:</strong> {user.categories}</p>
          <p><strong>Feedback Given:</strong> {user.feedbacks}</p>
        </div>

        {/* ECO POINTS */}
        <div className="eco-points-banner">
          💎 You have <strong>{user.points}</strong> Eco Points
        </div>

        <Link to="/rewards" className="primary-btn">
          Redeem Rewards
        </Link>
      </div>
    </div>
  );
}
