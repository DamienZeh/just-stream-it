//variables urls
let urlBestMovies = `http://localhost:8000/api/v1/titles/?sort_by=-imdb_score`;
let urlBestAnimationMovies = `http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=Animation`;
let urlBestActionMovies = `http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=Action`;
let urlBestAdventureMovies = `http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=Adventure`;


// variables for choice in categories's menu
let bestMoviesSelect = document.querySelector('#bestMoviesSelect');
let actionSelect = document.querySelector('#actionSelect');
let adventureSelect = document.querySelector('#adventureSelect');
let animationSelect = document.querySelector('#animationSelect');
let bestMovieWindow = document.querySelector('#bestFilm');
let carouselBest = document.querySelector("#bestMovies");
let carouselAction = document.querySelector("#action");
let carouselAnime = document.querySelector("#animation");
let carouselAdventure = document.querySelector("#adventure");
let categoriesButton = document.querySelector("#categoriesButton");

//hide all the categories that we did not choose, + modal window & button "categories"
let categoryChoice = function (category, supONe, supTwo, supThree){
  category.onclick = function() {
    //window best movie
    bestMovieWindow.style.display = "none";
    supONe.style.display = "none";
    supTwo.style.display = "none";
    supThree.style.display = "none";
    //categories button menu
    categoriesButton.style.display = "none";
    /*we display the best movies(carousel1), from the first to the seventh,
    when it displays alone */
    getImageMovie(urlBestMovies,'#carousel1', 0, 1);
    allMoviesCategory(urlBestMovies, "#carousel1", 0);
  }
}

categoryChoice(bestMoviesSelect, carouselAction, carouselAdventure, carouselAnime);
categoryChoice(actionSelect, carouselBest, carouselAdventure, carouselAnime);
categoryChoice(adventureSelect, carouselAction, carouselBest, carouselAnime);
categoryChoice(animationSelect, carouselAction, carouselAdventure, carouselBest);

// info: no film
let playButton = document.getElementById("playButton");
playButton.onclick= play;
function play(){
  alert("Pas de vidéo en stock.");
}

// Get data for the best movie
let getBestMovie = async function(url) {
  try {
    let response = await fetch(url);
    if (response.ok) {
      let data = await response.json();
      let movie =data.results;
      let responseSecond = await fetch(movie[0].url);
      if (responseSecond.ok) {
          let dataDetail = await responseSecond.json();
          console.log(dataDetail.image_url);
          let img = document.querySelector(`#imgBest`);
          img.src = dataDetail.image_url;
          let titleMovie = document.querySelector('#bestTitle');
          titleMovie.innerHTML ="Titre : " + dataDetail.title;
          let synopsis = document.querySelector("#bestDescription");
          synopsis.innerHTML = "Synopsis : " + dataDetail.description;
          return dataDetail;
      }else {
        console.error('Retour du serveur : ', response.status);
      }
    }else {
      console.error('Retour du serveur : ', response.status);
    }
  }
  catch (e) {
    console.log(e);
  }
}

getBestMovie(urlBestMovies)

//Get data's movies for the first two pages
let getMovies = async function(url) {
  try {
      var response = await fetch(url);
      if (response.ok) {
          let data = await response.json();
          let movies =data.results;
          var response2 = await fetch(data.next);
          if (response2.ok) {
              let data = await response2.json();
              let dataNext =data.results;
              let allMovies =movies.concat(dataNext);
              console.log(allMovies);
              return allMovies;
          }
          else {
            console.error('Retour du serveur : ', response.status);
          }
      }else {
        console.error('Retour du serveur : ', response.status);
      }
    }
  catch (e) {
    console.log(e);
  }
}

//get image_url from data movie
let getImageMovie = async function (url, nameCarousel, numberMovie, numberImage) {
   let moviesData = await getMovies(url);
   let indexMovie = 1;
   while (indexMovie !=8){
    let carousel = document.querySelector(nameCarousel);
    let img = carousel.querySelector(`.img${numberImage}`);
    img.src = moviesData[numberMovie].image_url;
    indexMovie++;
    numberMovie++;
    numberImage+=1;
  }
}
//we display the best movies(carousel1), from the second to the eighth in main page.
getImageMovie(urlBestMovies,'#carousel1', 1, 1);
getImageMovie(urlBestAnimationMovies,'#carousel2', 0, 1);
getImageMovie(urlBestActionMovies,'#carousel3', 0, 1);
getImageMovie(urlBestAdventureMovies,'#carousel4', 0, 1);


