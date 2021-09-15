const fs = require("fs");
const URL = require("url").URL;

var metody = {
     loadJSON: (filename = '') => {
         //Loading file
        return JSON.parse(
            fs.existsSync(filename) 
            ?fs.readFileSync(filename).toString()
            : 'null'
        )
    },

    IsUrlValid: (urlString = "") =>{
        //Validating an Url
        try{
            new URL(urlString);
            return true;
        }catch {
            return false;
        }
    },

    saveJSON: ( movieObj = "") =>{
        //Save changes to db
        return fs.writeFileSync(
            "./data/db.json",
            JSON.stringify(movieObj, null, 2)
        )
    },

    checkGenres: (genres1 = "", genres = "") =>{
        //Check genres
        var i = 0;  
        for(var gen of genres1){
            for(var genre of genres){
                if(gen === genre){
                    i++;
                    break;
                }
            }
        }
        return [i, gen];
    }
}

module.exports = metody;