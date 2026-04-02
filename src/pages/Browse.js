import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileCard from '../components/ProfileCard';
import personasData from '../data/personas.json';
import localAssetMap from '../data/localAssetMap';
import '../styles/browse.css';

const Browse = () => {
  const navigate = useNavigate();

  const profiles = personasData.personas.map((persona) => ({
    name: persona.slug,
    image: localAssetMap[persona.media.avatarImageKey],
    backgroundGif: persona.media.background.url
  }));

  const handleProfileClick = (profile) => {
    navigate(`/profile/${profile.name}`, { state: { profileImage: profile.image, backgroundGif: profile.backgroundGif } });
  };

  return (
    <div className="browse-container">
      <p className='who-is-watching'>Who's Watching?</p>
      <div className="profiles">
        {profiles.map((profile, index) => (
          <ProfileCard
            key={index}
            name={profile.name}
            image={profile.image}
            onClick={() => handleProfileClick(profile)}
          />
        ))}
      </div>
    </div>
  );
};

export default Browse;
