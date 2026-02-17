import React, { useState, useEffect, useCallback, useMemo } from "react";
import "./Gallery.css";

const GalleryPage = () => {
  const [selectedImg, setSelectedImg] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Using Unsplash images for all categories to replace broken local imports
  const allImages = useMemo(
    () => [
      // Coaches
      { img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&fit=crop", category: "Coaches" },
      { img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&fit=crop", category: "Coaches" },
      { img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&fit=crop", category: "Coaches" },
     
      // Winning Trophy
      { img: "https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?q=80&w=600&fit=crop", category: "Winning Trophy" },
      { img: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=600&fit=crop", category: "Winning Trophy" },

      // Team Photo
      { img: "https://images.unsplash.com/photo-1593341646782-e0b495cffd32?q=80&w=600&fit=crop", category: "Team Photo" },
      { img: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=600&fit=crop", category: "Team Photo" },

      // 3S Premium League (Generic sports league)
      { img: "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?q=80&w=600&fit=crop", category: "3S Premium League" },
      { img: "https://images.unsplash.com/photo-1606925797300-0b35e9d17d27?q=80&w=600&fit=crop", category: "3S Premium League" },

      // Events
      { img: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=600&fit=crop", category: "Events" },
      { img: "https://images.unsplash.com/photo-1574680096141-1cddd32e04ca?q=80&w=600&fit=crop", category: "Events" },

      // All
      { img: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600&fit=crop", category: "ALL" },
      { img: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=600&fit=crop", category: "ALL" },
    ],
    []
  );

  const categories = useMemo(
    () => [
      "ALL",
      "WPL Practice Session",
      "Team Photo",
      "Winning Trophy",
      "3S Premium League",
      "Building character-Mindset session ",
      "Coaches",
      "Events",
    ],
    []
  );

  const [filter, setFilter] = useState(categories[0]);
  const filteredImages = useMemo(() => {
    return allImages.filter((item) => item.category === filter || filter === "ALL");
  }, [filter, allImages]);

  const openModal = (item, index) => {
    setSelectedImg(item);
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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedImg) return;
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImg, nextImage, prevImage]);

  return (
    <div id="gallery-main">
      <section id="gallery-top">
        <h1 id="gallery-title">Elite SPORTS Gallery</h1>
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

      {/* Gallery Grid */}
      <section id="gallery-wrapper">
        <div id="gallery-masonry">
          {filteredImages.length > 0 ? (
            filteredImages.map((item, index) => (
              <div
                className="gallery-item"
                key={index}
                onClick={() => openModal(item, index)}
              >
                {item.img ? (
                  <img src={item.img} alt={item.category + " " + index} loading="lazy" />
                ) : null}
              </div>
            ))
          ) : (
            <div id="gallery-empty-message">
              <h2>No Media Available</h2>
              <p>This category ({filter}) will be updated soon with exciting photos!</p>
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      {selectedImg && (
        <div id="gallery-lightbox" onClick={closeModal}>
          <span id="gallery-close" onClick={closeModal}>
            &times;
          </span>
          <div id="gallery-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button id="gallery-prev" onClick={prevImage}>
              &#10094;
            </button>

            {selectedImg.img && (
              <img
                id="gallery-lightbox-img"
                src={selectedImg.img}
                alt={selectedImg.category + " " + currentIndex}
              />
            )}

            <button id="gallery-next" onClick={nextImage}>
              &#10095;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
