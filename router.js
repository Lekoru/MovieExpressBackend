"use strict";
const express = require("express");
let router = express.Router();


router
    .route('/findMovie')
    .get((req, res) => {
        console.log("Znajdź film");
    });

router
    .route("/addMovie")
    .post((req, res) =>{
        
    });

module.exports = router;