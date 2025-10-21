import React from "react";
import "./CoachDashboard.css";

const CoachDashboard = () => {
  return (
    <div id="coach-dashboard">
      {/* Sidebar */}
      <aside id="sidebar">
        <h2 id="sidebar-title">Coach</h2>
        <ul id="sidebar-menu">
          <li id="menu-item-active">
            <span>🏠</span> Dashboard
          </li>
          <li id="menu-item">
            <span>👥</span> Students
          </li>
          <li id="menu-item">
            <span>📋</span> Attendance
          </li>
          <li id="menu-item">
            <span>📝</span> Post
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main id="main-content">
        <h1 id="welcome-text">Welcome, Senior Coach</h1>

        <div id="cards-container">
          {/* Notifications */}
          <div id="notification-card">
            <h3 id="card-title">Notifications</h3>
            <p id="card-text">No new notifications</p>
          </div>

          {/* Recent Updates */}
          <div id="update-card">
            <h3 id="card-title">Recent Updates</h3>
            <p id="card-text">
              Check out the latest match scores from the internal matches
            </p>
            <button id="view-scores-btn">VIEW SCORES</button>
          </div>

          {/* Attendance Summary */}
          <div id="attendance-card">
            <h3 id="card-title">Attendance Summary</h3>
            <div id="attendance-details">
              <p><strong>Today:</strong> 22 / 25 Present</p>
              <p><strong>This Week:</strong> 110 / 125</p>
              <p><strong>Overall Rate:</strong> 88%</p>
            </div>
          </div>

          {/* Student Progress Overview */}
          <div id="progress-card">
            <h3 id="card-title">Student Progress</h3>
            <div id="progress-bars">
              <div id="progress-item">
                <p>Batting</p>
                <div id="progress-bar-bg">
                  <div id="progress-fill" style={{ width: "80%" }}></div>
                </div>
              </div>
              <div id="progress-item">
                <p>Bowling</p>
                <div id="progress-bar-bg">
                  <div id="progress-fill" style={{ width: "65%" }}></div>
                </div>
              </div>
              <div id="progress-item">
                <p>Fielding</p>
                <div id="progress-bar-bg">
                  <div id="progress-fill" style={{ width: "90%" }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Match Stats */}
          <div id="match-stats-card">
            <h3 id="card-title">Match Statistics</h3>
            <div id="match-stats-grid">
              <div id="stat-box">
                <h4 id="stat-number">12</h4>
                <p id="stat-label">Matches Played</p>
              </div>
              <div id="stat-box">
                <h4 id="stat-number">8</h4>
                <p id="stat-label">Matches Won</p>
              </div>
              <div id="stat-box">
                <h4 id="stat-number">4</h4>
                <p id="stat-label">Matches Lost</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CoachDashboard;
