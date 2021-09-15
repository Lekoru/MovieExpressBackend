"use strict";
const express = require("express");
let router = express.Router();
const postFunct = require('./Functions/postFunct.js');
const getFunct = require('./Functions/getFunct.js');

const data = postFunct.loadJSON("./data/db.json");

router
    .route('/findMovie')
    .get((req, res) => {
        var map1 = new Map();
        var body = req.body;
        var movies = data.movies;
        var foundMovies = [];

    if(!body.duration && !body.genres) {
        return res
            .status(200)
            .json(movies[Math.floor(Math.random() * (movies.length - 1)) + 1]);
    } else if ( body.duration && body.genres ){
        
    } else {

        //Duration parameter only
        if (body.duration && !body.genres){
            if(!isNaN(parseInt(body.duration))){
                map1 = getFunct.fitingDuration(movies, parseInt(body.duration));
                
                if(map1.size > 0){
                    return res
                    .status(200)
                    .json(map1.get(Math.floor(Math.random() * (map1.size - 1)) + 1))
                } else {
                    return res
                    .status(400)
                    .json({error: `There's no movie with duration close to ${parseInt(body.duration)}`});
                }
            }
            else {
                return res
                .status(400)
                .json({error: "Duration should be a number"});
            }
        } 
        //Genres parameter only
        else {
            foundMovies = getFunct.fitingGenres(movies, body.genres);
            return res
                .status(200)
                .json(foundMovies);
        }

    }

    });

router
    .route("/addMovie")
    .post((req, res) =>{
        var body = req.body;
        const genres = data.genres;

        //Check if all required data are set
        if ( !body.genres || !body.title || !body.year || !body.runtime || !body.director ){
            return res 
                .status(400)
                .json({error: 'Some of required data are missing (genres, title, year, runtime or director)'});
        }

        //Check if genres are corect
        var chGen = postFunct.checkGenres(body.genres, genres);
        if( chGen[0] != body.genres.length) {
            return res
                .status(400)
                .json({error: `Ther is no genre like ${chGen[1]}. Try some of those: ${genres.join(', ')}`})
        }

        //Check if title name isn't to long
        if ( body.title.length > 255){
            return res
                .status(400)
                .json({error: 'Title to long, it\'s max to 255 characters'})
        }

        //Check if Check if title start with numbers
        if (!isNaN(parseFloat(body.title))){
            return res
                .status(400)
                .json({error: 'Title can\'t be a number only'})
        }

        //Check if Year is a number
        if ( typeof(body.year) !== 'number'){
            const year = parseFloat(body.year);
            if(isNaN(year)){
                return res
                    .status(400)
                    .json({error: 'Year must be a number'});
            }
        }

        //Check if Runtime is a number
        if ( typeof(body.runtime) !== 'number'){
            const runtime = parseFloat(body.runtime);
            if(isNaN(runtime)){
                return res
                    .status(400)
                    .json({error: 'Runtime must be a number'});
            }
        }

        //Check if director name isn't to long
        if ( body.director.length > 255){
            return res
                .status(400)
                .json({error: 'Director i s to long, it\'s max to 255 characters'})
        }

        //Check if Actor is set and isn't starting with a number
        if (body.actors && isNaN(parseFloat(body.actors))){
            return res
                .status(400)
                .json({error: 'Actor can\'t have a number in name'})
        }

        //Check if Plot isn't shorter than 3 characters
        if(body.plot && body.plot.length < 3){
            return res
                .status(400)
                .json({error: 'Plot can\'t have less than 3 characters'})
        }

        //Check if poster Url is valid
        if( body.posterUrl && !postFunct.IsUrlValid(body.posterUrl)){
            return res
                .status(400)
                .json({error: 'Url should have proper structure. It need to have http:// or https:// at the beggining'})
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
            posterUrl: body.posterUrl
        }

        data.movies.push(movie);
        postFunct.saveJSON(data);

        return res 
            .status(201)
            .json(movie);
    });


module.exports = router;