const mongoose = require('mongoose');

const AppmonUserSchema = new mongoose.Schema({
    first_name :{
        type : String,
        required : true
    },
    last_name :{
        type : String,
    },
    email :{
        type : String,
        required : true,
        unique : true

    },
    phone :{
        type : Number,
        required : true
    },
    Password :{
        type : String,
        required : true
    },
    ConfirmPassword :{
        type : String,
        required : true
    }
});

//lets create collection

const Model = new mongoose.model("Model", AppmonUserSchema)

module.exports = Model;