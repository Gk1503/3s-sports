import React, { useState } from "react";
import { useNavigate} from "react-router-dom";
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
        body: JSON.stringify({ username: formData.username, password: formData.password }),
      });

      const data = await res.json();

      if (res.ok) {
  const userData = {
    _id: data._id,
    username: data.username,
    role: data.role,
    token: data.token,   // ✅ include token
    isLoggedIn: true,
  };

  localStorage.setItem("user", JSON.stringify(userData)); // ✅ save in localStorage

  setUser(userData); // (optional, if parent tracks it)
  closeModal();

  // Navigate immediately - don't wait for anything
  setTimeout(() => {
    switch (data.role) {
    case "student":
      navigate("/student-dashboard");
      break;
    case "coach":
      navigate("/coach-dashboard");
      break;
    case "seniorCoach": // ✅ fixed
      navigate("/srcoach-dashboard");
      break;
    default:
      navigate("/");
    }
  }, 0);
      } else {
        setError(data.message || "Login failed. Please check credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Could not connect to server: " + err.message);
    }
  };

  return (
    <div id="modal-overlay" onClick={closeModal} className={darkMode ? "dark" : ""}>
      <div id="login-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 id="modal-title">ELITE SPORTS Login</h2>
          <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>

        <div id="role-selector">
  {["student", "coach", "seniorCoach"].map((r) => (
    <label key={r}>
      <input
        type="radio"
        name="role"
        value={r}
        checked={role === r}
        onChange={() => setRole(r)}
      />
      {r === "seniorCoach" ? "Sr. Coach" : r.charAt(0).toUpperCase() + r.slice(1)}
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
            Login as {role === "Sr. Coach" ? "Senior Coach" : role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        </form>

        {error && <p id="error-message">{error}</p>}

        <button id="close-btn" onClick={closeModal}>✖ Close</button>
      </div>
    </div>
  );
};

export default LoginModal;
