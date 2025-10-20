import React, { useState } from "react";
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

  // Sample Data
  const [students, setStudents] = useState([
    {
      name: "Aakash Patel",
      contact: "9876543210",
      address: "Chennai",
      school: "DAV School",
      ageCategory: "U-14",
      batch: "A",
      timings: "6 AM - 8 AM",
      fees: 4000,
      status: "Paid",
    },
    {
      name: "Anuj Sharma",
      contact: "9823412398",
      address: "Coimbatore",
      school: "PSG School",
      ageCategory: "U-16",
      batch: "B",
      timings: "8 AM - 10 AM",
      fees: 5000,
      status: "Pending",
    },
  ]);

  const [coaches, setCoaches] = useState([
    { name: "Rahul Verma", specialization: "Batting", contact: "9998844220" },
    { name: "Suresh Nair", specialization: "Bowling", contact: "8881234567" },
  ]);

  const [notifications, setNotifications] = useState([
    { msg: "Practice session scheduled for Sunday 7 AM", time: "2 hrs ago" },
  ]);

  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showCoachModal, setShowCoachModal] = useState(false);
  const [newStudent, setNewStudent] = useState({});
  const [newCoach, setNewCoach] = useState({});
  const [newNotification, setNewNotification] = useState("");

  // Fee Stats
  const totalFees = students.reduce((sum, s) => sum + s.fees, 0);
  const collectedFees = students
    .filter((s) => s.status === "Paid")
    .reduce((sum, s) => sum + s.fees, 0);
  const pendingFees = totalFees - collectedFees;

  const feeData = [
    { name: "Collected", amount: collectedFees },
    { name: "Pending", amount: pendingFees },
  ];

  // Add Student
  const handleAddStudent = (e) => {
    e.preventDefault();
    setStudents([...students, newStudent]);
    setNewStudent({});
    setShowStudentModal(false);
  };

  // Add Coach
  const handleAddCoach = (e) => {
    e.preventDefault();
    setCoaches([...coaches, newCoach]);
    setNewCoach({});
    setShowCoachModal(false);
  };

  // Send Notification
  const handleSendNotification = (e) => {
    e.preventDefault();
    const now = new Date().toLocaleTimeString();
    setNotifications([
      { msg: newNotification, time: `Just now` },
      ...notifications,
    ]);
    setNewNotification("");
  };

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
                className={activeTab === tab ? "active" : ""}
                onClick={() => setActiveTab(tab)}
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

        {/* Overview */}
        {activeTab === "overview" && (
          <section id="overview-section">
            <div className="stat-card">
              <h3>Total Students</h3>
              <p>{students.length}</p>
            </div>
            <div className="stat-card">
              <h3>Total Coaches</h3>
              <p>{coaches.length}</p>
            </div>
            <div className="stat-card">
              <h3>Collected Fees</h3>
              <p>₹{collectedFees}</p>
            </div>
            <div className="stat-card">
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

        {/* Students */}
        {activeTab === "students" && (
          <section id="students-section">
            <div className="section-header">
              <h2>Manage Students</h2>
              <button onClick={() => setShowStudentModal(true)}>+ Add Student</button>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Batch</th>
                  <th>Age</th>
                  <th>Fees</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr key={i}>
                    <td>{s.name}</td>
                    <td>{s.contact}</td>
                    <td>{s.batch}</td>
                    <td>{s.ageCategory}</td>
                    <td>₹{s.fees}</td>
                    <td className={s.status === "Paid" ? "paid" : "pending"}>
                      {s.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* Coaches */}
        {activeTab === "coaches" && (
          <section id="coaches-section">
            <div className="section-header">
              <h2>Manage Coaches</h2>
              <button onClick={() => setShowCoachModal(true)}>+ Add Coach</button>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Specialization</th>
                  <th>Contact</th>
                </tr>
              </thead>
              <tbody>
                {coaches.map((c, i) => (
                  <tr key={i}>
                    <td>{c.name}</td>
                    <td>{c.specialization}</td>
                    <td>{c.contact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* Fees */}
        {activeTab === "fees" && (
          <section id="fees-section">
            <h2>Fee Summary</h2>
            <div className="fee-cards">
              <div className="fee-card">
                <h3>Collected Fees</h3>
                <p>₹{collectedFees}</p>
              </div>
              <div className="fee-card">
                <h3>Pending Fees</h3>
                <p>₹{pendingFees}</p>
              </div>
            </div>
          </section>
        )}

        {/* Notifications */}
        {activeTab === "notifications" && (
          <section id="notifications-section">
            <h2>Notifications</h2>
            <form onSubmit={handleSendNotification} id="notify-form">
              <textarea
                placeholder="Type a notification..."
                value={newNotification}
                onChange={(e) => setNewNotification(e.target.value)}
                required
              ></textarea>
              <button type="submit">Send</button>
            </form>

            <div id="notification-list">
              {notifications.map((n, i) => (
                <div key={i} className="notify-card">
                  <p>{n.msg}</p>
                  <span>{n.time}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Add Student Modal */}
      {showStudentModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add Student</h2>
            <form onSubmit={handleAddStudent}>
              <input
                placeholder="Name"
                onChange={(e) =>
                  setNewStudent({ ...newStudent, name: e.target.value })
                }
                required
              />
              <input
                placeholder="Contact"
                onChange={(e) =>
                  setNewStudent({ ...newStudent, contact: e.target.value })
                }
              />
              <input
                placeholder="Address"
                onChange={(e) =>
                  setNewStudent({ ...newStudent, address: e.target.value })
                }
              />
              <input
                placeholder="School"
                onChange={(e) =>
                  setNewStudent({ ...newStudent, school: e.target.value })
                }
              />
              <input
                placeholder="Age Category"
                onChange={(e) =>
                  setNewStudent({ ...newStudent, ageCategory: e.target.value })
                }
              />
              <input
                placeholder="Batch"
                onChange={(e) =>
                  setNewStudent({ ...newStudent, batch: e.target.value })
                }
              />
              <input
                placeholder="Timings"
                onChange={(e) =>
                  setNewStudent({ ...newStudent, timings: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Fees"
                onChange={(e) =>
                  setNewStudent({
                    ...newStudent,
                    fees: parseInt(e.target.value),
                  })
                }
              />
              <select
                onChange={(e) =>
                  setNewStudent({ ...newStudent, status: e.target.value })
                }
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
              </select>
              <div className="modal-buttons">
                <button type="submit">Add</button>
                <button onClick={() => setShowStudentModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Coach Modal */}
      {showCoachModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add Coach</h2>
            <form onSubmit={handleAddCoach}>
              <input
                placeholder="Name"
                onChange={(e) =>
                  setNewCoach({ ...newCoach, name: e.target.value })
                }
                required
              />
              <input
                placeholder="Specialization"
                onChange={(e) =>
                  setNewCoach({ ...newCoach, specialization: e.target.value })
                }
              />
              <input
                placeholder="Contact"
                onChange={(e) =>
                  setNewCoach({ ...newCoach, contact: e.target.value })
                }
              />
              <div className="modal-buttons">
                <button type="submit">Add</button>
                <button onClick={() => setShowCoachModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeniorCoachDashboard;
