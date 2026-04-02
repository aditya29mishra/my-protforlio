import React, { memo, useCallback, useEffect, useMemo } from 'react';
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
  const profiles = useMemo(
    () =>
      personas.map((persona) => ({
        name: persona.slug,
        image: persona.media.avatar.url,
      })),
    [personas]
  );
  const visibleProfiles = useProgressiveItems(profiles, 6, 6);
  const handleProfileSelect = useCallback(
    (profileName) => {
      navigate(`/profile/${profileName}`);
    },
    [navigate]
  );

  const handleProfileHover = useCallback(() => {
    queryClient.prefetchQuery(projectsQueryOptions);
  }, [queryClient]);

  const profileCards = useMemo(
    () =>
      visibleProfiles.map((profile, index) => (
        <ProfileCard
          key={profile.name}
          profileName={profile.name}
          name={profile.name}
          image={profile.image}
          onSelect={handleProfileSelect}
          onPrefetch={handleProfileHover}
          priority={index < 4}
        />
      )),
    [handleProfileHover, handleProfileSelect, visibleProfiles]
  );

  useEffect(() => {
    visibleProfiles.forEach((profile) => {
      if (!profile.image) {
        return;
      }

      const image = new Image();
      image.src = profile.image;
    });
  }, [visibleProfiles]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div className="browse-container">
      <p className='who-is-watching'>Who's Watching?</p>
      <div className="profiles">
        {profileCards}
      </div>
    </div>
  );
};

export default memo(Browse);
