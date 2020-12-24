const express = require("express");
const mongoose = require("mongoose");
const db = require("./config/keys").mongoURI;
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./routes/api/users.js");
const profile = require("./routes/api/profile.js");
const posts = require ("./routes/api/posts.js");

const path = require("path");

var app = express();

// Body parser middleware
app.use (bodyParser.urlencoded({extended: false}));
app.use (bodyParser.json());

// Connect to the database
mongoose
    .connect(db)
    .then(() => console.log("MongoDB connected"))
    .catch (error => console.log(error));

// Passport middleware
app.use(passport.initialize());

//Passport Config
require("./config/passport")(passport);


app.use("/api/users", users);
app.use("/api/posts", posts);
app.use("/api/profile", profile);

// Serve static assests if in production
if (process.env.NODE_ENV == "production"){
    // Set static folder
    app.use(express.static("client/build"))

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    })
}

const port = process.env.PORT || 5000

app.listen (port, () => console.log(`SERVING RUNNING ON PORT ${port}`));