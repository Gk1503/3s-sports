import React from "react";
import "./Academy.css";
import academyImg from "../../images/ground.jpg";
import SrCoach from "../../images/SrCoach.jpg";
import coach2 from "../../images/Coach1.jpg";
import coach3 from "../../images/Coach1.jpg";
import ground from "../../images/ground.jpg";
import nets from "../../images/Practice.jpg";
import gym from "../../images/Match.jpg";
import trophy from "../../images/TrophyWin.jpg";

const AcademyPage = () => {
  return (
    <div id="academy-page">
      {/* Hero Section */}
      <section id="hero-section">
        <img src={academyImg} alt="Academy Banner" className="hero-image" />
        <div id="hero-overlay">
          <h1 id="hero-title">Welcome to 3SPORTS Cricket Academy</h1>
          <p id="hero-subtitle">
            Excellence, Discipline & Team Spirit — The Future of Cricket Begins Here.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section id="about-section">
        <h2>About Our Academy</h2>
        <p>
          3SPORTS Cricket Academy is a professional coaching center dedicated to nurturing
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
      <section id="coaches-section">
        <h2>Our Expert Coaches</h2>
        <div id="coach-cards">
          {[
            { img: SrCoach, name: "Sachin suryavanshi", role: "Senior Coach & Mentor", exp: "10+ Years" },
            { img: coach2, name: "Amit Singh", role: "Batting Coach", exp: "8+ Years" },
            { img: coach3, name: "Vikram Rao", role: "Bowling Coach", exp: "7+ Years" }
          ].map((coach, index) => (
            <div id="coach-card" key={index}>
              <img src={coach.img} alt={coach.name} />
              <h3>{coach.name}</h3>
              <p>{coach.role}</p>
              <span>{coach.exp} Experience</span>
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
            <p>For state/national-level players focusing on strategy, mental strength, and match simulations.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials-section">
        <h2>What Our Students Say</h2>
        <div id="testimonials">
          <div id="testimonial-card">
            <p>
              “3SPORTS helped me improve my batting and game awareness. The coaches are
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
        <h2>Join 3SPORTS Cricket Academy Today!</h2>
        <p>Train with the best and take your cricket career to the next level.</p>
        <button id="join-btn">Enroll Now</button>
      </section>
    </div>
  );
};

export default AcademyPage;
