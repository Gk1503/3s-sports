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
  // Ensure user is correctly parsed and accessible
  const user = JSON.parse(localStorage.getItem("user"));

  const [students, setStudents] = useState([]);
  // ✅ Coaches data is now fetched from the backend, initialize as empty array
  const [coaches, setCoaches] = useState([]);

  const [notifications, setNotifications] = useState([
    { msg: "Practice session scheduled for Sunday 7 AM", time: "2 hrs ago" },
  ]);

  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showCoachModal, setShowCoachModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  // ✅ editingCoach now holds the coach object being edited
  const [editingCoach, setEditingCoach] = useState(null);
  // Renamed to 'studentFormData' for clarity in modals
  const [studentFormData, setStudentFormData] = useState({});
  // Renamed to 'coachFormData' to manage Add/Edit Coach form data
  const [coachFormData, setCoachFormData] = useState({});
  const [newNotification, setNewNotification] = useState("");

  // Handler for coach form input changes
  const handleCoachFormChange = (e) => {
    const { name, value } = e.target;
    setCoachFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // ✅ Extracted the fetch logic into a useCallback function for cleaner usage
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

  // ✅ New fetch logic for Coaches
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
        // Data structure: [{_id, userId: {_id, name, username}, specialization, contact}]
        setCoaches(data);
      } else {
        console.error("Failed to fetch coaches:", data.message);
      }
    } catch (err) {
      console.error("Error fetching coaches:", err);
    }
  }, [user?.token]);

  // Initial data fetch
  useEffect(() => {
    fetchStudents();
    // ✅ Fetch coaches data on component load
    fetchCoaches();
  }, [fetchStudents, fetchCoaches]);

  // Fee Stats Calculation
  const totalFees = students.reduce((sum, s) => sum + (s.fees?.total || 0), 0);
  const collectedFees = students
    .filter((s) => s.feeStatus === "Paid")
    .reduce((sum, s) => sum + (s.fees?.total || 0), 0);
  const pendingFees = totalFees - collectedFees;

  const feeData = [
    { name: "Collected", amount: collectedFees },
    { name: "Pending", amount: pendingFees },
  ];

  // Handler for student form input changes (unchanged)
  const handleStudentFormChange = (e) => {
    const { name, value, type } = e.target;
    setStudentFormData((prevData) => ({
      ...prevData,
      [name]: type === "number" ? parseInt(value) || "" : value,
    }));
  };

  // Student CRUD handlers (unchanged)
  const handleAddStudent = async (e) => {
    e.preventDefault();

    const feeValue = studentFormData.fees || 0;
    const feeStatus = studentFormData.status || "Pending";

    const studentDataToSend = {
      ...studentFormData,
      fees: feeValue,
      status: feeStatus,
    };

    try {
      const res = await fetch("http://localhost:5000/api/srcoach/add-student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(studentDataToSend),
      });

      const result = await res.json();

      if (res.ok) {
        alert("✅ Student added successfully!");
        await fetchStudents();

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
      ...student,
      name: student.userId?.name || student.name,
      fees: student.fees?.total,
      status: student.feeStatus,
      password: "",
    });
    setShowStudentModal(true);
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();

    const studentIdToUpdate = editingStudent._id;
    const feeValue = studentFormData.fees || 0;
    const feeStatus = studentFormData.status || "Pending";

    const updatePayload = {
      ...studentFormData,
      fees: feeValue,
      status: feeStatus,
      password: studentFormData.password || undefined,
    };

    try {
      const res = await fetch(`http://localhost:5000/api/srcoach/students/${studentIdToUpdate}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(updatePayload),
      });

      const result = await res.json();

      if (res.ok) {
        alert("✅ Student updated successfully!");
        // Rerunning fetchStudents is the safest way to ensure stats are updated correctly
        await fetchStudents();

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
    if (!window.confirm("Are you sure you want to delete this student? This action cannot be undone.")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/srcoach/students/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (res.ok) {
        alert("✅ Student deleted successfully!");
        setStudents(students.filter((s) => s._id !== id));
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete student");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    }
  };

  // --------------------------------------------------------------------------
  // ✅ UPDATED COACH HANDLERS - NOW CONNECTED TO BACKEND
  // --------------------------------------------------------------------------

  // Handler for setting up the Edit Coach Modal
  const handleEditCoach = (coach) => {
    setEditingCoach(coach);
    // Initialize form data from the coach object. Name comes from the populated userId.
    setCoachFormData({
      name: coach.userId.name,
      specialization: coach.specialization,
      contact: coach.contact,
    });
    setShowCoachModal(true);
  };

  // Handler for adding/updating a coach
  const handleAddCoach = async (e) => {
    e.preventDefault();
    const isEditing = !!editingCoach;
    const url = isEditing
      ? `http://localhost:5000/api/srcoach/coaches/${editingCoach._id}`
      : "http://localhost:5000/api/srcoach/coaches";
    const method = isEditing ? "PUT" : "POST";
    
    // For editing, we don't send username/password.
    // For adding, we need username/password (ensure fields are added to the modal)
    const payload = isEditing ? coachFormData : {
      ...coachFormData,
      // Add a placeholder password/username if not explicitly in the modal yet
      // For a robust system, these inputs must be in the modal!
      username: coachFormData.username || (isEditing ? undefined : `coach${Date.now()}`),
      password: coachFormData.password || (isEditing ? undefined : 'default123'), 
    };

    try {
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
        await fetchCoaches(); // Re-fetch all coaches

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
    if (!window.confirm("Are you sure you want to delete this coach and their associated user account?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/srcoach/coaches/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (res.ok) {
        alert("✅ Coach deleted successfully!");
        setCoaches(coaches.filter((c) => c._id !== id));
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete coach");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    }
  };

  const handleSendNotification = (e) => {
    e.preventDefault();
    setNotifications([{ msg: newNotification, time: "Just now" }, ...notifications]);
    setNewNotification("");
  };

  // --- Start of JSX ---
  return (
    <div id="srcoach-dashboard">
      {/* Sidebar */}
      <aside id="sidebar">
        <h2 id="sidebar-title">🏏 3Sports</h2>
        <ul>
          {["overview", "students", "coaches", "fees", "notifications", "reports"].map(
            (tab) => (
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
            )
          )}
        </ul>
      </aside>

      {/* Main Content */}
      <main id="main-content">
        <header id="main-header">
          <h1>Senior Coach Dashboard</h1>
        </header>

        {/* Overview (unchanged) */}
        {activeTab === "overview" && (
          <section id="overview-section">
            <div id="stat-total-students">
              <h3>Total Students</h3>
              <p>{students.length}</p>
            </div>
            <div id="stat-total-coaches">
              <h3>Total Coaches</h3>
              <p>{coaches.length}</p>
            </div>
            <div id="stat-collected-fees">
              <h3>Collected Fees</h3>
              <p>₹{collectedFees}</p>
            </div>
            <div id="stat-pending-fees">
              <h3>Pending Fees</h3>
              <p>₹{pendingFees}</p>
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

        {/* Students Table (unchanged) */}
        {activeTab === "students" && (
          <section id="students-section">
            <div id="students-header">
              <h2>Manage Students</h2>
              <button id="students-add-btn" onClick={() => {setShowStudentModal(true); setEditingStudent(null); setStudentFormData({});}}>
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
                      <th>Age</th>
                      <th>Fees</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s) => (
                      <tr key={s._id}>
                        {/* Access name from the populated userId object */}
                        <td>{s.userId?.name || 'N/A'}</td>
                        <td>{s.contact}</td>
                        <td>{s.batch}</td>
                        <td>{s.ageCategory}</td>
                        {/* Access total fees from the nested fees object */}
                        <td>₹{s.fees?.total || 0}</td>
                        <td
                          style={{
                            // Use feeStatus directly from the document
                            color: s.feeStatus === "Paid" ? "#10b981" : "#e53e3e",
                            fontWeight: 700,
                          }}
                        >
                          {s.feeStatus}
                        </td>
                        <td>
                          <button onClick={() => handleEditStudent(s)}>Edit</button>
                          <button onClick={() => handleDeleteStudent(s._id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
          </section>
        )}

        {/* Coaches Table (UPDATED to use dynamic data) */}
        {activeTab === "coaches" && (
          <section id="coaches-section" className="full-width-section">
            <div id="coaches-header">
              <h2>Manage Coaches</h2>
              <button id="coaches-add-btn" onClick={() => {setShowCoachModal(true); setEditingCoach(null); setCoachFormData({});}}>
                + Add Coach
              </button>
            </div>
            <div className="table-wrapper">
              <table id="coaches-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Specialization</th>
                    <th>Contact</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Map over coaches fetched from the backend */}
                  {coaches.map((c) => (
                    <tr key={c._id}>
                      {/* Access name from the populated userId object */}
                      <td>{c.userId?.name || 'N/A'}</td> 
                      <td>{c.specialization}</td>
                      <td>{c.contact}</td>
                      <td>
                        <button id={`edit-coach-${c._id}`} onClick={() => handleEditCoach(c)}>
                          Edit
                        </button>
                        <button id={`delete-coach-${c._id}`} onClick={() => handleDeleteCoach(c._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Fees, Notifications, Reports (unchanged) */}
        {activeTab === "fees" && (
          <section id="fees-section">
            <div id="fee-collected">
              <h3>Collected Fees</h3>
              <p>₹{collectedFees}</p>
            </div>
            <div id="fee-pending">
              <h3>Pending Fees</h3>
              <p>₹{pendingFees}</p>
            </div>
          </section>
        )}

        {activeTab === "notifications" && (
          <section id="notifications-section">
            <h2>Notifications</h2>
            <form id="notify-form" onSubmit={handleSendNotification}>
              <textarea
                value={newNotification}
                onChange={(e) => setNewNotification(e.target.value)}
                placeholder="Type a notification..."
                required
              />
              <button type="submit">Send</button>
            </form>
            <div id="notification-list">
              {notifications.map((n, i) => (
                <div id={`notify-card-${i}`} key={i}>
                  <p>{n.msg}</p>
                  <span>{n.time}</span>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {activeTab === "reports" && (
            <section id="reports-section">
              <h2>Reports</h2>
              <p>Reports and analytics coming soon!</p>
            </section>
          )}
      </main>

      {/* Add/Edit Student Modal (unchanged) */}
      {showStudentModal && (
        <div id="modal-overlay">
          <div id="modal-student">
            <h2>{editingStudent ? "Edit Student" : "Add Student"}</h2>
            <form onSubmit={editingStudent ? handleUpdateStudent : handleAddStudent}>
              <input name="name" placeholder="Full Name" value={studentFormData.name || ""} onChange={handleStudentFormChange} required />
              <input name="username" placeholder="Username" value={studentFormData.username || ""} onChange={handleStudentFormChange} required={!editingStudent} disabled={!!editingStudent}/>
              <input type="password" name="password" placeholder={editingStudent ? "New Password (optional)" : "Password"} value={studentFormData.password || ""} onChange={handleStudentFormChange} required={!editingStudent} />
              <input name="contact" placeholder="Contact" value={studentFormData.contact || ""} onChange={handleStudentFormChange} />
              <input name="address" placeholder="Address" value={studentFormData.address || ""} onChange={handleStudentFormChange} />
              <input name="school" placeholder="School" value={studentFormData.school || ""} onChange={handleStudentFormChange} />
              <input name="ageCategory" placeholder="Age Category" value={studentFormData.ageCategory || ""} onChange={handleStudentFormChange} />
              <input name="batch" placeholder="Batch" value={studentFormData.batch || ""} onChange={handleStudentFormChange} />
              <input name="timings" placeholder="Timings" value={studentFormData.timings || ""} onChange={handleStudentFormChange} />
              <input type="number" name="fees" placeholder="Total Fees" value={studentFormData.fees || ""} onChange={handleStudentFormChange} />
              <select name="status" value={studentFormData.status || "Pending"} onChange={handleStudentFormChange}>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
              </select>
              <div id="modal-buttons">
                <button type="submit">{editingStudent ? "Update" : "Add"}</button>
                <button type="button" onClick={() => { setShowStudentModal(false); setEditingStudent(null); setStudentFormData({}); }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Coach Modal (UPDATED to use coachFormData and include User fields) */}
      {showCoachModal && (
        <div id="modal-overlay">
          <div id="modal-coach">
            <h2>{editingCoach ? "Edit Coach" : "Add Coach"}</h2>
            {/* The submission handler is now generic for both Add/Edit */}
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
                    required={!editingCoach} 
                  />
                  <input 
                    type="password" 
                    name="password" 
                    placeholder="Password" 
                    value={coachFormData.password || ""} 
                    onChange={handleCoachFormChange} 
                    required={!editingCoach} 
                  />
                </>
              )}
              <input 
                name="specialization" 
                placeholder="Specialization" 
                value={coachFormData.specialization || ""} 
                onChange={handleCoachFormChange} 
              />
              <input 
                name="contact" 
                placeholder="Contact" 
                value={coachFormData.contact || ""} 
                onChange={handleCoachFormChange} 
              />
              <div id="modal-buttons">
                <button type="submit">{editingCoach ? "Update" : "Add"}</button>
                <button type="button" onClick={() => { setShowCoachModal(false); setEditingCoach(null); setCoachFormData({}); }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeniorCoachDashboard;