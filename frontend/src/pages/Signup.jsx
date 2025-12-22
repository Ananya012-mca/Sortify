import { useState } from "react";
import "../styles.css";

export default function Signup() {
  const [role, setRole] = useState("user");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    altPhone: "",
    address: ""
  });

  // HANDLE INPUT CHANGE
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // HANDLE SUBMIT
  function handleSubmit(e) {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    users.push({
      role,
      ...form
    });

    localStorage.setItem("users", JSON.stringify(users));

    alert("Signup successful! Please login.");
    window.location.href = "/login";
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="brand">♻️ Sortify</h2>
        <p className="subtitle">Smart Waste Segregation Platform</p>

        <h3>Create Account</h3>

        {/* ROLE SELECT */}
        <div className="form-group">
          <label>Register As *</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">User (Citizen / Business)</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* FULL NAME */}
        <div className="form-group">
          <label>Full Name *</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            required
            onChange={handleChange}
          />
        </div>

        {/* EMAIL */}
        <div className="form-group">
          <label>Email Address *</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            required
            onChange={handleChange}
          />
        </div>

        {/* PASSWORD */}
        <div className="form-group">
          <label>Password *</label>
          <input
            type="password"
            name="password"
            placeholder="Create password"
            required
            onChange={handleChange}
          />
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="form-group">
          <label>Confirm Password *</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Re-enter password"
            required
            onChange={handleChange}
          />
        </div>

        {/* PHONE */}
        <div className="form-group">
          <label>Phone Number *</label>
          <input
            type="tel"
            name="phone"
            placeholder="Primary phone number"
            required
            onChange={handleChange}
          />
        </div>

        {/* OPTIONAL PHONE */}
        <div className="form-group">
          <label>Additional Phone Number (Optional)</label>
          <input
            type="tel"
            name="altPhone"
            placeholder="Secondary phone number (optional)"
            onChange={handleChange}
          />
        </div>

        {/* ADDRESS */}
        <div className="form-group">
          <label>Address *</label>
          <textarea
            rows="3"
            name="address"
            placeholder="Enter your full address"
            required
            onChange={handleChange}
          />
        </div>

        {/* ADMIN NOTE */}
        {role === "admin" && (
          <p className="admin-note">
            Admin accounts are reviewed and approved by the system.
          </p>
        )}

        {/* SUBMIT */}
        <button className="primary-btn" onClick={handleSubmit}>
          {role === "admin"
            ? "Create Admin Account"
            : "Create User Account"}
        </button>

        <p className="switch-text">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}
