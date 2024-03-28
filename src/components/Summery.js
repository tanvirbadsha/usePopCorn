import { useState } from "react";
import { average } from "./static data/data";

export function Summery({ children, watched, selectedID }) {
  const [isOpen2, setIsOpen2] = useState(true);

  // Function to calculate average with rounding to two decimal places
  function calculateAverage(array) {
    if (array.length === 0) return 0;
    const sum = array.reduce((acc, val) => acc + val, 0);
    return Math.round((sum / array.length) * 100) / 100;
  }
  const avgUserRating = calculateAverage(
    watched.map((movie) => movie.userRating)
  );
  //const avgRuntime = calculateAverage(watched.map((movie) => movie.runtime));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  const runtime = avgRuntime.toFixed(2);
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  // const avgUserRating = average(watched.map((movie) => movie.userRating));
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen2((open) => !open)}
      >
        {isOpen2 ? "–" : "+"}
      </button>
      {isOpen2 && (
        <>
          {!selectedID && (
            <div className="summary">
              <h2>Movies you watched</h2>
              <div>
                <p>
                  <span>#️⃣</span>
                  <span>{watched.length} movies</span>
                </p>
                <p>
                  <span>⭐️</span>
                  <span>{avgImdbRating}</span>
                </p>
                <p>
                  <span>🌟</span>
                  <span>{avgUserRating}</span>
                </p>
                <p>
                  <span>⏳</span>
                  <span>{runtime} min</span>
                </p>
              </div>
            </div>
          )}

          {children}
        </>
      )}
    </div>
  );
}
