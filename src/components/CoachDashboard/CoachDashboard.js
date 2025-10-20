import React from "react";
import "./CoachDashboard.css";

const CoachDashboard = () => {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h4>Coach</h4>
        <ul>
          <li>Student List</li>
          <li>Training Sessions</li>
          <li>Match Records</li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <h5>Welcome, Coach</h5>
        </header>
        <section className="content">
          <h3>Coach Dashboard</h3>
          <p>Track students and manage training sessions.</p>
        </section>
      </main>
    </div>
  );
};

export default CoachDashboard;
