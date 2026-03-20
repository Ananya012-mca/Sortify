import React, { useEffect, useState, useContext, useRef } from "react";
import { PointsContext } from "../contexts/PointsContext";
import { useNavigate, Link } from "react-router-dom";
import API_BASE_URL from "../config";
import "./profile.css";

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    avatar: "",
  });

  const { points, setPoints } = useContext(PointsContext);
  const [items, setItems] = useState(0);
  const [stats, setStats] = useState({
    cardboard: 0,
    glass: 0,
    metal: 0,
    paper: 0,
    plastic: 0,
    trash: 0
  });
  const [history, setHistory] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const [profileRes, historyRes] = await Promise.all([
          fetch(`${API_BASE_URL}/profile`, {
            headers: { "Authorization": `Bearer ${token}` }
          }),
          fetch(`${API_BASE_URL}/history`, {
            headers: { "Authorization": `Bearer ${token}` }
          })
        ]);

        if (profileRes.ok && historyRes.ok) {
          const profileData = await profileRes.json();
          const historyData = await historyRes.json();

          setUser({
            name: profileData.name,
            email: profileData.email,
            avatar: profileData.avatar || localStorage.getItem("avatar") || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
          });
          setPhotos(profileData.additional_images || []);
          setEditName(profileData.name);
          setPoints(profileData.points || 0);
          setStats(profileData.stats || {
            cardboard: 0,
            glass: 0,
            metal: 0,
            paper: 0,
            plastic: 0,
            trash: 0
          });
          setItems(historyData.length);
          setHistory(historyData.slice(0, 3)); // Keep last 3 for snippet
        } else if (profileRes.status === 401) {
          localStorage.clear();
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [navigate]);

  const avatarInputRef = useRef(null);
  const addPhotoInputRef = useRef(null);

  const [photos, setPhotos] = useState([]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/profile/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name: editName })
      });

      if (response.ok) {
        setUser({ ...user, name: editName });
        setIsEditing(false);
        alert("Profile updated successfully!");
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const token = localStorage.getItem("token");
    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch(`${API_BASE_URL}/profile/avatar`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: form,
      });
      const data = await res.json();
      if (res.ok) {
        setUser((u) => ({ ...u, avatar: data.avatar }));
        localStorage.setItem("avatar", data.avatar);
        alert("Avatar updated");
      } else {
        alert(data.error || data.message || "Failed to upload avatar");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading avatar");
    }
  };

  const handleAddPhoto = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const token = localStorage.getItem("token");
    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch(`${API_BASE_URL}/profile/photos`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: form,
      });
      const data = await res.json();
      if (res.ok) {
        // server returns the new photo URL or the updated list
        if (data.added_photo) {
          setPhotos((p) => [data.added_photo, ...p]);
        } else if (Array.isArray(data.additional_images)) {
          setPhotos(data.additional_images);
        }
        alert("Photo added to your profile");
      } else {
        alert(data.error || "Failed to add photo");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading photo");
    }
  };

  const level = Math.floor(points / 100) + 1;
  const progress = points % 100;

  const achievements = [
    { id: 1, title: "First Sort", icon: "🌱", unlocked: items > 0 },
    { id: 2, title: "Points Collector", icon: "💰", unlocked: points >= 100 },
    { id: 3, title: "CO2 Hero", icon: "🛡️", unlocked: items >= 10 },
    { id: 4, title: "Eco Master", icon: "👑", unlocked: level >= 5 },
  ];

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
    <div className="profile-container">
      {/* MAIN PROFILE CARD */}
      <div className="profile-card-main">
        <div className="profile-banner">
          <div className="banner-circles"></div>
        </div>
        
        <div className="profile-info-section">
          <div className="profile-avatar-wrapper">
            <img 
              src={user.avatar} 
              alt="Profile" 
              className="profile-avatar"
            />
            <div className="level-badge-overlay">{level}</div>
          </div>
          <div className="avatar-actions">
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              ref={avatarInputRef}
              onChange={handleAvatarChange}
            />
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              ref={addPhotoInputRef}
              onChange={handleAddPhoto}
            />
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '12px' }}>
              <button className="edit-profile-btn" onClick={() => avatarInputRef.current && avatarInputRef.current.click()}>Change Avatar</button>
              <button className="edit-profile-btn" onClick={() => addPhotoInputRef.current && addPhotoInputRef.current.click()}>Add Photo</button>
            </div>
          </div>

          {photos && photos.length > 0 && (
            <div className="photo-gallery" style={{ marginTop: 18 }}>
              {photos.map((p, i) => (
                <img key={i} src={p} alt={`photo-${i}`} className="gallery-thumb" />
              ))}
            </div>
          )}
          
          <div className="profile-identity">
            {isEditing ? (
              <form onSubmit={handleUpdateProfile} className="edit-profile-form">
                <input 
                  type="text" 
                  value={editName} 
                  onChange={(e) => setEditName(e.target.value)}
                  className="edit-name-input"
                  autoFocus
                />
                <div className="edit-actions">
                  <button type="submit" className="save-btn">Save</button>
                  <button type="button" onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <h1 className="profile-name">{user.name}</h1>
                <p className="profile-email">{user.email}</p>
                <button onClick={() => setIsEditing(true)} className="edit-profile-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  Edit Profile
                </button>
              </>
            )}
          </div>
          
          <div className="profile-progress-container">
            <div className="progress-labels">
              <span>Level {level}</span>
              <span>{progress}% to Level {level + 1}</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          <div className="profile-badges">
            <span className="profile-badge eco-warrior">
              <span>🌱</span> Eco Warrior
            </span>
            <span className="profile-badge verified">
              <span>✅</span> Verified Hero
            </span>
          </div>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="profile-stats-grid">
        <div className="stat-card">
          <div className="stat-glow"></div>
          <span className="stat-icon">✨</span>
          <span className="stat-value">{points}</span>
          <span className="stat-label">Total Points</span>
        </div>

        <div className="stat-card">
          <div className="stat-glow"></div>
          <span className="stat-icon">♻️</span>
          <span className="stat-value">{items}</span>
          <span className="stat-label">Items Sorted</span>
        </div>

        <div className="stat-card">
          <div className="stat-glow"></div>
          <span className="stat-icon">🌍</span>
          <span className="stat-value">{Math.round(items * 0.5 * 10) / 10}kg</span>
          <span className="stat-label">CO2 Saved</span>
        </div>
      </div>

      {/* IMPACT SECTION */}
      <div className="profile-section impact-section">
        <h3 className="section-title">Your Impact</h3>
        <div className="impact-grid">
          {['cardboard', 'glass', 'metal', 'paper', 'plastic', 'trash'].map((category) => (
            <div key={category} className="impact-item">
              <span className="impact-category">{category.toUpperCase()}</span>
              <div className="impact-count-wrapper">
                <span className="impact-count">{stats[category] || 0}</span>
                <span className="impact-unit">items</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="profile-secondary-grid">
        {/* ACHIEVEMENTS */}
        <div className="profile-section achievements-section">
          <h3 className="section-title">Achievements</h3>
          <div className="achievements-grid">
            {achievements.map(ach => (
              <div key={ach.id} className={`achievement-item ${ach.unlocked ? 'unlocked' : 'locked'}`}>
                <span className="achievement-icon">{ach.icon}</span>
                <span className="achievement-title">{ach.title}</span>
                {!ach.unlocked && <span className="lock-icon">🔒</span>}
              </div>
            ))}
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="profile-section recent-activity-section">
          <h3 className="section-title">Recent Activity</h3>
          <div className="activity-mini-list">
            {history.length > 0 ? history.map((item, idx) => (
              <div key={idx} className="activity-mini-item">
                <span className="activity-dot"></span>
                <div className="activity-mini-info">
                  <p className="activity-mini-cat">{item.category}</p>
                  <p className="activity-mini-time">{new Date(item.timestamp).toLocaleDateString()}</p>
                </div>
                <span className="activity-mini-points">+10</span>
              </div>
            )) : (
              <p className="empty-text">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
