import React, { memo, useCallback } from 'react';
import SmartImage from './SmartImage';
import '../styles/ProfileCard.css';

const ProfileCard = ({
  profileName,
  name,
  image,
  onSelect,
  onPrefetch,
  priority = false,
}) => {
  const handleClick = useCallback(() => {
    onSelect(profileName);
  }, [onSelect, profileName]);

  const handlePrefetch = useCallback(() => {
    onPrefetch?.();
  }, [onPrefetch]);

  return (
    <div
      className="profile-card"
      onClick={handleClick}
      onMouseEnter={handlePrefetch}
      onFocus={handlePrefetch}
    >
      <div className="image-container">
        <SmartImage
          src={image}
          alt={`${name} profile`}
          className="profile-image"
          aspectRatio="1 / 1"
          priority={priority}
        />
      </div>
      <h3 className="profile-name">{name}</h3>
    </div>
  );
};

export default memo(ProfileCard);
