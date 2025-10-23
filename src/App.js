import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Components
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Academy from "./components/Academy/Academy";
import Coaches from "./components/Coaches/Coaches";
import Matches from "./components/Matches/Matches";
import Gallery from "./components/Gallery/Gallery";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";
import StudentDashboard from "./components/StudentDashboard/StudentDashboard";
import SeniorCoachDashboard from "./components/SeniorCoachDashboard/SeniorCoachDashboard";
import CoachDashboard from "./components/CoachDashboard/CoachDashboard";
import NotFound from "./components/common/NotFound";



// ✅ Protected Route
const ProtectedRoute = ({ children, allowedRoles }) => {
const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.role) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.warn(`Access Denied: ${user.role}`);
    return <Navigate to="/" replace />;
  }

  return children;
};

// ✅ Main App Content
function AppContent() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/academy" element={<Academy />} />
        <Route path="/coaches" element={<Coaches />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />

        {/* Protected Dashboard Routes */}
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/coach-dashboard"
          element={
            <ProtectedRoute allowedRoles={["coach", "srCoach"]}>
              <CoachDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/srcoach-dashboard"
          element={
            <ProtectedRoute allowedRoles={["srCoach"]}>
              <SeniorCoachDashboard />
            </ProtectedRoute>
          }
        />

        {/* 404 Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

export default AppContent;
