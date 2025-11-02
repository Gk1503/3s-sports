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
  const [showCoachCredentialsModal, setShowCoachCredentialsModal] = useState(false);
  const [showFeesModal, setShowFeesModal] = useState(false);
  const [showFeesReportModal, setShowFeesReportModal] = useState(false);
  
  const [editingStudent, setEditingStudent] = useState(null);
  const [editingCoach, setEditingCoach] = useState(null);
  const [selectedStudentForFees, setSelectedStudentForFees] = useState(null);
  const [selectedStudentForCredentials, setSelectedStudentForCredentials] = useState(null);
  const [selectedCoachForCredentials, setSelectedCoachForCredentials] = useState(null);
  const [selectedStudentForAttendance, setSelectedStudentForAttendance] = useState(null);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showFeeMarkModal, setShowFeeMarkModal] = useState(false);
  const [studentAttendanceData, setStudentAttendanceData] = useState([]);
  const [allStudentsWithFees, setAllStudentsWithFees] = useState([]);
  
  const [studentFormData, setStudentFormData] = useState({});
  const [coachFormData, setCoachFormData] = useState({});
  const [feesFormData, setFeesFormData] = useState({
    monthlyFee: "",
    feeDuration: "1m",
  });
  const [feeMarkFormData, setFeeMarkFormData] = useState({
    mode: "cash",
    month: new Date().toISOString().slice(0, 7),
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
      fetchAllStudentsWithFees();
    }
    if (activeTab === "reports") {
      fetchAttendanceReport();
    }
  }, [activeTab, fetchFeesReport, fetchPendingFees, fetchCollectedFees, fetchAttendanceReport]);

  // Fetch all students with fees status
  const fetchAllStudentsWithFees = useCallback(async () => {
    if (!user?.token) return;
    try {
      const [studentsRes, feesRes] = await Promise.all([
        fetch("http://localhost:5000/api/srcoach/students", {
          headers: { Authorization: `Bearer ${user.token}` },
        }),
        fetch("http://localhost:5000/api/srcoach/fees/report", {
          headers: { Authorization: `Bearer ${user.token}` },
        }),
      ]);
      
      if (studentsRes.ok && feesRes.ok) {
        const studentsData = await studentsRes.json();
        const feesData = await feesRes.json();
        
        const studentsWithFees = (studentsData || []).map(student => {
          const studentFees = (feesData.fees || []).filter(f => 
            f.student?._id === student._id || f.student === student._id
          );
          const pendingFees = studentFees.filter(f => f.status === "pending");
          const collectedFees = studentFees.filter(f => f.status === "collected");
          
          return {
            ...student,
            pendingAmount: pendingFees.reduce((sum, f) => sum + f.amount, 0),
            collectedAmount: collectedFees.reduce((sum, f) => sum + f.amount, 0),
            feeStatus: pendingFees.length > 0 ? "pending" : collectedFees.length > 0 ? "collected" : "none",
          };
        });
        
        setAllStudentsWithFees(studentsWithFees);
      }
    } catch (err) {
      console.error("Error fetching students with fees:", err);
    }
  }, [user?.token]);

  // Calculate next due date
  const calculateNextDueDate = (lastCollectedDate, feeForMonths) => {
    if (!lastCollectedDate) return null;
    const date = new Date(lastCollectedDate);
    const months = feeForMonths === '1m' ? 1 : feeForMonths === '3m' ? 3 : feeForMonths === '6m' ? 6 : 12;
    date.setMonth(date.getMonth() + months);
    return date.toISOString().slice(0, 10);
  };

  // View coach credentials
  const handleViewCoachCredentials = async (coach) => {
    try {
      const res = await fetch(`http://localhost:5000/api/srcoach/coaches/${coach._id}/credentials`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedCoachForCredentials({
          ...coach,
          username: data.username,
          password: data.password,
        });
        setShowCoachCredentialsModal(true);
      } else {
        const error = await res.json();
        alert(error.message || "Error fetching coach credentials");
      }
    } catch (err) {
      console.error("Error fetching coach credentials:", err);
      alert("Error fetching coach credentials");
    }
  };

  // View student attendance
  const handleViewStudentAttendance = async (student) => {
    setSelectedStudentForAttendance(student);
    try {
      const res = await fetch(`http://localhost:5000/api/srcoach/attendance/report?studentId=${student._id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setStudentAttendanceData(data.attendance || []);
        setShowAttendanceModal(true);
      }
    } catch (err) {
      console.error("Error fetching student attendance:", err);
      alert("Error fetching attendance data");
    }
  };

  // Handle fee marking with mode selection
  const handleMarkFee = (fee) => {
    setSelectedStudentForFees(fee);
    setFeeMarkFormData({
      mode: "cash",
      month: fee.month || new Date().toISOString().slice(0, 7),
    });
    setShowFeeMarkModal(true);
  };

  const handleSubmitFeeMark = async (e) => {
    e.preventDefault();
    if (!selectedStudentForFees?._id) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/srcoach/fees/${selectedStudentForFees._id}/collect`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          month: feeMarkFormData.month,
          mode: feeMarkFormData.mode,
        }),
      });
      
      if (res.ok) {
        const data = await res.json();
        const nextDueDate = calculateNextDueDate(new Date(), selectedStudentForFees.feeForMonths || "1m");
        alert(`Fee marked as collected!\nNext due date: ${nextDueDate ? new Date(nextDueDate).toLocaleDateString() : 'N/A'}`);
        fetchPendingFees();
        fetchCollectedFees();
        fetchAllStudentsWithFees();
        fetchDashboardStats();
        setShowFeeMarkModal(false);
        setSelectedStudentForFees(null);
        
        // Auto-create next month fee if needed
        if (selectedStudentForFees?.student?.monthlyFee && selectedStudentForFees.student.monthlyFee > 0) {
          const nextMonth = new Date(feeMarkFormData.month + '-01');
          nextMonth.setMonth(nextMonth.getMonth() + 1);
          const nextMonthStr = nextMonth.toISOString().slice(0, 7);
          
          // Check if fee already exists for next month
          const checkRes = await fetch(`http://localhost:5000/api/srcoach/fees/pending`, {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          if (checkRes.ok) {
            const pendingData = await checkRes.json();
            const exists = pendingData.fees?.some(f => 
              (f.student?._id === selectedStudentForFees.student?._id || f.student === selectedStudentForFees.student?._id) &&
              f.month === nextMonthStr
            );
            
            if (!exists) {
              // Auto-create pending fee for next month
              await fetch("http://localhost:5000/api/srcoach/fees/report", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                  studentId: selectedStudentForFees.student?._id || selectedStudentForFees.student,
                  amount: selectedStudentForFees.student?.monthlyFee || selectedStudentForFees.amount,
                  feeForMonths: selectedStudentForFees.student?.feeDuration || selectedStudentForFees.feeForMonths || "1m",
                  month: nextMonthStr,
                  status: "pending",
                }),
              });
            }
          }
        }
      } else {
        const data = await res.json();
        alert(data.message || "Failed to mark fee as collected");
      }
    } catch (err) {
      console.error(err);
      alert("Error marking fee");
    }
  };

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
    try {
      const res = await fetch(`http://localhost:5000/api/srcoach/students/${student._id}/credentials`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setSelectedStudentForCredentials({
          ...student,
          username: data.username,
          password: data.password,
        });
        setShowCredentialsModal(true);
      } else {
        alert(data.message || "Failed to fetch credentials");
      }
    } catch (err) {
      console.error("Error fetching credentials:", err);
      alert("Error fetching credentials");
    }
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
        <h2 id="sidebar-title">🏏 3S Sports</h2>
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
                color: "#fff",
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
                        <td style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          <button 
                            onClick={() => handleEditStudent(s)}
                            style={{
                              background: "linear-gradient(90deg, #3182ce, #2563eb)",
                              color: "#fff",
                              border: "none",
                              padding: "6px 12px",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontSize: "0.85rem",
                              fontWeight: "600",
                            }}
                          >Edit</button>
                          <button 
                            onClick={() => handleDeleteStudent(s._id)}
                            style={{
                              background: "linear-gradient(90deg, #e53e3e, #c53030)",
                              color: "#fff",
                              border: "none",
                              padding: "6px 12px",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontSize: "0.85rem",
                              fontWeight: "600",
                            }}
                          >Delete</button>
                          <button 
                            onClick={() => handleViewCredentials(s)}
                            style={{
                              background: "linear-gradient(90deg, #f6ad55, #ed8936)",
                              color: "#fff",
                              border: "none",
                              padding: "6px 12px",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontSize: "0.85rem",
                              fontWeight: "600",
                            }}
                          >Credentials</button>
                          <button 
                            onClick={() => handleSetFees(s)}
                            style={{
                              background: "linear-gradient(90deg, #10b981, #059669)",
                              color: "#fff",
                              border: "none",
                              padding: "6px 12px",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontSize: "0.85rem",
                              fontWeight: "600",
                            }}
                          >Set Fees</button>
                          <button 
                            onClick={() => handleViewStudentAttendance(s)}
                            style={{
                              background: "linear-gradient(90deg, #805ad5, #6b46c1)",
                              color: "#fff",
                              border: "none",
                              padding: "6px 12px",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontSize: "0.85rem",
                              fontWeight: "600",
                            }}
                          >Attendance</button>
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
                        <td style={{ display: "flex", gap: "8px" }}>
                          <button 
                            onClick={() => handleEditCoach(c)}
                            style={{
                              background: "linear-gradient(90deg, #3182ce, #2563eb)",
                              color: "#fff",
                              border: "none",
                              padding: "6px 12px",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontSize: "0.85rem",
                              fontWeight: "600",
                            }}
                          >Edit</button>
                          <button 
                    
                            style={{
                              background: "linear-gradient(90deg, #f6ad55, #ed8936)",
                              color: "#fff",
                              border: "none",
                              padding: "6px 12px",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontSize: "0.85rem",
                              fontWeight: "600",
                            }}
                          >Credentials</button>
                          <button 
                            onClick={() => handleDeleteCoach(c._id)}
                            style={{
                              background: "linear-gradient(90deg, #e53e3e, #c53030)",
                              color: "#fff",
                              border: "none",
                              padding: "6px 12px",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontSize: "0.85rem",
                              fontWeight: "600",
                            }}
                          >Delete</button>
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
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "30px" }}>
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
            </div>

            {/* All Students with Fees Status */}
            <div style={{ marginTop: "30px", background: "#fff", padding: "20px", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)" }}>
              <h3 style={{ marginBottom: "15px", color: "#0f3b5f" }}>All Students - Fees Status</h3>
              <div className="table-wrapper">
                <table id="fees-table">
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Monthly Fee</th>
                      <th>Pending Amount</th>
                      <th>Collected Amount</th>
                      <th>Status</th>
                      <th>Next Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allStudentsWithFees.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: "center" }}>No students found</td>
                      </tr>
                    ) : (
                      allStudentsWithFees.map((student) => {
                        // Get last collected fee
                        const lastCollectedFee = collectedFees.find(f => 
                          (f.student?._id === student._id || f.student === student._id)
                        );
                        const nextDueDate = lastCollectedFee && student.feeDuration 
                          ? calculateNextDueDate(lastCollectedFee.collectedAt || lastCollectedFee.date, student.feeDuration || "1m")
                          : null;
                        
                        return (
                          <tr key={student._id}>
                            <td>{student.firstName} {student.lastName || ""}</td>
                            <td>₹{student.monthlyFee || 0}</td>
                            <td>₹{student.pendingAmount || 0}</td>
                            <td>₹{student.collectedAmount || 0}</td>
                            <td>
                              <span style={{
                                padding: "4px 12px",
                                borderRadius: "6px",
                                fontSize: "0.85rem",
                                fontWeight: "600",
                                color: "#fff",
                                background: student.feeStatus === "pending" ? "#e53e3e" : student.feeStatus === "collected" ? "#10b981" : "#64748b",
                              }}>
                                {student.feeStatus === "pending" ? "Pending" : student.feeStatus === "collected" ? "Collected" : "No Fees"}
                              </span>
                            </td>
                            <td>{nextDueDate ? new Date(nextDueDate).toLocaleDateString() : "-"}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pending Fees List - Month Wise */}
            <div style={{ marginTop: "30px", background: "#fff", padding: "20px", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)" }}>
              <h3 style={{ marginBottom: "15px", color: "#0f3b5f" }}>Pending Fees (Month-wise)</h3>
              <div className="table-wrapper">
                <table id="fees-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Amount</th>
                      <th>Month</th>
                      <th>Duration</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingFees.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{ textAlign: "center" }}>
                          No pending fees
                        </td>
                      </tr>
                    ) : (
                      pendingFees.sort((a, b) => (a.month || "").localeCompare(b.month || "")).map((fee) => (
                        <tr key={fee._id}>
                          <td>
                            {fee.student?.firstName} {fee.student?.lastName || ""}
                          </td>
                          <td>₹{fee.amount}</td>
                          <td>{fee.month || "-"}</td>
                          <td>{fee.feeForMonths}</td>
                          <td>
                            <button
                              onClick={() => handleMarkFee({ ...fee, student: fee.student })}
                              style={{
                                background: "linear-gradient(90deg, #10b981, #059669)",
                                color: "#fff",
                                border: "none",
                                padding: "6px 12px",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontSize: "0.85rem",
                                fontWeight: "600",
                              }}
                            >
                              Mark Collected
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Collected Fees List - Month Wise */}
            <div style={{ marginTop: "30px", background: "#fff", padding: "20px", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)" }}>
              <h3 style={{ marginBottom: "15px", color: "#0f3b5f" }}>Collected Fees (Month-wise)</h3>
              <div className="table-wrapper">
                <table id="fees-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Amount</th>
                      <th>Month</th>
                      <th>Duration</th>
                      <th>Mode</th>
                      <th>Collected Date</th>
                      <th>Next Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {collectedFees.length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{ textAlign: "center" }}>
                          No collected fees
                        </td>
                      </tr>
                    ) : (
                      collectedFees.sort((a, b) => (a.month || "").localeCompare(b.month || "")).map((fee) => {
                        const nextDueDate = calculateNextDueDate(fee.collectedAt || fee.date, fee.feeForMonths);
                        return (
                          <tr key={fee._id}>
                            <td>
                              {fee.student?.firstName} {fee.student?.lastName || ""}
                            </td>
                            <td>₹{fee.amount}</td>
                            <td>{fee.month || "-"}</td>
                            <td>{fee.feeForMonths}</td>
                            <td style={{ textTransform: "uppercase", fontWeight: "600" }}>{fee.mode || "cash"}</td>
                            <td>{fee.collectedAt ? new Date(fee.collectedAt).toLocaleDateString() : "-"}</td>
                            <td>{nextDueDate ? new Date(nextDueDate).toLocaleDateString() : "-"}</td>
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

        {/* Reports Tab */}
        {activeTab === "reports" && (
          <section id="reports-section">
            <h2>Reports</h2>

            {/* Attendance Sheet */}
            <div style={{ marginBottom: "30px", background: "#fff", padding: "20px", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)" }}>
              <h3 style={{ marginBottom: "15px", color: "#0f3b5f" }}>Attendance Sheet</h3>
              {attendanceReport && (
                <div style={{ marginBottom: "20px" }}>
                  <p><strong>Total Records:</strong> {attendanceReport.summary?.total || 0}</p>
                  <p><strong>Present:</strong> {attendanceReport.summary?.present || 0}</p>
                  <p><strong>Absent:</strong> {attendanceReport.summary?.absent || 0}</p>
                  <p><strong>Leave:</strong> {attendanceReport.summary?.leave || 0}</p>
                </div>
              )}
              
              <div className="table-wrapper">
                <table id="fees-table">
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Coach</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceReport?.attendance?.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{ textAlign: "center" }}>No attendance records</td>
                      </tr>
                    ) : (
                      attendanceReport?.attendance?.slice(0, 20).map((record) => (
                        <tr key={record._id}>
                          <td>{record.student?.firstName} {record.student?.lastName || ""}</td>
                          <td>{new Date(record.date).toLocaleDateString()}</td>
                          <td>
                            <span style={{
                              padding: "4px 12px",
                              borderRadius: "6px",
                              fontSize: "0.85rem",
                              fontWeight: "600",
                              color: "#fff",
                              background: record.status === "present" ? "#10b981" : record.status === "absent" ? "#e53e3e" : "#f6ad55",
                            }}>
                              {record.status?.toUpperCase()}
                            </span>
                          </td>
                          <td>{record.coach?.username || "-"}</td>
                          <td>
                            <button
                              onClick={() => handleViewStudentAttendance(record.student)}
                              style={{
                                background: "linear-gradient(90deg, #3182ce, #2563eb)",
                                color: "#fff",
                                border: "none",
                                padding: "4px 10px",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontSize: "0.8rem",
                              }}
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {feesReport && (
              <div style={{ background: "#fff", padding: "20px", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)" }}>
                <h3>Fees Report Summary</h3>
                <p><strong>Total:</strong> ₹{feesReport.summary?.total || 0}</p>
                <p><strong>Collected:</strong> ₹{feesReport.summary?.collected || 0}</p>
                <p><strong>Pending:</strong> ₹{feesReport.summary?.pending || 0}</p>
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
              <select
  name="gender"
  value={studentFormData.gender || ""}
  onChange={handleStudentFormChange}
   // optional Bootstrap class for styling
>
  <option value="" disabled>
    Select Gender
  </option>
  <option value="Male">Male</option>
  <option value="Female">Female</option>
  <option value="Other">Other</option>
</select>

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
            <p>
              <strong>Password:</strong>{" "}
              <span style={{ fontFamily: "monospace", fontSize: "16px", fontWeight: "bold", color: "#0b66c3" }}>
                {selectedStudentForCredentials.password || "N/A"}
              </span>
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

      {/* Fee Marking Modal */}
      {showFeeMarkModal && selectedStudentForFees && (
        <div id="modal-overlay">
          <div id="modal-student">
            <h2>Mark Fee as Collected</h2>
            <form onSubmit={handleSubmitFeeMark}>
              <label>Payment Mode:</label>
              <select
                value={feeMarkFormData.mode}
                onChange={(e) => setFeeMarkFormData({ ...feeMarkFormData, mode: e.target.value })}
                required
              >
                <option value="cash">Cash</option>
                <option value="online">Online</option>
                <option value="cheque">Cheque</option>
                <option value="other">Other</option>
              </select>
              <label>Month:</label>
              <input
                type="month"
                value={feeMarkFormData.month}
                onChange={(e) => setFeeMarkFormData({ ...feeMarkFormData, month: e.target.value })}
                required
              />
              <div id="modal-buttons">
                <button type="submit">Mark Collected</button>
                <button
                  type="button"
                  onClick={() => {
                    setShowFeeMarkModal(false);
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

      {/* Coach Credentials Modal */}
      {showCoachCredentialsModal && selectedCoachForCredentials && (
        <div id="modal-overlay">
          <div id="modal-student">
            <h2>Coach Credentials</h2>
            <p>
              <strong>Name:</strong> {selectedCoachForCredentials.name || "N/A"}
            </p>
            <p>
              <strong>Username:</strong> {selectedCoachForCredentials.username || "N/A"}
            </p>
            <p>
              <strong>Password:</strong>{" "}
              <span style={{ fontFamily: "monospace", fontSize: "16px", fontWeight: "bold", color: "#0b66c3" }}>
                {selectedCoachForCredentials.password || "Password not available"}
              </span>
            </p>
            <div id="modal-buttons">
              <button
                type="button"
                onClick={() => {
                  setShowCoachCredentialsModal(false);
                  setSelectedCoachForCredentials(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Attendance Modal */}
      {showAttendanceModal && selectedStudentForAttendance && (
        <div id="modal-overlay">
          <div id="modal-student" style={{ maxWidth: "800px", maxHeight: "80vh", overflowY: "auto" }}>
            <h2>Attendance Details - {selectedStudentForAttendance.firstName} {selectedStudentForAttendance.lastName || ""}</h2>
            <div className="table-wrapper" style={{ marginTop: "20px" }}>
              <table id="fees-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Coach</th>
                  </tr>
                </thead>
                <tbody>
                  {studentAttendanceData.length === 0 ? (
                    <tr>
                      <td colSpan="3" style={{ textAlign: "center" }}>No attendance records</td>
                    </tr>
                  ) : (
                    studentAttendanceData.map((record) => (
                      <tr key={record._id}>
                        <td>{new Date(record.date).toLocaleDateString()}</td>
                        <td>
                          <span style={{
                            padding: "4px 12px",
                            borderRadius: "6px",
                            fontSize: "0.85rem",
                            fontWeight: "600",
                            color: "#fff",
                            background: record.status === "present" ? "#10b981" : record.status === "absent" ? "#e53e3e" : "#f6ad55",
                          }}>
                            {record.status?.toUpperCase()}
                          </span>
                        </td>
                        <td>{record.coach?.username || "-"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div id="modal-buttons">
              <button
                type="button"
                onClick={() => {
                  setShowAttendanceModal(false);
                  setSelectedStudentForAttendance(null);
                }}
              >
                Close
              </button>
            </div>
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
