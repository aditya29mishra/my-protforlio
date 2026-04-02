import React from 'react';
import '../styles/ProfileBanner.css';
import PlayButton from '../components/PlayButton';
import MoreInfoButton from '../components/MoreInfoButton';

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
        <h1 className="banner-headline">Aditya Mishra</h1>
        <h2 className="banner-subheadline">Developer | Game & AR/VR Engineer</h2>
        <p className="banner-description">
          Specializing in Android, Game Design, and Immersive AR/VR experiences. 
          Expertise in Kotlin, Unity, C#, and 3D Modeling with a focus on real-time 
          performance and intuitive UX.
        </p>

        <div className="banner-buttons">
          <PlayButton onClick={handleDownloadResumes} label="Get Resumes" />
          <MoreInfoButton onClick={handleLinkedinClick} label="LinkedIn Profile" />
        </div>
      </div>
    </div>
  );
};

export default ProfileBanner;
