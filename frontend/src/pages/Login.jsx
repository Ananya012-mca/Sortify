import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles.css";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    role: "User",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      alert("Please fill all required fields");
      return;
    }

    console.log("Login Data:", form);

    // Temporary logic
    alert(`${form.role} login successful ✅`);
    navigate("/");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* LOGO */}
        <h2 className="brand">♻️ Sortify</h2>
        <p className="subtitle">Smart Waste Segregation Platform</p>

        {/* LOGIN FORM */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Login As *</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
            >
              <option>User</option>
              <option>Admin</option>
            </select>
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="primary-btn">
            Login
          </button>
        </form>

        {/* LINKS */}
        <div className="switch-text">
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>

        <div className="switch-text">
          Don&apos;t have an account? <Link to="/signup">Create Account</Link>
        </div>
      </div>
    </div>
  );
}
