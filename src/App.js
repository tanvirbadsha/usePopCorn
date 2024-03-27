import { useEffect, useState, useRef } from "react";
import { NavBar } from "./components/NavBar";
import { Main } from "./components/Main";
import { MovieList } from "./components/MovieList";
import { Summery } from "./components/Summery";
import { RenderList } from "./components/RenderList";
import { Search } from "./components/Search";
import { MovieDetails } from "./components/MovieDetails";
import { Loader } from "./components/Loader";

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export const key = "52155ca3";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState(tempWatchedData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedID, setSelectedID] = useState(null);
  const [userRating, setUserRating] = useState("");
  const countRef = useRef(0);

  const controller = new AbortController();

  function handleMovieClick(id) {
    setSelectedID((prevId) => (id === prevId ? null : id));
  }
  function handleCloseMobie() {
    setSelectedID(null);
  }

  //adding countRef into the component
  useEffect(
    function () {
      if (userRating) countRef.current = countRef.current + 1;
    },
    [userRating]
  );
  // adding a movie to my watchList
  function handleWatchList(movie) {
    const durationNumber = parseInt(movie.Runtime);
    const alreadyAdded = watched.some((m) => m.imdbID === movie.imdbID);
    if (!alreadyAdded) {
      const newMovie = {
        imdbID: movie.imdbID,
        Title: movie.Title,
        Year: movie.Year,
        Poster: movie.Poster,
        runtime: durationNumber,
        imdbRating: movie.imdbRating,
        countRatingAttempt: countRef.current,
        userRating: userRating,
      };
      setWatched((w) => [...w, newMovie]);
      console.log(newMovie);
    } else {
      console.log("Movie with IMDb ID " + movie.imdbID + " is already added.");
      alert("Error! Movie already added!");
    }
  }

  //const query = "asdftg";
  useEffect(
    function () {
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const result = await fetch(
            `http://www.omdbapi.com/?apikey=${key}&s=${query}`,
            { signal: controller.signal }
          );
          if (!result.ok) throw new Error("Data Fetching Failed!...");
          const data = await result.json();
          //console.log(data);
          if (data.Response === "False")
            throw new Error("Movie name not found!");
          setMovies(data.Search);
          setError("");
        } catch (err) {
          console.error(err.message);
          if (err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      fetchMovies();
      return function () {
        controller.abort();
      };
    },
    [query]
  );
  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
        {isLoading && <Loader />}
        {error && <ErrorMessage message={error} />}
        {!isLoading && !error && (
          <MovieList movies={movies} onHandleMovieClick={handleMovieClick} />
        )}
        <Summery watched={watched} selectedID={selectedID}>
          {!selectedID && <RenderList watched={watched} />}
          {selectedID && (
            <MovieDetails
              selectedID={selectedID}
              onCloseClick={handleCloseMobie}
              onHandleWatchList={handleWatchList}
              userRating={userRating}
              onSetUserRating={setUserRating}
            />
          )}
        </Summery>
      </Main>
      <br /> <br />
    </>
  );
}

function ErrorMessage({ message }) {
  return <p className="error">🎫{message}</p>;
}
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies?.length}</strong> results
    </p>
  );
}
