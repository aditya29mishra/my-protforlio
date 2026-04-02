import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import ProfileCard from '../components/ProfileCard';
import { useProgressiveItems } from '../hooks/useProgressiveItems';
import { usePersona } from '../hooks/usePersona';
import { projectsQueryOptions } from '../hooks/useProjects';
import '../styles/browse.css';

const Browse = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { personas, loading, error } = usePersona();
  const profiles = personas.map((persona) => ({
    name: persona.slug,
    image: persona.media.avatar.url,
  }));
  const visibleProfiles = useProgressiveItems(profiles, 6, 6);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  const handleProfileClick = (profile) => {
    navigate(`/profile/${profile.name}`);
  };

  const handleProfileHover = () => {
    queryClient.prefetchQuery(projectsQueryOptions);
  };

  return (
    <div className="browse-container">
      <p className='who-is-watching'>Who's Watching?</p>
      <div className="profiles">
        {visibleProfiles.map((profile) => (
          <ProfileCard
            key={profile.name}
            name={profile.name}
            image={profile.image}
            onClick={() => handleProfileClick(profile)}
            onMouseEnter={handleProfileHover}
          />
        ))}
      </div>
    </div>
  );
};

export default Browse;
