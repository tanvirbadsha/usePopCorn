import { useEffect, useState } from "react";
import { key } from "../static data/data";

export default function useFetchMovies(query, paramKey = "s") {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [movies, setMovies] = useState([]);
  const [movie, setMovie] = useState({});

  useEffect(
    function () {
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const result = await fetch(
            `http://www.omdbapi.com/?apikey=${key}&${paramKey}=${query}`
          );
          if (!result.ok) throw new Error("Data Fetching Failed!...");
          const data = await result.json();
          if (data.Response === "False")
            throw new Error("Movie name not found!");
          paramKey === "s" ? setMovies(data.Search) : setMovie(data);
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
      return function () {};
    },
    [query]
  );
  return { movies, isLoading, error, movie };
}
