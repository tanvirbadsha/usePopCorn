import { Typography } from "@mui/material";
import { useState } from "react";

export function MovieList({ movies, onHandleMovieClick }) {
  const [isOpen1, setIsOpen1] = useState(true);
  console.log(movies);
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen1((open) => !open)}
      >
        {isOpen1 ? "–" : "+"}
      </button>
      {isOpen1 && (
        <ul className="list list-movies">
          {movies.length !== 0 ? (
            movies.map((movie) => (
              <li
                key={movie.imdbID}
                onClick={() => onHandleMovieClick(movie.imdbID)}
              >
                <img src={movie.Poster} alt={`${movie.Title} poster`} />
                <h3>{movie.Title}</h3>
                <div>
                  <p>
                    <span>🗓</span>
                    <span>{movie.Year}</span>
                  </p>
                </div>
              </li>
            ))
          ) : (
            <Typography variant="h4" p={1}>
              Please atelast search 3 first letter of a movie to start.
            </Typography>
          )}
        </ul>
      )}
    </div>
  );
}
