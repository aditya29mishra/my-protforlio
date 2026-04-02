import React, { memo, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/ProfilePage.css';
import { usePersona } from '../hooks/usePersona';

import ProfileBanner from './ProfileBanner';
import TopPicksRow from './TopPicksRow';
import ContinueWatching from './ContinueWatching';

const DEFAULT_BACKGROUND_GIF = "https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif";

const ProfilePage = () => {
  const { profileName } = useParams();
  const { personasData, persona, profile, loading, error } = usePersona(profileName);
  const backgroundGif = persona?.media.background.url || DEFAULT_BACKGROUND_GIF;
  const topPicks = useMemo(
    () =>
      persona?.recommendationGroups.topPicks
        ? personasData.recommendationGroups.topPicks[
            persona.recommendationGroups.topPicks
          ] || []
        : [],
    [personasData.recommendationGroups.topPicks, persona]
  );
  const continueWatching = useMemo(
    () =>
      persona?.recommendationGroups.continueWatching
        ? personasData.recommendationGroups.continueWatching[
            persona.recommendationGroups.continueWatching
          ] || []
        : [],
    [personasData.recommendationGroups.continueWatching, persona]
  );

  useEffect(() => {
    [persona?.media.avatar.url, backgroundGif].filter(Boolean).forEach((imageUrl) => {
      const image = new Image();
      image.src = imageUrl;
    });
  }, [backgroundGif, persona]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <>
      <div
        className="profile-page"
        style={{ backgroundImage: `url(${backgroundGif})` }}
      >
        <ProfileBanner />
      </div>
      <TopPicksRow profile={profile} picks={topPicks} />
      <ContinueWatching profile={profile} picks={continueWatching} />
    </>
  );
};

export default memo(ProfilePage);
