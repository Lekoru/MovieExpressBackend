const express = require('express');
const port = 8080;
const app = express();
const router = require("./router.js");

app.use(express.json());
app.use(router)

app.listen(port);