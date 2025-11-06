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
        setShowProfileEdit(false);
        alert("Profile updated successfully!");
        fetchProfile(); // Refresh to get updated data
      } else {
        const error = await res.json();
        alert(error.message || "Profile update failed");
      }
    } catch (err) {
      console.error("Profile update failed", err);
      alert("Error updating profile");
    }
  };

  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files[0] && user?.token) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('profilePhoto', file);

      try {
        const res = await fetch("http://localhost:5000/api/students/profile/photo", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          setProfileImage(data.student.profilePhotoUrl);
          setStudent({ ...student, profilePhotoUrl: data.student.profilePhotoUrl });
          alert("Profile photo updated successfully!");
          fetchProfile(); // Refresh to get updated data
          
          // Trigger navbar update via custom event
          window.dispatchEvent(new CustomEvent('profilePhotoUpdated', { 
            detail: { profilePhotoUrl: data.student.profilePhotoUrl } 
          }));
        } else {
          const error = await res.json();
          alert(error.message || "Photo upload failed");
        }
      } catch (err) {
        console.error("Photo upload failed", err);
        alert("Error uploading photo");
      }
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
              profileImage || student?.profilePhotoUrl || "https://via.placeholder.com/150"
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
            <label htmlFor="profile-image-upload" id="profile-upload-label" style={{ cursor: "pointer", padding: "10px", background: "#00bfff", color: "#fff", borderRadius: "8px", textAlign: "center" }}>
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
            
            {/* Profile Details Section */}
            <div style={{ background: "#fff", padding: "20px", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)", marginBottom: "20px" }}>
              <h3 style={{ marginBottom: "15px", color: "#002b5c" }}>Profile Details</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px" }}>
                <div>
                  <strong>Name:</strong> {student?.firstName} {student?.lastName || ""}
                </div>
                <div>
                  <strong>Email:</strong> {student?.email || "N/A"}
                </div>
                <div>
                  <strong>Phone:</strong> {student?.phone || "N/A"}
                </div>
                <div>
                  <strong>Gender:</strong> {student?.gender || "N/A"}
                </div>
                <div>
                  <strong>Date of Birth:</strong> {student?.dob ? new Date(student.dob).toLocaleDateString() : "N/A"}
                </div>
                <div>
                  <strong>Batch:</strong> <span id="batch-highlight">{student?.batch || "N/A"}</span>
                </div>
                <div>
                  <strong>Address:</strong> {student?.address || "N/A"}
                </div>
                <div>
                  <strong>Parent Name:</strong> {student?.parentName || "N/A"}
                </div>
                <div>
                  <strong>Parent Phone:</strong> {student?.parentPhone || "N/A"}
                </div>
                {student?.extraInfo && (
                  <div style={{ gridColumn: "1 / -1" }}>
                    <strong>Extra Info:</strong> {student.extraInfo}
                  </div>
                )}
              </div>
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
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Month</th>
                    <th>Collected Date</th>
                    <th>Duration</th>
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
                        <td>₹{fee.amount}</td>
                        <td
                          style={{
                            color:
                              fee.status === "collected" ? "#10b981" : "#e53e3e",
                            fontWeight: 700,
                          }}
                        >
                          {fee.status?.toUpperCase()}
                        </td>
                        <td>{fee.month || (fee.date ? new Date(fee.date).toISOString().slice(0, 7) : "-")}</td>
                        <td>
                          {fee.collectedAt
                            ? new Date(fee.collectedAt).toLocaleDateString()
                            : fee.status === "collected" && fee.date
                            ? new Date(fee.date).toLocaleDateString()
                            : "-"}
                        </td>
                        <td>{fee.feeForMonths || "-"}</td>
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
            
            {/* Month-wise Summary */}
            <div style={{ marginBottom: "30px", background: "#fff", padding: "20px", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)" }}>
              <h3 style={{ marginBottom: "15px", color: "#002b5c" }}>Monthly Attendance Summary</h3>
              <div className="table-wrapper">
                <table id="attendance-table">
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Total Days</th>
                      <th>Present</th>
                      <th>Absent</th>
                      <th>Leave</th>
                      <th>Attendance %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      // Group attendance by month
                      const monthlyData = {};
                      attendance.forEach((record) => {
                        if (record.date) {
                          const date = new Date(record.date);
                          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                          if (!monthlyData[monthKey]) {
                            monthlyData[monthKey] = {
                              month: monthKey,
                              total: 0,
                              present: 0,
                              absent: 0,
                              leave: 0,
                            };
                          }
                          monthlyData[monthKey].total++;
                          if (record.status === "present") monthlyData[monthKey].present++;
                          else if (record.status === "absent") monthlyData[monthKey].absent++;
                          else if (record.status === "leave") monthlyData[monthKey].leave++;
                        }
                      });

                      const monthlyArray = Object.values(monthlyData).sort((a, b) => b.month.localeCompare(a.month));

                      return monthlyArray.length === 0 ? (
                        <tr>
                          <td colSpan="6" style={{ textAlign: "center" }}>No attendance records</td>
                        </tr>
                      ) : (
                        monthlyArray.map((monthData) => {
                          const percentage = monthData.total > 0 
                            ? ((monthData.present / monthData.total) * 100).toFixed(1)
                            : "0";
                          const monthName = new Date(monthData.month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                          return (
                            <tr key={monthData.month}>
                              <td>{monthName}</td>
                              <td>{monthData.total}</td>
                              <td>{monthData.present}</td>
                              <td>{monthData.absent}</td>
                              <td>{monthData.leave}</td>
                              <td>
                                <span style={{
                                  padding: "4px 12px",
                                  borderRadius: "6px",
                                  fontSize: "0.85rem",
                                  fontWeight: "600",
                                  color: "#fff",
                                  background: percentage >= 75 ? "#10b981" : percentage >= 50 ? "#f6ad55" : "#e53e3e",
                                }}>
                                  {percentage}%
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      );
                    })()}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Overall Summary */}
            <div id="attendance-summary" style={{ marginBottom: "20px" }}>
              <p id="present-count">{totalPresent}</p>
              <p id="subtext">Days Present</p>
              <p>Total: {attendance.length} days</p>
              <p>Attendance: {attendanceSummary.percentage}%</p>
            </div>

            {/* Detailed Attendance List */}
            <div style={{ background: "#fff", padding: "20px", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)" }}>
              <h3 style={{ marginBottom: "15px", color: "#002b5c" }}>All Attendance Records</h3>
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
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;