//modal window for all movie data
let modalBox = async function (url,nameCarousel, nameButton, numberMovie) {
  let moviesData = await getMovies(url);
  let carousel = document.querySelector(nameCarousel);
  let modal = document.getElementById("myModal");
  let btn = carousel.querySelector(nameButton);
  let span = document.getElementsByClassName("close")[0];
  btn.onclick = function() {
    modal.style.display = "block";
    getDataMovie(moviesData, numberMovie);
  }
  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  }
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}

//launch modal window for all movies in all categories
modalBox(urlBestMovies, '#bestFilm', '#infoButton', 0);
let allMoviesCategory = async function(url, nomCarousel, positionMovie){
  modalBox(url,nomCarousel, '.myBtn1', positionMovie);
  modalBox(url,nomCarousel, '.myBtn2', positionMovie+1);
  modalBox(url,nomCarousel, '.myBtn3', positionMovie+2);
  modalBox(url,nomCarousel, '.myBtn4', positionMovie+3);
  modalBox(url,nomCarousel, '.myBtn5', positionMovie+4);
  modalBox(url,nomCarousel, '.myBtn6', positionMovie+5);
  modalBox(url,nomCarousel, '.myBtn7', positionMovie+6);
}

allMoviesCategory(urlBestMovies, "#carousel1", 1);
allMoviesCategory(urlBestAnimationMovies, "#carousel2", 0);
allMoviesCategory(urlBestActionMovies, "#carousel3", 0);
allMoviesCategory(urlBestAdventureMovies, "#carousel4", 0);


//get all infos in a film
let getDataMovie = async function(dataMovie, numberMovie){
  try {
    let response = await fetch(dataMovie[numberMovie].url);
    // get in url details.
    if (response.ok) {
        let data = await response.json();
        let img = document.querySelector(`.imgBox`);
        img.src = data.image_url;
        let titleMovie = document.querySelector('#titleMovie');
        titleMovie.innerHTML ="Titre : " + data.title;
        let genre = document.querySelector("#genre");
        genre.innerHTML="Genre : " + data.genres;
        let datePublished = document.querySelector("#datePublished");
        datePublished.innerHTML = "Date de sortie :" + data.datePublished;
        let rated = document.querySelector("#rated");
        rated.innerHTML = "Classification :" + data.rated;
        let scoreImdb = document.querySelector("#scoreImdb");
        scoreImdb.innerHTML = "Score IMDB :" + data.scoreImdb;
        let director = document.querySelector("#director");
        director.innerHTML = "Réalisateur :" + data.director;
        let actors = document.querySelector("#actors");
        actors.innerHTML = "Acteurs :" + data.actors;
        let time = document.querySelector("#time");
        time.innerHTML = "Durée : " + data.time;
        let country = document.querySelector("#country");
        country.innerHTML = "Pays d'origine : " + data.country;
        let result = document.querySelector("#result");
        result.innerHTML = "résultat box-office : " + data.result;
        let synopsis = document.querySelector("#synopsis");
        synopsis.innerHTML = "Synopsis : " + data.description;
    }else {
      console.error('Retour du serveur : ', response.status);
    }
  }catch (e) {
    console.log(e);
  }
}


