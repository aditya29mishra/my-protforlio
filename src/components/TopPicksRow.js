import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TopPicksRow.css';
import personasData from '../data/personas.json';

const TopPicksRow = ({ profile }) => {
  const navigate = useNavigate();
  const persona = personasData.personas.find((entry) => entry.slug === profile);
  const groupKey = persona?.recommendationGroups.topPicks;
  const topPicks = (groupKey ? personasData.recommendationGroups.topPicks[groupKey] : []).map((pick) => ({
    title: pick.title,
    imgSrc: pick.media.url,
    route: pick.route
  }));

  console.log("Profile in TopPicksRow:", profile);

  if (topPicks.length === 0) {
    return <div>No recommendations available for this profile.</div>;
  }


  return (
    <div className="top-picks-row">
      <h2 className="row-title">Today's Top Picks for {profile}</h2>
      <div className="card-row">
        {topPicks.map((pick, index) => (
          <div 
            key={index} 
            className="pick-card" 
            onClick={() => navigate(pick.route)}
            style={{ animationDelay: `${index * 0.2}s` }} // Adding delay based on index
          >
            <img src={pick.imgSrc} alt={pick.title} className="pick-image" />
            <div className="overlay">
              <div className="pick-label">{pick.title}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopPicksRow;
