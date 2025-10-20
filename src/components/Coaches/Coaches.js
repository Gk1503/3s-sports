// CoachesPage.jsx
import React, { useState } from "react";
import "./Coaches.css";
import coach1 from "../../images/Coach1.jpg";
import coach2 from "../../images/Coach1.jpg";
import coach3 from "../../images/Coach1.jpg";
import coach4 from "../../images/Coach1.jpg";
import coach5 from "../../images/Coach1.jpg";

// Practice session images
import practice1 from "../../images/Practice.jpg";
import practice2 from "../../images/Practice.jpg";
import practice3 from "../../images/Practice.jpg";

const CoachesPage = () => {
  const [selectedCoach, setSelectedCoach] = useState(null);

  const coaches = [
    { 
      img: coach1, 
      name: "Rajesh Kumar", 
      role: "Senior Coach", 
      exp: "10+ Years",
      bio: "Rajesh Kumar specializes in advanced batting techniques and overall strategy development. He has coached multiple national-level players."
    },
    { 
      img: coach2, 
      name: "Amit Singh", 
      role: "Batting Coach", 
      exp: "8+ Years",
      bio: "Amit Singh focuses on refining batting skills, footwork, and shot selection. He emphasizes technical excellence."
    },
    { 
      img: coach3, 
      name: "Vikram Rao", 
      role: "Bowling Coach", 
      exp: "7+ Years",
      bio: "Vikram Rao is an expert in fast and spin bowling, coaching young bowlers to enhance accuracy, pace, and spin techniques."
    },
    { 
      img: coach4, 
      name: "Suresh Patil", 
      role: "Fitness Coach", 
      exp: "9+ Years",
      bio: "Suresh Patil focuses on player fitness, strength, and conditioning to ensure peak performance during matches."
    },
    { 
      img: coach5, 
      name: "Rohit Sharma", 
      role: "Fielding Coach", 
      exp: "6+ Years",
      bio: "Rohit Sharma trains players in advanced fielding techniques, agility drills, and catching strategies."
    },
  ];

  const practiceImages = [practice1, practice2, practice3];

  const openModal = (coach) => {
    setSelectedCoach(coach);
  };

  const closeModal = () => {
    setSelectedCoach(null);
  };

  return (
    <div id="coaches-page">
      {/* Hero Section */}
      <section id="coaches-hero">
        <h1 id="coaches-hero-title">Meet Our Expert Coaches</h1>
        <p id="coaches-hero-subtitle">
          Our professional coaches guide you to excellence on and off the field.
        </p>
      </section>

      {/* Practice Session Gallery */}
      <section id="practice-section">
        <h2 id="practice-title">Training in Action</h2>
        <div id="practice-grid">
          {practiceImages.map((img, index) => (
            <div id="practice-card" key={index}>
              <img src={img} alt={`Practice ${index + 1}`} />
            </div>
          ))}
        </div>
      </section>

      {/* Coaches Grid Section */}
      <section id="coaches-section">
        <div id="coaches-grid">
          {coaches.map((coach, index) => (
            <div id="coach-card" key={index} onClick={() => openModal(coach)}>
              <img src={coach.img} alt={coach.name} />
              <h3>{coach.name}</h3>
              <p>{coach.role}</p>
              <span>{coach.exp} Experience</span>
            </div>
          ))}
        </div>
      </section>

      {/* Modal */}
      {selectedCoach && (
        <div id="coach-modal">
          <div id="coach-modal-content">
            <span id="coach-modal-close" onClick={closeModal}>&times;</span>
            <img src={selectedCoach.img} alt={selectedCoach.name} id="modal-coach-img" />
            <h2 id="modal-coach-name">{selectedCoach.name}</h2>
            <h4 id="modal-coach-role">{selectedCoach.role}</h4>
            <p id="modal-coach-exp">{selectedCoach.exp} Experience</p>
            <p id="modal-coach-bio">{selectedCoach.bio}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoachesPage;
