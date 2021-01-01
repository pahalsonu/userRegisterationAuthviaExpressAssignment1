const express = require('express');
const app = express();
const bcrypt = require("bcrypt");
const { body, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
const Model = require("./userSchema/UserSchema")
const PORT = process.env.port || 3000;
const config = require("./config")
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
//mongo db conn
require('./db/mongoConn')

app.set('view engine', 'html')
app.engine('html', require('hbs').__express);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// middleware to register user
app.post('/register', [
    body("first_name").isString().notEmpty(),
    body("last_name").isString(),
],
    async (req, res) => {
        try {
            let { Password, ConfirmPassword } = req.body;
           
            if (Password !== ConfirmPassword) {
                console.log('Password and Confirm Password Must be Same')
            }
            //becrypt password
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
            const hashedPassword = await bcrypt.hash(Password, salt)

            //token generation by json web token

            const privateKey = "HelloThere";
            const payload = {
                id: {
                    email: req.body.email
                }
            }
            const token = jwt.sign(payload, privateKey, { expiresIn: 100000 })

            let registerAppmonCustomer = new Model({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                phone: req.body.phone,
                email: req.body.email,
                emailtoken: token,
                Password: hashedPassword
            })
           
            await registerAppmonCustomer.save();


            //send verification mail gmail

            var transporter = nodemailer.createTransport(smtpTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                auth: {
                    user: 'pahalsonu10@gmail.com',
                    pass: `${config.pass}`
                }
            }));

            var mailOptions = {
                from: 'pahalsonu10@gmail.com',
                to: `${req.body.email}`,
                subject: 'Please click on link to verify!',
                text: `http://localhost:3000/verify/${token}`
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

            res.status(201).json({ "Success": "User Registered" })
        } catch (error) {
            res.status(501).send(error);

        }
    });


    //middleware to verify user by mail token
app.get('/verify/:emailtok', async (req, res) => {
    try {
        const emailtoken = req.params.emailtok;
        const userVerification = await Model.findOneAndUpdate({ emailtoken }, { $set: { active: true } });
        console.log("ello")
        if (!userVerification) {
            res.status(201).json({ "User": "Not Existed" })
        }
        res.send("<h1>you are successfully registered<h1>")
    } catch (error) {
        res.status(501).send(error)
    }
})





app.post('/login', async (req, res) => {
    try {
        let findUser = req.body.email;
        let user = await Model.findOne({ findUser });

        if (!user) {
            res.status(201).json({ "User": "User not Registered" })
        }
        //verify entered pass
        const match = await bcrypt.compare(req.body.password, user.hashedPassword);
        if (!match) {
            res.status(201).json({ "password": " not matched" })
        }
        // access jwt token
        const privateKey = "HelloThere";
        const payload = {
            id: {
                email: req.body.email
            }
        }
        const token = jwt.sign(payload, privateKey, { expiresIn: 10000 })

        var decoded = jwt.verify(token, privateKey);
        console.log(decoded.id.email)
        res.status(201).json({ "Success": "Log IN" })

    } catch (error) {
        res.status(501).send(error)
    }

})


app.get('/', (req, res) => {
    res.render("index")
});
app.get('/register', function (req, res) {
    res.render('register')
});
app.get('/login', function (req, res) {
    res.render('login')
});

app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`)

})