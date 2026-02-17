import React from "react";
import "./Academy.css";
import { useNavigate } from "react-router-dom";

const AcademyPage = () => {
  const navigate = useNavigate();

  const handleJoinClick = () => {
    navigate("/contact");
  };

  const programs = [
    {
      title: "High Performance Specialist",
      age: "16+ Years",
      desc: "An intensive regimen focusing on advanced bio-mechanics, tactical analysis, and competitive match simulations for aspiring professionals.",
      img: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Junior Elite Development",
      age: "10-15 Years",
      desc: "Building a solid foundation in technique, fielding agility, and game awareness to prepare young talents for the next level.",
      img: "https://images.unsplash.com/photo-1593341646782-e0b495cffd32?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Grassroots Foundation",
      age: "5-9 Years",
      desc: "Introducing the joy of cricket through fun drills, coordination exercises, and basic skill acquisition in a supportive environment.",
      img: "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?q=80&w=800&auto=format&fit=crop"
    }
  ];

  const facilities = [
    { name: "ICC Standard Pitch", img: "https://images.unsplash.com/photo-1589487391730-58f20eb2c308?q=80&w=600&auto=format&fit=crop" },
    { name: "High-Tech Nets", img: "https://images.unsplash.com/photo-1562077772-3bd305261997?q=80&w=600&auto=format&fit=crop" },
    { name: "Biomechanics Lab", img: "https://images.unsplash.com/photo-1574680096141-1cddd32e04ca?q=80&w=600&auto=format&fit=crop" },
    { name: "Recovery Centre", img: "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=600&auto=format&fit=crop" }
  ];

  return (
    <div className="academy-page">
      {/* Hero Section */}
      <section className="academy-hero">
        <div className="academy-hero-overlay"></div>
        <div className="academy-hero-content">
          <h1>The <span className="gold-text">Elite</span> Standard</h1>
          <p>Where Potential Meets Precision & Passion Meets Performance.</p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="philosophy-section section-padding">
        <div className="section-header">
          <h2>Our Philosophy</h2>
        </div>
        <div className="philosophy-grid">
          <div className="philosophy-card">
            <h3>Excellence</h3>
            <p>We strive for perfection in every drill, every session, and every game. Good enough is never enough.</p>
          </div>
          <div className="philosophy-card">
            <h3>Discipline</h3>
            <p>Talent without discipline is wasted potential. We cultivate mental toughness and unwavering focus.</p>
          </div>
          <div className="philosophy-card">
            <h3>Innovation</h3>
            <p>Leveraging cutting-edge technology and data analytics to refine skills and optimize performance.</p>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="programs-showcase section-padding">
        <div className="section-header">
          <h2>Elite Programs</h2>
          <p>Tailored Pathways for Every Stage of Development</p>
        </div>
        <div className="programs-container">
          {programs.map((prog, index) => (
            <div className="program-item" key={index}>
              <div className="program-img-wrapper">
                <img src={prog.img} alt={prog.title} />
              </div>
              <div className="program-info">
                <span className="program-age">{prog.age}</span>
                <h3>{prog.title}</h3>
                <p>{prog.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Facilities Section */}
      <section className="facilities-showcase section-padding">
        <div className="section-header">
          <h2>World-Class Infrastructure</h2>
        </div>
        <div className="facilities-grid">
          {facilities.map((fac, index) => (
            <div className="facility-item" key={index}>
              <img src={fac.img} alt={fac.name} />
              <div className="facility-overlay">
                <h3>{fac.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="academy-cta section-padding">
        <h2>Ready to Elevate Your Game?</h2>
        <p>Join the ranks of the elite. Your journey to greatness starts here.</p>
        <button onClick={handleJoinClick} className="cta-button">
          Apply Now
        </button>
      </section>
    </div>
  );
};

export default AcademyPage;
