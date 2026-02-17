import React from "react";
import "./Footer.css";
import { FaInstagram, FaYoutube, FaFacebook, FaTwitter, FaEnvelope, FaPhone } from "react-icons/fa";

const Footer = () => {
  return (
    <footer id="footer">
      <div id="footer-container">
        {/* About Section */}
        <div id="footer-about">
          <h3 id="footer-logo">ELITE SPORT MANAGEMENT</h3>
          <p id="footer-about-text">
            Elite Sport Management – Redefining athletic excellence through world-class training,
            strategic mentorship, and data-driven performance analysis.
          </p>
        </div>

        {/* Quick Links */}
        <div id="footer-links">
          <h4 id="footer-links-title">Quick Links</h4>
          <ul id="footer-links-list">
            <li><a href="/">Home</a></li>
            <li><a href="/academy">Programs</a></li>
            <li><a href="/coaches">Mentors</a></li>
            <li><a href="/matches">Schedules</a></li>
            <li><a href="/gallery">Showcase</a></li>
            <li><a href="/contact">Inquire</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div id="footer-contact">
          <h4 id="footer-contact-title">Contact Us</h4>
          <p><FaPhone /> <a href="tel:+1234567890">+1 (555) 123-4567</a></p>
          <p><FaEnvelope /> <a href="mailto:info@elitesports.com">contact@elitesports.com</a></p>
          <div id="footer-socials">
            <a href="#" target="_blank"><FaInstagram /></a>
            <a href="#" target="_blank"><FaYoutube /></a>
            <a href="#" target="_blank"><FaFacebook /></a>
            <a href="#" target="_blank"><FaTwitter /></a>
          </div>
        </div>
      </div>

      <div id="footer-bottom">
        <p>© 2026 ELITE SPORT MANAGEMENT. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
