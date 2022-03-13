let urlBestMovies= `http://localhost:8000/api/v1/titles/?sort_by=-imdb_score`;
let urlBestAnimationMovies = `http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=Animation`;
let urlBestActionMovies = `http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=Action`;
let urlBestAdventureMovies = `http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=Adventure`;


var getMovies = async function(url) {    
  try {
      var response = await fetch(url);
      if (response.ok) {
          var data = await response.json();
          let movies =data.results;
          var response = await fetch(data.next);
          if (response.ok) {
              let data = await response.json();
              let dataNext =data.results;
              allMovies =movies.concat(dataNext);
              console.log(allMovies);
            return allMovies;
          }
          else {
            console.error('Retour du serveur : ', response.status);
          }
      }
      else {
        console.error('Retour du serveur : ', response.status);
      }
    }        
  catch (e) {
    console.log(e);
  }    
} 


var getImageMovie = async function (url, nameCarousel, numberMovie, numberImage) { 
   var moviesData = await getMovies(url); 
   let indexMovie = 1;    
   while (indexMovie !=8){  
    let carousel = document.querySelector(nameCarousel);
    let img = carousel.querySelector(`.img${numberImage}`)  ;        
    img.src = moviesData[numberMovie].image_url; 
    indexMovie++;
    numberMovie++;
    numberImage+=1;    
  }    
} 

getImageMovie(urlBestMovies,'#carousel1', 0, 1);
getImageMovie(urlBestAnimationMovies,'#carousel2', 0, 1);
getImageMovie(urlBestActionMovies,'#carousel3', 0, 1);
getImageMovie(urlBestAdventureMovies,'#carousel4', 0, 1);



