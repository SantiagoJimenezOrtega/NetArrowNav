document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const backdropUrl = urlParams.get("backdrop");
  const movieTitle = urlParams.get("title");

  if (backdropUrl) {
    document.body.style.backgroundImage = `url('${backdropUrl}')`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";

    const movieInfoElement = document.createElement("div");
    movieInfoElement.className = "movie-info";

    const titleElement = document.createElement("h1");
    titleElement.className = "title";
    titleElement.textContent = movieTitle;

    const descriptionElement = document.createElement("p");
    descriptionElement.className = "overview";
    descriptionElement.textContent = urlParams.get("overview");

    movieInfoElement.appendChild(titleElement);
    movieInfoElement.appendChild(descriptionElement);

    document.body.appendChild(movieInfoElement);
  } else {
    console.error("Thumbnail URL is empty or invalid");
  }
  /** */
  document.addEventListener(
    "focus",
    function (event) {
      console.log("Focused element:", event.target);
    },
    true
  );
  /** */
  // Get the return button element
  const returnButton = document.querySelector(".return-button");

  console.log(returnButton); // Should log the return button element

  // Add tabindex to make the return button focusable
  returnButton.tabIndex = 0;

  // Add event listener to handle keyboard navigation
  returnButton.addEventListener("keydown", (event) => {
    console.log("Return button keydown event listener triggered");
    if (event.key === "Enter") {
      returnButton.click();
    }
  });
});

angular.module("myApp", ["caph.focus"]).controller("myController", [
  "$scope",
  "FocusConstant",
  "focusController",
  "nearestFocusableFinder",
  function ($scope, FocusConstant, focusController, nearestFocusableFinder) {
    $scope.focusRight = function (from) {
      focusController.focus(
        nearestFocusableFinder.getNearest(from, FocusConstant.DIRECTION.RIGHT)
      );
    };
  },
]);
