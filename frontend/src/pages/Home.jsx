import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";

// How it works images
import snapPhoto from "../assets/images/snap-photo.png";
import instantResult from "../assets/images/instant-result.png";
import disposeProperly from "../assets/images/dispose-properly.png";

// Waste category images
import plastic from "../assets/images/plastic.png";
import food from "../assets/images/food.png";
import ewaste from "../assets/images/e-waste.png";
import hazardous from "../assets/images/hazardous.png";

export default function Home() {
  const navigate = useNavigate();

  const [showFeedback, setShowFeedback] = useState(false);

  const [feedback, setFeedback] = useState({
    easeOfUse: "",
    accuracy: "",
    recommendation: "",
    comments: ""
  });

  const handleChange = (e) => {
    setFeedback({ ...feedback, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User Feedback:", feedback);
    alert("Thank you for your feedback! 🌱");
    setShowFeedback(false);
  };

  return (
    <>
      {/* HEADER */}
      <header className="main-header">
        <div className="logo">♻️ Sortify</div>
        <nav className="nav-actions">
          <button className="nav-btn">🔔 Notifications</button>
          <a href="/signup" className="nav-btn">Sign Up</a>
          <a href="/login" className="nav-btn">Login</a>
        </nav>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="hero-text">
          <h1>Welcome to Sortify!</h1>
          <p>Smart Waste Management Made Easy</p>
        </div>
      </section>

      {/* HOW SORTIFY WORKS */}
      <section className="section">
        <h2>How Sortify Works</h2>
        <div className="card-grid">
          <div className="info-card">
            <img src={snapPhoto} alt="Snap a Photo" />
          </div>
          <div className="info-card">
            <img src={instantResult} alt="Instant Results" />
          </div>
          <div className="info-card">
            <img src={disposeProperly} alt="Dispose Properly" />
          </div>
        </div>
      </section>

      {/* LEARN ABOUT WASTE */}
      <section className="section">
        <h2>Learn About Waste</h2>
        <div className="card-grid">
          <div
            className="info-card"
            onClick={() => navigate("/waste/plastic")}
            style={{ cursor: "pointer" }}
          >
            <img src={plastic} alt="Plastic Waste" />
          </div>

          <div
            className="info-card"
            onClick={() => navigate("/waste/food")}
            style={{ cursor: "pointer" }}
          >
            <img src={food} alt="Food Waste" />
          </div>

          <div
            className="info-card"
            onClick={() => navigate("/waste/ewaste")}
            style={{ cursor: "pointer" }}
          >
            <img src={ewaste} alt="E-Waste" />
          </div>

          <div
            className="info-card"
            onClick={() => navigate("/waste/hazardous")}
            style={{ cursor: "pointer" }}
          >
            <img src={hazardous} alt="Hazardous Waste" />
          </div>
        </div>
      </section>

      {/* FEEDBACK */}
      <section className="section feedback">
        <h2>Feedback</h2>
        <p>We value your feedback!</p>

        <button
          className="primary-btn feedback-btn"
          onClick={() => setShowFeedback(true)}
        >
          Share Your Thoughts
        </button>

        {showFeedback && (
          <form className="feedback-form" onSubmit={handleSubmit}>
            <h3>Help us improve Sortify ♻️</h3>

            <label>How easy is Sortify to use?</label>
            <select name="easeOfUse" required onChange={handleChange}>
              <option value="">Select</option>
              <option>Very Easy</option>
              <option>Easy</option>
              <option>Average</option>
              <option>Difficult</option>
            </select>

            <label>How accurate are the waste results?</label>
            <select name="accuracy" required onChange={handleChange}>
              <option value="">Select</option>
              <option>Very Accurate</option>
              <option>Accurate</option>
              <option>Needs Improvement</option>
            </select>

            <label>Would you recommend Sortify?</label>
            <select name="recommendation" required onChange={handleChange}>
              <option value="">Select</option>
              <option>Yes</option>
              <option>Maybe</option>
              <option>No</option>
            </select>

            <label>Your Comments</label>
            <textarea
              name="comments"
              rows="4"
              placeholder="Share your experience..."
              onChange={handleChange}
            />

            <button type="submit" className="primary-btn">
              Submit Feedback
            </button>
          </form>
        )}
      </section>

      {/* CONTACT */}
      <section className="section contact">
        <h2>Contact Us</h2>
        <div className="contact-box">
          <p>📧 support@sortify.com</p>
          <p>📞 +1 234 567 890</p>
        </div>
        <div className="socials">
          <span>🌐</span>
          <span>📘</span>
          <span>📸</span>
        </div>
      </section>
    </>
  );
}
