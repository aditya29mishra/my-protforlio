import React from "react";
import "../styles/Music.css";
import { useMusicContent } from "../hooks/useMusicContent";

const Music = () => {
  const { songs, collections, loading, error } = useMusicContent();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div className="music-page">
      <h1 className="music-title">My Spotify Music</h1>
      <p className="quote">
        “Music is the universal language of mankind.” — Henry Wadsworth
      </p>

      {/* Spotify Songs Section */}
      <div className="spotify-embed">
        <h2>Top Songs</h2>
        <div className="songs-grid">
          {songs.map((song, index) => (
            <iframe
              key={song.slug || index}
              title={`Spotify song ${index + 1}`}
              className="spotify-player"
              src={song.embedUrl}
              width="250"
              height="80"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            ></iframe>
          ))}
        </div>
      </div>

      {/* Albums Section */}
      <div className="albums-section">
        <h2>Albums & Playlists</h2>
        <div className="albums">
          {collections.map((album, index) => (
            <div className="album-card" key={album.slug || index}>
              <iframe
                title={album.title}
                src={album.embedUrl}
                width="250"
                height="200"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              ></iframe>
              <div className="album-details">
                <h4>{album.title}</h4>
                <p>{album.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Music;
