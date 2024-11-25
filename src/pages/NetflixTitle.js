import React, { useEffect, useState } from 'react';
import '../styles/NetflixTitle.css';
import netflixSound from '../assets/netflix-sound.mp3';
import { useNavigate } from 'react-router-dom';
import logoImage from '../assets/logo-2.png'; // Update with the path to your logo

const NetflixTitle = () => {
  const [isAnimationStarted, setIsAnimationStarted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Play the Netflix sound automatically when the page loads
    const audio = new Audio(netflixSound);
    audio.play().catch(error => console.error("Audio play error:", error));
    setIsAnimationStarted(true); // Starts animation

    // Navigate to the browse page after the animation ends
    const timer = setTimeout(() => {
      navigate('/browse');
    }, 3000); // Adjust the time to match the duration of the animation

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="netflix-container">
      <img 
        src={logoImage} 
        alt="Custom Logo" 
        className={`netflix-logo ${isAnimationStarted ? 'animate' : ''}`} 
      />
    </div>
  );
};

export default NetflixTitle;
