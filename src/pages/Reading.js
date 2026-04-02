import React, { memo, useMemo } from 'react';
import SmartImage from '../components/SmartImage';
import { useProgressiveItems } from '../hooks/useProgressiveItems';
import '../styles/Reading.css';
import { useReadingContent } from '../hooks/useReadingContent';

const Reading = () => {
  const { books, loading, error } = useReadingContent();
  const visibleBooks = useProgressiveItems(books, 6, 6);
  const bookCards = useMemo(
    () =>
      visibleBooks.map((book, index) => (
        <div key={book.slug || index} className="book-card">
          <SmartImage
            src={book.image}
            alt={book.alt}
            className="book-cover"
            aspectRatio="2 / 3"
            sizes="(max-width: 768px) 50vw, 220px"
          />
          <div className="book-info">
            <h2 className="book-title">{book.title}</h2>
            <p className="book-author">{book.author}</p>
            <p className="book-description">{book.description}</p>
          </div>
        </div>
      )),
    [visibleBooks]
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div className="reading-container">
      <h1 className="reading-title">Books to Read</h1>
      <p className="reading-intro">Dive into some of the best books across genres and languages.</p>

      <div className="books-grid">
        {bookCards}
      </div>
    </div>
  );
};

export default memo(Reading);
