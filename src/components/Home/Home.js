import React, { useState, useEffect } from "react";
import "./Home.css";
import coach1 from "../../images/Coach1.jpg";
import Training from "../../images/Traning.jpg";
import Practice from "../../images/Practice.jpg";
import Team from "../../images/Team.jpg";
import Match from "../../images/Match.jpg";
import SrCoach from "../../images/Coach1.jpg";

// Hero images for slideshow
import Hero1 from "../../images/ground.jpg";
import Hero2 from "../../images/Team.jpg";
import Hero3 from "../../images/Practice.jpg";

const Home = () => {
  const [currentHero, setCurrentHero] = useState(0);
  const heroImages = [Hero1, Hero2, Hero3];

  // Change hero image every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const coaches = [
    { name: "Coach A", role: "Senior Coach", image: coach1 },
    { name: "Coach B", role: "Batting Coach", image: coach1 },
    { name: "Coach C", role: "Bowling Coach", image: coach1 },
    { name: "Coach D", role: "Fielding Coach", image: coach1 },
    { name: "Coach E", role: "Fitness Coach", image: coach1 },
  ];

  const programs = [
    { title: "Batting Mastery", desc: "Perfect your stance, shot selection, and power hitting.", icon: "🏏" },
    { title: "Bowling Accuracy", desc: "Master pace, swing, spin, and line control.", icon: "🎯" },
    { title: "Fielding Focus", desc: "Sharpen your reflexes, agility, and catching skills.", icon: "🧤" },
    { title: "Fitness & Conditioning", desc: "Enhance endurance and build athletic strength.", icon: "💪" },
  ];

  const testimonials = [
    { name: "Rahul Sharma", text: "The coaches are amazing! My batting improved in just 2 months.", rating: 5 },
    { name: "Ananya Patel", text: "Professional environment with digital performance tracking.", rating: 5 },
    { name: "Ravi Desai", text: "Great academy with real-time stats and video analysis!", rating: 4 },
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section
        className="hero-section"
        style={{
          background: `linear-gradient(
            rgba(0, 0, 0, 0.4),
            rgba(0, 0, 0, 0.8)
          ), url(${heroImages[currentHero]}) center/cover no-repeat`,
          transition: "background 1s ease-in-out",
        }}
      >
        <div className="hero-overlay">
          <h1>
            <span className="highlight">3Sports</span> Cricket Academy
          </h1>
          <p>Train. Perform. Excel. The Digital Way.</p>
          <a href="#programs" className="cta-btn">
            Explore Programs
          </a>
        </div>
        <div className="scroll-indicator">↓</div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <h2>About Our Academy</h2>
        <p>
          Welcome to <strong>3Sports Cricket Academy</strong> — a revolution in digital cricket training.
          Our platform integrates technology with performance, making cricket smarter, faster, and data-driven.
          Experience coaching like never before, where passion meets precision.
        </p>
      </section>

      {/* Senior Coach Message */}
      <section className="mentor-message-section">
        <div className="mentor-card">
          <img src={SrCoach} alt="Senior Coach" className="mentor-image" />
          <div className="mentor-text">
            <h3>Mr. Arjun Mehta</h3>
            <p className="mentor-role">Senior Coach & Mentor</p>
            <p>
              "At <strong>3Sports Cricket Academy</strong>, our goal is not only to develop skilled cricketers
              but also disciplined, confident, and resilient athletes. We believe in blending traditional
              coaching wisdom with modern digital performance tracking to unlock each player's true potential."
            </p>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="programs-section">
        <h2>Our Elite Programs</h2>
        <div className="programs-grid">
          {programs.map((prog, index) => (
            <div className="program-card" key={index}>
              <span className="program-icon">{prog.icon}</span>
              <h3>{prog.title}</h3>
              <p>{prog.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Coaches Section */}
      <section id="coaches" className="coaches-section">
        <h2>Meet Our Coaches</h2>
        <div className="coaches-grid">
          {coaches.map((coach, index) => (
            <div className="coach-card" key={index}>
              <img src={coach.image} alt={coach.name} />
              <div className="coach-info">
                <h3>{coach.name}</h3>
                <p>{coach.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2>Players’ Voices</h2>
        <div className="testimonials-grid">
          {testimonials.map((t, index) => (
            <div className="testimonial-card" key={index}>
              <p className="testimonial-text">“{t.text}”</p>
              <div className="testimonial-rating">{"⭐".repeat(t.rating)}</div>
              <h4>- {t.name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery Section */}
      <section className="gallery-section">
        <h2>Academy Highlights</h2>
        <div className="gallery-grid">
          <img src={Training} alt="Training" />
          <img src={Practice} alt="Practice" />
          <img src={Match} alt="Match" />
          <img src={Team} alt="Team" />
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 3S Sports Cricket Academy | Designed by Gopalkrishnan</p>
      </footer>
    </div>
  );
};

export default Home;
