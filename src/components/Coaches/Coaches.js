// CoachesPage.jsx
import React, { useState } from "react";
import "./Coaches.css";

const CoachesPage = () => {
  const [selectedCoach, setSelectedCoach] = useState(null);

  const coaches = [
    { 
      img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&fit=crop", 
      name: "Sachin Suryavanshi", 
      role: "Head Coach & Mentor", 
      exp: "10+ Years",
      bio: "Sachin Suryanshi specializes in advanced batting techniques and overall strategy development. He has coached multiple national-level players."
    },
     { 
      img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&fit=crop", 
      name: "Mahesh Bharambe", 
      role: "Coach", 
      exp: "4+ Years",
      bio: "Mahesh Bharambe trains players in advanced fielding techniques, agility drills, and catching strategies."
    },
    
    { 
      img: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=400&fit=crop", 
      name: "Siddhesh Darde", 
      role: "Coach", 
      exp: "4+ Years",
      bio: "Siddhesh Darde is an expert in fast and spin bowling, coaching young bowlers to enhance accuracy, pace, and spin techniques."
    },
    { 
      img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&fit=crop", 
      name: "Rahul Bhagat", 
      role: "Coach", 
      exp: "4+ Years",
      bio: "Rahul Bhagat focuses on refining batting skills, footwork, and shot selection. He emphasizes technical excellence."
    },
    { 
      img: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=400&fit=crop", 
      name: "Sudarshan Bansode", 
      role: "Coach", 
      exp: "4+ Years",
      bio: "Sudarshan Bansode focuses on player fitness, strength, and conditioning to ensure peak performance during matches."
    },
   
  ];

  const practiceImages = [
      "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=800&fit=crop", 
      "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?q=80&w=800&fit=crop", 
      "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?q=80&w=800&fit=crop"
  ];

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
