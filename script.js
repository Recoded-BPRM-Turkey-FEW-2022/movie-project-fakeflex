'use strict';

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".container");

// Don't touch this function please
const autorun = async () => {
  const movies = await fetchMovies();
  renderMovies(movies.results);
};

// Don't touch this function please
const constructUrl = (path) => {
  return `${TMDB_BASE_URL}/${path}?api_key=${atob(
    "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
  )}`;
};

// You may need to add to this function, definitely don't delete it.
const movieDetails = async (movie) => {
  const movieRes = await fetchMovie(movie.id);
  renderMovie(movieRes);
};

// This function is to fetch movies. You may need to add it or change some part in it in order to apply some of the features.
const fetchMovies = async () => {
  const url = constructUrl(`movie/now_playing`);
  const res = await fetch(url);
  return res.json();
};

// Don't touch this function please. This function is to fetch one movie.
const fetchMovie = async (movieId) => {
  const url = constructUrl(`movie/${movieId}`);
  const res = await fetch(url);
  return res.json();
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovies = (movies) => {
  movies.map((movie) => {
    const movieDiv = document.createElement("div");
    movieDiv.innerHTML = `
        <img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${movie.title
      } poster">
        <h3>${movie.title}</h3>`;
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    CONTAINER.appendChild(movieDiv);
  });
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = (movie) => {
  CONTAINER.innerHTML = `
    <div class="row">
        <div class="col-md-4">
             <img id="movie-backdrop" src=${PROFILE_BASE_URL + movie.backdrop_path
    }>
        </div>
        <div class="col-md-8">
            <h2 id="movie-title">${movie.title}</h2>
            <p id="movie-release-date"><b>Release Date:</b> ${movie.release_date
    }</p>
            <p id="movie-runtime"><b>Runtime:</b> ${movie.runtime} Minutes</p>
            <h3>Overview:</h3>
            <p id="movie-overview">${movie.overview}</p>
        </div>
        </div>
            <h3>Actors:</h3>
            <ul id="actors" class="list-unstyled"></ul>
    </div>`;
};

const actorDetails = async (actor) => {
  const ActorRes = await fetchActor(actor.id);
  renderActor(ActorRes);
};

const fetchActor = async (ActorId) => {             // http://api.themoviedb.org/3/person/18277?api_key=542003918769df50083a13c415bbc602
  const url = constructUrl(`person/${ActorId}`);
  const res = await fetch(url);
  return res.json();
};

const renderActor = (actor) => {                    // later: actorCredit param
  CONTAINER.innerHTML = `
  <div class="row " id="single-actor-page">
  <div class="col-lg-4 col-md-12 col-sm-12">
    <img id="actor-backdrop" src=${actor.backdropUrl}> 
  </div>
  <div class="col-lg-8 col-md-12 col-sm-12">
    <h2 id="actor-name"><span>${actor.name}</span></h2>
    <h4>Gender:</h4>
    <p id="gender">${actor.gender}</p>
    <h4>Popularity:</h4>
    <p id="popularity">${actor.popularity}</p>
    <h4>Birthday:</h4>
    <p id="birthday">${actor.birthday}</p>
    ${actor.deathday}
    <h4>Biography:</h4>
     <p id="biography" style="color:#BDBDBD; font-size: .8rem;">${actor.biography}</p>
  </div>
  <div class="container" >
    <h4 class="row" style="padding:1rem;"> Related Movies:</h4> 
    <div class="row"> ${actorCredit.credits}</div>
  </div>
</div>`;
};





document.addEventListener("DOMContentLoaded", autorun);