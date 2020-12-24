const express = require ("express");
const router = express.Router();
const mongoose = require ("mongoose");
const passport = require ("passport");


// Load profile model.
const Profile = require ("../../models/Profile");

// Load User profile.
const User = require ("../../models/User");

// Load profile validation.
const validateProfileInput = require ("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");


// @route   GET api/profile/test.
// @desc    Tests profile route.
// @access  Public.
router.get("/test", (req,res) => res.json({msg: "Profile works"}));

// @route   GET api/profile/
// @desc    Get current users profile
// @access  Private

router.get("/", passport.authenticate("jwt", {session: false}), (req,res) => {
    const errors = {};

    Profile.findOne ({user: req.user.id})
            .populate("user", ["name", "avatar"])
            .then (profile => {
                if (!profile){
                    errors.noProfile = "There is no profile for this user";
                    return res.status(404).json({errors});
                }
                res.json(profile);
            })
            .catch (err => res.status(404).json(err));
});

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public

router.get("/all", (req, res) => {
    const errors = {};

    Profile.find()
            .populate("user", ["name", "avatar"])
            .then(profiles => {
                if (!profiles){
                    errors.noProfiles = "No profiles exist";
                    return res.send(404).json(errors);
                }
                res.json(profiles);
            })
            .catch (err => 
                res.status(404).json({profiles: "No profile exist"})
            );
});


// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public

router.get("/handle/:handle", (req, res) => {
    const errors = {}

    Profile.findOne({handle: req.params.handle})
        .populate("user", ["name", "avatar"])
        .then(profile => {
            if (!profile){
                errors.noProfile = "There is no profile for this user";
                res.status(404).json(errors)
            }
            res.json(profile)
        })
        .catch (error => {
            res.status(404).json(error);
        })
})


// @route   GET api/profile/user/:user_id
// @desc    Get profile by user id
// @access  Public

router.get("/user/:user_id", (req, res) => {
    const errors = {}

    Profile.findOne({user: req.params.user_id})
        .populate("user", ["name", "avatar"])
        .then(profile => {
            if (!profile){
                errors.noProfile = "There is no profile for this user";
                res.status(404).json(errors)
            }
            res.json(profile)
        })
        .catch (error => {
            res.status(404).json({profile: "There is no profile for this user"})
        })
})


// @route   POST api/profile/
// @desc    Create users profile
// @access  Private

router.post("/", passport.authenticate("jwt", {session: false}), (req,res) => {

    const {errors, isValid} = validateProfileInput(req.body);

    if (!isValid) {
        //Return errors with 400 status
        return res.status(400).json(errors);
    }
    // Get all fields
    const profileFields = {};

    profileFields.user = req.user.id;
    
    if(req.body.handle){
        profileFields.handle = req.body.handle
    }
    if(req.body.company){
        profileFields.company = req.body.company
    }
    if(req.body.website){
        profileFields.website = req.body.website
    }
    if(req.body.location){
        profileFields.location = req.body.location
    }
    if(req.body.bio){
        profileFields.bio = req.body.bio
    }
    if(req.body.status){
        profileFields.status = req.body.status
    }
    if(req.body.githubusername){
        console.log("WORKS")
        profileFields.githubusername = req.body.githubusername
    }
    // Skills
    if(typeof req.body.skills !== "undefined"){
        profileFields.skills = req.body.skills.split(",")
    }

    // Social
    profileFields.social = {};

    if(req.body.youtube){
        profileFields.social.youtube = req.body.youtube;
    }
    if(req.body.twitter){
        profileFields.social.twitter = req.body.twitter;
    }
    if(req.body.facebook){
        profileFields.social.facebook = req.body.facebook;
    }
    if(req.body.linkedin){
        profileFields.social.linkedin = req.body.linkedin;
    }
    if(req.body.instagram){
        profileFields.social.instagram = req.body.instagram;
    }

    Profile.findOne({user: req.user.id})
            .then (profile => {
                if (profile) {
                    // Update Existing User
                    Profile.findOneAndUpdate(
                        {user : req.user.id}, 
                        {$set: profileFields}, 
                        {new: true}
                    )
                    .then (profile => {
                        res.json(profile)
                    })
                } else {
                    // Create New User
                    // Check if handle exists
                    Profile.findOne({handle: profileFields.handle})
                            .then (profile => {
                                if(profile) {
                                    errors.handle = "That handle already exists";
                                    res.status(400).json(errors)
                                }

                                new Profile(profileFields).save()
                                    .then(profile => {
                                        res.json(profile);
                                    });
                            })
                }
            })
});

