const express = require('express');
const port = 8080;
const app = express();

app.use(express.json());
app.use("/", (req, res) =>{
    console.log("server is working");
})

app.listen(port);