import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css'; // Make sure to create and link the CSS file

export default function Home() {
  return (
    <div className="home-container">
      <header className="hero-section">
        <h1>Welcome to Book Haven</h1>
        <p>Your gateway to a world of reading</p>
        <Link to="/book" className="cta-button">Browse Books</Link>
      </header>

      <section className="features-section">
        <div className="feature">
          <h2>Discover New Reads</h2>
          <p>Explore a wide range of books across various genres. Whether you love fiction, non-fiction, or something in between, we've got something for everyone.</p>
        </div>
        <div className="feature">
          <h2>Build Your Library</h2>
          <p>Add your favorite books to your personal library. Keep track of what you've read and what's next on your reading list.</p>
        </div>
        <div className="feature">
          <h2>Join the Community</h2>
          <p>Connect with fellow book lovers. Share reviews, recommendations, and your passion for reading.</p>
        </div>
      </section>

      <footer className="footer-section">
        <p>&copy; 2024 Book Haven. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
