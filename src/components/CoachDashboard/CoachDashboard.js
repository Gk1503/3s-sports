// CoachDashboard.js
import React, { useState, useEffect, useCallback, useMemo } from "react";
import "./CoachDashboard.css";

const CoachDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const user = JSON.parse(localStorage.getItem("user"));

  // Student Management State
  const [students, setStudents] = useState([]);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [studentFormData, setStudentFormData] = useState({});

  // Fees Management State
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [feeStudent, setFeeStudent] = useState(null);
  const [feeFormData, setFeeFormData] = useState({
    amount: "",
    feeForMonths: "1m",
    month: new Date().toISOString().slice(0, 7), // YYYY-MM format
    mode: "cash",
    note: "",
  });

  // Attendance Management State
  const [attendanceSearchTerm, setAttendanceSearchTerm] = useState("");
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().slice(0, 10));
  const [attendanceSummary, setAttendanceSummary] = useState({
    presentToday: 0,
    totalStudents: 0,
  });
  const [individualAttendanceHistory, setIndividualAttendanceHistory] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Dashboard Stats
  const [dashboardStats, setDashboardStats] = useState({
    totalStudents: 0,
    pendingFees: 0,
    presentToday: 0,
  });

  // Fetch all students
  const fetchStudents = useCallback(async () => {
    if (!user?.token) return;

    try {
      const res = await fetch("http://localhost:5000/api/coaches/students", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setStudents(data.students || data || []);
        setDashboardStats((prev) => ({
          ...prev,
          totalStudents: data.count || data.students?.length || 0,
        }));
      } else {
        console.error("Failed to fetch students:", data.message);
      }
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  }, [user?.token]);

  // Fetch attendance summary for today
  const fetchAttendanceSummary = useCallback(async () => {
    if (!user?.token) return;
    try {
      const today = new Date().toISOString().slice(0, 10);
      const res = await fetch(
        `http://localhost:5000/api/coaches/attendance?date=${today}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      const data = await res.json();
      if (res.ok) {
        const presentCount = data.attendance?.filter(
          (a) => a.status === "present"
        ).length || 0;
        setAttendanceSummary({
          presentToday: presentCount,
          totalStudents: students.length,
        });
        setDashboardStats((prev) => ({
          ...prev,
          presentToday: presentCount,
        }));
      }
    } catch (err) {
      console.error("Error fetching attendance summary:", err);
      setAttendanceSummary((prev) => ({
        ...prev,
        totalStudents: students.length,
      }));
    }
  }, [user?.token, students.length]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    if (students.length > 0) {
      fetchAttendanceSummary();
    }
  }, [students.length, fetchAttendanceSummary]);

  // Calculate fees stats
  const calculateFeesStats = useMemo(() => {
    // This would ideally come from an API, but for now we'll calculate from student data
    return {
      pending: 0, // Would need to fetch from fees API
      collected: 0,
    };
  }, []);

  // Student Form Handlers
  const handleStudentFormChange = (e) => {
    const { name, value } = e.target;
    setStudentFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setStudentFormData({
      firstName: student.firstName || "",
      lastName: student.lastName || "",
      phone: student.phone || "",
      email: student.email || "",
      address: student.address || "",
      batch: student.batch || "",
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
        alert("✅ Student profile updated successfully!");
        await fetchStudents();
        setShowStudentModal(false);
        setEditingStudent(null);
        setStudentFormData({});
      } else {
        alert(result.message || "Failed to update student profile");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    }
  };

  // Fees Collection Handler
  const handleFeeCollection = (student) => {
    setFeeStudent(student);
    setFeeFormData({
      amount: student.monthlyFee || "",
      feeForMonths: student.feeDuration || "1m",
      month: new Date().toISOString().slice(0, 7),
      mode: "cash",
      note: "",
    });
    setShowFeeModal(true);
  };

  const submitFeePayment = async (e) => {
    e.preventDefault();

    if (!feeStudent) return;

    try {
      const res = await fetch("http://localhost:5000/api/coaches/fees/collect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          studentId: feeStudent._id,
          amount: parseFloat(feeFormData.amount),
          feeForMonths: feeFormData.feeForMonths,
          month: feeFormData.month,
          mode: feeFormData.mode,
          note: feeFormData.note,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        alert(
          `✅ ₹${feeFormData.amount} fee collected successfully from ${feeStudent.firstName} ${feeStudent.lastName || ""}!`
        );
        await fetchStudents();
        setShowFeeModal(false);
        setFeeStudent(null);
        setFeeFormData({
          amount: "",
          feeForMonths: "1m",
          month: new Date().toISOString().slice(0, 7),
          mode: "cash",
          note: "",
        });
      } else {
        alert(result.message || "Failed to record fee payment");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    }
  };

  // Attendance Handler
  const handleMarkAttendance = async (student, status) => {
    const confirmation = window.confirm(
      `Mark ${student.firstName} ${student.lastName || ""} as ${status} for ${attendanceDate}?`
    );

    if (!confirmation) return;

    try {
      const res = await fetch("http://localhost:5000/api/coaches/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          studentId: student._id,
          date: attendanceDate,
          status: status.toLowerCase(),
          note: "",
        }),
      });

      const result = await res.json();

      if (res.ok) {
        alert(
          `Attendance marked as ${status} for ${student.firstName} ${student.lastName || ""}.`
        );
        fetchAttendanceSummary();
        fetchStudents(); // Refresh to update any UI indicators
      } else {
        alert(result.message || "Failed to mark attendance.");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    }
  };

  // Individual Attendance History
  const handleViewAttendanceHistory = async (student) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/coaches/attendance/${student._id}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      const data = await res.json();

      if (res.ok) {
        setIndividualAttendanceHistory(data.attendance || data || []);
        setShowHistoryModal(true);
      } else {
        alert(data.message || "Failed to fetch attendance history.");
      }
    } catch (err) {
      console.error("Error fetching history:", err);
      alert("Error connecting to server.");
    }
  };

  // Filtered Students for Attendance Tab
  const filteredStudents = useMemo(() => {
    const term = attendanceSearchTerm.toLowerCase();
    if (!term) return students;

    return students.filter(
      (s) =>
        `${s.firstName} ${s.lastName || ""}`
          .toLowerCase()
          .includes(term) ||
        s.batch?.toLowerCase().includes(term) ||
        s.email?.toLowerCase().includes(term)
    );
  }, [students, attendanceSearchTerm]);

  return (
    <div id="coach-dashboard">
      {/* Sidebar */}
      <aside id="sidebar">
        <h2 id="sidebar-title">🏏 Coach Panel</h2>
        <ul>
          {["dashboard", "students", "fees", "attendance"].map((tab) => (
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
          <h1>Welcome, Coach!</h1>
        </header>

        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <section id="dashboard-section" className="stat-grid">
            <div className="stat-card">
              <h3>Total Students</h3>
              <p>{dashboardStats.totalStudents}</p>
            </div>
            <div className="stat-card red-bg">
              <h3>Pending Fees</h3>
              <p>₹{calculateFeesStats.pending}</p>
            </div>
            <div className="stat-card green-bg">
              <h3>Present Today ({new Date().toLocaleDateString()})</h3>
              <p>
                {attendanceSummary.presentToday} / {attendanceSummary.totalStudents}
              </p>
            </div>
          </section>
        )}

        {/* Students Table */}
        {activeTab === "students" && (
          <section id="students-section">
            <h2>All Students</h2>
            <div className="table-wrapper">
              <table id="students-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Batch</th>
                    <th>Monthly Fee</th>
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
                        <td>{s.email || "N/A"}</td>
                        <td>{s.phone || "N/A"}</td>
                        <td>{s.batch || "N/A"}</td>
                        <td>₹{s.monthlyFee || 0}</td>
                        <td>
                          <button onClick={() => handleEditStudent(s)}>
                            View Details
                          </button>
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
            <h2>Fees Collection</h2>
            <div className="table-wrapper">
              <table id="fees-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Batch</th>
                    <th>Monthly Fee</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: "center" }}>
                        No students found
                      </td>
                    </tr>
                  ) : (
                    students.map((s) => (
                      <tr key={s._id}>
                        <td>
                          {s.firstName} {s.lastName || ""}
                        </td>
                        <td>{s.batch || "N/A"}</td>
                        <td>₹{s.monthlyFee || 0}</td>
                        <td>
                          <button onClick={() => handleFeeCollection(s)}>
                            Collect Fee
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Attendance Section */}
        {activeTab === "attendance" && (
          <section id="attendance-section">
            <h2>Mark Attendance</h2>

            {/* Date Selector */}
            <div style={{ marginBottom: "20px" }}>
              <label>
                Date:{" "}
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                />
              </label>
            </div>

            {/* Search Box */}
            <div className="search-box-container">
              <input
                type="text"
                placeholder="Search by Student Name or Batch..."
                value={attendanceSearchTerm}
                onChange={(e) => setAttendanceSearchTerm(e.target.value)}
              />
            </div>

            <div className="table-wrapper">
              <table id="attendance-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Batch</th>
                    <th>Mark Attendance</th>
                    <th>History</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: "center" }}>
                        No students found
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((s) => (
                      <tr key={s._id}>
                        <td>
                          {s.firstName} {s.lastName || ""}
                        </td>
                        <td>{s.batch || "N/A"}</td>
                        <td style={{ minWidth: "200px" }}>
                          <button
                            className="mark-present-btn"
                            onClick={() => handleMarkAttendance(s, "present")}
                            style={{ marginRight: "5px" }}
                          >
                            Present
                          </button>
                          <button
                            className="mark-absent-btn"
                            onClick={() => handleMarkAttendance(s, "absent")}
                            style={{
                              marginRight: "5px",
                              background: "#e53e3e",
                            }}
                          >
                            Absent
                          </button>
                          <button
                            onClick={() => handleMarkAttendance(s, "leave")}
                            style={{
                              background: "#f6ad55",
                            }}
                          >
                            Leave
                          </button>
                        </td>
                        <td>
                          <button
                            className="history-btn"
                            onClick={() => handleViewAttendanceHistory(s)}
                            style={{ background: "#3182ce" }}
                          >
                            View History
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      {/* Edit Student Modal */}
      {showStudentModal && editingStudent && (
        <div id="modal-overlay">
          <div id="modal-student">
            <h2>Student Details: {editingStudent.firstName}</h2>
            <form onSubmit={handleUpdateStudent}>
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
                name="address"
                placeholder="Address"
                value={studentFormData.address || ""}
                onChange={handleStudentFormChange}
              />
              <input
                name="batch"
                placeholder="Batch"
                value={studentFormData.batch || ""}
                onChange={handleStudentFormChange}
              />

              <div id="modal-buttons">
                <button type="submit">Update Profile</button>
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

      {/* Fee Collection Modal */}
      {showFeeModal && feeStudent && (
        <div id="modal-overlay">
          <div id="modal-student">
            <h2>Record Payment for: {feeStudent.firstName} {feeStudent.lastName || ""}</h2>
            <form onSubmit={submitFeePayment}>
              <label>Payment Amount (₹):</label>
              <input
                type="number"
                name="amount"
                value={feeFormData.amount}
                onChange={(e) =>
                  setFeeFormData({ ...feeFormData, amount: e.target.value })
                }
                required
                step="0.01"
              />

              <label>Fee Duration:</label>
              <select
                name="feeForMonths"
                value={feeFormData.feeForMonths}
                onChange={(e) =>
                  setFeeFormData({ ...feeFormData, feeForMonths: e.target.value })
                }
              >
                <option value="1m">1 Month</option>
                <option value="3m">3 Months</option>
                <option value="6m">6 Months</option>
                <option value="12m">12 Months</option>
              </select>

              <label>Month (YYYY-MM):</label>
              <input
                type="month"
                name="month"
                value={feeFormData.month}
                onChange={(e) =>
                  setFeeFormData({ ...feeFormData, month: e.target.value })
                }
                required
              />

              <label>Payment Mode:</label>
              <select
                name="mode"
                value={feeFormData.mode}
                onChange={(e) =>
                  setFeeFormData({ ...feeFormData, mode: e.target.value })
                }
              >
                <option value="cash">Cash</option>
                <option value="online">Online</option>
                <option value="cheque">Cheque</option>
                <option value="other">Other</option>
              </select>

              <label>Note (optional):</label>
              <textarea
                name="note"
                value={feeFormData.note}
                onChange={(e) =>
                  setFeeFormData({ ...feeFormData, note: e.target.value })
                }
                rows="3"
              />

              <div id="modal-buttons">
                <button type="submit">Record Payment</button>
                <button
                  type="button"
                  onClick={() => {
                    setShowFeeModal(false);
                    setFeeStudent(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Attendance History Modal */}
      {showHistoryModal && (
        <div id="modal-overlay">
          <div id="modal-history">
            <h2>
              Attendance History:{" "}
              {individualAttendanceHistory[0]?.student?.firstName ||
                "Student"}
            </h2>
            <div className="table-wrapper">
              <table id="history-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Note</th>
                  </tr>
                </thead>
                <tbody>
                  {individualAttendanceHistory.length === 0 ? (
                    <tr>
                      <td colSpan="3" style={{ textAlign: "center" }}>
                        No attendance records found
                      </td>
                    </tr>
                  ) : (
                    individualAttendanceHistory.map((item, index) => (
                      <tr key={item._id || index}>
                        <td>
                          {new Date(item.date).toLocaleDateString()}
                        </td>
                        <td
                          style={{
                            color:
                              item.status === "present"
                                ? "#10b981"
                                : item.status === "absent"
                                ? "#e53e3e"
                                : "#f6ad55",
                            fontWeight: 700,
                          }}
                        >
                          {item.status?.toUpperCase()}
                        </td>
                        <td>{item.note || "-"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div id="modal-buttons" style={{ marginTop: "20px" }}>
              <button
                type="button"
                onClick={() => {
                  setShowHistoryModal(false);
                  setIndividualAttendanceHistory([]);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoachDashboard;
