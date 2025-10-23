// CoachDashboard.js
import React, { useState, useEffect, useCallback, useMemo } from "react";
import "./CoachDashboard.css"; 

// NOTE: Hardcoded images (Sachin, Rahul etc.) imports are removed since the 'Team' tab is gone.
// We keep basic imports:
// import Sachin from "../../images/Sachin.jpg"; 
// import Rahul from "../../images/RahulSir.jpg";

const CoachDashboard = () => {
    // 1. Updated Tabs: dashboard, students, fees, attendance (Removed 'team'/'reports'/'notifications')
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
    const [feeDate, setFeeDate] = useState(new Date().toISOString().slice(0, 10)); // Default to today

    // Attendance Management State
    const [attendanceSearchTerm, setAttendanceSearchTerm] = useState("");
    const [attendanceSummary, setAttendanceSummary] = useState({ presentToday: 0, totalStudents: 0 }); // For Dashboard
    const [individualAttendanceHistory, setIndividualAttendanceHistory] = useState([]); // For History Modal
    const [showHistoryModal, setShowHistoryModal] = useState(false);


    // --- Data Fetching Logic (Refactored to fetch attendance summary too) ---

    // Fetches the main student list (required for all tabs)
    const fetchStudents = useCallback(async () => {
        if (!user?.token) return;

        try {
            // Updated route to fetch students with nested fee details and User name
            const res = await fetch("http://localhost:5000/api/srcoach/coach-students", { 
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            const data = await res.json();
            if (res.ok) {
                // Assuming students now includes a feePayments array and userId is populated
                setStudents(data); 
            } else {
                console.error("Failed to fetch students:", data.message);
            }
        } catch (err) {
            console.error("Error fetching students:", err);
        }
    }, [user?.token]);

    // Fetches Attendance Summary for the Dashboard
    const fetchAttendanceSummary = useCallback(async () => {
        if (!user?.token) return;
        try {
            // 6. he can view the attancdace summary (New route needed)
            const res = await fetch("http://localhost:5000/api/coach/attendance/summary", {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            const data = await res.json();
            if (res.ok) {
                setAttendanceSummary({
                    presentToday: data.presentToday || 0,
                    totalStudents: students.length, // Fallback to local students count
                });
            }
        } catch (err) {
            console.error("Error fetching attendance summary:", err);
            // Default to local student count if API fails
            setAttendanceSummary(prev => ({ ...prev, totalStudents: students.length })); 
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
    
    // --- Calculations ---

    const totalFees = students.reduce((sum, s) => sum + (s.fees?.total || 0), 0);
    // Calculated Collected Fees from the new feePayments array structure
    const collectedFees = students.reduce((sum, s) => {
        const totalPaid = s.feePayments?.reduce((pSum, p) => pSum + (p.amount || 0), 0) || 0;
        return sum + totalPaid;
    }, 0);
    const pendingFees = totalFees - collectedFees;

    // --- Student CRUD Handlers (Kept as is for Profile editing) ---
    const handleStudentFormChange = (e) => {
        const { name, value, type } = e.target;
        setStudentFormData((prevData) => ({
            ...prevData,
            [name]: type === "number" ? parseInt(value) || "" : value,
        }));
    };

    const handleEditStudent = (student) => {
        setEditingStudent(student);
        setStudentFormData({
            ...student,
            name: student.userId?.name || student.name, 
            fees: student.fees?.total, 
            status: student.feeStatus, // Keep for legacy/initial status
            password: "", 
        });
        setShowStudentModal(true);
    };

    const handleUpdateStudent = async (e) => {
        e.preventDefault();
        
        const studentIdToUpdate = editingStudent._id;
        const feeValue = studentFormData.fees || 0;
        
        // Remove sensitive and internal fields from payload
        const { username, password, status, ...restOfData } = studentFormData;

        const updatePayload = {
            ...restOfData,
            fees: feeValue,
            // feeStatus is updated via a separate fee collection route now, but kept fees total here
        };

        try {
            // Reusing the existing SrCoach route for general student profile updates
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

    // --- 4. Fees Collection Handler ---
    const handleFeeCollection = (student) => {
        setFeeStudent(student);
        setShowFeeModal(true);
        // Reset date to today every time
        setFeeDate(new Date().toISOString().slice(0, 10)); 
    };

    const submitFeePayment = async (e) => {
        e.preventDefault();
        const amount = e.target.elements.amount.value;
        const date = feeDate;
        
        if (!feeStudent || !amount || !date) return;

        try {
            // New route needed: POST /api/coach/students/:id/fee-payment
            const res = await fetch(`http://localhost:5000/api/coach/students/${feeStudent._id}/fee-payment`, { 
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user?.token}`,
                },
                body: JSON.stringify({ amount: parseInt(amount), date }),
            });

            const result = await res.json();

            if (res.ok) {
                alert(`✅ ₹${amount} fee collected successfully from ${feeStudent.userId?.name}!`);
                await fetchStudents(); // Re-fetch all data to update fees tab/dashboard
                setShowFeeModal(false);
                setFeeStudent(null);
            } else {
                alert(result.message || "Failed to record fee payment");
            }
        } catch (err) {
            console.error(err);
            alert("Error connecting to server");
        }
    };
    
    // --- 5. Attendance Handler ---
    const handleMarkAttendance = async (student, status) => {
        const today = new Date().toISOString().slice(0, 10);
        const confirmation = window.confirm(`Mark ${student.userId?.name} as ${status} for today (${today})?`);

        if (!confirmation) return;
        
        try {
            // New route needed: POST /api/coach/attendance
            const res = await fetch("http://localhost:5000/api/coach/attendance", { 
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user?.token}`,
                },
                body: JSON.stringify({ 
                    studentId: student._id, 
                    date: today, 
                    status: status,
                    batch: student.batch // Pass batch for easier filtering/reporting
                }),
            });

            const result = await res.json();

            if (res.ok) {
                alert(`Attendance marked as ${status} for ${student.userId?.name}.`);
                // Re-fetch only the summary for the dashboard update
                fetchAttendanceSummary(); 
            } else {
                alert(result.message || "Failed to mark attendance. (Attendance already marked for today?)");
            }
        } catch (err) {
            console.error(err);
            alert("Error connecting to server");
        }
    };

    // --- 7. Individual Attendance History ---
    const handleViewAttendanceHistory = async (student) => {
        try {
            // New route needed: GET /api/coach/attendance/:studentId
            const res = await fetch(`http://localhost:5000/api/coach/attendance/${student._id}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            const data = await res.json();
            
            if (res.ok) {
                setIndividualAttendanceHistory(data);
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

        return students.filter(s => 
            s.userId?.name?.toLowerCase().includes(term) ||
            s.batch?.toLowerCase().includes(term)
        );
    }, [students, attendanceSearchTerm]);

    // --- JSX Structure (Refactored) ---

    return (
        <div id="coach-dashboard">
            {/* Sidebar (UPDATED tabs) */}
            <aside id="sidebar">
                <h2 id="sidebar-title">🏏 Coach Panel</h2>
                <ul>
                    {/* New Tabs: dashboard, students, fees, attendance */}
                    {["dashboard", "students", "fees", "attendance"].map( 
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
                    <h1>Welcome, Coach {user?.name || "User"}!</h1>
                </header>

                {/* Dashboard (Updated with Attendance Summary) */}
                {activeTab === "dashboard" && (
                    <section id="dashboard-section" className="stat-grid">
                        <div className="stat-card">
                            <h3>Total Students</h3>
                            <p>{students.length}</p>
                        </div>
                        <div className="stat-card red-bg">
                            <h3>Pending Fees</h3>
                            <p>₹{pendingFees}</p>
                        </div>
                        {/* 6. Attendance Summary */}
                        <div className="stat-card green-bg">
                            <h3>Present Today ({new Date().toLocaleDateString()})</h3>
                            <p>{attendanceSummary.presentToday} / {attendanceSummary.totalStudents}</p>
                        </div>
                    </section>
                )}
                
                {/* 1. Students Table (Full Student Management) */}
                {activeTab === "students" && (
                    <section id="students-section">
                        <h2>Manage Student Profiles</h2>
                        <div className="table-wrapper">
                            <table id="students-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Contact</th>
                                        <th>Batch</th>
                                        <th>Age</th>
                                        <th>Fees (Total)</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((s) => (
                                        <tr key={s._id}>
                                            <td>{s.userId?.name || 'N/A'}</td> 
                                            <td>{s.contact}</td>
                                            <td>{s.batch}</td>
                                            <td>{s.ageCategory}</td>
                                            <td>₹{s.fees?.total || 0}</td> 
                                            <td>
                                                <button onClick={() => handleEditStudent(s)}>Edit Profile</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {/* 3. Fees Tab (Fees collection and display) */}
                {activeTab === "fees" && (
                    <section id="fees-section">
                        <h2>Fees Management Overview</h2>
                        <div className="table-wrapper">
                            <table id="fees-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Batch</th>
                                        <th>Total Fee</th>
                                        <th>Amount Paid</th>
                                        <th>Remaining</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((s) => {
                                        const paid = s.feePayments?.reduce((pSum, p) => pSum + (p.amount || 0), 0) || 0;
                                        const remaining = (s.fees?.total || 0) - paid;
                                        const status = remaining <= 0 ? "Paid" : "Pending";

                                        return (
                                            <tr key={s._id}>
                                                <td>{s.userId?.name || 'N/A'}</td> 
                                                <td>{s.batch}</td>
                                                <td>₹{s.fees?.total || 0}</td> 
                                                <td style={{ color: '#10b981', fontWeight: 700 }}>₹{paid}</td>
                                                <td style={{ color: remaining > 0 ? '#e53e3e' : '#10b981', fontWeight: 700 }}>₹{remaining}</td>
                                                <td style={{ color: remaining > 0 ? '#e53e3e' : '#10b981', fontWeight: 700 }}>{status}</td>
                                                <td>
                                                    {/* 4. Coach can mark the fees collected with the date */}
                                                    <button 
                                                        onClick={() => handleFeeCollection(s)} 
                                                        disabled={remaining <= 0}
                                                        style={{ background: remaining > 0 ? '#f6ad55' : '#ccc' }}
                                                    >
                                                        Record Payment
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}


                {/* Attendance Section (Tab with Search) */}
                {activeTab === "attendance" && (
                    <section id="attendance-section">
                        <h2>Mark Daily Attendance</h2>
                        
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
                                        <th>Fee Status</th>
                                        <th>5. Mark Attendance</th>
                                        <th>7. History</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStudents.map((s) => {
                                        const paid = s.feePayments?.reduce((pSum, p) => pSum + (p.amount || 0), 0) || 0;
                                        const remaining = (s.fees?.total || 0) - paid;
                                        const feeStatus = remaining <= 0 ? "Paid" : "Pending";
                                        return (
                                            <tr key={s._id}>
                                                <td>{s.userId?.name || 'N/A'}</td> 
                                                <td>{s.batch}</td>
                                                <td style={{
                                                        color: feeStatus === "Paid" ? "#10b981" : "#e53e3e",
                                                        fontWeight: 700,
                                                    }}>
                                                    {feeStatus}
                                                </td>
                                                <td style={{ minWidth: '150px' }}>
                                                    <button 
                                                        className="mark-present-btn" 
                                                        onClick={() => handleMarkAttendance(s, 'Present')}
                                                    >
                                                        Present
                                                    </button>
                                                    <button 
                                                        className="mark-absent-btn" 
                                                        onClick={() => handleMarkAttendance(s, 'Absent')}
                                                        style={{ marginLeft: '5px', background: '#e53e3e' }}
                                                    >
                                                        Absent
                                                    </button>
                                                </td>
                                                <td>
                                                    <button 
                                                        className="history-btn"
                                                        onClick={() => handleViewAttendanceHistory(s)}
                                                        style={{ background: '#3182ce' }}
                                                    >
                                                        View History
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}
            </main>

            {/* Edit Student Modal (For profile/total fee update) */}
            {showStudentModal && (
                <div id="modal-overlay">
                    <div id="modal-student">
                        <h2>Edit Student Profile: {editingStudent?.userId?.name}</h2>
                        <form onSubmit={handleUpdateStudent}>
                            {/* ... (inputs for name, contact, batch, fees total, etc. - KEPT AS IS) */}
                            <input name="name" placeholder="Full Name" value={studentFormData.name || ""} onChange={handleStudentFormChange} required />
                            <input name="contact" placeholder="Contact" value={studentFormData.contact || ""} onChange={handleStudentFormChange} />
                            <input name="address" placeholder="Address" value={studentFormData.address || ""} onChange={handleStudentFormChange} />
                            <input name="school" placeholder="School" value={studentFormData.school || ""} onChange={handleStudentFormChange} />
                            <input name="ageCategory" placeholder="Age Category" value={studentFormData.ageCategory || ""} onChange={handleStudentFormChange} />
                            <input name="batch" placeholder="Batch" value={studentFormData.batch || ""} onChange={handleStudentFormChange} />
                            <input name="timings" placeholder="Timings" value={studentFormData.timings || ""} onChange={handleStudentFormChange} />
                            <input type="number" name="fees" placeholder="Total Fees" value={studentFormData.fees || ""} onChange={handleStudentFormChange} />
                            {/* Disabled/Hidden fields */}
                            <input name="username" placeholder="Username" value={editingStudent?.userId?.username || ""} disabled style={{ display: 'none' }} /> 
                            <input type="password" name="password" placeholder="New Password (optional)" disabled style={{ display: 'none' }} />
                            <select name="status" value={studentFormData.status || "Pending"} disabled style={{ display: 'none' }}>
                                <option value="Pending">Pending</option>
                                <option value="Paid">Paid</option>
                            </select>
                            
                            <div id="modal-buttons">
                                <button type="submit">Update Profile</button>
                                <button type="button" onClick={() => { setShowStudentModal(false); setEditingStudent(null); setStudentFormData({}); }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            {/* 4. Fee Collection Modal (NEW) */}
            {showFeeModal && feeStudent && (
                <div id="modal-overlay">
                    <div id="modal-student">
                        <h2>Record Payment for: {feeStudent.userId?.name}</h2>
                        <form onSubmit={submitFeePayment}>
                            <label>Payment Amount:</label>
                            <input type="number" name="amount" placeholder="Amount collected (₹)" required />
                            
                            <label>Payment Date:</label>
                            <input 
                                type="date" 
                                name="date" 
                                value={feeDate} 
                                onChange={(e) => setFeeDate(e.target.value)} 
                                required 
                            />
                            
                            <div id="modal-buttons">
                                <button type="submit">Record Payment</button>
                                <button type="button" onClick={() => { setShowFeeModal(false); setFeeStudent(null); }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 7. Attendance History Modal (NEW) */}
            {showHistoryModal && (
                <div id="modal-overlay">
                    <div id="modal-history">
                        <h2>Attendance History: {individualAttendanceHistory[0]?.studentName || 'Student'}</h2>
                        <div className="table-wrapper">
                            <table id="history-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Batch</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {individualAttendanceHistory.map((item, index) => (
                                        <tr key={index}>
                                            <td>{new Date(item.date).toLocaleDateString()}</td>
                                            <td style={{ color: item.status === 'Present' ? '#10b981' : '#e53e3e', fontWeight: 700 }}>
                                                {item.status}
                                            </td>
                                            <td>{item.batch}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div id="modal-buttons" style={{ marginTop: '20px' }}>
                            <button type="button" onClick={() => { setShowHistoryModal(false); setIndividualAttendanceHistory([]); }}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CoachDashboard;