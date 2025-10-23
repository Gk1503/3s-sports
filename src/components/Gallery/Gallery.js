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

//Winning Trophy
import Image1 from "../../images/WinningTrophy/WT1.jpg";
import Image2 from "../../images/WinningTrophy/WT2.jpg";

import Image8 from "../../images/WinningTrophy/WT8.jpg";
import Image10 from "../../images/WinningTrophy/WT10.jpg";
import Image14 from "../../images/WinningTrophy/WT14.jpg";
import Image15 from "../../images/WinningTrophy/WT15.jpg";
import Image16 from "../../images/WinningTrophy/WT16.jpg";
import Image17 from "../../images/WinningTrophy/WT17.jpg";
import TrophyWin from "../../images/WinningTrophy/TrophyWin.jpg";

//Team Photo
import Team1 from "../../images/TeamPhoto/TP1.jpg";
import Team2 from "../../images/TeamPhoto/TP2.jpg";
import Team3 from "../../images/TeamPhoto/TP3.jpg";
import Team4 from "../../images/TeamPhoto/TP4.jpg";
import Team5 from "../../images/TeamPhoto/TP5.jpg";
import Team6 from "../../images/TeamPhoto/TP6.jpg";
import Team7 from "../../images/TeamPhoto/TP7.jpg";
import Team8 from "../../images/TeamPhoto/TP8.jpg";

//3S Premium League
import PSL1 from "../../images/3sPL/3SPL1.jpg";
import PSL2 from "../../images/3sPL/3SPL2.jpg";
import PSL3 from "../../images/3sPL/3SPL3.jpg";
import PSL4 from "../../images/3sPL/3SPL4.jpg";
import PSL5 from "../../images/3sPL/3SPL5.jpg";
import PSL6 from "../../images/3sPL/3SPL6.jpg";
import PSL7 from "../../images/3sPL/3SPL7.jpg";
import PSL8 from "../../images/3sPL/3SPL8.jpg";
import PSL9 from "../../images/3sPL/3SPL9.jpg";
import PSL10 from "../../images/3sPL/3SPL10.jpg";
import PSL11 from "../../images/3sPL/3SPL11.jpg";

//Events
import Event1 from "../../images/Events/Event1.jpg";
import Event2 from "../../images/Events/Event2.jpg";
import Event3 from "../../images/Events/Event3.jpg";
import Event4 from "../../images/Events/Event4.jpg";
import Event5 from "../../images/Events/Event5.jpg";
import Event6 from "../../images/Events/Event6.jpg";
import Event7 from "../../images/Events/Event7.jpg";
import Event8 from "../../images/Events/Event8.jpg";
import Event9 from "../../images/Events/Event9.jpg";
import Event10 from "../../images/Events/Event10.jpg";
import Event11 from "../../images/Events/Event11.jpg";
import Event12 from "../../images/Events/Event12.jpg";

// All Images 
import All1 from "../../images/ALL/All1.jpg";
import All2 from "../../images/ALL/All2.jpg";
import All3 from "../../images/ALL/All3.jpg";
import All4 from "../../images/ALL/All4.jpg";
import All5 from "../../images/ALL/All5.jpg";
import All6 from "../../images/ALL/All6.jpg";
import All7 from "../../images/ALL/All7.jpg";
import All8 from "../../images/ALL/All8.jpg";
import All9 from "../../images/ALL/All9.jpg";
import All10 from "../../images/ALL/All10.jpg";
import All11 from "../../images/ALL/All11.jpg";
import All12 from "../../images/ALL/All12.jpg";
import All13 from "../../images/ALL/All13.jpg";
import All14 from "../../images/ALL/All14.jpg";
import All15 from "../../images/ALL/All15.jpg";


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

    // Winning Trophy Images  
    { img: Image1, category: "Winning Trophy" },
    { img: Image2, category: "Winning Trophy" },
    { img: Image14, category: "Winning Trophy" },
    { img: TrophyWin, category: "Winning Trophy" },
    { img: Image8, category: "Winning Trophy" },
    { img: Image10, category: "Winning Trophy" },
    { img: Image15, category: "Winning Trophy" },
    { img: Image16, category: "Winning Trophy" },
    { img: Image17, category: "Winning Trophy" },

    // Team Photo Images
    { img: Team1, category: "Team Photo" },
    { img: Team2, category: "Team Photo" },
    { img: Team8, category: "Team Photo" },
    { img: Team3, category: "Team Photo" },
    { img: Team4, category: "Team Photo" },
    { img: Team5, category: "Team Photo" },
    { img: Team6, category: "Team Photo" },
    { img: Team7, category: "Team Photo" },

    // 3S Premium League Images
    { img: PSL1, category: "3S Premium League" },
    { img: PSL2, category: "3S Premium League" },
    { img: PSL3, category: "3S Premium League" },
    { img: PSL4, category: "3S Premium League" },
    { img: PSL5, category: "3S Premium League" },
    { img: PSL6, category: "3S Premium League" },
    { img: PSL7, category: "3S Premium League" },
    { img: PSL8, category: "3S Premium League" },
    { img: PSL9, category: "3S Premium League" },
    { img: PSL10, category: "3S Premium League" },
    { img: PSL11, category: "3S Premium League" },

    // Events Images
    { img: Event1, category: "Events" },
    {img: Event12, category: "Events" },
    { img: Event2, category: "Events" },
    { img: Event3, category: "Events" },
    { img: Event4, category: "Events" },
    { img: Event10, category: "Events" }, 
    { img: Event5, category: "Events" },
    { img: Event6, category: "Events" },
    { img: Event7, category: "Events" },
    { img: Event8, category: "Events" },
    { img: Event9, category: "Events" },
    { img: Event11, category: "Events" },
  

    // All Images
    { img: All1, category: "ALL" },
    { img: All2, category: "ALL" },
    
    { img: All15, category: "ALL" },
    { img: All3, category: "ALL" },
        { img: All14, category: "ALL" },
    { img: All4, category: "ALL" },
    { img: All5, category: "ALL" },
    { img: All6, category: "ALL" },
    { img: All7, category: "ALL" },
    { img: All8, category: "ALL" },
    { img: All9, category: "ALL" },
    { img: All10, category: "ALL" },
    { img: All11, category: "ALL" },
    { img: All12, category: "ALL" },
    { img: All13, category: "ALL" },


  ], []);

  // List of all categories, including placeholders for your future content
  const categories = useMemo(() => [
    "ALL",
    "WPL Practice Session", // Active Category
    "Team Photo", 
    "Winning Trophy",
    "3S Premium League",
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