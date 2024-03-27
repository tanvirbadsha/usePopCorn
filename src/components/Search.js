import { useEffect, useRef } from "react";

export function Search({ query, setQuery }) {
  // initiating useRef
  const inputEl = useRef(null);
  useEffect(
    function () {
      function callBack(e) {
        if (document.activeElement === inputEl.current) return;
        if (e.code === "Enter") {
          inputEl.current.focus();
          setQuery("");
        }
      }
      document.addEventListener("keydown", callBack);
      // clean up function
      return () => document.addEventListener("keydown", callBack);
    },
    [setQuery]
  );
  return (
    <div>
      <input
        className="search"
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        // element is connected to ref
        ref={inputEl}
      />
    </div>
  );
}
