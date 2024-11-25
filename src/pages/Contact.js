// src/components/Contact.js

import React from 'react';
import '../styles/ContactMe.css';
import { FaLinkedin, FaEnvelope, FaPhone, FaCoffee } from 'react-icons/fa';
import avatar from '../assets/adi-removebg-preview.png';


const Contact = () => {
    const contactDetails = {
        name: "Aditya Mishra",
        title: "Developer",
        description: "Dynamic and results-driven professional with expertise in Unity 3D, AR/VR development, and more.",
        company: "KIET Group of Insitutions",
        linkedin: "https://linkedin.com/in/adityamishra29",
        email: "adityarakeshmishra@gmail.com",
        phone: "+91-6394461208",
    };

    return (
        <div className="contact-container">
            <div className="linkedin-badge-custom">
                <img
                    src={avatar}
                    alt="Aditya's Avatar"
                    className="badge-avatar"
                />
                <div className="badge-content">
                    <h3 className="badge-name">{contactDetails.name}</h3>
                    <p className="badge-title">{contactDetails.title}</p>
                    <p className="badge-description">{contactDetails.description}</p>
                    <p className="badge-company">{contactDetails.company}</p>
                    <a
                        href={contactDetails.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="badge-link"
                    >
                        <FaLinkedin className="linkedin-icon" /> LinkedIn
                    </a>
                </div>
            </div>
            <div className="contact-header">
                <p>I'm always up for a chat or a coffee! Feel free to reach out.</p>
            </div>
            <div className="contact-details">
                <div className="contact-item">
                    <FaEnvelope className="contact-icon" />
                    <a href={`mailto:${contactDetails.email}`} className="contact-link">
                        {contactDetails.email}
                    </a>
                </div>
                <div className="contact-item">
                    <FaPhone className="contact-icon" />
                    <a href={`tel:${contactDetails.phone}`} className="contact-link">
                        {contactDetails.phone}
                    </a>
                </div>
                <div className="contact-fun">
                    <p>Or catch up over a coffee ☕</p>
                    <FaCoffee className="coffee-icon" />
                </div>
            </div>
        </div>
    );
};

export default Contact;
