import { useState } from "react";
import "../styles.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email");
      return;
    }

    // Simulate email sent
    setSent(true);
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="brand">♻️ Sortify</h2>
        <p className="subtitle">Password Recovery</p>

        {!sent ? (
          <>
            <h3>Forgot Password</h3>

            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button className="primary-btn" onClick={handleSubmit}>
              Send Reset Link
            </button>
          </>
        ) : (
          <>
            <h3>Check Your Email</h3>
            <p style={{ textAlign: "center", fontSize: "14px", color: "#555" }}>
              A password reset link has been sent to <strong>{email}</strong>.
            </p>

            <p className="switch-text">
              <a href="/login">Back to Login</a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
