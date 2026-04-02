import React from 'react';
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  const backgroundGif = persona?.media.background.url || DEFAULT_BACKGROUND_GIF;
  const topPicks = persona?.recommendationGroups.topPicks
    ? personasData.recommendationGroups.topPicks[persona.recommendationGroups.topPicks] || []
    : [];
  const continueWatching = persona?.recommendationGroups.continueWatching
    ? personasData.recommendationGroups.continueWatching[persona.recommendationGroups.continueWatching] || []
    : [];

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

export default ProfilePage;
