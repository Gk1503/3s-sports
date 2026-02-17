import React, { useState, useEffect } from "react";
import "./Home.css";

// Using Unsplash images for a premium sports look
// No local imports needed for now

const Home = () => {
  const [currentHero, setCurrentHero] = useState(0);

  const heroImages = [
    // Placeholders for debugging purposes, but user requested 'blank space' or 'other images' (Unsplash)
    // We will keep high quality Unsplash URLs as per previous request context to avoid broken images
    "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=2076&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?q=80&w=2070&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1606925797300-0b35e9d17d27?q=80&w=2070&auto=format&fit=crop"  
  ];

  // Change hero image every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const programs = [
    { title: "High Perfromance Centre", desc: "Advanced bio-mechanics analysis and elite skill development for professional aspirants.", icon: "⚡" },
    { title: "Tactical Leadership", desc: "Strategic game awareness and captaincy grooming for the next generation of leaders.", icon: "♟️" },
    { title: "Mental Fortitude", desc: "Psychological conditioning to perform under pressure and handle game-day stress.", icon: "🧠" },
    { title: "Strength & Conditioning", desc: "Athlete-specific physical training focusing on explosive power and injury prevention.", icon: "💪" },
  ];

  const coaches = [
    { name: "Alexander Sterling", role: "Director of Cricket", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop" },
    { name: "Marcus Thorne", role: "Head of Bowling Performance", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop" },
    { name: "Elena Vostokova", role: "Mental Conditioning Coach", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop" },
    { name: "David Vance", role: "Lead Batting Consultant", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop" },
  ];

  const testimonials = [
    { name: "James Anderson", text: "Elite Sport Management transformed my game. The data-driven approach is truly world-class.", role: "Professional Cricketer" },
    { name: "Michael Clarke", text: "The facilities and coaching staff are second to none. A perfect environment for nurturing talent.", role: "U-19 State Player" },
    { name: "Sarah Miller", text: "As a parent, seeing the disciplined and holistic growth in my son is immensely satisfying.", role: "Parent" },
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section
        className="hero-section"
        style={{
          background: `url(${heroImages[currentHero]}) center/cover no-repeat`,
          transition: "background 1s ease-in-out",
        }}
      >
        <div className="hero-overlay-gradient"></div>
        <div className="hero-content">
          <h1>
            Forging <span className="highlight">Champions</span><br />
            Building <span className="highlight">Legacies</span>
          </h1>
          <p>The definitive destination for elite cricket excellence and professional sports management.</p>
          <a href="#programs" className="cta-btn">Begin Your Journey</a>
        </div>
        <div className="scroll-indicator">↓</div>
      </section>

      {/* About Section */}
      <section className="about-section section-padding">
        <div className="about-content">
          <div className="section-title">
            <h2>The Elite Standard</h2>
            <p>Redefining Excellence in Sports Education</p>
          </div>
          <p className="about-text">
            Welcome to <strong>Elite Sport Management</strong>. We are not just an academy; we are an institution dedicated to the art and science of cricket. 
            By fusing traditional wisdom with cutting-edge technology, we provide an ecosystem where raw talent is refined into professional excellence.
            Our philosophy is built on three pillars: <strong>Discipline, Strategy, and Innovation</strong>.
          </p>
        </div>
      </section>

      {/* Mentor Section */}
      <section className="mentor-section section-padding">
        <div className="mentor-card">
          <div className="mentor-image-wrapper">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop" alt="Director" className="mentor-image" />
          </div>
          <div className="mentor-info">
            <h3>Alexander Sterling</h3>
            <span className="mentor-role">Founder & Director of Performance</span>
            <p className="mentor-quote">
              "Greatness is not inherited; it is constructed day by day through relentless pursuit of perfection. 
              At Elite Sport Management, we don't just teach cricket; we engineer athletes who command the field 
              with intelligence, skill, and unwavering character."
            </p>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="programs-section section-padding">
        <div className="section-title">
          <h2>Elite Programs</h2>
          <p>Curriculum Designed for the Modern Athlete</p>
        </div>
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
      <section className="coaches-section section-padding">
        <div className="section-title">
          <h2>World-Class Mentors</h2>
          <p>Learn from the Masters of the Game</p>
        </div>
        <div className="coaches-grid">
          {coaches.map((coach, index) => (
            <div className="coach-card" key={index}>
              <div className="coach-image-container">
                <img src={coach.image} alt={coach.name} />
              </div>
              <div className="coach-info">
                <h3>{coach.name}</h3>
                <p>{coach.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section section-padding">
        <div className="section-title">
          <h2>Success Stories</h2>
          <p>Voices from the Elite Community</p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((t, index) => (
            <div className="testimonial-card" key={index}>
              <div className="testimonial-quote-icon">“</div>
              <p className="testimonial-text">{t.text}</p>
              <div className="testimonial-author">
                <h4>{t.name}</h4>
                <span>{t.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery/Showcase Section */}
      <section className="gallery-section section-padding">
        <div className="section-title">
          <h2>The Arena</h2>
          <p>Where Preparation Meets Opportunity</p>
        </div>
        <div className="gallery-grid">
          <img src="https://images.unsplash.com/photo-1593341646782-e0b495cffd32?q=80&w=800&auto=format&fit=crop" alt="Match Day" />
          <img src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=800&auto=format&fit=crop" alt="Team Huddle" />
          <img src="https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?q=80&w=800&auto=format&fit=crop" alt="Training Session" />
        </div>
      </section>
    </div>
  );
};

export default Home;