var modalBox = async function (url,nameCarousel, nameButton, numberMovie) { 
  var moviesData = await getMovies(url);
  let carousel = document.querySelector(nameCarousel);
  // Get the modal
  var modal = document.getElementById("myModal");
  // Get the button that opens the modal
  var btn = carousel.querySelector(nameButton);
  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];
  // When the user clicks on the button, open the modal
  btn.onclick = function() {
    modal.style.display = "block";
    getDataMovie(moviesData, numberMovie);
  }
  function x() {
    modal.style.display = "block";
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

let allMoviesCategory = async function(url, nomCarousel){  
  modalBox(url,nomCarousel, '.myBtn1', 0)
  modalBox(url,nomCarousel, '.myBtn2', 1)
  modalBox(url,nomCarousel, '.myBtn3', 2)
  modalBox(url,nomCarousel, '.myBtn4', 3)
  modalBox(url,nomCarousel, '.myBtn5', 4)
  modalBox(url,nomCarousel, '.myBtn6', 5)
  modalBox(url,nomCarousel, '.myBtn7', 6)
}

allMoviesCategory(urlBestMovies, "#carousel1");
allMoviesCategory(urlBestAnimationMovies, "#carousel2");
allMoviesCategory(urlBestActionMovies, "#carousel3");
allMoviesCategory(urlBestAdventureMovies, "#carousel4");

let getDataMovie = async function(dataMovie, numberMovie){
  var response = await fetch(dataMovie[numberMovie].url);
  // get in url details.
  if (response.ok) {
      var data = await response.json();
      let img = document.querySelector(`.imgBox`)  ;        
      img.src = data.image_url; 
      let titleMovie = document.querySelector('#titleMovie') ;
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
      time.innerHTML = "Durée :" + data.time;
      let country = document.querySelector("#country");
      country.innerHTML = "Pays d'origine :" + data.country;
      let result = document.querySelector("#result");
      result.innerHTML = "résultat box-office :" + data.result;
      let synopsis = document.querySelector("#synopsis");
      synopsis.innerHTML = "Synopsis :" + data.description;
  }
}


//carousel
class Carousel {
  /**
   * This callback type is called `requestCallback` and is displayed as a global symbol.
   *
   * @callback moveCallback
   * @param {number} index
   */

  /**
   * @param {HTMLElement} element
   * @param {Object} options
   * @param {Object} [options.slidesToScroll=1] Nombre d'éléments à faire défiler
   * @param {Object} [options.slidesVisible=1] Nombre d'éléments visible dans un slide
   * @param {boolean} [options.loop=false] Doit-t-on boucler en fin de carousel
   * @param {boolean} [options.infinite=false]
   * @param {boolean} [options.pagination=false]
   * @param {boolean} [options.navigation=true]
   */
  constructor (element, options = {}) {
    this.element = element
    this.options = Object.assign({}, {
      slidesToScroll: 1,
      slidesVisible: 1,
      loop: false,
      pagination: false,
      navigation: true,
      infinite: false
    }, options)
    if (this.options.loop && this.options.infinite) {
      throw new Error('Un carousel ne peut être à la fois en boucle et en infinie')
    }
    let children = [].slice.call(element.children)
    this.isMobile = false
    this.currentItem = 0
    this.moveCallbacks = []
    this.offset = 0

    // Modification du DOM
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
    if (this.options.infinite) {
      this.offset = this.options.slidesVisible + this.options.slidesToScroll
      if (this.offset > children.length) {
        console.error("Vous n'avez pas assez d'élément dans le carousel", element)
      }
      this.items = [
        ...this.items.slice(this.items.length - this.offset).map(item => item.cloneNode(true)),
        ...this.items,
        ...this.items.slice(0, this.offset).map(item => item.cloneNode(true)),
      ]
      this.gotoItem(this.offset, false)
    }
    this.items.forEach(item => this.container.appendChild(item))
    this.setStyle()
    if (this.options.navigation) {
      this.createNavigation()
    }
    if (this.options.pagination) {
      this.createPagination()
    }

    // Evenements
    this.moveCallbacks.forEach(cb => cb(this.currentItem))
    this.onWindowResize()
    window.addEventListener('resize', this.onWindowResize.bind(this))
    this.root.addEventListener('keyup', e => {
      if (e.key === 'ArrowRight' || e.key === 'Right') {
        this.next()
      } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        this.prev()
      }
    })
    if (this.options.infinite) {
      this.container.addEventListener('transitionend', this.resetInfinite.bind(this))
    }
  }

  /**
   * Applique les bonnes dimensions aux éléments du carousel
   */
  setStyle () {
    let ratio = this.items.length / this.slidesVisible
    this.container.style.width = (ratio * 100) + "%"
    this.items.forEach(item => item.style.width = ((100 / this.slidesVisible) / ratio) + "%")
  }

  /**
   * Crée les flêches de navigation dans le DOM
   */
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

  /**
   *
   */
  next () {
    this.gotoItem(this.currentItem + this.slidesToScroll)
  }

  prev () {
    this.gotoItem(this.currentItem - this.slidesToScroll)
  }

  /**
   * Déplace le carousel vers l'élément ciblé
   * @param {number} index
   * @param {boolean} [animation = true]
   */
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
    this.container.offsetHeight // force repaint
    if (animation === false) {
      this.container.style.transition = ''
    }
    this.currentItem = index
    this.moveCallbacks.forEach(cb => cb(index))
  }

  /**
   * Déplace le container pour donner l'impression d'un slide infini
   */
  resetInfinite () {
    if (this.currentItem <= this.options.slidesToScroll) {
      this.gotoItem(this.currentItem + (this.items.length - 2 * this.offset), false)
    } else if (this.currentItem >= this.items.length - this.offset) {
      this.gotoItem(this.currentItem - (this.items.length - 2 * this.offset), false)
    }
  }

  /**
   * Rajoute un écouteur qui écoute le déplacement du carousel
   * @param {moveCallback} cb
   */
  onMove (cb) {
    this.moveCallbacks.push(cb)
  }

  /**
   * Ecouteur pour le redimensionnement de la fenêtre
   */
  onWindowResize () {
    let mobile = window.innerWidth < 800
    if (mobile !== this.isMobile) {
      this.isMobile = mobile
      this.setStyle()
      this.moveCallbacks.forEach(cb => cb(this.currentItem))
    }
  }

  /**
   * Helper pour créer une div avec une classe
   * @param {string} className
   * @returns {HTMLElement}
   */
  createDivWithClass (className) {
    let div = document.createElement('div')
    div.setAttribute('class', className)
    return div
  }

  /**
   * @returns {number}
   */
  get slidesToScroll () {
    return this.isMobile ? 1 : this.options.slidesToScroll
  }

  /**
   * @returns {number}
   */
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
document.addEventListener('DOMContentLoaded', onReady)
