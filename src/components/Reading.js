import React from 'react';
import './Reading.css';

// Book data
const books = [
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones.',
    image: require('../assets/atomicHabits.jpg'), // Replace with actual path or URL
  },
  {
    title: 'Rich Dad Poor Dad',
    author: 'Robert Kiyosaki',
    description: 'What the Rich Teach Their Kids About Money.',
    image: require('../assets/richDadPoorDad.jpg'), // Replace with actual path or URL
  },
  {
    title: 'A Song of Ice and Fire',
    author: 'George R.R. Martin',
    description: 'FIRE AND BLOOD is the definitive history of the Targaryens in Westeros.',
    image: require('../assets/A Song of Ice and Fire.jpg'), // Replace with actual path or URL
  },
  {
    title: 'Harry Potter',
    author: 'J.K. Rowling',
    description: 'Harry dreams he will win the competition.',
    image: require('../assets/Harry Potter.jpg'), // Replace with actual path or URL
  },
];

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
