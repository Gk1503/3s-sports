import React from "react";
import "./Contact.css";
import { FaInstagram, FaYoutube, FaFacebook, FaGlobe, FaPhone, FaEnvelope } from "react-icons/fa";

const ContactPage = () => {
  return (
    <div id="contact-page">
      {/* Hero Section */}
      <section id="contact-hero">
        <h1 id="contact-hero-title">Get in Touch with 3SPORTS</h1>
        <p id="contact-hero-subtitle">
          We’d love to hear from you! Reach out for training, collaborations, or queries.
        </p>
      </section>

      {/* Contact Info */}
      <section id="contact-info">
        <div id="contact-details">
          <h2 id="contact-info-title">Contact Details</h2>
          <p id="contact-text"><FaPhone /> <a href="tel:+919876543210">+91 98765 43210</a></p>
          <p id="contact-text"><FaEnvelope /> <a href="mailto:info@3sportsacademy.com">info@3sportsacademy.com</a></p>
          <p id="contact-text"><FaGlobe /> <a href="https://www.3sportsacademy.com" target="_blank">www.3sportsacademy.com</a></p>
          <p id="contact-text"><FaInstagram /> <a href="https://www.instagram.com/3sportsacademy" target="_blank">Instagram</a></p>
          <p id="contact-text"><FaYoutube /> <a href="https://www.youtube.com/@3sportsacademy" target="_blank">YouTube</a></p>
          <p id="contact-text"><FaFacebook /> <a href="https://www.facebook.com/3sportsacademy" target="_blank">Facebook</a></p>
        </div>

        {/* Contact Form */}
        <div id="contact-form">
          <h2 id="contact-form-title">Send Us a Message</h2>
          <form id="form">
            <input type="text" id="name" placeholder="Your Name" required />
            <input type="email" id="email" placeholder="Your Email" required />
            <textarea id="message" placeholder="Your Message" rows="5" required></textarea>
            <button type="submit" id="send-btn">Send Message</button>
          </form>
        </div>
      </section>

      {/* Location Map */}
      <section id="contact-map">
        <h2 id="map-title">Our Location</h2>
        <iframe
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.088818351099!2d73.01043987466481!3d19.059832152481004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c1fd6c9f48f9%3A0x561150caa16b8925!2sJhansi%20ki%20Rani%20maidan!5e0!3m2!1sen!2sin!4v1760850810216!5m2!1sen!2sin"
  width="600"
  height="450"
  style={{ border: 0 }}
  allowFullScreen=""
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
></iframe>

      </section>
    </div>
  );
};

export default ContactPage;
