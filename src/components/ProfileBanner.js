import React, { useEffect, useState } from 'react';
import '../styles/ProfileBanner.css';
import PlayButton from '../components/PlayButton';
import MoreInfoButton from '../components/MoreInfoButton';
// import { getProfileBanner } from '../queries/getProfileBanner';
// import { ProfileBanner as ProfileBannerType } from '../types';

const ProfileBanner = () => {

  const handleDownloadResumes = () => {
    // Paths to your resumes
    const resumes = [
      "../assets/aditya_blender.pdf", // Replace with actual path
      "../assets/aditya_resume_main.pdf", // Replace with actual path
    ];

    // Trigger downloads for both resumes
    resumes.forEach((resume) => {
      const link = document.createElement('a');
      link.href = resume;
      link.download = resume.split('/').pop(); // Extract filename for download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const handleLinkedinClick = () => { 
    window.open("https://www.linkedin.com/in/adityamishra29/", "_blank");
  }

  return (
    <div className="profile-banner">
      <div className="banner-content">
      <h1 className="banner-headline">Aditya Mishra - Developer</h1>
        <p className="banner-description">
        I am a highly motivated and goal-oriented fresher with expertise in Android, Game, and AR/VR development, seeking opportunities to gain professional experience and contribute to impactful projects. With skills in Kotlin, Unity, C#, and 3D modeling tools like Blender, I have developed scalable Android applications, immersive VR simulations, and engaging multiplayer games as part of my academic and personal projects. My work demonstrates a strong focus on real-time performance optimization, seamless API integration, intuitive UI/UX design, and robust gameplay mechanics. Passionate about learning and problem-solving, I am eager to apply my skills in a professional environment, collaborate with experienced teams, and deliver innovative solutions that push the boundaries of technology.
        </p>

        <div className="banner-buttons">
          <PlayButton onClick={handleDownloadResumes} label="Resume" />
          <MoreInfoButton onClick={handleLinkedinClick} label="Linkedin" />
        </div>
      </div>
    </div>
  );
};

export default ProfileBanner;
