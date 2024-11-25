import React from "react";
import "./Music.css";

const songs = [
  "https://open.spotify.com/embed/track/5W7DOVGQLTigu09afW7QMT?utm_source=generator",
  "https://open.spotify.com/embed/track/1dGr1c8CrMLDpV6mPbImSI?utm_source=generator",
  "https://open.spotify.com/embed/track/7fBv7CLKzipRk6EC6TWHOB?utm_source=generator",
];

const albums = [
  {
    name: "Top 50 Global",
    description: "Today's most popular tracks from across the globe.",
    spotifyLink:
      "https://open.spotify.com/embed/playlist/37i9dQZEVXbMDoHDwVN2tF?utm_source=generator",
  },
  {
    name: "My Top Songs 2023",
    description: "Your most played songs of 2023.",
    spotifyLink:
      "https://open.spotify.com/embed/playlist/37i9dQZF1Fa1IIVtEpGUcU?utm_source=generator",
  },
  {
    name: "Moonchild Era - Diljit Dosanjh",
    description: "An album by Diljit Dosanjh full of soulful tracks.",
    spotifyLink:
      "https://open.spotify.com/embed/album/0wkGNaTXbbxaD9QjvxlNGE?utm_source=generator",
  },
];

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
