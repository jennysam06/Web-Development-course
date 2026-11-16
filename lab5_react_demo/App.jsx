import React, { useState } from "react";
import "./style.css";

// Reusable Movie Item Component (Slide 8 & 37)
function MovieCard({ movie, onRemove }) {
  return (
    <div className="movie-item">
      <div className="movie-info">
        <h3>{movie.title}</h3>
        {/* Requirement 4: Show rating using star emojis */}
        <div className="stars">{"⭐".repeat(movie.rating)}</div>
        {/* Requirement 2: Show comment review */}
        {movie.review && <p className="review-text">"{movie.review}"</p>}
      </div>
      {/* Requirement 1: Remove movie */}
      <button className="delete-btn" onClick={() => onRemove(movie.id)}>✕</button>
    </div>
  );
}

// Main Movies Watchlist Component (Slide 39)
export default function App() {
  // State for list of movies
  const [movies, setMovies] = useState([
    { id: 1, title: "Inception", rating: 5, review: "Mind-bending visual masterpiece!" },
    { id: 2, title: "Interstellar", rating: 4, review: "Emotional story with amazing soundtrack." }
  ]);

  // Form input states
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");

  // Requirement 1: Add movie to the list
  const handleAddMovie = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newMovie = {
      id: Date.now(),
      title: title.trim(),
      rating: Number(rating),
      review: review.trim()
    };

    setMovies([...movies, newMovie]);
    setTitle("");
    setRating(5);
    setReview("");
  };

  // Requirement 1: Remove movie from list
  const handleRemoveMovie = (id) => {
    setMovies(movies.filter((movie) => movie.id !== id));
  };

  return (
    <div className="card">
      <div className="title">
        <span>🎬 Movies Watchlist</span>
        <span className="badge">{movies.length} {movies.length === 1 ? 'Movie' : 'Movies'}</span>
      </div>

      {/* Add Movie Form */}
      <form onSubmit={handleAddMovie} className="form-group">
        <div className="input-row">
          <input
            type="text"
            placeholder="Movie title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ flex: 1 }}
          />
          {/* Requirement 3: Star rating selector */}
          <select value={rating} onChange={(e) => setRating(e.target.value)}>
            <option value="5">⭐⭐⭐⭐⭐ (5)</option>
            <option value="4">⭐⭐⭐⭐ (4)</option>
            <option value="3">⭐⭐⭐ (3)</option>
            <option value="2">⭐⭐ (2)</option>
            <option value="1">⭐ (1)</option>
          </select>
        </div>
        {/* Requirement 2: Comment review input */}
        <textarea
          placeholder="Write a comment / review..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
        <button type="submit" className="btn-primary">Add Movie</button>
      </form>

      {/* Render Movies using .map (Slide 9 & 29) */}
      <div className="item-list">
        {movies.length === 0 ? (
          <p className="empty-state">No movies in your watchlist yet.</p>
        ) : (
          movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} onRemove={handleRemoveMovie} />
          ))
        )}
      </div>
    </div>
  );
}
