import React from 'react';
import '../styles/Reading.css';
import { useReadingContent } from '../hooks/useReadingContent';

const Reading = () => {
  const { books, loading, error } = useReadingContent();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div className="reading-container">
      <h1 className="reading-title">Books to Read</h1>
      <p className="reading-intro">Dive into some of the best books across genres and languages.</p>

      <div className="books-grid">
        {books.map((book, index) => (
          <div key={book.slug || index} className="book-card">
            <img src={book.image} alt={book.alt} className="book-cover" loading="lazy" />
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
