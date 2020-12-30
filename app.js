const express = require('express');
const app = express();
const path = require("path");

const PORT = process.env.port || 2020;
//mongo db conn
require('./db/mongoConn')

app.use(express.static(path.join(__dirname,"./public")))

app.get('/', (req, res) =>{
    res.send('User Auth assignment 1')
});

app.listen(PORT, ()=>{
    console.log(`Server is running at ${PORT}`)

})