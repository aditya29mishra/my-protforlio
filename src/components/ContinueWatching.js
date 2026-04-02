import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ContinueWatching.css';
import personasData from '../data/personas.json';

const ContinueWatching = ({ profile }) => {
  const persona = personasData.personas.find((entry) => entry.slug === profile);
  const groupKey = persona?.recommendationGroups.continueWatching;
  const continueWatching = (groupKey ? personasData.recommendationGroups.continueWatching[groupKey] : []).map((pick) => ({
    title: pick.title,
    imgSrc: pick.media.url,
    link: pick.route
  }));

  return (
    <div className="continue-watching-row">
      <h2 className="row-title">Continue Watching for {profile}</h2>
      <div className="card-row">
        {continueWatching.map((pick, index) => (
          <Link to={pick.link} key={index} className="pick-card">
            <img src={pick.imgSrc} alt={pick.title} className="pick-image" />
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
