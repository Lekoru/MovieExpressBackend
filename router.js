"use strict";
const express = require("express");
let router = express.Router();
const fs = require("fs");
const URL = require("url").URL;

function loadJSON(filename = ''){
    return JSON.parse(
        fs.existsSync(filename) 
        ?fs.readFileSync(filename).toString()
        : 'null'
    )
};
const IsUrlValid = (urlString = "") =>{
    try{
        new URL(urlString);
        return true;
    }catch {
        return false;
    }
};

const data = loadJSON("./data/db.json");

router
    .route('/findMovie')
    .get((req, res) => {
        console.log("Znajdź film");
    });

router
    .route("/addMovie")
    .post((req, res) =>{
        const body = req.body;
        const genres = data.genres;

        //Check if all required data are set
        if ( !body.genres || !body.title || !body.year || !body.runtime || !body.director ){
            return res 
                .status(400)
                .json({error: 'Some of required data are missing (genres, title, year, runtime or director)'});
        }

        //Check genres
        var i = 0;  
        for(var gen of body.genres){
            for(var genre of genres){
                if(gen === genre){
                    i++;
                    break;
                }
            }
        }

        if(i != body.genres.length) {
            return res
                .status(400)
                .json({error: `Ther is no genre like ${gen}. Try some of those: ${genres.join(', ')}`})
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
        if( body.posterUrl && !IsUrlValid(body.posterUrl)){
            return res
                .status(400)
                .json({error: 'Url should have proper structure. It need to have http:// or https:// at the beggining'})
        }

        const movie = {
            genres: body.genres,
            title: body.title,
            year: parseFloat(body.year),
            runtime: parseFloat(body.runtime),
            director: body.director,
            actors: body.actors,
            plot: body.plot,
            posterUrl: body.posterUrl
        }

        console.log(movie);

        return res 
            .status(201)
            .json(movie);
    });

module.exports = router;