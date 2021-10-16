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
    let i = 0
    const movieMap = movies.filter((movie) => {
      i = method.checkGenres(movie.genres, genres)
      return (i.matched > 0)
    }).map((movie) => {
      i = method.checkGenres(movie.genres, genres)
      return { movie, match: i.matched }
    }).sort((a, b) => b.match - a.match)
    return movieMap.map((movie) => {
      return movie.movie
    })
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
