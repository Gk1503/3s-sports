// CoachesPage.jsx
import React, { useState } from "react";
import "./Coaches.css";
import Sachin from "../../images/Coaches/Sachin.jpg";
import Rahul from "../../images/Coaches/RahulSir.jpg";
import Siddesh from "../../images/Coaches/Siddesh.jpg";
import Sudarshan from "../../images/Coaches/Sudarshan.jpg";
import Mahesh from "../../images/Coaches/Mahesh.jpg";

// Practice session images
import practice1 from "../../images/Practice.jpg";
import practice2 from "../../images/TeamPhoto/Team1.jpg";
import practice3 from "../../images/Traning.jpg";

const CoachesPage = () => {
  const [selectedCoach, setSelectedCoach] = useState(null);

  const coaches = [
    { 
      img: Sachin, 
      name: "Sachin Suryavanshi", 
      role: "Head Coach & Mentor", 
      exp: "10+ Years",
      bio: "Sachin Suryanshi specializes in advanced batting techniques and overall strategy development. He has coached multiple national-level players."
    },
     { 
      img: Mahesh, 
      name: "Mahesh Bharambe", 
      role: "Coach", 
      exp: "4+ Years",
      bio: "Mahesh Bharambe trains players in advanced fielding techniques, agility drills, and catching strategies."
    },
    
    { 
      img: Siddesh, 
      name: "Siddhesh Darde", 
      role: "Coach", 
      exp: "4+ Years",
      bio: "Siddhesh Darde is an expert in fast and spin bowling, coaching young bowlers to enhance accuracy, pace, and spin techniques."
    },
    { 
      img: Rahul, 
      name: "Rahul Bhagat", 
      role: "Coach", 
      exp: "4+ Years",
      bio: "Rahul Bhagat focuses on refining batting skills, footwork, and shot selection. He emphasizes technical excellence."
    },
    { 
      img: Sudarshan, 
      name: "Sudarshan Bansode", 
      role: "Coach", 
      exp: "4+ Years",
      bio: "Sudarshan Bansode focuses on player fitness, strength, and conditioning to ensure peak performance during matches."
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
