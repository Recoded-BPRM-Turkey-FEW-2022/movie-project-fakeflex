'use strict';

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".container");
const genresList = document.getElementById("genresList");


// Don't touch this function please
const autorun = async () => {
  const movies = await fetchFilteredMovies("now_playing");
  renderMovies(movies.results);
};

const runTopRatedMovies = async () => {
  const movies = await fetchFilteredMovies("top_rated");
  renderMovies(movies.results);
};

const runUpcomingMovies = async () => {
  const movies = await fetchFilteredMovies("upcoming");
  renderMovies(movies.results);
};

const runPopularMovies = async () => {
  const movies = await fetchFilteredMovies("popular");
  renderMovies(movies.results);
};

const runGenreMovie = async (genreId) => {
  const moives = await fetchMoviesByGenre(genreId);
  renderMovies(moives.results);
}

const runLatestMovies = async () => {
  const movies = await fetchLatestMovies(); //}&sort_by=release_date.desc
  renderMovies(movies.results);
};

// Don't touch this function please
const constructUrl = (path) => {
  return `${TMDB_BASE_URL}/${path}?api_key=${atob(
    "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
  )}`;
};

const constructGenreUrl = (genreId) => {
  return `${TMDB_BASE_URL}/discover/movie?api_key=${atob(
    "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
  )}&with_genres=${genreId}`;
}

const fetchMoviesByGenre = async (genreId) => {
  const url = constructGenreUrl(genreId);
  const res = await fetch(url);
  return res.json();
};

// You may need to add to this function, definitely don't delete it.
const movieDetails = async (movie) => {
  const movieRes = await fetchMovie(movie.id);
  const movieCrds = await fetchMoviesCredits(movie.id);
  const movieRelat = await fetchRelatedMovies(movie.id);
  const movieVideo = await fetchMoviesTrailer(movie.id);
  topFunction();
  renderMovie(movieRes, movieCrds, movieRelat, movieVideo);
};

const fetchFilteredMovies = async (filter) => {
  const url = constructUrl(`movie/${filter}`);
  const res = await fetch(url);
  return res.json();
};

const fetchLatestMovies = async () => {
  const url = `${TMDB_BASE_URL}/discover/movie?api_key=${atob(
    'NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI=')}&sort_by=release_date.desc`;
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
  CONTAINER.innerHTML = "";
  movies.map((movie) => {
    const movieDiv = document.createElement("div");
    

    movieDiv.innerHTML = `
        <img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${movie.title
      } poster" id="movie-img">
        <h3 id="movie-title">${movie.title}</h3>`;
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    CONTAINER.appendChild(movieDiv);
    movieDiv.classList.add("movie-div");
  });
  CONTAINER.classList.add("movies");
};

const movieOnhover = (movie) => {
  
}

// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = (movie, credits, similars, video) => {
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
            <p id="vote_average"> <b>Vote Average:</b> ${movie.vote_average}    
             <b>Vote Count: </b> ${movie.vote_count} </p>
            <p id="original_language"><b>language:</b> ${movie.spoken_languages[0].name} </p>
            <p id="director"> </p>
        </div>
        </div>
        <div id="video">
        
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
  for (let i = 0; i < 5; i++) {
    const actorLi = document.createElement('li');
    actorLi.addEventListener("click", () => {
      actorDetails(credits.cast[i]);
    })
    const actorphoto = document.createElement('img');
    const actorH3 = document.createElement('h4');
    actorH3.innerHTML = `${credits.cast[i].name}`;
    actorphoto.src = PROFILE_BASE_URL + credits.cast[i].profile_path;
    actors.append(actorLi);
    actorLi.append(actorphoto);
    actorLi.append(actorH3);
  };


  //to get companies name and logo
  const companies = document.getElementById('companies');
  for (let i = 0; i < 2; i++) {
    const company = document.createElement('li');
    const companyName = document.createElement('h4');
    const companyPhoto = document.createElement('img');

    companyName.innerHTML = `${movie.production_companies[i].name}`
    companyPhoto.src = BACKDROP_BASE_URL + movie.production_companies[i].logo_path;
    companies.append(company);
    company.append(companyName);
    company.append(companyPhoto);

  };

  //to get 5 related movies
  const Related = document.getElementById('Related');
  for (let i = 0; i < 5; i++) {
    const relatedMo = document.createElement('li');
    relatedMo.addEventListener("click", () => {
      movieDetails(similars[i]);
    })
    const MovieName = document.createElement('h4');
    const MoviePhoto = document.createElement('img');
    MovieName.innerHTML = `${similars[i].title}`;
    MoviePhoto.src = BACKDROP_BASE_URL + similars[i].backdrop_path;
    Related.append(relatedMo);
    relatedMo.append(MoviePhoto);
    relatedMo.append(MovieName);
  };

  //to get the trailer(VIDEO)
  for (let i = 0; i < video.length; i++) {
    const videoT = document.getElementById('video');
    videoT.innerHTML = `<iframe src=https://www.youtube.com/embed/${video[i].key} width="400" height="240" autoplay>
    </video>
    <h3>Trailer</h3>`;
  };

  //to get the director name 
  for (let i = 0; i < credits.crew.length; i++) {
    if (credits.crew[i].job === 'Director') {
      const directorName = `${credits.crew[i].name}`;
      const director = document.getElementById('director');
      director.innerHTML = `<b>Director</b>: ${directorName}`;
    };

  };
};

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
  const video = await res.json();
  return video.results;
};

// fetching the most related movies (similar moives)
const fetchRelatedMovies = async (moiveID) => {
  const url = constructUrl(`movie/${moiveID}/similar`);
  const res = await fetch(url);
  const relatedMoveis = await res.json();
  return relatedMoveis.results;
};

//fetch the data which will be used in search function & creating new url because query is needed
const searchConstructUrl = (path,searchValue) => {
  return `${TMDB_BASE_URL}/${path}?api_key=${atob(
    "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
  )}&query=${searchValue}`;
};
const fetchSearch = async (searchInfo) => {
  const url = searchConstructUrl(`search/multi`,`${searchInfo}`)
  console.log(url);
  const res = await fetch(url);
  const FindData = await res.json();
  return FindData.results;

};

//render the search results 
const renderSearch = async (result) => {
  const resultData = await fetchSearch(result);
   for(let i=0 ;  i<resultData.length ; i++){
    if(resultData[i].media_type==="movie"){
      CONTAINER.innerHTML = ""
      return renderMovies(resultData);
    }
    else if(resultData.results[i].media_type==="person"){
      CONTAINER.innerHTML = ""
    return renderActors(resultData);
    };
    
  };
}
//adding EventListener to the search button in the nav bar 
const searchBtn= document.getElementById("searchBtn");
const searchInput= document.getElementById("searchInput");
searchBtn.addEventListener("click",async (e)=>{
  e.preventDefault();
  const inputValue = searchInput.value;
  return renderSearch(inputValue);
});

// This function is to fetch Actors
const fetchActors = async () => {
  const url = constructUrl(`person/popular`);
  const res = await fetch(url);
  return res.json();
};

// This function is to render actors
const renderActors = (actors) => {
  CONTAINER.innerHTML = "";
  actors.map((actor) => {
    const actorDiv = document.createElement("div");
    actorDiv.innerHTML = `
        <img src="${PROFILE_BASE_URL + actor.profile_path}" alt="${actor.title
      } poster">
        <h3>${actor.name}</h3>`;
    actorDiv.addEventListener("click", () => {
      actorDetails(actor);
    });

    CONTAINER.appendChild(actorDiv);
  });
};

const runActors = async () => {
  const actors = await fetchActors();
  renderActors(actors.results);
};

const actorDetails = async (actor) => {
  const actorRes = await fetchActor(actor.id);
  const actorCredits = await fetchActorCredits(actor.id);
  topFunction();
  renderActor(actorRes, actorCredits);
};

const fetchActor = async (actorId) => {             // http://api.themoviedb.org/3/person/18277?api_key=542003918769df50083a13c415bbc602
  const url = constructUrl(`person/${actorId}`);
  const res = await fetch(url);
  return res.json();
};

