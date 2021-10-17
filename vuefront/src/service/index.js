import axios from "axios";

export const MovieService = {
  getMovies(duration, genres) {
    return new Promise((resolve, reject) => {
      axios
        .post("http://localhost:5000/findMovie", {
          duration: duration,
          genres: genres,
        })
        .then((response) => {
          if (response.data != "") {
            if (response.data.length >= 1) {
              resolve(response.data);
            } else {
              resolve([response.data]);
            }
          } else {
            resolve([]);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  getGenres() {
    return new Promise((resolve, reject) => {
      axios
        .post("http://localhost:5000/getGenres")
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  addMovie(
    title,
    addMovieGen,
    year,
    runtime,
    director,
    actors,
    plot,
    posterUrl
  ) {
    return new Promise((resolve, reject) => {
      axios
        .post("http://localhost:5000/addMovie", {
          title: title,
          genres: addMovieGen,
          year: year,
          runtime: runtime,
          director: director,
          actors: actors,
          plot: plot,
          posterUrl: posterUrl,
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};
