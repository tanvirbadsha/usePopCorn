import { useEffect } from "react";
import StarRating from "./startRating/StarRating";
import { Loader } from "./Loader";
import { Box, Button, Typography } from "@mui/material";
import useFetchMovies from "./customhooks/useFetchMovies";

export function MovieDetails({
  selectedID,
  onCloseClick,
  onHandleWatchList,
  onSetUserRating,
}) {
  const { movie, isLoading } = useFetchMovies(selectedID, "i");

  // chaning the page title as we click new movie
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
              <Typography variant="h2">{movie.Title}</Typography>

              <Typography variant="h6">
                {movie.Released} &bull; {movie.Runtime}
              </Typography>
              <p>{movie.Rating}</p>
              <p>
                <Box component="span">
                  <Typography variant="h4">🎥 {movie.imdbRating}</Typography>
                </Box>
              </p>
            </div>
          </header>
          <Box component={"section"} sx={{ marginLeft: "5px" }}>
            <div className="rating">
              <StarRating
                maxRating={10}
                size={24}
                onSetStarCount={onSetUserRating}
              />
            </div>
            <Button
              // className="btn-add"
              variant="contained"
              sx={{
                marginLeft: "25px",
              }}
              onClick={() => {
                onHandleWatchList(movie);
                onCloseClick();
              }}
            >
              + add to list
            </Button>

            <p>
              <Box component="em">
                <Typography variant="h6">{movie.Plot}</Typography>
              </Box>
            </p>
            <Box component="p">
              <Typography variant="h6">Starring {movie.Actor}</Typography>
            </Box>
            <Box component="p">
              <Typography variant="h6">Directed By {movie.Director}</Typography>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}
