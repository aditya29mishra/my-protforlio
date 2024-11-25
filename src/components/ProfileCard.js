import React from 'react';
import './ProfileCard.css';

const ProfileCard = ({ name, image, onClick }) => {
  return (
    <div className="profile-card" onClick={onClick}>
      <div className="image-container">
        <img src={image} alt={`${name} profile`} className="profile-image" />
      </div>
      <h3 className="profile-name">{name}</h3>
    </div>
  );
};

export default ProfileCard;
