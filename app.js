const express = require('express');
const app = express();
const path = require("path");
const AppmonTrial = require("./userSchema/UserSchema")
const PORT = process.env.port || 3000;
//mongo db conn
require('./db/mongoConn')

app.set('view engine', 'html')
app.engine('html', require('hbs').__express);

app.get('/register', function (req, res) {
    res.render('register')
  })

app.get('/', (req, res) =>{
    res.send('User Auth assignment 1')
});

app.listen(PORT, ()=>{
    console.log(`Server is running at ${PORT}`)

})