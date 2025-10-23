import React from "react";
import "./Academy.css";
import { useNavigate } from "react-router-dom";

import academyImg from "../../images/ground.jpg";
import ground from "../../images/ground.jpg";
import nets from "../../images/Practice.jpg";
import gym from "../../images/Match.jpg";
import trophy from "../../images/TrophyWin.jpg";
import Sachin from "../../images/Sachin.jpg";
import Siddhesh from "../../images/Siddesh.jpg";
import Suddarshan from "../../images/Sudarshan.jpg";
import Mahesh from "../../images/Mahesh.jpg";
import Rahul from "../../images/RahulSir.jpg";

const AcademyPage = () => {
  const navigate = useNavigate();

  const handleJoinClick = () => {
    navigate("/contact");
  };

  return (
    <div id="academy-page">
      {/* Hero Section */}
      <section id="hero-section">
        <img src={academyImg} alt="Academy Banner" className="hero-image" />
        <div id="hero-overlay">
          <h1 id="hero-title">Welcome to 3S SPORTS Cricket Academy</h1>
          <p id="hero-subtitle">
            Excellence, Discipline & Team Spirit — The Future of Cricket Begins Here.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section id="about-section">
        <h2>About Our Academy</h2>
        <p>
          3S SPORTS Cricket Academy is a professional coaching center dedicated to nurturing
          young talent with structured training programs, certified coaches, and
          world-class facilities. Our mission is to develop skilled, confident, and
          disciplined cricketers who excel on and off the field.
        </p>
        <div id="about-grid">
          <div id="about-card">
            <h3>🏏 Vision</h3>
            <p>
              To create a generation of technically sound and mentally strong cricketers
              who can compete at national and international levels.
            </p>
          </div>
          <div id="about-card">
            <h3>🎯 Mission</h3>
            <p>
              To provide structured, personalized coaching through technology-driven
              performance tracking and mentoring.
            </p>
          </div>
        </div>
      </section>

      {/* Coaches Section */}
      <section id="coaches-showcase">
        <h2>Our Expert Coaches</h2>
        <div className="coach-container">
          {[
            { img: Sachin, name: "Sachin Suryavanshi", role: "Head Coach & Mentor", exp: "10+ Years" },
            { img: Siddhesh, name: "Siddhesh Darde", role: "Coach", exp: "8+ Years" },
            { img: Suddarshan, name: "Sudarshan Bansode", role: "Coach", exp: "7+ Years" },
            { img: Mahesh, name: "Mahesh Bharambe", role: "Coach", exp: "7+ Years" },
            { img: Rahul, name: "Rahul Bhagat", role: "Coach", exp: "4+ Years" },
          ].map((coach, index) => (
            <div className="coach-profile" key={index}>
              <div className="coach-img-wrapper">
                <img src={coach.img} alt={coach.name} className="coach-img" />
              </div>
              <h3 className="coach-name">{coach.name}</h3>
              <p className="coach-role">{coach.role}</p>
              <span className="coach-exp">{coach.exp} Experience</span>
            </div>
          ))}
        </div>
      </section>

      {/* Facilities Section */}
      <section id="facilities-section">
        <h2>Our Facilities</h2>
        <div id="facility-gallery">
          {[ground, nets, gym, trophy].map((img, i) => (
            <div id="facility-card" key={i}>
              <img src={img} alt="Facility" />
            </div>
          ))}
        </div>
      </section>

      {/* Training Programs */}
      <section id="training-section">
        <h2>Training Programs</h2>
        <div id="training-grid">
          <div id="training-card">
            <h3>Beginner Batch</h3>
            <p>For ages 8–12. Focus on fundamentals, grip, stance, and basic fitness.</p>
          </div>
          <div id="training-card">
            <h3>Intermediate Batch</h3>
            <p>For ages 13–17. Advanced batting, bowling drills, and field awareness.</p>
          </div>
          <div id="training-card">
            <h3>Advanced Batch</h3>
            <p>
              For state/national-level players focusing on strategy, mental strength, and
              match simulations.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials-section">
        <h2>What Our Students Say</h2>
        <div id="testimonials">
          <div id="testimonial-card">
            <p>
              “3S SPORTS helped me improve my batting and game awareness. The coaches are
              very supportive!”
            </p>
            <h4>– Arjun Sharma</h4>
          </div>
          <div id="testimonial-card">
            <p>
              “The best cricket academy with digital progress tracking and excellent
              facilities!”
            </p>
            <h4>– Karan Patel</h4>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section id="cta-section">
        <h2>Join 3S SPORTS Cricket Academy Today!</h2>
        <p>Train with the best and take your cricket career to the next level.</p>
        <button onClick={handleJoinClick} id="join-btn">
          Enroll Now
        </button>
      </section>
    </div>
  );
};

export default AcademyPage;
