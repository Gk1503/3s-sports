import React from "react";
import "./Footer.css";
import { FaInstagram, FaYoutube, FaFacebook, FaTwitter, FaEnvelope, FaPhone } from "react-icons/fa";

const Footer = () => {
  return (
    <footer id="footer">
      <div id="footer-container">
        {/* About Section */}
        <div id="footer-about">
          <h3 id="footer-logo">3S SPORTS</h3>
          <p id="footer-about-text">
            3S SPORTS Cricket Academy – Empowering young talents with modern training, 
            performance tracking, and match experience.
          </p>
        </div>

        {/* Quick Links */}
        <div id="footer-links">
          <h4 id="footer-links-title">Quick Links</h4>
          <ul id="footer-links-list">
            <li><a href="/">Home</a></li>
            <li><a href="/academy">Academy</a></li>
            <li><a href="/coaches">Coaches</a></li>
            <li><a href="/matches">Matches</a></li>
            <li><a href="/gallery">Gallery</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div id="footer-contact">
          <h4 id="footer-contact-title">Contact Us</h4>
          <p><FaPhone /> <a href="tel:+919876543210">+91 98765 43210</a></p>
          <p><FaEnvelope /> <a href="mailto:info@3sportsacademy.com">info@3sportsacademy.com</a></p>
          <div id="footer-socials">
            <a href="https://www.instagram.com/3sportsacademy" target="_blank"><FaInstagram /></a>
            <a href="https://www.youtube.com/@3sportsacademy" target="_blank"><FaYoutube /></a>
            <a href="https://www.facebook.com/3sportsacademy" target="_blank"><FaFacebook /></a>
            <a href="https://twitter.com/3sportsacademy" target="_blank"><FaTwitter /></a>
          </div>
        </div>
      </div>

      <div id="footer-bottom">
        <p>© 2025 3S SPORTS Cricket Academy. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
