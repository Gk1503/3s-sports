import React, { useEffect, useState } from "react";
import "./StudentDashboard.css";

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [fees, setFees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch student profile
  const fetchProfile = async () => {
    if (!user?.token) return;

    try {
      const res = await fetch("http://localhost:5000/api/students/profile", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setStudent(data);
        setProfileImage(data.profilePhotoUrl || "");
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          phone: data.phone || "",
          email: data.email || "",
          address: data.address || "",
        });
      } else {
        console.error("Failed to fetch profile");
      }
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
  };

  // Fetch fees
  const fetchFees = async () => {
    if (!user?.token) return;

    try {
      const res = await fetch("http://localhost:5000/api/students/fees", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setFees(data.fees || []);
      }
    } catch (err) {
      console.error("Failed to fetch fees", err);
    }
  };

  // Fetch attendance
  const fetchAttendance = async () => {
    if (!user?.token) return;

    try {
      const res = await fetch("http://localhost:5000/api/students/attendance", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAttendance(data.attendance || []);
      }
    } catch (err) {
      console.error("Failed to fetch attendance", err);
    }
  };

  // Fetch dashboard summary
  const fetchDashboard = async () => {
    if (!user?.token) return;

    try {
      const res = await fetch("http://localhost:5000/api/students/dashboard", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setDashboardData(data);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard", err);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchFees();
    fetchAttendance();
    fetchDashboard();
  }, []);

  const handleProfileSave = async () => {
    if (!user?.token) return;

    try {
      const res = await fetch("http://localhost:5000/api/students/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          ...formData,
          profilePhotoUrl: profileImage, // For now, we expect a URL string
          // If you want file upload, you'll need to handle it differently with FormData
        }),
      });

      if (res.ok) {
        const updatedStudent = await res.json();
        setStudent(updatedStudent.student || updatedStudent);
        setProfileImage(updatedStudent.student?.profilePhotoUrl || profileImage);
        setShowProfileEdit(false);
        alert("Profile updated successfully!");
      } else {
        const error = await res.json();
        alert(error.message || "Profile update failed");
      }
    } catch (err) {
      console.error("Profile update failed", err);
      alert("Error updating profile");
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // For file upload, you'd need to convert to base64 or upload to a server first
      // For now, we'll just store the file reference
      setProfileImage(file);
      // You can create an object URL for preview
      // const reader = new FileReader();
      // reader.onloadend = () => {
      //   setProfileImage(reader.result);
      // };
      // reader.readAsDataURL(file);
    }
  };

  if (!student && !dashboardData) {
    return (
      <div id="student-dashboard">
        <p>Loading...</p>
      </div>
    );
  }

  const studentName =
    student?.firstName && student?.lastName
      ? `${student.firstName} ${student.lastName}`
      : student?.firstName || "Student";

  const feesSummary = dashboardData?.stats?.fees || {
    monthlyFee: student?.monthlyFee || 0,
    feeDuration: student?.feeDuration || "1m",
    pendingAmount: fees.reduce(
      (sum, fee) => (fee.status === "pending" ? sum + fee.amount : sum),
      0
    ),
    pendingCount: fees.filter((fee) => fee.status === "pending").length,
  };

  const attendanceSummary = dashboardData?.stats?.recentAttendance || {
    total: attendance.length,
    present: attendance.filter((a) => a.status === "present").length,
    percentage:
      attendance.length > 0
        ? (
            (attendance.filter((a) => a.status === "present").length /
              attendance.length) *
            100
          ).toFixed(2)
        : 0,
  };

  const totalPresent = attendance.filter((a) => a.status === "present").length;

  return (
    <div id="student-dashboard">
      {/* Sidebar */}
      <aside id="dashboard-sidebar">
        <div id="profile-section">
          <img
            src={
              profileImage instanceof File
                ? URL.createObjectURL(profileImage)
                : profileImage || student?.profilePhotoUrl || "https://via.placeholder.com/150"
            }
            alt={studentName}
            id="sidebar-profile-img"
          />
          <p id="sidebar-profile-name">{studentName}</p>
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
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              id="profile-name-input"
              placeholder="First Name"
            />
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              placeholder="Last Name"
            />
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Email"
            />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="Phone"
            />
            <input
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              placeholder="Address"
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
            <button id="save-profile-btn" onClick={handleProfileSave}>
              Save
            </button>
          </div>
        )}

        <nav id="sidebar-menu">
          <button
            className={`sidebar-btn ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={`sidebar-btn ${activeTab === "fees" ? "active" : ""}`}
            onClick={() => setActiveTab("fees")}
          >
            Fees
          </button>
          <button
            className={`sidebar-btn ${activeTab === "attendance" ? "active" : ""}`}
            onClick={() => setActiveTab("attendance")}
          >
            Attendance
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main id="dashboard-main">
        {activeTab === "dashboard" && (
          <section id="dashboard-view">
            <h2>Welcome, {studentName}</h2>
            <div id="batch-info">
              <p>
                Batch: <span id="batch-highlight">{student?.batch || "N/A"}</span>
              </p>
            </div>
            <div id="fees-info">
              <div id="fee-card">
                Monthly Fee: ₹{feesSummary.monthlyFee} ({feesSummary.feeDuration})
              </div>
              <div id="fee-card">
                Pending: ₹{feesSummary.pendingAmount}
              </div>
              <div id="fee-card">
                Pending Count: {feesSummary.pendingCount}
              </div>
            </div>
            <div id="attendance-info" style={{ marginTop: "20px" }}>
              <h3>Recent Attendance (Last 30 days)</h3>
              <div id="fee-card">
                Total Days: {attendanceSummary.total}
              </div>
              <div id="fee-card">
                Present: {attendanceSummary.present}
              </div>
              <div id="fee-card">
                Attendance: {attendanceSummary.percentage}%
              </div>
            </div>
          </section>
        )}

        {activeTab === "fees" && (
          <section id="fees-view">
            <h2>Fees Report</h2>
            <div id="fees-summary">
              <div>
                <p>Monthly Fee: ₹{feesSummary.monthlyFee}</p>
                <p>Fee Duration: {feesSummary.feeDuration}</p>
                <p>Pending Amount: ₹{feesSummary.pendingAmount}</p>
              </div>
            </div>
            <div id="fees-table-container">
              <table id="fees-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Duration</th>
                    <th>Month</th>
                    <th>Status</th>
                    <th>Mode</th>
                  </tr>
                </thead>
                <tbody>
                  {fees.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center" }}>
                        No fees records found
                      </td>
                    </tr>
                  ) : (
                    fees.map((fee) => (
                      <tr key={fee._id}>
                        <td>{new Date(fee.date).toLocaleDateString()}</td>
                        <td>₹{fee.amount}</td>
                        <td>{fee.feeForMonths}</td>
                        <td>{fee.month || "-"}</td>
                        <td
                          style={{
                            color:
                              fee.status === "collected" ? "#10b981" : "#e53e3e",
                            fontWeight: 700,
                          }}
                        >
                          {fee.status?.toUpperCase()}
                        </td>
                        <td>{fee.mode?.toUpperCase() || "-"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === "attendance" && (
          <section id="attendance-view">
            <h2>Attendance Report</h2>
            <div id="attendance-summary">
              <p id="present-count">{totalPresent}</p>
              <p id="subtext">Days Present</p>
              <p>Total: {attendance.length} days</p>
              <p>Attendance: {attendanceSummary.percentage}%</p>
            </div>
            <div id="attendance-table-container">
              <table id="attendance-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Note</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.length === 0 ? (
                    <tr>
                      <td colSpan="3" style={{ textAlign: "center" }}>
                        No attendance records found
                      </td>
                    </tr>
                  ) : (
                    attendance
                      .sort(
                        (a, b) =>
                          new Date(b.date) - new Date(a.date)
                      )
                      .map((record) => (
                        <tr key={record._id}>
                          <td>{new Date(record.date).toLocaleDateString()}</td>
                          <td
                            id={
                              record.status === "present"
                                ? "present"
                                : record.status === "absent"
                                ? "absent"
                                : "leave"
                            }
                          >
                            {record.status?.toUpperCase()}
                          </td>
                          <td>{record.note || "-"}</td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;
