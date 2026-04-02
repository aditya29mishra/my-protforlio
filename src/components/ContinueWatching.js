import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ContinueWatching.css';

const ContinueWatching = ({ profile, picks = [] }) => {
  return (
    <div className="continue-watching-row">
      <h2 className="row-title">Continue Watching for {profile}</h2>
      <div className="card-row">
        {picks.map((pick, index) => (
          <Link to={pick.route} key={index} className="pick-card">
            <img src={pick.media.url} alt={pick.title} className="pick-image" loading="lazy" />
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
