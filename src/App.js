import React from "react";
import { Routes, Route } from "react-router-dom";
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

function App() {
  return (
<>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/academy" element={<Academy />} />
        <Route path="/coaches" element={<Coaches />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/srcoach-dashboard" element={<SeniorCoachDashboard />} />
      </Routes>
      <Footer />
</>
  );
}

export default App;
