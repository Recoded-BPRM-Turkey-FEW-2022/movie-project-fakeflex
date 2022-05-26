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
  const movieRes= await fetchMovie(movie.id);
  const movieCrds= await fetchMoviesCredits(movie.id);
  const movieRelat= await fetchRelatedMovies(movie.id);
  const movieVedio= await fetchMoviesTrailer(movie.id);
  renderMovie(movieRes,movieCrds,movieRelat,movieVedio);
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
const renderMovie = (movie,credits,similars,vedio) => {
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
            <p id="vote_average"> <b>Vote Average:</b> ${movie.vote_average}    
             <b>Vote Count: </b> ${movie.vote_count} </p>
            <p id="original_language"><b>language:</b> ${movie.spoken_languages[0].name} </p>
            <p id="director"> </p>
        </div>
        </div>
        <div id="vedio">
        
        </div>
          <div>
            <h3>Actors:</h3>
            <ul id="actors" class="list-unstyled">
            </ul>
            </div>
            <div id="companies" class="list-unstyled"><h3>production Company:</h3></div>
            <h3>Related Movies:</h3>
            <ul id="Related" class="list-unstyled">
            </ul>
    </div>`;

    //to get 5 Actors in the movie
   const actors = document.getElementById('actors');
    for(let i=0 ; i<5 ; i++){
      const actorLi =document.createElement('li') ;
      const actorphoto =document.createElement('img') ;
      const actorH3 =document.createElement('h4') ;
      actorH3.innerHTML =`${credits.cast[i].name}`;
      actorphoto.src=PROFILE_BASE_URL+ credits.cast[i].profile_path;
      actors.append(actorLi);
      actorLi.append(actorphoto);
      actorLi.append(actorH3);
    };

    //to get companies name and logo
    const companies= document.getElementById('companies');
    for(let i=0 ; i<2 ; i++){
      const company=document.createElement('li');
      const companyName=document.createElement('h4');
      const companyPhoto=document.createElement('img');

      companyName.innerHTML=`${movie.production_companies[i].name}`
      companyPhoto.src= BACKDROP_BASE_URL+ movie.production_companies[i].logo_path;
      companies.append(company);
      company.append(companyName);
      company.append(companyPhoto);
  };

    //to get 5 related movies
    const Related = document.getElementById('Related');
    for(let i=0 ; i<5 ; i++){
      const relatedMo =document.createElement('li') ;
      const MovieName =document.createElement('h4') ;
      const MoviePhoto =document.createElement('img') ;
      MovieName.innerHTML =`${similars[i].title}`;
      MoviePhoto.src=BACKDROP_BASE_URL+ similars[i].backdrop_path;
      Related.append(relatedMo);
      relatedMo.append(MoviePhoto);
      relatedMo.append(MovieName);
    };

  //to get the trailer(VEDIO)
  for(let i=0 ; i<vedio.length ; i++){
    const vedioT =document.getElementById('vedio');
    vedioT.innerHTML=`<iframe src=https://www.youtube.com/embed/${vedio[i].key} width="400" height="240" autoplay>
    </video>
    <h3>Trailer</h3>`;
  };

    //to get the director name 
    for(let i=0 ; i<credits.crew.length ; i++){
    if (credits.crew[i].job==='Director'){
    const directorName =`${credits.crew[i].name}`;
    const director= document.getElementById('director');
    director.innerHTML =`<b>Director</b>: ${directorName}`;
    };

  };
};

document.addEventListener("DOMContentLoaded", autorun);

//fetching all data of crew and cast (credits)
const fetchMoviesCredits = async (moiveID) => {
  const url = constructUrl(`movie/${moiveID}/credits`);
  const res = await fetch(url);
  const Cast = await res.json();
  return Cast
};

//fetching trailer(video) 
const fetchMoviesTrailer = async (moiveID) => {
  const url = constructUrl(`movie/${moiveID}/videos`);
  const res = await fetch(url);
  const vedio = await res.json();
  return vedio.results;
};

// fetching the most related movies (similar moives)
const fetchRelatedMovies = async (moiveID) => {
  const url = constructUrl(`movie/${moiveID}/similar`);
  const res = await fetch(url);
  const relatedMoveis = await res.json();
  return relatedMoveis.results;
};

