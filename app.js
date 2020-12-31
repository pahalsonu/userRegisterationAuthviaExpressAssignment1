const express = require('express');
const app = express();

const Model = require("./userSchema/UserSchema")
const PORT = process.env.port || 3000;
//mongo db conn
require('./db/mongoConn')

app.set('view engine', 'html')
app.engine('html', require('hbs').__express);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/register', function (req, res) {
    res.render('register')
});
app.post('/register', async (req, res) => {
    try {
        const { Password, ConfirmPassword } = req.body;
        console.log(Password, ConfirmPassword)
        if (Password !== ConfirmPassword) {
            console.log('Password and Confirm Password Must be Same')
        }
        let registerAppmonCustomer = new Model({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            phone: req.body.phone,
            email: req.body.email,
            Password ,
            ConfirmPassword
        })
        
        await registerAppmonCustomer.save();
        
        res.status(201).json({"Success" : "User Registered"})
    } catch (error) {
        res.status(501).send(error)
        console.log(error)
        // console.log(error)
    }
})

app.get('/', (req, res) => {
    res.send('User Auth assignment 1')
});

app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`)

})