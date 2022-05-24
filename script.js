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
  const movieCrds= await fetchMoviesCredits(movie.id);
  renderMovie(movieRes,movieCrds);
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
        <img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${
      movie.title
    } poster">
        <h3>${movie.title}</h3>`;
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    CONTAINER.appendChild(movieDiv);
  });
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = (movie,credits) => {
  CONTAINER.innerHTML = `
    <div class="row">
        <div class="col-md-4">
             <img id="movie-backdrop" src=${
               BACKDROP_BASE_URL + movie.backdrop_path
             }>
        </div>
        <div class="col-md-8">
            <h2 id="movie-title">${movie.title}</h2>
            <p id="movie-release-date"><b>Release Date:</b> ${
              movie.release_date
            }</p>
            <p id="movie-runtime"><b>Runtime:</b> ${movie.runtime} Minutes</p>
            <h3>Overview:</h3>
            <p id="movie-overview">${movie.overview}</p>
            <p id="vote_average"> <b>vote Average:</b> ${movie.vote_average}    
             <b>Vote Count: </b> ${movie.vote_count} </p>
            <p id="original_language"><b>language:</b> ${movie.original_language} </p>
            <p id="director"> <b>Director: </b></p>
        </div>
        </div>
            <h3>Actors:</h3>
            <ul id="actors" class="list-unstyled">
            </ul>
    </div>`;
   const actors = document.getElementById('actors');
    for(let i=0 ; i<5 ; i++){ 
      const actorLi =document.createElement('li') ;
      const actorH3 =document.createElement('h3') ;
      actorH3.innerHTML =`${credits.cast[i].name}`;
      const actorphoto =document.createElement('img') ;
      actorphoto.src=PROFILE_BASE_URL+ credits.cast[i].profile_path;
      actors.append(actorLi);
      actorLi.append(actorphoto);
      actorLi.append(actorH3);
    };
    // let directorIn= -1;
    // for(let i=0 ; i<credits.crew.length ; i++){
    // directorIn = credits.crew[i].job.indexOf('Director');
    // console.log(directorIn);
    // if (directorIn!==-1){
    //   console.log(credits.crew[directorIn].name);
      
    // }
    // console.log(credits.crew[directorIn].name);

  };

 

};

document.addEventListener("DOMContentLoaded", autorun);

const fetchMoviesCredits = async (moiveID) => {
  const url = constructUrl(`movie/${moiveID}/credits`);
  const res = await fetch(url);
  const Cast = await res.json();
  console.log(Cast);
  return Cast
};
// fetchMoviesCredits(moiveID);

const MoviesCast =async () =>{
  await fetchMoviesCredits(moiveID);
  for(let i=0 ; i<5 ; i++){ 
  console.log(Cast.cast[i].name);
  console.log(Cast.cast[i].profile_path);

};
}
// MoviesCast()



