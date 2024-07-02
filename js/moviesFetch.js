const tmdbApiEndpoint = "https://api.themoviedb.org/3";
const tmdbAuthorizationToken =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlYmFhMjczMzYwYTk2NzhlNTk1NzQ4MGY2YWRkYTNiNyIsIm5iZiI6MTcxOTc5MDEzNC41NTA3MzYsInN1YiI6IjY2NmI0NzVhODgzNmIxNDM4N2NkMjMxYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.H3MzymLd5I99vNksikrAowiR9SKWSfgxByfVdnXX8Mo";

async function fetchTmdbData(endpoint, options = {}) {
  try {
    const response = await fetch(`${tmdbApiEndpoint}/${endpoint}`, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${tmdbAuthorizationToken}`,
      },
      ...options,
    });
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }
    return response.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}
/**/
let rowMovieArrays = [];
/**/

function renderMovieList(endpoint, containerId) {
  fetchTmdbData(endpoint)
    .then((response) => {
      const rowContentElement = document.querySelector(`#${containerId} .row-content`);
      const movies = response.results;

      const movieListElement = document.createElement("div");
      movieListElement.className = "movieListElement";

      const moviePosition = {}; // <--- Add this object to store movie positions
      const movieArray = [];   // <--- Add this array to store movie objects

      movies.forEach((movie, index) => {
        const thumbnailElement = document.createElement("div");
        thumbnailElement.className = "thumbnail";

        const posterElement = document.createElement("img");
        posterElement.src = `https://image.tmdb.org/t/p/w500${movie.backdrop_path || movie.poster_path}`;
        posterElement.alt = movie.title || movie.original_name;

        const titleElement = document.createElement("h2");
        titleElement.className =
          "w-56 cursor-pointer text-sm font-semibold text-[#e5e5e5] transition duration-200 hover:text-red-500 md:text-2xl";
        titleElement.textContent = movie.title || movie.original_name;

        

        thumbnailElement.appendChild(posterElement);
        thumbnailElement.appendChild(titleElement);

        // Add tabindex here
        thumbnailElement.tabIndex = 0;

        // Add event listeners for keyboard navigation here
        thumbnailElement.addEventListener("keydown", (event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            // Navigate to previous/next movie thumbnail
            const currentIndex = Array.prototype.indexOf.call(
              movieListElement.children,
              thumbnailElement
            );
            const newIndex =
              currentIndex + (event.key === "ArrowRight" ? 1 : -1);
            const newThumbnail = movieListElement.children[newIndex];
            if (newThumbnail) {
              newThumbnail.focus();
            }
          } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
            // Navigate to previous/next row
            const rowElements = document.querySelectorAll(`.row-content`);
            const currentRowIndex = Array.prototype.indexOf.call(
              rowElements,
              rowContentElement
            );
            const newRowIndex =
              currentRowIndex + (event.key === "ArrowDown" ? 1 : -1);
            if (newRowIndex >= 0 && newRowIndex < rowElements.length) {
              const newRowElement = rowElements[newRowIndex];
              const firstThumbnail = newRowElement.querySelector(".thumbnail");
              if (firstThumbnail) {
                firstThumbnail.focus();
              }
            }
          }
        });

        // Add movie to the object with its position
        moviePosition[movie.title || movie.original_name] = index + 1;
        // Add movie object to the array
        movieArray.push({ name: movie.title || movie.original_name, position: index + 1 });

        thumbnailElement.addEventListener("focus", () => {
          thumbnailElement.classList.add("focused");
        });

        thumbnailElement.addEventListener("blur", () => {
          thumbnailElement.classList.remove("focused");
        });
        //

        movieListElement.appendChild(thumbnailElement);
      });

      rowContentElement.appendChild(movieListElement);
      // Log the movieArray to the console
      rowMovieArrays.push(movieArray);
      
    })
    .catch((err) => console.error(err));
}

// Call the function for each endpoint
Promise.all([
  renderMovieList(
    "trending/all/week?api_key=ebaa273360a9678e5957480f6adda3b7&language=en-US",
    "netflixOriginals"
  ),
  renderMovieList(
    "discover/movie?api_key=ebaa273360a9678e5957480f6adda3b7&with_networks=213",
    "trendingNow"
  ),
  renderMovieList(
    "movie/top_rated?api_key=ebaa273360a9678e5957480f6adda3b7&language=en-US",
    "topRated"
  ),
  renderMovieList(
    "discover/movie?api_key=ebaa273360a9678e5957480f6adda3b7&language=en-US&with_genres=28",
    "actionMovies"
  ),
  renderMovieList(
    "discover/movie?api_key=ebaa273360a9678e5957480f6adda3b7&language=en-US&with_genres=35",
    "comedyMovies"
  ),
  renderMovieList(
    "discover/movie?api_key=ebaa273360a9678e5957480f6adda3b7&language=en-US&with_genres=27",
    "horrorMovies"
  ),
  renderMovieList(
    "discover/movie?api_key=ebaa273360a9678e5957480f6adda3b7&language=en-US&with_genres=10749",
    "romanceMovies"
  ),
  renderMovieList(
    "discover/movie?api_key=ebaa273360a9678e5957480f6adda3b7&language=en-US&with_genres=99",
    "documentaries"
  ),
]).then(() => {
  console.log('Fetched movies from tmdb -', rowMovieArrays);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
    event.preventDefault();
  }
});

document.addEventListener(
  "focus",
  (event) => {
    console.log("Focused element:", event.target);
  },
  true
);


