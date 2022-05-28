'use strict';

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".container");
const genresList = document.getElementById("genresList");
const footer = document.getElementById("footer");


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
  footer.className = "footer";
  CONTAINER.className = "container";
  CONTAINER.innerHTML = "";

  movies.map((movie) => {
    const movieDiv = document.createElement("div");
    movieDiv.id = `${movie.id}Div`;

    movieDiv.innerHTML = `
        <img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${movie.title
      } poster" id="movie-img" onerror="this.src='https://thumbs.dreamstime.com/b/unknown-concept-word-blackboard-background-written-140315057.jpg';">
        <p id="${movie.id}" class="centered glow">Rating ${movie.vote_average}/10</p>
        <h3 id="movie-title">${movie.title}</h3>`;

    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });

    movieDiv.addEventListener("mouseover", () => {
      movieOnhover(movie);
      movieDiv.style.backgroundColor = "rgb(28, 70, 123)";
      movieDiv.style.color = "aliceblue";
      movieDiv.style.scale = 1.1;
    });

    movieDiv.addEventListener("mouseleave", () => {
      movieOnleave(movie);
      movieDiv.style.backgroundColor = "rgba(254, 254, 254, 0.5)";
      movieDiv.style.color = "#423a3a";
      movieDiv.style.scale = 1;
    });

    // if(!BACKDROP_BASE_URL + movie.backdrop_path) {
    //   const movieImage = document.getElementById("movie-img");
    //   movieImage.src = "https://thumbs.dreamstime.com/b/unknown-concept-word-blackboard-background-written-140315057.jpg";
    // }

    CONTAINER.appendChild(movieDiv);

    movieDiv.classList.add("movie-div", "flashing");
    const rating = document.getElementById(movie.id);
    rating.style.visibility = "hidden";
  });
  CONTAINER.classList.add("movies");
};

// const classToggle = (movie) => {
//   const moiveDiv = document.getElementById(`${movie.id}Div`);
//   moiveDiv.classList.toggle("movie-hover")
// }

const movieOnhover = (movie) => {
  const rating = document.getElementById(movie.id);
  rating.style.visibility = "visible";
}

const movieOnleave = (movie) => {
  const rating = document.getElementById(movie.id);
  rating.style.visibility = "hidden";
}

// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = (movie, credits, similars, video) => {
  footer.className = "footer";
  CONTAINER.className = "single-movie-page";

  CONTAINER.innerHTML = `
    <div class="row">
        <div class="col-md-4">
             <img id="movie-backdrop" class="movie-backdrop" src=${PROFILE_BASE_URL + movie.backdrop_path
    } class="movie-backdrop">
        </div>
        <div class="col-md-8" id="movie-details" style="padding-bottom: 2.5rem;">
            <h1 id="single-movie-title" class="movie-title">${movie.title}</h1>
            <h3 id="movie-release-date" class="movie-info">Release Date: <span class="movie-info-detl"> ${movie.release_date}</span></h3>
            <h3 id="movie-runtime" class="movie-info">Runtime:<span class="movie-info-detl"> ${movie.runtime} Minutes</span></h3>
            <h3 class="movie-info" style="font-size: x-large">Overview</h3>
            <p id="movie-overview"><span class="movie-info-detl">${movie.overview}</span></p>
            <h3 id="vote_average" class="movie-info"> Vote Average:<span class="movie-info-detl"> ${movie.vote_average}</span>    
             <b>Vote Count: <span class="movie-info-detl"> ${movie.vote_count}</span> </h3>
            <h3 id="original_language" class="movie-info">Language: <span class="movie-info-detl">${movie.spoken_languages[0].name}</span> </h3>
            
        </div>
        </div>
        <div id="video">
        
        </div>
          <div style="padding: 2.5rem;">
            <h3 class="RelatedName">Actors</h3>

            <ul id="actors" class="list-unstyled hello">
            </ul>
          </div>
          <h3 class="RelatedName" style="padding-top: 2rem;">Production Company</h3>
          <ul id="companies" class="flex-row list-unstyled" style="padding: 1rem"></ul>
          <div style="width:100%;">
          <div>
          <h3 class="RelatedName">Related Movies</h3>
          <ul id="Related" class="list-unstyled hello">
          </ul>
          </div>
        </div>

    </div>`;

  //to get 5 Actors in the movie
  const actors = document.getElementById('actors');
  for (let i = 0; i < 5; i++) {
    const actorLi = document.createElement('li');
    actorLi.addEventListener("click", () => {
      actorDetails(credits.cast[i]);
    });

    actorLi.addEventListener("mouseover", () => {
      actorH3.style.color = "aliceblue";
      actorLi.style.scale = 1.05;
    });

    actorLi.addEventListener("mouseleave", () => {
      actorH3.style.color = "#423a3a";
      actorLi.style.scale = 1;
    });

    const actorphoto = document.createElement('img');
    const actorH3 = document.createElement('h4');
    actorH3.innerHTML = `${credits.cast[i].name}`;
    actorphoto.src = PROFILE_BASE_URL + credits.cast[i].profile_path;
    actorphoto.onerror = () => {
      placeholderImage("actor", actorphoto);
    }

    actors.append(actorLi);
    actorLi.append(actorphoto);
    actorLi.append(actorH3);

    actorLi.classList.add("listActorMovie", "flashing");
    actorphoto.classList.add("listActorImg");
    actorH3.classList.add("listActorImgName");
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
    company.append(companyPhoto);
    company.append(companyName);
    companyName.classList.add("company-title");
    companyPhoto.classList.add("company-logo");

  };

  //to get 5 related movies
  const Related = document.getElementById('Related');
  for (let i = 0; i < 5; i++) {
    const relatedMo = document.createElement('li');
    relatedMo.addEventListener("click", () => {
      movieDetails(similars[i]);
    });

    relatedMo.addEventListener("mouseover", () => {
      MovieName.style.color = "aliceblue";
      relatedMo.style.scale = 1.05;
    });


    relatedMo.addEventListener("mouseleave", () => {
      MovieName.style.color = "#423a3a";
      relatedMo.style.scale = 1;
    });

    const MovieName = document.createElement('h4');
    const MoviePhoto = document.createElement('img');
    MovieName.innerHTML = `${similars[i].title}`;
    MoviePhoto.src = BACKDROP_BASE_URL + similars[i].backdrop_path;

    Related.append(relatedMo);
    relatedMo.append(MoviePhoto);
    relatedMo.append(MovieName);

    relatedMo.classList.add("listActorMovie", "flashing");
    MoviePhoto.classList.add("listActorImg");
    MovieName.classList.add("listActorImgName");
  };

  //to get the trailer(VIDEO)
  for (let i = 0; i < video.length; i++) {
    const videoT = document.getElementById('video');
    videoT.innerHTML = `<iframe src=https://www.youtube.com/embed/${video[i].key} width="600" height="440" autoplay>
    </video>
    <h3>Trailer</h3>`;
  };

  //to get the director name
  const details = document.getElementById("movie-details");
  for (let i = 0; i < credits.crew.length; i++) {

    if (credits.crew[i].job === 'Director') {
      const directorName = `${credits.crew[i].name}`;
      const director = document.createElement('h3');
      details.append(director);
      director.classList.add("movie-info");
      director.innerHTML = `
      Director: <span class="actor-info-detl">${directorName} </span>`;
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
const searchConstructUrl = (path, searchValue) => {
  return `${TMDB_BASE_URL}/${path}?api_key=${atob(
    "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
  )}&query=${searchValue}`;
};

const fetchSearch = async (searchInfo) => {
  const url = searchConstructUrl(`search/multi`, `${searchInfo}`)
  console.log(url);
  const res = await fetch(url);
  const FindData = await res.json();
  return FindData.results;
};

//render the search results 
const renderSearch = async (result) => {
  const resultData = await fetchSearch(result);
  for (let i = 0; i < resultData.length; i++) {
    if (resultData[i].media_type === "movie") {
      CONTAINER.innerHTML = ""
      return renderMovies(resultData);
    }
    else if (resultData.results[i].media_type === "person") {
      CONTAINER.innerHTML = ""
      return renderActors(resultData);
    };

  };
}
//adding EventListener to the search button in the nav bar 
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");

searchBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const inputValue = searchInput.value;
  searchInput.value = "";
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
  footer.className = "footer";
  CONTAINER.className = "";
  CONTAINER.classList.add("container");

  CONTAINER.innerHTML = "";

  actors.map((actor) => {
    const actorDiv = document.createElement("div");
    actorDiv.id = `${actor.id}Div`;

    actorDiv.innerHTML = `
        <img src="${PROFILE_BASE_URL + actor.profile_path}" alt="${actor.title
      } poster" class="actor-img" onerror="this.src='./images/actor-placehoder.jpg';" style="width:100%">
        <h3 id="actor-name" class="actors-name">${actor.name}</h3>`;
    actorDiv.addEventListener("click", () => {
      actorDetails(actor);
    });

    actorDiv.addEventListener("mouseover", () => {
      // movieOnhover(actor);
      actorDiv.style.backgroundColor = "rgb(28, 70, 123)";
      actorDiv.style.color = "aliceblue";
      actorDiv.style.scale = 1.05;
    });

    actorDiv.addEventListener("mouseleave", () => {
      // movieOnleave(actor);
      actorDiv.style.backgroundColor = "rgba(254, 254, 254, 0.5)";
      actorDiv.style.color = "#423a3a";
      actorDiv.style.scale = 1;
    });

    CONTAINER.appendChild(actorDiv);

    actorDiv.classList.add("actor-div", "flashing");
  });

  CONTAINER.classList.add("actors");

};

// const actorOnhover = (actor) => {
//   const rating = document.getElementById(actor.id);
//   rating.style.visibility = "visible";
// }

// const actorOnleave = (actor) => {
//   const rating = document.getElementById(actor.id);
//   rating.style.visibility = "hidden";
// }

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
  footer.className = "footer";
  CONTAINER.className = "";
  CONTAINER.innerHTML = `
  <div class="row " id="single-actor-page">
  <div col-lg-4 col-md-12 col-sm-12">
    <img id="actor-backdrop" class="actor-backdrop" src=${PROFILE_BASE_URL + actor.profile_path}> 
  </div>
  <div style="margin:1.5rem;" class="actor-info col-lg-8 col-md-12 col-sm-12">
    <h2 id="actor-name" class="actorName">${actor.name}</h2>
    <h4 class="actor-info">Gender</h4>
    <p id="gender" class="actor-info-detl">${actor.gender}</p>
    <h4 class="actor-info">Popularity</h4>
    <p id="popularity" class="actor-info-detl">${actor.popularity}</p>
    <h4 class="actor-info">Birthday</h4>
    <p id="birthday" class="actor-info-detl">${actor.birthday}</p>
    <h4 class="actor-info">Biography</h4>
     <p id="biography" style="color:aliceblue; font-size: 1rem; font-weight:normal;">${actor.biography}</p>
  </div>
  <div style="width:100%;">
    <h4 class="row RelatedName"><span> Related Movies</span></h4>
    <ul id="relatedMovies" class=" list-unstyled hello">

    </ul>
  </div>
</div>`;

  const gender = document.getElementById("gender");
  if (gender.innerText === "1") {
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

    movieli.addEventListener("mouseover", () => {
      movieName.style.color = "aliceblue";
      movieli.style.scale = 1.05;
    });

    movieli.addEventListener("mouseleave", () => {
      movieName.style.color = "#423a3a";
      movieli.style.scale = 1;
    });

    const movieImage = document.createElement("img");
    movieImage.src = `${BACKDROP_BASE_URL + actorCredits.cast[i].poster_path}`;
    movieImage.onerror = () => {
      placeholderImage("movie", movieImage);
    };

    const movieName = document.createElement("h4");
    movieName.textContent = actorCredits.cast[i].title;

    relatedMovies.append(movieli);
    movieli.append(movieImage);
    movieli.append(movieName);
    movieli.classList.add("listActorMovie", "flashing");
    movieImage.classList.add("listActorImg");
    movieName.classList.add("listActorImgName");
  }
};

const placeholderImage = (type, image) => {
  if (type === "actor") {
    image.src = "./images/actor-placehoder.jpg";
  }
  else if (type === "movie") {
    image.src = "https://thumbs.dreamstime.com/b/unknown-concept-word-blackboard-background-written-140315057.jpg";
  }
}

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
  footer.className = "about-footer";
  CONTAINER.className = "";
  CONTAINER.innerHTML = `
  <div class="flex-column">
    <img src="./images/fakeflex-logo-full.png" alt="Fakeflex logo" class="about-logo">
    <p class="about">Fakeflex is a website that uses TMDB database.<br> 
    You can get info about any movie that exits.<br>
    Enjoy!</p>
  </div>`
}

function topFunction() {
  document.documentElement.scrollTop = 0;
}

document.addEventListener("DOMContentLoaded", autorun);

