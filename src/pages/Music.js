import React from "react";
import "../styles/Music.css";
import content from "../data/content.json";

const songs = content.music.songs.map((song) => song.embedUrl);

const albums = content.music.collections.map((collection) => ({
  name: collection.title,
  description: collection.description,
  spotifyLink: collection.embedUrl
}));

const Music = () => {
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
              key={index}
              className="spotify-player"
              src={song}
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
          {albums.map((album, index) => (
            <div className="album-card" key={index}>
              <iframe
                src={album.spotifyLink}
                width="250"
                height="200"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              ></iframe>
              <div className="album-details">
                <h4>{album.name}</h4>
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
