const express = require ("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require ("bcryptjs");
const jwt = require ("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require ("passport");

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load existing user model
const User = require ("../../models/User");

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get("/test", (req,res) => res.json({msg: "Users works"}));

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post("/register", (req, res) => {
    const {errors, isValid} = validateRegisterInput(req.body);

    // check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({email: req.body.email})
        .then(user => {
            if (user){
                errors.email = "Email already exists"
                return res.status(400).json(errors);
            } else {
                const avatar = gravatar.url(req.body.email , {
                    s: "200",       // avatar size
                    r: "pg",        // avatar rating
                    d: "mm"         // default in none exists
                });

                const newUser = new User({
                    name : req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) {
                            throw err;
                        }
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    });
                });
            }
        })
});

// @route   GET api/users/login
// @desc    Login user / Returning JWT token
// @access  Public

router.post("/login", (req, res) => {

    const {errors, isValid} = validateLoginInput(req.body);

    // check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    // Find the user in DB using email address
    User.findOne({email})
        .then(user => {
            if (!user) {
                errors.email = "User not found";
                return res.status(404).json({errors});
            }
            bcrypt.compare(password, user.password)
                .then (isMatch => {
                    if (isMatch) {
                        // User found
                        const payload = {
                            id : user.id,
                            name : user.name,
                            avatar : user.avatar
                        };

                        // Sign token
                        jwt.sign(payload, keys.secretKey, {expiresIn: 3600}, (err, token) => {
                            res.json({
                                success: true,
                                token: "Bearer " + token
                            });
                        });
                    } else {
                        errors.password = "Password incorrect"
                        return res.status(400).json({errors});
                    }
                });
        });
});

// @route   GET api/users/current
// @desc    Return current User
// @access  Private

router.get("/current", passport.authenticate("jwt", {session: false}), (req, res) => {
    res.json (req.user);
});

module.exports = router;