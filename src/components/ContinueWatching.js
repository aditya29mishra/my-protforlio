import React from 'react';
import { Link } from 'react-router-dom';
import SmartImage from './SmartImage';
import { useProgressiveItems } from '../hooks/useProgressiveItems';
import '../styles/ContinueWatching.css';

const ContinueWatching = ({ profile, picks = [] }) => {
  const visiblePicks = useProgressiveItems(picks, 6, 6);

  return (
    <div className="continue-watching-row">
      <h2 className="row-title">Continue Watching for {profile}</h2>
      <div className="card-row">
        {visiblePicks.map((pick, index) => (
          <Link to={pick.route} key={index} className="pick-card">
            <SmartImage
              src={pick.media.url}
              alt={pick.title}
              className="pick-image"
              style={{ width: '100%', height: '100%' }}
              sizes="150px"
            />
            <div className="overlay">
              <div className="pick-label">{pick.title}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ContinueWatching;
