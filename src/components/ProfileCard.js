import React from 'react';
import SmartImage from './SmartImage';
import '../styles/ProfileCard.css';

const ProfileCard = ({ name, image, onClick, onMouseEnter }) => {
  return (
    <div className="profile-card" onClick={onClick} onMouseEnter={onMouseEnter}>
      <div className="image-container">
        <SmartImage
          src={image}
          alt={`${name} profile`}
          className="profile-image"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      <h3 className="profile-name">{name}</h3>
    </div>
  );
};

export default ProfileCard;
