import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const LoginModal = ({ closeModal, setUser }) => {
  const [role, setRole] = useState("student");
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: formData.username, password: formData.password, role }),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Send user info directly to Navbar state
        setUser(data.user);

        // Navigate based on role
        if (role === "student") navigate("/student-dashboard");
        else if (role === "coach") navigate("/coach-dashboard");
        else if (role === "srCoach") navigate("/srcoach-dashboard");

        closeModal();
      } else {
        setError(data.message || "Invalid username or password");
      }
    } catch (err) {
      setError("Server error. Try again later.");
    }
  };

  return (
    <div id="modal-overlay" onClick={closeModal} className={darkMode ? "dark" : ""}>
      <div id="login-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 id="modal-title">3SPORTS Login</h2>
          <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>

        <div id="role-selector">
          {["student", "coach", "srCoach"].map((r) => (
            <label key={r}>
              <input
                type="radio"
                name="role"
                value={r}
                checked={role === r}
                onChange={() => setRole(r)}
              />
              {r === "srCoach" ? "Sr. Coach" : r.charAt(0).toUpperCase() + r.slice(1)}
            </label>
          ))}
        </div>

        <form id="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button id="submit-btn" type="submit">
            Login as {role === "srCoach" ? "Senior Coach" : role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        </form>

        {error && <p id="error-message">{error}</p>}

        <button id="close-btn" onClick={closeModal}>✖ Close</button>
      </div>
    </div>
  );
};

export default LoginModal;
