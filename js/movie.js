// Get the movie backdrop path from the URL parameter
const urlParams = new URLSearchParams(window.location.search);
const backdropPath = urlParams.get('backdrop');

// Set the background image
document.body.style.backgroundImage = `url(${backdropPath})`;