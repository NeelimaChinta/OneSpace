const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Create schema
const UserSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    avatar : {
        type : String,
    },
    date : {
        type : Date,
        default : Date.now
    }
})

var User = mongoose.model ("Users", UserSchema);

module.exports = User;
