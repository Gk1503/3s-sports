import React, { useState, useEffect, useCallback, useMemo } from "react";
import "./Gallery.css";

// Import WPL Practice Session Images
import wpl1 from "../../images/WPL/Wpl1.jpg";
import wpl2 from "../../images/WPL/Wpl2.jpg";
import wpl3 from "../../images/WPL/Wpl3.jpg";
import wpl4 from "../../images/WPL/Wpl4.jpg";
import wpl5 from "../../images/WPL/Wpl5.jpg";
import wpl6 from "../../images/WPL/Wpl6.jpg";
import wpl7 from "../../images/WPL/Wpl7.jpg";
import wpl8 from "../../images/WPL/Wpl8.jpg";
import wpl9 from "../../images/WPL/Wpl9.jpg";
import wpl10 from "../../images/WPL/Wpl10.jpg";
import wpl11 from "../../images/WPL/Wpl11.jpg";
import wpl12 from "../../images/WPL/Wpl12.jpg";
import wpl13 from "../../images/WPL/Wpl13.jpg";
import wpl14 from "../../images/WPL/Wpl14.jpg";
import wpl15 from "../../images/WPL/Wpl15.jpg";
import wpl16 from "../../images/WPL/Wpl16.jpg";

//Coaches
import Sachin from "../../images/Coaches/Sachin.jpg";
import Rahul from "../../images/Coaches/RahulSir.jpg";
import Suddarshan from "../../images/Coaches/Sudarshan.jpg";
import Siddesh from "../../images/Coaches/Siddesh.jpg";
import Mahesh from "../../images/Coaches/Mahesh.jpg";

const GalleryPage = () => {
  const [selectedImg, setSelectedImg] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);


  const allImages = useMemo(() => [
   //Wpl Practice Session Images
    { img: wpl1, category: "WPL Practice Session" },
    { img: wpl2, category: "WPL Practice Session" },
    { img: wpl3, category: "WPL Practice Session" },
    { img: wpl4, category: "WPL Practice Session" },
    { img: wpl5, category: "WPL Practice Session" },
    { img: wpl6, category: "WPL Practice Session" },
    { img: wpl7, category: "WPL Practice Session" },
    { img: wpl8, category: "WPL Practice Session" },
    { img: wpl9, category: "WPL Practice Session" },
    { img: wpl10, category: "WPL Practice Session" },
    { img: wpl11, category: "WPL Practice Session" },
    { img: wpl12, category: "WPL Practice Session" },
    { img: wpl13, category: "WPL Practice Session" },
    { img: wpl14, category: "WPL Practice Session" },
    { img: wpl15, category: "WPL Practice Session" },
    { img: wpl16, category: "WPL Practice Session" },

    // Coaches Images
    { img: Sachin, category: "Coaches" },
    { img: Rahul, category: "Coaches" },
    { img: Suddarshan, category: "Coaches" },
    { img: Siddesh, category: "Coaches" },
    { img: Mahesh, category: "Coaches" },

  ], []);

  // List of all categories, including placeholders for your future content
  const categories = useMemo(() => [
    "ALL",
    "WPL Practice Session", // Active Category
    "Ground", 
    "Team Photo", 
    "Match Day",
    "Coaches",
    "Events",
  ], []);

  // Initialize filter to the first category in the list
  const [filter, setFilter] = useState(categories[0]);

  // Filter images based on the selected category (simplified)
  const filteredImages = useMemo(() => {
    // Show ALL images that belong to the current filter.
    return allImages.filter((img) => img.category === filter);
  }, [filter, allImages]);
  
  // Update selected image and current index when filter changes
  useEffect(() => {
    // Close modal if open when filter changes
    closeModal(); 
  }, [filter]);


  const openModal = (img, index) => {
    setSelectedImg(img);
    setCurrentIndex(index);
  };

  const closeModal = () => setSelectedImg(null);

  const nextImage = useCallback(() => {
    if (filteredImages.length === 0) return;
    const newIndex = (currentIndex + 1) % filteredImages.length;
    setCurrentIndex(newIndex);
    setSelectedImg(filteredImages[newIndex]);
  }, [filteredImages, currentIndex]);

  const prevImage = useCallback(() => {
    if (filteredImages.length === 0) return;
    const newIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    setCurrentIndex(newIndex);
    setSelectedImg(filteredImages[newIndex]);
  }, [filteredImages, currentIndex]);

  // ✅ Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedImg) return;
      if (e.key === "ArrowRight") {
        e.preventDefault(); 
        nextImage();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault(); 
        prevImage();
      }
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImg, nextImage, prevImage]);

  return (
    <div id="gallery-main">
      {/* Hero Section */}
      <section id="gallery-top">
        <h1 id="gallery-title">3S SPORTS Gallery</h1>
        <p id="gallery-subtitle">
          Explore our cricket academy, training sessions, and WPL practice moments.
        </p>
      </section>

      {/* Filter Buttons */}
      <section id="gallery-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            id="gallery-tab-btn"
            className={filter === cat ? "active" : ""}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </section>

      {/* Masonry Grid */}
      <section id="gallery-wrapper">
        <div id="gallery-masonry">
          {filteredImages.length > 0 ? (
            filteredImages.map((imgObj, index) => (
              <div
                className="gallery-item"
                key={index}
                tabIndex={0}
                onClick={() => openModal(imgObj, index)}
                onKeyDown={(e) => e.key === "Enter" && openModal(imgObj, index)}
              >
                <img src={imgObj.img} alt={imgObj.category + " " + index} loading="lazy" />
                {/* Overlay for category name is removed per request, now just the image */}
              </div>
            ))
          ) : (
            <div id="gallery-empty-message">
                <h2>No Images Available</h2>
                <p>This category ({filter}) will be updated soon with exciting photos!</p>
            </div>
          )}
        </div>
      </section>

      {/* Modal Lightbox */}
      {selectedImg && (
        <div id="gallery-lightbox" onClick={closeModal}>
          <span id="gallery-close" onClick={closeModal}>
            &times;
          </span>
          <div id="gallery-lightbox-content" onClick={(e) => e.stopPropagation()}>
             {/* Previous Button */}
            <button id="gallery-prev" onClick={prevImage} aria-label="Previous Image">
              &#10094;
            </button>
            
            <img
              id="gallery-lightbox-img"
              src={selectedImg.img}
              alt={selectedImg.category + " " + currentIndex}
            />
            
            {/* Next Button */}
            <button id="gallery-next" onClick={nextImage} aria-label="Next Image">
              &#10095;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;