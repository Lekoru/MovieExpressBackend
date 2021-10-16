const express = require("express");
const port = 5000;
const cors = require("cors");
const router = require("./router.js");
const app = express();

app.use(express.json());
app.use(cors());
app.use(router);

app.listen(
  port,
  console.log(
    `Server up on 127.0.0.1:${port} \n /addMovie - add movie \n /findMovie - find movie`
  )
);
