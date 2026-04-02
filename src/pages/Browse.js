import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileCard from '../components/ProfileCard';
import { usePersona } from '../hooks/usePersona';
import '../styles/browse.css';

const Browse = () => {
  const navigate = useNavigate();
  const { personas, loading, error } = usePersona();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  const profiles = personas.map((persona) => ({
    name: persona.slug,
    image: persona.media.avatar.url,
  }));

  const handleProfileClick = (profile) => {
    navigate(`/profile/${profile.name}`);
  };

  return (
    <div className="browse-container">
      <p className='who-is-watching'>Who's Watching?</p>
      <div className="profiles">
        {profiles.map((profile) => (
          <ProfileCard
            key={profile.name}
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
