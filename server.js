const express = require('express')
const port = 8080
const router = require('./router.js')
const app = express()

app.use(express.json())
app.use(router)

app.listen(port, () => console.log(`Server up on 127.0.0.1:${port} \n /addMovie - add movie \n /findMovie - find movie`))
