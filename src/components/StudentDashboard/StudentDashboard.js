import React, { useEffect, useState } from "react";
import "./StudentDashboard.css";

const StudentDashboard = ({ user, token }) => {
  const [student, setStudent] = useState({
    name: "Student Name",
    batch: "N/A",
    batchTime: "N/A",
    photo: "",
    attendance: [],
    progress: { batting: 0, bowling: 0, diet: 0, fitness: 0 },
    fees: { total: 0, paid: 0, due: 0 },
  });
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [formData, setFormData] = useState({ name: "" });

 useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return;
  fetch("http://localhost:5000/api/students/me", {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(res => res.json())
    .then(data => setStudent(data));
}, []);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetchStudentData(token); // Call fetchStudentData with token
}, []);

  const fetchStudentData = async (token) => {
    try {
      const res = await fetch("http://localhost:5000/api/students/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setStudent(data);
        setProfileImage(data.photo || "");
        setFormData({ name: data.name });
      } else {
       console.error("Failed to fetch student data");
      }
    } catch (err) {
      console.error("Failed to fetch student data", err);
    }
  };

const handleProfileSave = async () => {
    const token = localStorage.getItem("token");
    const form = new FormData();
    // The backend expects 'name' and 'profileImage'. It uses the URL path ID for the user to update.
    form.append("name", formData.name); 
    if (profileImage instanceof File) form.append("profileImage", profileImage);

    // **IMPORTANT:** Use the user ID to hit the profile update endpoint
    const res = await fetch(`http://localhost:5000/api/srcoach/update-profile/${user._id}`, { // Assuming 'user' is the prop containing the logged-in User object
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
        // NOTE: Do NOT set 'Content-Type': 'application/json' when using FormData for file uploads.
    });

    if (res.ok) {
        const updatedStudent = await res.json();
        setStudent(updatedStudent); // Set the entire updated student object
        setProfileImage(updatedStudent.photo || "");
        setShowProfileEdit(false);
    } else {
        console.error("Profile update failed");
    }
};

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const totalPresent = student.attendance?.filter(a => a.status === "Present").length || 0;

  return (
    <div id="student-dashboard">
      {/* Sidebar */}
      <aside id="dashboard-sidebar">
        <div id="profile-section">
          <img
            src={
              profileImage instanceof File
                ? URL.createObjectURL(profileImage)
                : profileImage || "https://via.placeholder.com/150"
            }
            alt={student.name}
            id="sidebar-profile-img"
          />
          <p id="sidebar-profile-name">{student.name}</p>
          <button
            id="edit-profile-btn"
            onClick={() => setShowProfileEdit(!showProfileEdit)}
          >
            {showProfileEdit ? "Close" : "Edit Profile"}
          </button>
        </div>

        {showProfileEdit && (
          <div id="profile-edit-section">
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              id="profile-name-input"
            />
            <label htmlFor="profile-image-upload" id="profile-upload-label">
              Upload Photo
            </label>
            <input
              type="file"
              id="profile-image-upload"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
            <button id="save-profile-btn" onClick={handleProfileSave}>Save</button>
          </div>
        )}

        <nav id="sidebar-menu">
          <button
            className={`sidebar-btn ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >Dashboard</button>
          <button
            className={`sidebar-btn ${activeTab === "attendance" ? "active" : ""}`}
            onClick={() => setActiveTab("attendance")}
          >Attendance</button>
          <button
            className={`sidebar-btn ${activeTab === "progress" ? "active" : ""}`}
            onClick={() => setActiveTab("progress")}
          >Progress</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main id="dashboard-main">
        {activeTab === "dashboard" && (
          <section id="dashboard-view">
            <h2>Welcome, {student.name}</h2>
            <div id="batch-info">
              <p>Batch: <span id="batch-highlight">{student.batch} ({student.batchTime})</span></p>
            </div>
            <div id="fees-info">
              <div id="fee-card">Total Fees: ₹{student.fees?.total}</div>
              <div id="fee-card">Paid: ₹{student.fees?.paid}</div>
              <div id="fee-card">Due: ₹{student.fees?.due}</div>
            </div>
          </section>
        )}

        {activeTab === "attendance" && (
          <section id="attendance-view">
            <h2>Attendance</h2>
            <div id="attendance-summary">
              <p id="present-count">{totalPresent}</p>
              <p id="subtext">Days Present</p>
            </div>
            <div id="attendance-table-container">
              <table id="attendance-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {student.attendance?.map((record, index) => (
                    <tr key={index}>
                      <td>{record.date}</td>
                      <td id={record.status === "Present" ? "present" : "absent"}>{record.status}</td>
                    </tr>
                  )) || <tr><td colSpan="2">No attendance data</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === "progress" && (
          <section id="progress-view">
            <h2>Progress</h2>
            <div id="progress-circles">
              {Object.entries(student.progress || {}).map(([key, value], index) => (
                <div id="circle-container" key={index}>
                  <svg id="progress-circle" viewBox="0 0 36 36">
                    <path
                      id="circle-bg"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      id="circle-bar"
                      strokeDasharray={`${value}, 100`}
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <text x="18" y="20.35" id="circle-text">{value}%</text>
                  </svg>
                  <p id="circle-label">{key.charAt(0).toUpperCase() + key.slice(1)}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;

