import React from 'react';
import '../styles/Reading.css';
import content from '../data/content.json';
import localAssetMap from '../data/localAssetMap';

const books = content.reading.books.map((book) => ({
  title: book.title,
  author: book.author,
  description: book.description,
  image: localAssetMap[book.media.imageAssetKey]
}));

const Reading = () => {
  return (
    <div className="reading-container">
      <h1 className="reading-title">Books to Read</h1>
      <p className="reading-intro">Dive into some of the best books across genres and languages.</p>

      <div className="books-grid">
        {books.map((book, index) => (
          <div key={index} className="book-card">
            <img src={book.image} alt={book.title} className="book-cover" />
            <div className="book-info">
              <h2 className="book-title">{book.title}</h2>
              <p className="book-author">{book.author}</p>
              <p className="book-description">{book.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reading;
