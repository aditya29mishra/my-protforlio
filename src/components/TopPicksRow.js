import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TopPicksRow.css';

const TopPicksRow = ({ profile, picks = [] }) => {
  const navigate = useNavigate();

  if (picks.length === 0) {
    return <div>No recommendations available for this profile.</div>;
  }


  return (
    <div className="top-picks-row">
      <h2 className="row-title">Today's Top Picks for {profile}</h2>
      <div className="card-row">
        {picks.map((pick, index) => (
          <div 
            key={index} 
            className="pick-card" 
            onClick={() => navigate(pick.route)}
            style={{ animationDelay: `${index * 0.2}s` }} // Adding delay based on index
          >
            <img src={pick.media.url} alt={pick.title} className="pick-image" />
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
