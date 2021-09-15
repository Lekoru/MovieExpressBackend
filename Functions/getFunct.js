const postFunct = require('./postFunct.js');

var i = 0;
 

var metody = {
    changeOnObj: (map1) => {
        var map2 = new Map([...map1.entries()].sort((a,b) => b[1] - a[1]));
        var it = map2.values();
        var movies = [];
        i = 0;
        while (i < map2.size ){
            movies.push(it.next().value);
            i++;
        }
        return movies;
    },

    fitingDuration: (movies, duration) =>{
        var map1 = new Map();
        i = 0;
        for(var movie of movies){
            if ((movie.runtime < duration + 10) && (movie.runtime > duration - 10) ){
                map1.set(i, movie);
                i++;
            }
        }
        return map1;
    },

    fitingGenres: (movies, genres) => {
        //Fiting genres
        var map3 = new Map();
        i = 0;
        for(var movie1 of movies){
            i = postFunct.checkGenres(genres, movie1.genres);
            if(i[0] > 0){
                map3.set(movie1, i[0]);
            }
        }
        var map2 = new Map([...map3.entries()].sort((a,b) => b[1] - a[1]));
        var it2 = map2.keys();
        var foundMovies = [];
        i = 0;
        while (i < map2.size ){
            foundMovies.push(it2.next().value);
            i++;
        }
        return foundMovies;
   }
}

module.exports = metody;