import React, { useState } from "react";
import "./Gallery.css";

// Images
import ground from "../../images/ground.jpg";
import practice1 from "../../images/Practice.jpg";
import match from "../../images/Match.jpg";
import team from "../../images/Team4.jpg";
import coach1 from "../../images/SrCoach.jpg";
import coach2 from "../../images/SrCoach.jpg";
import gallery1 from "../../images/Gallery1.jpg";
import gallery2 from "../../images/TrophyWin.jpg";
import gallery3 from "../../images/Gallery3.jpg";
import gallery4 from "../../images/Gallery4.jpg";
import gallery5 from "../../images/Gallery5.jpg";
import gallery6 from "../../images/Gallery6.jpg";
import gallery7 from "../../images/Gallery7.jpg";
import gallery8 from "../../images/Gallery8.jpg";
import gallery9 from "../../images/Gallery9.jpg";

const GalleryPage = () => {
  const [selectedImg, setSelectedImg] = useState(null);
  const [filter, setFilter] = useState("All");

  const images = [
    { img: ground, title: "Cricket Ground", category: "Ground" },
    { img: practice1, title: "Practice Session", category: "Practice" },
    { img: match, title: "Match Day", category: "Match" },
    { img: team, title: "Team Photo", category: "Team" },
    { img: coach1, title: "Coaching Session", category: "Coaches" },
    { img: coach2, title: "Fitness Training", category: "Coaches" },
    { img: gallery1, title: "Indoor Practice", category: "Gallery" },
    { img: gallery2, title: "Winning Trophy", category: "Gallery" },
    { img: gallery3, title: "Celebration Event", category: "Gallery" },
    { img: gallery4, title: "Fun Activities", category: "Gallery" },
    { img: gallery5, title: "Team Huddle", category: "Gallery" },
    { img: gallery6, title: "Advanced Training", category: "Gallery" },
    { img: gallery7, title: "Match Practice", category: "Gallery" },
    { img: gallery8, title: "Coaches Discussion", category: "Gallery" },
    { img: gallery9, title: "Victory Celebration", category: "Gallery" },
  ];

  const filteredImages =
    filter === "All" ? images : images.filter((img) => img.category === filter);

  const openModal = (img) => setSelectedImg(img);
  const closeModal = () => setSelectedImg(null);

  return (
    <div id="gallery-page">
      {/* Hero Section */}
      <section id="gallery-hero">
        <h1 id="gallery-hero-title">3SPORTS Gallery</h1>
        <p id="gallery-hero-subtitle">
          Explore our cricket academy, training sessions, matches, and events.
        </p>
      </section>

      {/* Filter Buttons */}
      <section id="gallery-filters">
        {["All", "Ground", "Practice", "Match", "Team", "Coaches", "Gallery"].map(
          (cat) => (
            <button
              key={cat}
              id="gallery-filter-btn"
              className={filter === cat ? "active" : ""}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          )
        )}
      </section>

      {/* Gallery Grid */}
      <section id="gallery-section">
        <div id="gallery-grid">
          {filteredImages.map((imgObj, index) => (
            <div
              id="gallery-card"
              key={index}
              onClick={() => openModal(imgObj)}
            >
              <img src={imgObj.img} alt={imgObj.title} />
              <div id="gallery-overlay">
                <h3>{imgObj.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal */}
      {selectedImg && (
        <div id="gallery-modal" onClick={closeModal}>
          <span id="gallery-modal-close">&times;</span>
          <img
            id="gallery-modal-img"
            src={selectedImg.img}
            alt={selectedImg.title}
          />
          <h3 id="gallery-modal-title">{selectedImg.title}</h3>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
