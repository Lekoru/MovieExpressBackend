const fs = require('fs')
const URL = require('url').URL

const method = {
  fittingDuration: (movies, duration) => {
    return movies.filter(movie => {
      return ((movie.runtime < duration + 10) && (movie.runtime > duration - 10))
    })
  },

  fittingGenres: (movies, genres) => {
    // Fitting genres
    const movieMap = new Map()
    const foundMovies = []
    let i = 0
    for (const movie of movies) {
      i = method.checkGenres(genres, movie.genres)
      if (i.matched > 0) {
        movieMap.set(movie, i.matched)
      }
    }
    const movieMap2 = new Map([...movieMap.entries()].sort((a, b) => b[1] - a[1]))
    const iterator = movieMap2.keys()
    i = 0
    while (i < movieMap2.size) {
      foundMovies.push(iterator.next().value)
      i++
    }
    return foundMovies
  },

  loadJSON: (filename = '') => {
    // Loading file
    return JSON.parse(
      fs.existsSync(filename)
        ? fs.readFileSync(filename).toString()
        : 'null'
    )
  },

  IsUrlValid: (urlString = '') => {
    try {
      URL(urlString)
      return true
    } catch {
      return false
    }
  },

  saveJSON: (movieObj = '') => {
    // Save changes to db
    return fs.writeFileSync(
      './data/db.json',
      JSON.stringify(movieObj, null, 2)
    )
  },

  checkGenres: (genres = '', genres1 = '') => {
    // Check genres
    let i = 0
    let gen, genre
    for (gen of genres) {
      for (genre of genres1) {
        if (gen === genre) {
          i++
          break
        }
      }
    }
    return { matched: i, genName: gen }
  }
}

module.exports = method