const fetchActorCredits = async (actorId) => {
  const url = constructUrl(`person/${actorId}/movie_credits`);
  const res = await fetch(url);
  const Cast = await res.json();
  return Cast
};

const renderActor = (actor, actorCredits) => {
  CONTAINER.innerHTML = `
  <div class="row " id="single-actor-page">
  <div class="col-lg-4 col-md-12 col-sm-12">
    <img id="actor-backdrop" src=${PROFILE_BASE_URL + actor.profile_path}> 
  </div>
  <div class="col-lg-8 col-md-12 col-sm-12">
    <h2 id="actor-name"><span>${actor.name}</span></h2>
    <h4>Gender:</h4>
    <p id="gender">${actor.gender}</p>
    <h4>Popularity:</h4>
    <p id="popularity">${actor.popularity}</p>
    <h4>Birthday:</h4>
    <p id="birthday">${actor.birthday}</p>
    <h4>Biography:</h4>
     <p id="biography" style="color:#BDBDBD; font-size: .8rem;">${actor.biography}</p>
  </div>
  <div class="container" >
    <h4 class="row" style="padding:1rem;" > Related Movies:</h4>
    <ul id="relatedMovies">

    </ul>
  </div>
</div>`;

  const gender = document.getElementById("gender");
  if(gender.innerText === "1") {
    gender.textContent = "Female";
  }
  else if (gender.innerText === "2") {
    gender.textContent = "Male";
  }
  // If actor is dead

  const birthDeathday = document.getElementById("birthday");
  if (actor.deathday !== null) {
    birthDeathday.append(document.createElement("span").textContent = actor.deathday);
  }

  // Actor related movies

  const relatedMovies = document.getElementById("relatedMovies");

  for (let i = 0; i < actorCredits.cast.length && i < 5; i++) {

    const movieli = document.createElement("li");

    movieli.addEventListener("click", () => {
      movieDetails(actorCredits.cast[i]);
    });
    const movieImage = document.createElement("img");
    movieImage.src = `${BACKDROP_BASE_URL + actorCredits.cast[i].poster_path}`;

    const movieName = document.createElement("h4");
    movieName.textContent = actorCredits.cast[i].title;

    relatedMovies.append(movieli);
    movieli.append(movieImage);
    movieli.append(movieName);
  }
};
const genresArraylist = [
  {
    "id": 28,
    "name": "Action"
  },
  {
    "id": 12,
    "name": "Adventure"
  },
  {
    "id": 16,
    "name": "Animation"
  },
  {
    "id": 35,
    "name": "Comedy"
  },
  {
    "id": 80,
    "name": "Crime"
  },
  {
    "id": 99,
    "name": "Documentary"
  },
  {
    "id": 18,
    "name": "Drama"
  },
  {
    "id": 10751,
    "name": "Family"
  },
  {
    "id": 14,
    "name": "Fantasy"
  },
  {
    "id": 36,
    "name": "History"
  },
  {
    "id": 27,
    "name": "Horror"
  },
  {
    "id": 10402,
    "name": "Music"
  },
  {
    "id": 9648,
    "name": "Mystery"
  },
  {
    "id": 10749,
    "name": "Romance"
  },
  {
    "id": 878,
    "name": "Science Fiction"
  },
  {
    "id": 10770,
    "name": "TV Movie"
  },
  {
    "id": 53,
    "name": "Thriller"
  },
  {
    "id": 10752,
    "name": "War"
  },
  {
    "id": 37,
    "name": "Western"
  }
]

const renderGenresList = (genresArraylist) => {
  for (let i of genresArraylist) {

    const genre = document.createElement("a");

    genre.innerHTML = `<a class="dropdown-item" href="#">${i.name}</a>`;

    genre.addEventListener("click", () => {
      runGenreMovie(i.id);
    })
    genresList.append(genre);

  }
}

renderGenresList(genresArraylist);

const renderAbout = () => {
  CONTAINER.innerHTML = `
  <div>
    <p>This is the about section</p> 
  </div>`
}

function topFunction() {
  document.documentElement.scrollTop = 0;
}

document.addEventListener("DOMContentLoaded", autorun);

