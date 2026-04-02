import React, { memo, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import SmartImage from './SmartImage';
import { useProgressiveItems } from '../hooks/useProgressiveItems';
import '../styles/TopPicksRow.css';

const TopPicksRow = ({ profile, picks = [] }) => {
  const navigate = useNavigate();
  const visiblePicks = useProgressiveItems(picks, 6, 6);
  const handlePickClick = useCallback(
    (event) => {
      const route = event.currentTarget.dataset.route;

      if (route) {
        navigate(route);
      }
    },
    [navigate]
  );

  const pickCards = useMemo(
    () =>
      visiblePicks.map((pick, index) => (
        <div
          key={`${pick.route}-${index}`}
          className="pick-card"
          data-route={pick.route}
          onClick={handlePickClick}
          style={{ animationDelay: `${index * 0.2}s` }}
        >
          <SmartImage
            src={pick.media.url}
            alt={pick.title}
            className="pick-image"
            aspectRatio="5 / 4"
            sizes="250px"
          />
          <div className="overlay">
            <div className="pick-label">{pick.title}</div>
          </div>
        </div>
      )),
    [handlePickClick, visiblePicks]
  );

  if (visiblePicks.length === 0) {
    return <div>No recommendations available for this profile.</div>;
  }

  return (
    <div className="top-picks-row">
      <h2 className="row-title">Today's Top Picks for {profile}</h2>
      <div className="card-row">{pickCards}</div>
    </div>
  );
};

export default memo(TopPicksRow);
