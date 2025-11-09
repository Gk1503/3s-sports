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
  const [attendanceRecords, setAttendanceRecords] = useState({}); // Track attendance status by studentId

  // Profile Photo State
  const [coachProfile, setCoachProfile] = useState(null);
  const [showProfileEdit, setShowProfileEdit] = useState(false);

  // Dashboard Stats
  const [dashboardStats, setDashboardStats] = useState({
    totalStudents: 0,
    pendingFees: 0,
    presentToday: 0,
  });
  
  // Fees Lists
  const [collectedFees, setCollectedFees] = useState([]);
  const [pendingFeesList, setPendingFeesList] = useState([]);
  
  // Edit Attendance State
  const [editingAttendance, setEditingAttendance] = useState(null);

  // Fetch coach profile
  const fetchCoachProfile = useCallback(async () => {
    if (!user?.token) return;
    try {
      const res = await fetch("http://localhost:5000/api/coaches/profile", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setCoachProfile(data);
      }
    } catch (err) {
      console.error("Error fetching coach profile:", err);
    }
  }, [user?.token]);

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

  // Fetch attendance records for selected date
  const fetchAttendanceForDate = useCallback(async () => {
    if (!user?.token || !attendanceDate) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/coaches/attendance?date=${attendanceDate}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      if (res.ok) {
        const data = await res.json();
        const records = {};
        if (data.attendance && Array.isArray(data.attendance)) {
          data.attendance.forEach((record) => {
            if (record.student && record.student._id) {
              records[record.student._id] = {
                status: record.status,
                _id: record._id,
              };
            }
          });
        }
        setAttendanceRecords(records);
      }
    } catch (err) {
      console.error("Error fetching attendance for date:", err);
    }
  }, [user?.token, attendanceDate]);

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
    // Fetch essential data immediately, but don't block render
    if (user?.token) {
      fetchCoachProfile(); // Fetch profile first for name display
      // Defer students fetch slightly to avoid blocking
      const timer = setTimeout(() => {
        fetchStudents();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [user?.token, fetchCoachProfile, fetchStudents]);

  useEffect(() => {
    if (students.length > 0) {
      fetchAttendanceSummary();
    }
  }, [students.length, fetchAttendanceSummary]);

  // Fetch fees lists for dashboard
  const fetchFeesLists = useCallback(async () => {
    if (!user?.token) return;
    try {
      // Fetch collected fees
      const collectedRes = await fetch("http://localhost:5000/api/coaches/fees?status=collected", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (collectedRes.ok) {
        const collectedData = await collectedRes.json();
        setCollectedFees(collectedData.fees || []);
      }
      
      // Fetch pending fees
      const pendingRes = await fetch("http://localhost:5000/api/coaches/fees?status=pending", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (pendingRes.ok) {
        const pendingData = await pendingRes.json();
        setPendingFeesList(pendingData.fees || []);
        setDashboardStats((prev) => ({
          ...prev,
          pendingFees: pendingData.totalAmount || 0,
        }));
      }
    } catch (err) {
      console.error("Error fetching fees lists:", err);
    }
  }, [user?.token]);

  useEffect(() => {
    if (attendanceDate) {
      fetchAttendanceForDate();
    }
  }, [attendanceDate, fetchAttendanceForDate]);

  useEffect(() => {
    // Only fetch fees lists when dashboard tab is active and user is authenticated
    if (activeTab === "dashboard" && user?.token) {
      // Defer fetching to avoid blocking initial render
      const timer = setTimeout(() => {
        fetchFeesLists();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [activeTab, fetchFeesLists, user?.token]);

  // Calculate fees stats
  const calculateFeesStats = useMemo(() => {
    const collected = collectedFees.reduce((sum, fee) => sum + fee.amount, 0);
    const pending = pendingFeesList.reduce((sum, fee) => sum + fee.amount, 0);
    return {
      pending,
      collected,
    };
  }, [collectedFees, pendingFeesList]);

  // Calculate next due date based on fee duration
  const calculateNextDueDate = (lastCollectedDate, feeForMonths) => {
    if (!lastCollectedDate) return null;
    const date = new Date(lastCollectedDate);
    const months = feeForMonths === '1m' ? 1 : feeForMonths === '3m' ? 3 : feeForMonths === '6m' ? 6 : 12;
    date.setMonth(date.getMonth() + months);
    return date.toISOString().slice(0, 10);
  };

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
          mode: "cash", // Coach can only mark cash
          note: feeFormData.note,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        const nextDueDate = calculateNextDueDate(new Date(), feeFormData.feeForMonths);
        alert(
          `✅ ₹${feeFormData.amount} fee collected successfully from ${feeStudent.firstName} ${feeStudent.lastName || ""}!\nNext due date: ${nextDueDate ? new Date(nextDueDate).toLocaleDateString() : 'N/A'}`
        );
        await fetchStudents();
        await fetchFeesLists();
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

  // Edit marked attendance
  const handleEditAttendance = async (student, newStatus) => {
    if (!window.confirm(`Change attendance status to ${newStatus}?`)) return;
    
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
          status: newStatus.toLowerCase(),
          note: "",
        }),
      });

      const result = await res.json();

      if (res.ok) {
        setAttendanceRecords((prev) => ({
          ...prev,
          [student._id]: {
            status: newStatus.toLowerCase(),
            _id: result.attendance?._id || prev[student._id]?._id,
          },
        }));
        fetchAttendanceSummary();
      } else {
        alert(result.message || "Failed to update attendance.");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    }
  };

  // Bulk mark attendance for all students
  const handleBulkMarkAttendance = async (status) => {
    if (!window.confirm(`Mark all ${filteredStudents.length} students as ${status} for ${attendanceDate}?`)) return;

    const studentIds = filteredStudents.map(s => s._id);
    
    try {
      const res = await fetch("http://localhost:5000/api/coaches/attendance/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          students: studentIds,
          date: attendanceDate,
          status: status.toLowerCase(),
        }),
      });

      const result = await res.json();

      if (res.ok) {
        alert(`✅ Attendance marked as ${status} for all students!`);
        await fetchAttendanceForDate();
        fetchAttendanceSummary();
      } else {
        alert(result.message || "Failed to mark bulk attendance.");
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
        // Update attendance records immediately
        setAttendanceRecords((prev) => ({
          ...prev,
          [student._id]: {
            status: status.toLowerCase(),
            _id: result.attendance?._id || prev[student._id]?._id,
          },
        }));
        fetchAttendanceSummary();
      } else {
        alert(result.message || "Failed to mark attendance.");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    }
  };

  // Profile Photo Upload Handler
  const handleProfilePhotoUpload = async (e) => {
    if (e.target.files && e.target.files[0] && user?.token) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('profilePhoto', file);

      try {
        const res = await fetch("http://localhost:5000/api/coaches/profile/photo", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          setCoachProfile(data.coach);
          alert("Profile photo updated successfully!");
          fetchCoachProfile(); // Refresh to get updated data
          
          // Trigger navbar update via custom event
          window.dispatchEvent(new CustomEvent('profilePhotoUpdated', { 
            detail: { profilePhotoUrl: data.coach.profilePhotoUrl } 
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
        
        {/* Profile Photo Section */}
        <div style={{ marginBottom: "15px", textAlign: "center" }}>
          <img
            src={coachProfile?.profilePhotoUrl || "https://via.placeholder.com/60"}
            alt="Coach Profile"
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              border: "2px solid #00bfff",
              objectFit: "cover",
              marginBottom: "8px",
            }}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/60";
            }}
          />
          <div>
            <label
              htmlFor="coach-profile-photo-upload"
              style={{
                cursor: "pointer",
                padding: "6px 12px",
                background: "#00bfff",
                color: "#fff",
                borderRadius: "6px",
                fontSize: "0.75rem",
                display: "inline-block",
              }}
            >
              Update Photo
            </label>
            <input
              type="file"
              id="coach-profile-photo-upload"
              accept="image/*"
              onChange={handleProfilePhotoUpload}
              style={{ display: "none" }}
            />
          </div>
        </div>

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
                color: activeTab === tab ? "#fff" : "#fff",
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
          <h1>Welcome, {coachProfile?.name || "Coach"}!</h1>
        </header>

        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <section id="dashboard-section">
            <div className="stat-grid">
              <div className="stat-card">
                <h3>Total Students</h3>
                <p>{dashboardStats.totalStudents}</p>
              </div>
              <div className="stat-card green-bg">
                <h3>Present Today ({new Date().toLocaleDateString()})</h3>
                <p>
                  {attendanceSummary.presentToday} / {attendanceSummary.totalStudents}
                </p>
              </div>
            </div>

            {/* Collected Fees List */}
            <div style={{ marginTop: "30px", background: "#fff", padding: "20px", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)" }}>
              <h2 style={{ marginBottom: "15px", color: "#002b5c" }}>Collected Fees</h2>
              <div className="table-wrapper">
                <table id="fees-table">
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Amount</th>
                      <th>Month</th>
                      <th>Duration</th>
                      <th>Collected Date</th>
                      <th>Next Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {collectedFees.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: "center" }}>No collected fees</td>
                      </tr>
                    ) : (
                      collectedFees.slice(0, 10).map((fee) => (
                        <tr key={fee._id}>
                          <td>{fee.student?.firstName} {fee.student?.lastName || ""}</td>
                          <td>₹{fee.amount}</td>
                          <td>{fee.month || "-"}</td>
                          <td>{fee.feeForMonths}</td>
                          <td>{fee.collectedAt ? new Date(fee.collectedAt).toLocaleDateString() : "-"}</td>
                          <td>{fee.collectedAt ? calculateNextDueDate(fee.collectedAt, fee.feeForMonths) ? new Date(calculateNextDueDate(fee.collectedAt, fee.feeForMonths)).toLocaleDateString() : "-" : "-"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pending Fees List */}
            <div style={{ marginTop: "30px", background: "#fff", padding: "20px", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)" }}>
              <h2 style={{ marginBottom: "15px", color: "#002b5c" }}>Pending Fees</h2>
              <div className="table-wrapper">
                <table id="fees-table">
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Amount</th>
                      <th>Month</th>
                      <th>Duration</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingFeesList.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{ textAlign: "center" }}>No pending fees</td>
                      </tr>
                    ) : (
                      pendingFeesList.slice(0, 10).map((fee) => {
                        const student = students.find(s => s._id === fee.student?._id || s._id === fee.student);
                        return (
                          <tr key={fee._id}>
                            <td>{fee.student?.firstName || student?.firstName} {fee.student?.lastName || student?.lastName || ""}</td>
                            <td>₹{fee.amount}</td>
                            <td>{fee.month || "-"}</td>
                            <td>{fee.feeForMonths}</td>
                            <td>
                              {student && (
                                <button onClick={() => handleFeeCollection(student)}>Collect Fee</button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
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
                    <th>Photo</th>
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
                      <td colSpan="7" style={{ textAlign: "center" }}>
                        No students found
                      </td>
                    </tr>
                  ) : (
                    students.map((s) => (
                      <tr key={s._id}>
                        <td>
                          <img
                            src={s.profilePhotoUrl ? (s.profilePhotoUrl.startsWith('http') ? s.profilePhotoUrl : `http://localhost:5000${s.profilePhotoUrl}`) : "https://via.placeholder.com/50"}
                            alt={`${s.firstName} ${s.lastName || ""}`}
                            style={{
                              width: "50px",
                              height: "50px",
                              borderRadius: "50%",
                              objectFit: "cover",
                              border: "2px solid #00bfff",
                            }}
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/50";
                            }}
                          />
                        </td>
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
                    <th>Photo</th>
                    <th>Name</th>
                    <th>Batch</th>
                    <th>Monthly Fee</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center" }}>
                        No students found
                      </td>
                    </tr>
                  ) : (
                    students.map((s) => (
                      <tr key={s._id}>
                        <td>
                          <img
                            src={s.profilePhotoUrl ? (s.profilePhotoUrl.startsWith('http') ? s.profilePhotoUrl : `http://localhost:5000${s.profilePhotoUrl}`) : "https://via.placeholder.com/50"}
                            alt={`${s.firstName} ${s.lastName || ""}`}
                            style={{
                              width: "50px",
                              height: "50px",
                              borderRadius: "50%",
                              objectFit: "cover",
                              border: "2px solid #00bfff",
                            }}
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/50";
                            }}
                          />
                        </td>
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

            {/* Date Selector and Bulk Mark Button */}
            <div style={{ marginBottom: "20px", display: "flex", gap: "15px", alignItems: "center", flexWrap: "wrap" }}>
              <label>
                Date:{" "}
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                />
              </label>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => handleBulkMarkAttendance("present")}
                  className="mark-present-btn"
                  style={{ padding: "10px 20px" }}
                >
                  Mark All Present
                </button>
                <button
                  onClick={() => handleBulkMarkAttendance("absent")}
                  className="mark-absent-btn"
                  style={{ padding: "10px 20px" }}
                >
                  Mark All Absent
                </button>
              </div>
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
                    <th>Photo</th>
                    <th>Name</th>
                    <th>Batch</th>
                    <th>Mark Attendance</th>
                    <th>History</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center" }}>
                        No students found
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((s) => {
                      const attendanceStatus = attendanceRecords[s._id]?.status;
                      const isMarked = !!attendanceStatus;
                      
                      return (
                        <tr key={s._id}>
                          <td>
                            <img
                              src={s.profilePhotoUrl ? (s.profilePhotoUrl.startsWith('http') ? s.profilePhotoUrl : `http://localhost:5000${s.profilePhotoUrl}`) : "https://via.placeholder.com/50"}
                              alt={`${s.firstName} ${s.lastName || ""}`}
                              style={{
                                width: "50px",
                                height: "50px",
                                borderRadius: "50%",
                                objectFit: "cover",
                                border: "2px solid #00bfff",
                              }}
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/50";
                              }}
                            />
                          </td>
                          <td>
                            {s.firstName} {s.lastName || ""}
                          </td>
                          <td>{s.batch || "N/A"}</td>
                          <td style={{ minWidth: "250px" }}>
                            {isMarked ? (
                              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                <span
                                  style={{
                                    padding: "8px 16px",
                                    borderRadius: "8px",
                                    fontWeight: "bold",
                                    fontSize: "0.9rem",
                                    color: "#fff",
                                    background:
                                      attendanceStatus === "present"
                                        ? "#10b981"
                                        : attendanceStatus === "absent"
                                        ? "#e53e3e"
                                        : "#f6ad55",
                                  }}
                                >
                                  {attendanceStatus.toUpperCase()}
                                </span>
                                <select
                                  onChange={(e) => handleEditAttendance(s, e.target.value)}
                                  value={attendanceStatus}
                                  style={{
                                    padding: "6px 12px",
                                    fontSize: "0.85rem",
                                    borderRadius: "6px",
                                    border: "1px solid #ddd",
                                    cursor: "pointer",
                                  }}
                                >
                                  <option value="present">Present</option>
                                  <option value="absent">Absent</option>
                                  <option value="leave">Leave</option>
                                </select>
                              </div>
                            ) : (
                              <>
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
                              </>
                            )}
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
                      );
                    })
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
                value="cash"
                disabled
                style={{ background: "#f0f0f0", color: "#666" }}
              >
                <option value="cash">Cash (Coach can only mark cash)</option>
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
