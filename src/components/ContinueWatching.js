import React, { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SmartImage from './SmartImage';
import { useProgressiveItems } from '../hooks/useProgressiveItems';
import '../styles/ContinueWatching.css';

const ContinueWatching = ({ profile, picks = [] }) => {
  const visiblePicks = useProgressiveItems(picks, 6, 6);
  const pickLinks = useMemo(
    () =>
      visiblePicks.map((pick, index) => (
        <Link to={pick.route} key={`${pick.route}-${index}`} className="pick-card">
          <SmartImage
            src={pick.media.url}
            alt={pick.title}
            className="pick-image"
            aspectRatio="3 / 2"
            sizes="150px"
          />
          <div className="overlay">
            <div className="pick-label">{pick.title}</div>
          </div>
        </Link>
      )),
    [visiblePicks]
  );

  return (
    <div className="continue-watching-row">
      <h2 className="row-title">Continue Watching for {profile}</h2>
      <div className="card-row">{pickLinks}</div>
    </div>
  );
};

export default memo(ContinueWatching);
