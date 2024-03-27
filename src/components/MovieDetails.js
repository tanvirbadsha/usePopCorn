import { useEffect, useState } from "react";
import StarRating from "./startRating/StarRating";
import { key } from "../App";
import { Loader } from "./Loader";
import { Box } from "@mui/material";

export function MovieDetails({
  selectedID,
  onCloseClick,
  onHandleWatchList,
  onSetUserRating,
  userRating,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  //fetching data from omdb movie api
  useEffect(
    function () {
      async function getMovieDetails() {
        setIsLoading(true);
        // avoiding race conditon
        const result = await fetch(
          `http://www.omdbapi.com/?apikey=${key}&i=${selectedID}`
        );
        const data = await result.json();
        setIsLoading(false);
        setMovie(data);
      }
      getMovieDetails();
    },
    [selectedID]
  );

  // chaning the page title as we click new movies
  useEffect(
    function () {
      if (!movie.Title) return;
      document.title = `Movie | ${movie.Title}`;

      return function () {
        document.title = "usePoPcorn";
      };
    },
    [movie.Title]
  );
  // adding escape button as back navigation
  useEffect(
    function () {
      function callBack(e) {
        if (e.code === "Escape") {
          onCloseClick();
          console.log("closed movie details!");
        }
      }
      document.addEventListener("keydown", callBack);

      return function () {
        document.removeEventListener("keydown", callBack);
      };
    },
    [onCloseClick]
  );
  return (
    <Box
      sx={{ backgroundColor: "#343a40", borderRadius: "10px", color: "white" }}
    >
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseClick}>
              &larr;
            </button>
            <img src={movie.Poster} alt="poster" />
            <div className="details-overview">
              <h2>{movie.Title}</h2>
              <p>
                {movie.Released} &bull; {movie.Runtime}
              </p>
              <p>{movie.Rating}</p>
              <p>
                <span>🦘{movie.imdbRating}</span>
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              <StarRating
                maxRating={10}
                size={24}
                onSetStarCount={onSetUserRating}
              />
            </div>
            <button
              className="btn-add"
              onClick={() => {
                onHandleWatchList(movie);
                onCloseClick();
              }}
            >
              + add to list
            </button>

            <p>
              <em>{movie.Plot}</em>
            </p>
            <p>Starring {movie.Actor}</p>
            <p>Directed By {movie.Director}</p>
          </section>
        </>
      )}
    </Box>
  );
}
