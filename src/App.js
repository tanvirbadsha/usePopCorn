import { useEffect, useState, useRef } from "react";
import { NavBar } from "./components/NavBar";
import { Main } from "./components/Main";
import { MovieList } from "./components/MovieList";
import { Summery } from "./components/Summery";
import { RenderList } from "./components/RenderList";
import { Search } from "./components/Search";
import { MovieDetails } from "./components/MovieDetails";
import { Loader } from "./components/Loader";
import { tempWatchedData } from "./components/static data/data";
import useFetchMovies from "./components/customhooks/useFetchMovies";

export default function App() {
  const [watched, setWatched] = useState(tempWatchedData);
  const [query, setQuery] = useState("");
  const { movies, isLoading, error } = useFetchMovies(query);
  const [selectedID, setSelectedID] = useState(null);
  const [userRating, setUserRating] = useState("");
  const countRef = useRef(0);

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
