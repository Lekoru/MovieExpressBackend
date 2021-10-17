"use strict";
const express = require("express");
const router = express.Router();
const funcGetPost = require("./Functions/functGetPost");

router.route("/getGenres").get((req, res) => {
  const data = funcGetPost.loadJSON("./data/db.json");
  const genres = data.genres;
  return res.status(200).json(genres);
});

router.route("/findMovie").get((req, res) => {
  const data = funcGetPost.loadJSON("./data/db.json");
  let moviesMap = new Map();
  const body = req.query;
  let foundMovies = null;
  const movies = data.movies;
  const genres = data.genres;
  const chGen = funcGetPost.checkGenres(body.genres, genres);

  if (!body.duration && !body.genres) {
    // None parameter was specified
    if (isNaN(body.duration) && body.duration < 1) {
      return res
        .status(400)
        .json({ error: "Duration of the movie can't be this short" });
    } else {
      return res
        .status(200)
        .json(movies[Math.floor(Math.random() * movies.length)]);
    }
  } else if (body.duration && body.genres) {
    // Both parameters was specified
    if (parseInt(body.duration) > 0) {
      moviesMap = funcGetPost.fittingDuration(movies, parseInt(body.duration));
      if (moviesMap.length > 0 && chGen.matched > 0) {
        foundMovies = funcGetPost.fittingGenres(moviesMap, body.genres);
        if (foundMovies.length > 0) {
          return res.status(200).json(foundMovies);
        } else {
          return res
            .status(400)
            .json({ error: "There is no movie with those genres" });
        }
      } else if (moviesMap.length > 0 && body.genres.length < 1) {
        return res
          .status(200)
          .json(moviesMap[Math.floor(Math.random() * moviesMap.length)]);
      } else if (moviesMap.length < 1) {
        return res.status(400).json({
          error: `There's no movie with duration: ${parseInt(body.duration)}`,
        });
      } else {
        return res
          .status(400)
          .json({ error: `There's no movie with genre: ${chGen.genName}` });
      }
    } else if (isNaN(body.duration)) {
      return res.status(400).json({ error: "Duration should be a number" });
    } else {
      return res
        .status(400)
        .json({ error: "Duration of the movie can't be this short" });
    }
  } else {
    // Only duration was specified
    if (body.duration && !body.genres) {
      if (!isNaN(parseInt(body.duration)) && body.duration > 0) {
        moviesMap = funcGetPost.fittingDuration(
          movies,
          parseInt(body.duration)
        );

        if (moviesMap.length > 0) {
          return res
            .status(200)
            .json(moviesMap[Math.floor(Math.random() * moviesMap.length)]);
        } else {
          return res.status(400).json({
            error: `There's no movie with duration close to ${parseInt(
              body.duration
            )}`,
          });
        }
      } else if (parseInt(body.duration) < 0) {
        return res
          .status(400)
          .json({ error: "Duration of the movie can't be this short" });
      } else {
        return res.status(400).json({ error: "Duration should be a number" });
      }
    } else {
      // Only genres was specified
      if (chGen.matched > 0) {
        foundMovies = funcGetPost.fittingGenres(movies, body.genres);
        return res.status(200).json(foundMovies);
      } else if (body.genres.length > 0 && chGen.matched < 1) {
        return res
          .status(400)
          .json({ error: `There's no movie with genre: ${chGen.genName}` });
      } else {
        return res
          .status(200)
          .json(movies[Math.floor(Math.random() * (movies.length - 1)) + 1]);
      }
    }
  }
});

router.route("/addMovie").post((req, res) => {
  const data = funcGetPost.loadJSON("./data/db.json");
  const body = req.body;
  const genres = data.genres;

  // Check if all required data are set
  if (
    !body.genres ||
    !body.title ||
    !body.year ||
    !body.runtime ||
    !body.director
  ) {
    return res.status(400).json({
      error:
        "Some of required data are missing (genres, title, year, runtime or director)",
    });
  }

  // Check if genres are correct
  const chGen = funcGetPost.checkGenres(body.genres, genres);
  if (chGen.matched !== body.genres.length) {
    return res.status(400).json({
      error: `There is no genre like ${
        chGen.genName
      }. Try some of those: ${genres.join(", ")}`,
    });
  }

  // Check if genres aren't an empty array
  if (body.genres.length < 1) {
    return res.status(400).json({ error: "Genres cannot be an empty array" });
  }

  // Check if title name isn't to long
  if (body.title.length > 255) {
    return res
      .status(400)
      .json({ error: "Title to long, it's max to 255 characters" });
  }

  // Check if Year is a number
  if (typeof body.year !== "number") {
    const year = parseFloat(body.year);
    if (isNaN(year)) {
      return res.status(400).json({ error: "Year must be a number" });
    }
  }

  // Check if year isn't from before first movie staged
  if (body.year < 1985) {
    return res
      .status(400)
      .json({ error: "The first movie was staged in 1985" });
  }

  // Check if Runtime is a number
  if (typeof body.runtime !== "number") {
    const runtime = parseFloat(body.runtime);
    if (isNaN(runtime)) {
      return res.status(400).json({ error: "Runtime must be a number" });
    }
  }

  // Check if Runtime isn't to short
  if (body.runtime <= 0) {
    return res.status(400).json({ error: "Runtime can't be that short" });
  }

  // Check if director name isn't to long
  if (body.director.length > 255) {
    return res
      .status(400)
      .json({ error: "Director i s to long, it's max to 255 characters" });
  }

  // Check if Director is set and isn't starting with a number
  if (body.director && !isNaN(parseFloat(body.director))) {
    return res
      .status(400)
      .json({ error: "Director can't have a number in name" });
  }

  // Check if Actor is set and isn't starting with a number
  if (body.actors && !isNaN(parseFloat(body.actors))) {
    return res.status(400).json({ error: "Actor can't have a number in name" });
  }

  // Check if Plot isn't shorter than 3 characters
  if (body.plot && body.plot.length < 3) {
    return res
      .status(400)
      .json({ error: "Plot can't have less than 3 characters" });
  }

  // Check if poster Url is valid
  if (body.posterUrl && !funcGetPost.IsUrlValid(body.posterUrl)) {
    return res.status(400).json({
      error:
        "Url should have proper structure. It need to have http:// or https:// at the beggining",
    });
  }

  const movie = {
    id: data.movies.length + 1,
    title: body.title,
    year: body.year,
    runtime: body.runtime,
    genres: body.genres,
    director: body.director,
    actors: body.actors,
    plot: body.plot,
    posterUrl: body.posterUrl,
  };

  data.movies.push(movie);
  funcGetPost.saveJSON(data);

  return res.status(200).json(movie);
});

module.exports = router;