// @route   POST api/profile/experience
// @desc    Add experience to profile
// @access  Private
router.post("/experience", passport.authenticate("jwt", {session: false}), (req, res) => {

    const {errors, isValid} = validateExperienceInput(req.body);

    if (!isValid) {
        //Return errors with 400 status
        return res.status(400).json(errors);
    }

    Profile.findOne({user: req.user.id})
           .then (profile => {
                const newExperience = {
                    title: req.body.title,
                    company: req.body.company,
                    location: req.body.location,
                    from: req.body.from,
                    to: req.body.to,
                    current: req.body.current,
                    description: req.body.description
                }

                // Add to experience array
                profile.experience.unshift(newExperience)
                profile.save()
                       .then (profile => {
                            res.json(profile)
                        })
            })
});

// @route   POST api/profile/education
// @desc    Add education to profile
// @access  Private
router.post("/education", passport.authenticate("jwt", {session: false}), (req, res) => {

    const {errors, isValid} = validateEducationInput(req.body);

    if (!isValid) {
        //Return errors with 400 status
        return res.status(400).json(errors);
    }

    Profile.findOne({user: req.user.id})
           .then (profile => {
                const newEducation = {
                    school: req.body.school,
                    degree: req.body.degree,
                    fieldOfStudy: req.body.fieldOfStudy,
                    from: req.body.from,
                    to: req.body.to,
                    current: req.body.current,
                    description: req.body.description
                }

                // Add to experience array
                profile.education.unshift(newEducation)
                profile.save()
                       .then (profile => {
                            res.json(profile)
                        })
            })
});

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
router.delete("/experience/:exp_id", passport.authenticate("jwt", {session: false}), (req, res) => {


    Profile.findOne({user: req.user.id})
           .then (profile => {
                // Get remove index
                const removeIndex = profile.experience
                    .map(item => item.id)
                    .indexOf(req.params.exp_id)

                // Splice out of array
                profile.experience.splice(removeIndex, 1);

                // Save

                profile.save()
                        .then (profile => {
                            res.json(profile);
                        })
                        .catch (err => {
                            res.status(404).json(err);
                        })
            })
});

// @route   DELETE api/profile/education/:edu_id
// @desc    Delete education from profile
// @access  Private
router.delete("/education/:edu_id", passport.authenticate("jwt", {session: false}), (req, res) => {


    Profile.findOne({user: req.user.id})
           .then (profile => {
                // Get remove index
                const removeIndex = profile.education
                    .map(item => item.id)
                    .indexOf(req.params.edu_id)

                    console.log(removeIndex)

                // Splice out of array
                profile.education.splice(removeIndex, 1);

                // Save

                profile.save()
                        .then (profile => {
                            res.json(profile);
                        })
                        .catch (err => {
                            res.status(404).json(err);
                        })
            })
});

// @route   DELETE api/profile/
// @desc    Delete user and profile
// @access  Private
router.delete("/", passport.authenticate("jwt", {session: false}), (req, res) => {

    Profile.findOneAndRemove({user: req.user.id})
        .then (() => {
            User.findOneAndRemove({id: req.user.id})
                .then(() => {
                    res.json({success: true})
                })
        })
});
module.exports = router;