import React, { useState, useEffect, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import "./SeniorCoachDashboard.css";

const SeniorCoachDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const user = JSON.parse(localStorage.getItem("user"));

  const [students, setStudents] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [feesReport, setFeesReport] = useState(null);
  const [pendingFees, setPendingFees] = useState([]);
  const [collectedFees, setCollectedFees] = useState([]);
  const [attendanceReport, setAttendanceReport] = useState(null);

  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showCoachModal, setShowCoachModal] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [showFeesModal, setShowFeesModal] = useState(false);
  const [showFeesReportModal, setShowFeesReportModal] = useState(false);
  
  const [editingStudent, setEditingStudent] = useState(null);
  const [editingCoach, setEditingCoach] = useState(null);
  const [selectedStudentForFees, setSelectedStudentForFees] = useState(null);
  const [selectedStudentForCredentials, setSelectedStudentForCredentials] = useState(null);
  
  const [studentFormData, setStudentFormData] = useState({});
  const [coachFormData, setCoachFormData] = useState({});
  const [feesFormData, setFeesFormData] = useState({
    monthlyFee: "",
    feeDuration: "1m",
  });

  // Fetch students
  const fetchStudents = useCallback(async () => {
    if (!user?.token) return;

    try {
      const res = await fetch("http://localhost:5000/api/srcoach/students", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setStudents(data);
      } else {
        console.error("Failed to fetch students:", data.message);
      }
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  }, [user?.token]);

  // Fetch coaches
  const fetchCoaches = useCallback(async () => {
    if (!user?.token) return;
    try {
      const res = await fetch("http://localhost:5000/api/srcoach/coaches", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setCoaches(data);
      } else {
        console.error("Failed to fetch coaches:", data.message);
      }
    } catch (err) {
      console.error("Error fetching coaches:", err);
    }
  }, [user?.token]);

  // Fetch dashboard stats
  const fetchDashboardStats = useCallback(async () => {
    if (!user?.token) return;
    try {
      const res = await fetch("http://localhost:5000/api/srcoach/dashboard/stats", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setDashboardStats(data);
      }
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
    }
  }, [user?.token]);

  // Fetch fees report
  const fetchFeesReport = useCallback(async () => {
    if (!user?.token) return;
    try {
      const res = await fetch("http://localhost:5000/api/srcoach/fees/report", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setFeesReport(data);
      }
    } catch (err) {
      console.error("Error fetching fees report:", err);
    }
  }, [user?.token]);

  // Fetch pending fees
  const fetchPendingFees = useCallback(async () => {
    if (!user?.token) return;
    try {
      const res = await fetch("http://localhost:5000/api/srcoach/fees/pending", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setPendingFees(data.fees || []);
      }
    } catch (err) {
      console.error("Error fetching pending fees:", err);
    }
  }, [user?.token]);

  // Fetch collected fees
  const fetchCollectedFees = useCallback(async () => {
    if (!user?.token) return;
    try {
      const res = await fetch("http://localhost:5000/api/srcoach/fees/collected", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setCollectedFees(data.fees || []);
      }
    } catch (err) {
      console.error("Error fetching collected fees:", err);
    }
  }, [user?.token]);

  // Fetch attendance report
  const fetchAttendanceReport = useCallback(async () => {
    if (!user?.token) return;
    try {
      const res = await fetch("http://localhost:5000/api/srcoach/attendance/report", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setAttendanceReport(data);
      }
    } catch (err) {
      console.error("Error fetching attendance report:", err);
    }
  }, [user?.token]);

  useEffect(() => {
    fetchStudents();
    fetchCoaches();
    fetchDashboardStats();
  }, [fetchStudents, fetchCoaches, fetchDashboardStats]);

  useEffect(() => {
    if (activeTab === "fees") {
      fetchFeesReport();
      fetchPendingFees();
      fetchCollectedFees();
    }
    if (activeTab === "reports") {
      fetchAttendanceReport();
    }
  }, [activeTab, fetchFeesReport, fetchPendingFees, fetchCollectedFees, fetchAttendanceReport]);

  // Form handlers
  const handleStudentFormChange = (e) => {
    const { name, value, type } = e.target;
    setStudentFormData((prevData) => ({
      ...prevData,
      [name]: type === "number" ? parseInt(value) || "" : value,
    }));
  };

  const handleCoachFormChange = (e) => {
    const { name, value } = e.target;
    setCoachFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Student CRUD
  const handleAddStudent = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/srcoach/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          username: studentFormData.username,
          password: studentFormData.password,
          firstName: studentFormData.firstName,
          lastName: studentFormData.lastName,
          email: studentFormData.email,
          phone: studentFormData.phone,
          gender: studentFormData.gender,
          dob: studentFormData.dob,
          batch: studentFormData.batch,
          address: studentFormData.address,
          parentName: studentFormData.parentName,
          parentPhone: studentFormData.parentPhone,
          profilePhotoUrl: studentFormData.profilePhotoUrl,
          monthlyFee: studentFormData.monthlyFee || 0,
          feeDuration: studentFormData.feeDuration || "1m",
          extraInfo: studentFormData.extraInfo,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        alert("✅ Student added successfully!");
        await fetchStudents();
        await fetchDashboardStats();
        setShowStudentModal(false);
        setStudentFormData({});
      } else {
        alert(result.message || "Failed to add student");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    }
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setStudentFormData({
      firstName: student.firstName || "",
      lastName: student.lastName || "",
      email: student.email || "",
      phone: student.phone || "",
      gender: student.gender || "",
      dob: student.dob ? student.dob.split("T")[0] : "",
      batch: student.batch || "",
      address: student.address || "",
      parentName: student.parentName || "",
      parentPhone: student.parentPhone || "",
      profilePhotoUrl: student.profilePhotoUrl || "",
      monthlyFee: student.monthlyFee || 0,
      feeDuration: student.feeDuration || "1m",
      extraInfo: student.extraInfo || "",
    });
    setShowStudentModal(true);
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();

    if (!editingStudent) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/srcoach/students/${editingStudent._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify(studentFormData),
        }
      );

      const result = await res.json();

      if (res.ok) {
        alert("✅ Student updated successfully!");
        await fetchStudents();
        await fetchDashboardStats();
        setShowStudentModal(false);
        setEditingStudent(null);
        setStudentFormData({});
      } else {
        alert(result.message || "Failed to update student");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    }
  };

  const handleDeleteStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student? This action cannot be undone."))
      return;

    try {
      const res = await fetch(`http://localhost:5000/api/srcoach/students/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (res.ok) {
        alert("✅ Student deleted successfully!");
        await fetchStudents();
        await fetchDashboardStats();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete student");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    }
  };

  // View credentials
  const handleViewCredentials = async (student) => {
    setSelectedStudentForCredentials(student);
    setShowCredentialsModal(true);
  };

  // Set student fees
  const handleSetFees = (student) => {
    setSelectedStudentForFees(student);
    setFeesFormData({
      monthlyFee: student.monthlyFee || "",
      feeDuration: student.feeDuration || "1m",
    });
    setShowFeesModal(true);
  };

  const handleSubmitFees = async (e) => {
    e.preventDefault();
    if (!selectedStudentForFees) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/srcoach/students/${selectedStudentForFees._id}/fees`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify({
            monthlyFee: parseFloat(feesFormData.monthlyFee),
            feeDuration: feesFormData.feeDuration,
          }),
        }
      );

      const result = await res.json();

      if (res.ok) {
        alert("✅ Student fees updated successfully!");
        await fetchStudents();
        await fetchFeesReport();
        setShowFeesModal(false);
        setSelectedStudentForFees(null);
      } else {
        alert(result.message || "Failed to update fees");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    }
  };

  // Coach CRUD
  const handleEditCoach = (coach) => {
    setEditingCoach(coach);
    setCoachFormData({
      name: coach.name || "",
      email: coach.email || "",
      phone: coach.phone || "",
      profilePhotoUrl: coach.profilePhotoUrl || "",
    });
    setShowCoachModal(true);
  };

  const handleAddCoach = async (e) => {
    e.preventDefault();
    const isEditing = !!editingCoach;

    try {
      const url = isEditing
        ? `http://localhost:5000/api/srcoach/coaches/${editingCoach._id}`
        : "http://localhost:5000/api/srcoach/coaches";
      const method = isEditing ? "PUT" : "POST";

      const payload = isEditing
        ? coachFormData
        : {
            username: coachFormData.username,
            password: coachFormData.password,
            name: coachFormData.name,
            email: coachFormData.email,
            phone: coachFormData.phone,
            profilePhotoUrl: coachFormData.profilePhotoUrl,
          };

      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        alert(`✅ Coach ${isEditing ? "updated" : "added"} successfully!`);
        await fetchCoaches();
        await fetchDashboardStats();
        setShowCoachModal(false);
        setEditingCoach(null);
        setCoachFormData({});
      } else {
        alert(result.message || `Failed to ${isEditing ? "update" : "add"} coach`);
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    }
  };

  const handleDeleteCoach = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coach and their associated user account?"))
      return;

    try {
      const res = await fetch(`http://localhost:5000/api/srcoach/coaches/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (res.ok) {
        alert("✅ Coach deleted successfully!");
        await fetchCoaches();
        await fetchDashboardStats();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete coach");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    }
  };

  // Calculate stats for charts
  const feeData = dashboardStats?.fees
    ? [
        { name: "Collected", amount: dashboardStats.fees.collected },
        { name: "Pending", amount: dashboardStats.fees.pending },
      ]
    : [];

  return (
    <div id="srcoach-dashboard">
      {/* Sidebar */}
      <aside id="sidebar">
        <h2 id="sidebar-title">🏏 3Sports</h2>
        <ul>
          {["overview", "students", "coaches", "fees", "reports"].map((tab) => (
            <li
              key={tab}
              id={`sidebar-${tab}`}
              onClick={() => setActiveTab(tab)}
              style={{
                background:
                  activeTab === tab
                    ? "linear-gradient(90deg,#0b66c3, #1e90ff)"
                    : "transparent",
                color: activeTab === tab ? "#fff" : "#12394f",
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main id="main-content">
        <header id="main-header">
          <h1>Senior Coach Dashboard</h1>
        </header>

        {/* Overview */}
        {activeTab === "overview" && (
          <section id="overview-section">
            <div id="stat-total-students">
              <h3>Total Students</h3>
              <p>{dashboardStats?.counts?.totalStudents || students.length}</p>
            </div>
            <div id="stat-total-coaches">
              <h3>Total Coaches</h3>
              <p>{dashboardStats?.counts?.totalCoaches || coaches.length}</p>
            </div>
            <div id="stat-collected-fees">
              <h3>Collected Fees</h3>
              <p>₹{dashboardStats?.fees?.collected || 0}</p>
            </div>
            <div id="stat-pending-fees">
              <h3>Pending Fees</h3>
              <p>₹{dashboardStats?.fees?.pending || 0}</p>
            </div>

            <div id="chart-container">
              <h2>Fee Analytics</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={feeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#004080" barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}

        {/* Students Table */}
        {activeTab === "students" && (
          <section id="students-section">
            <div id="students-header">
              <h2>Manage Students</h2>
              <button
                id="students-add-btn"
                onClick={() => {
                  setShowStudentModal(true);
                  setEditingStudent(null);
                  setStudentFormData({});
                }}
              >
                + Add Student
              </button>
            </div>
            <div className="table-wrapper">
              <table id="students-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Contact</th>
                    <th>Batch</th>
                    <th>Monthly Fee</th>
                    <th>Username</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center" }}>
                        No students found
                      </td>
                    </tr>
                  ) : (
                    students.map((s) => (
                      <tr key={s._id}>
                        <td>
                          {s.firstName} {s.lastName || ""}
                        </td>
                        <td>{s.phone || "N/A"}</td>
                        <td>{s.batch || "N/A"}</td>
                        <td>₹{s.monthlyFee || 0}</td>
                        <td>{s.username || "N/A"}</td>
                        <td>
                          <button onClick={() => handleEditStudent(s)}>Edit</button>
                          <button onClick={() => handleDeleteStudent(s._id)}>Delete</button>
                          <button onClick={() => handleViewCredentials(s)}>Credentials</button>
                          <button onClick={() => handleSetFees(s)}>Set Fees</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Coaches Table */}
        {activeTab === "coaches" && (
          <section id="coaches-section" className="full-width-section">
            <div id="coaches-header">
              <h2>Manage Coaches</h2>
              <button
                id="coaches-add-btn"
                onClick={() => {
                  setShowCoachModal(true);
                  setEditingCoach(null);
                  setCoachFormData({});
                }}
              >
                + Add Coach
              </button>
            </div>
            <div className="table-wrapper">
              <table id="coaches-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Username</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coaches.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center" }}>
                        No coaches found
                      </td>
                    </tr>
                  ) : (
                    coaches.map((c) => (
                      <tr key={c._id}>
                        <td>{c.name || "N/A"}</td>
                        <td>{c.email || "N/A"}</td>
                        <td>{c.phone || "N/A"}</td>
                        <td>{c.username || "N/A"}</td>
                        <td>
                          <button onClick={() => handleEditCoach(c)}>Edit</button>
                          <button onClick={() => handleDeleteCoach(c._id)}>Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Fees Tab */}
        {activeTab === "fees" && (
          <section id="fees-section">
            <div id="fee-collected">
              <h3>Collected Fees</h3>
              <p>₹{dashboardStats?.fees?.collected || 0}</p>
            </div>
            <div id="fee-pending">
              <h3>Pending Fees</h3>
              <p>₹{dashboardStats?.fees?.pending || 0}</p>
            </div>
            <div id="fee-total">
              <h3>Total Collection</h3>
              <p>₹{dashboardStats?.fees?.totalCollection || 0}</p>
            </div>

            <div style={{ marginTop: "30px" }}>
              <h3>Pending Fees List</h3>
              <div className="table-wrapper">
                <table id="fees-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Amount</th>
                      <th>Month</th>
                      <th>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingFees.length === 0 ? (
                      <tr>
                        <td colSpan="4" style={{ textAlign: "center" }}>
                          No pending fees
                        </td>
                      </tr>
                    ) : (
                      pendingFees.map((fee) => (
                        <tr key={fee._id}>
                          <td>
                            {fee.student?.firstName} {fee.student?.lastName || ""}
                          </td>
                          <td>₹{fee.amount}</td>
                          <td>{fee.month || "-"}</td>
                          <td>{fee.feeForMonths}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* Reports Tab */}
        {activeTab === "reports" && (
          <section id="reports-section">
            <h2>Reports</h2>

            {attendanceReport && (
              <div style={{ marginBottom: "30px" }}>
                <h3>Attendance Report</h3>
                <p>Total Records: {attendanceReport.summary?.total || 0}</p>
                <p>Present: {attendanceReport.summary?.present || 0}</p>
                <p>Absent: {attendanceReport.summary?.absent || 0}</p>
                <p>Leave: {attendanceReport.summary?.leave || 0}</p>
              </div>
            )}

            {feesReport && (
              <div>
                <h3>Fees Report Summary</h3>
                <p>Total: ₹{feesReport.summary?.total || 0}</p>
                <p>Collected: ₹{feesReport.summary?.collected || 0}</p>
                <p>Pending: ₹{feesReport.summary?.pending || 0}</p>
              </div>
            )}
          </section>
        )}
      </main>

      {/* Add/Edit Student Modal */}
      {showStudentModal && (
        <div id="modal-overlay">
          <div id="modal-student">
            <h2>{editingStudent ? "Edit Student" : "Add Student"}</h2>
            <form onSubmit={editingStudent ? handleUpdateStudent : handleAddStudent}>
              {!editingStudent && (
                <>
                  <input
                    name="username"
                    placeholder="Username"
                    value={studentFormData.username || ""}
                    onChange={handleStudentFormChange}
                    required
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={studentFormData.password || ""}
                    onChange={handleStudentFormChange}
                    required={!editingStudent}
                  />
                </>
              )}
              <input
                name="firstName"
                placeholder="First Name"
                value={studentFormData.firstName || ""}
                onChange={handleStudentFormChange}
                required
              />
              <input
                name="lastName"
                placeholder="Last Name"
                value={studentFormData.lastName || ""}
                onChange={handleStudentFormChange}
              />
              <input
                name="email"
                placeholder="Email"
                type="email"
                value={studentFormData.email || ""}
                onChange={handleStudentFormChange}
              />
              <input
                name="phone"
                placeholder="Phone"
                value={studentFormData.phone || ""}
                onChange={handleStudentFormChange}
              />
              <input
                name="gender"
                placeholder="Gender"
                value={studentFormData.gender || ""}
                onChange={handleStudentFormChange}
              />
              <input
                name="dob"
                placeholder="Date of Birth"
                type="date"
                value={studentFormData.dob || ""}
                onChange={handleStudentFormChange}
              />
              <input
                name="batch"
                placeholder="Batch"
                value={studentFormData.batch || ""}
                onChange={handleStudentFormChange}
              />
              <input
                name="address"
                placeholder="Address"
                value={studentFormData.address || ""}
                onChange={handleStudentFormChange}
              />
              <input
                name="parentName"
                placeholder="Parent Name"
                value={studentFormData.parentName || ""}
                onChange={handleStudentFormChange}
              />
              <input
                name="parentPhone"
                placeholder="Parent Phone"
                value={studentFormData.parentPhone || ""}
                onChange={handleStudentFormChange}
              />
              <input
                name="profilePhotoUrl"
                placeholder="Profile Photo URL"
                value={studentFormData.profilePhotoUrl || ""}
                onChange={handleStudentFormChange}
              />
              <input
                type="number"
                name="monthlyFee"
                placeholder="Monthly Fee"
                value={studentFormData.monthlyFee || ""}
                onChange={handleStudentFormChange}
              />
              <select
                name="feeDuration"
                value={studentFormData.feeDuration || "1m"}
                onChange={handleStudentFormChange}
              >
                <option value="1m">1 Month</option>
                <option value="3m">3 Months</option>
                <option value="6m">6 Months</option>
                <option value="12m">12 Months</option>
              </select>
              <textarea
                name="extraInfo"
                placeholder="Extra Info"
                value={studentFormData.extraInfo || ""}
                onChange={handleStudentFormChange}
              />
              <div id="modal-buttons">
                <button type="submit">{editingStudent ? "Update" : "Add"}</button>
                <button
                  type="button"
                  onClick={() => {
                    setShowStudentModal(false);
                    setEditingStudent(null);
                    setStudentFormData({});
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Credentials Modal */}
      {showCredentialsModal && selectedStudentForCredentials && (
        <div id="modal-overlay">
          <div id="modal-student">
            <h2>Student Credentials</h2>
            <p>
              <strong>Name:</strong> {selectedStudentForCredentials.firstName}{" "}
              {selectedStudentForCredentials.lastName || ""}
            </p>
            <p>
              <strong>Username:</strong> {selectedStudentForCredentials.username || "N/A"}
            </p>
            <p style={{ color: "#666", fontStyle: "italic" }}>
              Password is encrypted and cannot be retrieved. Use password reset if needed.
            </p>
            <div id="modal-buttons">
              <button
                type="button"
                onClick={() => {
                  setShowCredentialsModal(false);
                  setSelectedStudentForCredentials(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Set Fees Modal */}
      {showFeesModal && selectedStudentForFees && (
        <div id="modal-overlay">
          <div id="modal-student">
            <h2>Set Fees for {selectedStudentForFees.firstName}</h2>
            <form onSubmit={handleSubmitFees}>
              <label>Monthly Fee (₹):</label>
              <input
                type="number"
                value={feesFormData.monthlyFee}
                onChange={(e) =>
                  setFeesFormData({ ...feesFormData, monthlyFee: e.target.value })
                }
                required
                step="0.01"
              />
              <label>Fee Duration:</label>
              <select
                value={feesFormData.feeDuration}
                onChange={(e) =>
                  setFeesFormData({ ...feesFormData, feeDuration: e.target.value })
                }
              >
                <option value="1m">1 Month</option>
                <option value="3m">3 Months</option>
                <option value="6m">6 Months</option>
                <option value="12m">12 Months</option>
              </select>
              <div id="modal-buttons">
                <button type="submit">Update Fees</button>
                <button
                  type="button"
                  onClick={() => {
                    setShowFeesModal(false);
                    setSelectedStudentForFees(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Coach Modal */}
      {showCoachModal && (
        <div id="modal-overlay">
          <div id="modal-coach">
            <h2>{editingCoach ? "Edit Coach" : "Add Coach"}</h2>
            <form onSubmit={handleAddCoach}>
              <input
                name="name"
                placeholder="Full Name"
                value={coachFormData.name || ""}
                onChange={handleCoachFormChange}
                required
              />
              {!editingCoach && (
                <>
                  <input
                    name="username"
                    placeholder="Username"
                    value={coachFormData.username || ""}
                    onChange={handleCoachFormChange}
                    required
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={coachFormData.password || ""}
                    onChange={handleCoachFormChange}
                    required
                  />
                </>
              )}
              <input
                name="email"
                placeholder="Email"
                type="email"
                value={coachFormData.email || ""}
                onChange={handleCoachFormChange}
              />
              <input
                name="phone"
                placeholder="Phone"
                value={coachFormData.phone || ""}
                onChange={handleCoachFormChange}
              />
              <input
                name="profilePhotoUrl"
                placeholder="Profile Photo URL"
                value={coachFormData.profilePhotoUrl || ""}
                onChange={handleCoachFormChange}
              />
              <div id="modal-buttons">
                <button type="submit">{editingCoach ? "Update" : "Add"}</button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCoachModal(false);
                    setEditingCoach(null);
                    setCoachFormData({});
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeniorCoachDashboard;