//
//carousel
//
class Carousel {
  constructor (element, options = {}) {
    this.element = element
    this.options = Object.assign({}, {
      // elements number to do scroll
      slidesToScroll: 1,
      // elements number visible in a slide
      slidesVisible: 1,
      // boucle or not in the end of carousel
      loop: false,
      navigation: true,  
    }, options)
    let children = [].slice.call(element.children)
    this.isMobile = false
    this.currentItem = 0
    this.moveCallbacks = []
    this.offset = 0

    // DOM's Modification
    this.root = this.createDivWithClass('carousel')
    this.container = this.createDivWithClass('carousel__container')
    this.root.setAttribute('tabindex', '0')
    this.root.appendChild(this.container)
    this.element.appendChild(this.root)
    this.items = children.map((child) => {
      let item = this.createDivWithClass('carousel__item')
      item.appendChild(child)
      return item
    })
    this.items.forEach(item => this.container.appendChild(item))
    this.setStyle()
    if (this.options.navigation) {
      this.createNavigation()
    }

    // Evenements
    this.moveCallbacks.forEach(cb => cb(this.currentItem))
    this.onWindowResize()
    window.addEventListener('resize', this.onWindowResize.bind(this))
    this.root.addEventListener('keyup', e => {
      //Right and Left, also pb with Internet Explorer with arrows.
      if (e.key === 'ArrowRight' || e.key === 'Right') {
        this.next()
      } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        this.prev()
      }
    })
  }
  
  //give the good dimensions to carousel's elements   
  setStyle () {
    let ratio = this.items.length / this.slidesVisible
    this.container.style.width = (ratio * 100) + "%"
    this.items.forEach(item => item.style.width = ((100 / this.slidesVisible) / ratio) + "%")
  }
  
  // Create arrows for navigation in the DOM  
  createNavigation () {
    let nextButton = this.createDivWithClass('carousel__next')
    let prevButton = this.createDivWithClass('carousel__prev')
    this.root.appendChild(nextButton)
    this.root.appendChild(prevButton)
    nextButton.addEventListener('click', this.next.bind(this))
    prevButton.addEventListener('click', this.prev.bind(this))
    if (this.options.loop === true) {
      return
    }
    this.onMove(index => {
      if (index === 0) {
        prevButton.classList.add('carousel__prev--hidden')
      } else {
        prevButton.classList.remove('carousel__prev--hidden')
      }
      if (this.items[this.currentItem + this.slidesVisible] === undefined) {
        nextButton.classList.add('carousel__next--hidden')
      } else {
        nextButton.classList.remove('carousel__next--hidden')
      }
    })
  }
  
  next () {
    this.gotoItem(this.currentItem + this.slidesToScroll)
  }

  prev () {
    this.gotoItem(this.currentItem - this.slidesToScroll)
  }

  //Move carousel to target element
  gotoItem (index, animation = true) {
    if (index < 0) {
      if (this.options.loop) {
        index = this.items.length - this.slidesVisible
      } else {
        return
      }
    } else if (index >= this.items.length || (this.items[this.currentItem + this.slidesVisible] === undefined && index > this.currentItem)) {
      if (this.options.loop) {
        index = 0
      } else {
        return
      }
    }
    let translateX = index * -100 / this.items.length
    if (animation === false) {
      this.container.style.transition = 'none'
    }
    this.container.style.transform = 'translate3d(' + translateX + '%, 0, 0)'
    // force repaint
    this.container.offsetHeight 
    if (animation === false) {
      this.container.style.transition = ''
    }
    this.currentItem = index
    this.moveCallbacks.forEach(cb => cb(index))
  }

  //add a listener for listen le move of carousel
  onMove (cb) {
    this.moveCallbacks.push(cb)
  }

  //Listener for resize window
  onWindowResize () {
    let mobile = window.innerWidth < 620
    if (mobile !== this.isMobile) {
      this.isMobile = mobile
      this.setStyle()
      this.moveCallbacks.forEach(cb => cb(this.currentItem))
    }
  }

  //Helper for create div with a class
  createDivWithClass (className) {
    let div = document.createElement('div')
    div.setAttribute('class', className)
    return div
  }

  //returns number
  get slidesToScroll () {
    return this.isMobile ? 1 : this.options.slidesToScroll
  }

  //returns number
  get slidesVisible () {
    return this.isMobile ? 1 : this.options.slidesVisible
  }
}

let onReady = function () {

  new Carousel(document.querySelector('#carousel1'), {
      slidesVisible: 4,
      slidesToScroll: 1,
      loop: true,
  })

  new Carousel(document.querySelector('#carousel2'), {
    slidesVisible: 4,
      slidesToScroll: 1,
      loop: true,
  })

  new Carousel(document.querySelector('#carousel3'), {
    slidesVisible: 4,
      slidesToScroll: 1,
      loop: true,
  })

  new Carousel(document.querySelector('#carousel4'), {
    slidesVisible: 4,
      slidesToScroll: 1,
      loop: true,
  })
}

if (document.readyState !== 'loading') {
  onReady()
}
//it launches when html is loaded, witheout wait css or images loaded.
document.addEventListener('DOMContentLoaded', onReady)
