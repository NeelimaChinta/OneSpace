const express = require ("express");
const router = express.Router();
const mongoose = require ("mongoose");
const passport = require("passport");

// User Model
const User = require("../../models/User");

// Profile Model
const Profile = require("../../models/Profile");

// Post Model
const Post = require ("../../models/Post");

// Post Validation
const validatePostInput = require("../../validation/post");

// Comment Validation
const validateCommentInput = require("../../validation/comment");

// @route   GET api/posts/test
// @desc    Tests posts route
// @access  Public
router.get("/test", (req,res) => res.json({msg: "Posts works"}));

// @route   GET api/posts/
// @desc    Get all posts
// @access  Public
router.get("/", (req,res) => {
    Post.find()
        .sort({date: -1})
        .then(posts => {
            res.json(posts)
        })
        .catch (err => {
            res.status(404). json({noPostsFound: "No posts were found"})
        })
});

// @route   GET api/posts/
// @desc    Get all posts
// @access  Public
router.get("/:id", (req,res) => {
    Post.findById(req.params.id)
        .then(post => {
            res.json(post)
        })
        .catch (err => {
            res.status(404). json({noPostFound: "No post found with that ID"})
        })
});

// @route   GET api/posts/
// @desc    Create posts
// @access  Private
router.post("/", passport.authenticate("jwt", {session: false}), (req, res) => {
    const {errors, isValid} = validatePostInput(req.body)

    // Check validation
    if (!isValid){
        return res.status(400).json(errors);
    }

    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    });

    newPost.save()
        .then(post =>
            res.json(post)
        )
})

// @route   DELETE api/posts/:id
// @desc    Delete posts
// @access  Private
router.delete("/:id", passport.authenticate("jwt", {session: false}), (req, res) => {
    Profile.findOne({user: req.user.id})
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    // Check for post owner
                    if (post.user.toString() != req.user.id){
                        return res.status(401).json({notAuthorized: "User is not authorized"})
                    }
                    
                    post.remove()
                        .then (() => {
                            res.json({success : true})
                        })
                })
                .catch(err => {
                    res.status(404).json({noPostFound: "No post found with that ID"})
                })
        })
})

// @route   POST api/posts/like/:id
// @desc    Like a post
// @access  Private
router.post("/like/:id", passport.authenticate("jwt", {session: false}), (req, res) => {
    Profile.findOne({user: req.user.id})
           .then(profile => {
               Post.findById(req.params.id)
                    .then(post => {
                        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
                            return res.status(400).json({alreadyLiked : "User already liked this post"});
                        }

                        // Add user id to the likes array
                        post.likes.unshift({user: req.user.id});

                        post.save()
                            .then (post => {
                                res.json(post)
                        })
                    })
           })
})

// @route   POST api/posts/unlike/:id
// @desc    Unlike a post
// @access  Private
router.post("/unlike/:id", passport.authenticate("jwt", {session: false}), (req, res) => {
    Profile.findOne({user: req.user.id})
           .then(profile => {
               Post.findById(req.params.id)
                    .then(post => {
                        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
                            return res.status(400).json({notLiked : "User has not liked this post"});
                        }

                        // Get the remove index
                        const removeIndex = post.likes.map(item => item.user.toString()).indexOf(req.user.id)
                        post.likes.splice(removeIndex, 1);

                        post.save()
                            .then (post => {
                                res.json(post)
                        })
                    })
                    .catch (err => {
                        res.status(404).json({postNotFound: "No post was found"})
                    })
           })
})

// @route   POST api/posts/comment/:id
// @desc    Add a comment
// @access  Private
router.post("/comment/:id", passport.authenticate("jwt", {session: false}), (req,res) => {
   
    const {errors, isValid} = validateCommentInput(req.body)

    // Check validation
    if (!isValid){
        return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
        .then(post => {
            const newComment = {
                text : req.body.text,
                name: req.body.name,
                avatar: req.body.avatar,
                user: req.user.id
            }
        
            post.comments.unshift(newComment)

            post.save()
                .then (post => {
                    res.json({post})
                })
        })
        .catch (err => {
            res.status(404).json ({postNotFound : "That post was not found"})
        })
})

// @route   DELETE api/posts/comment/:id
// @desc    Delete a comment
// @access  Private
router.delete("/comment/:id", passport.authenticate("jwt", {session: false}), (req,res) => {

    Post.findById(req.params.id)
        .then(post => {
            if (post.comments.filter(comment => comment.id.toString() === req.params.comment_id).length === 0) {
                return res.status(404).json({noCommentFound: "That comment does not exist"})
            }

            const removeIndex = post.comments.indexOf(req.user.id)
    
            post.comments.splice(removeIndex, 1)

            post.save()
                .then (post => {
                    res.json({post})
                })
        })
        .catch (err => {
            res.status(404).json ({postNotFound : "That post was not found"})
        })
})

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Remove comment from post
// @access  Private
router.delete("/comment/:id/:comment_id", passport.authenticate('jwt', { session: false }), (req, res) => {
      
    Post.findById(req.params.id)
        .then(post => {
          // Check to see if comment exists
          if (
            post.comments.filter(
              comment => comment._id.toString() === req.params.comment_id
            ).length === 0
          ) {
            return res
              .status(404)
              .json({ commentnotexists: 'Comment does not exist' });
          }
  
          // Get remove index
          const removeIndex = post.comments
            .map(item => item._id.toString())
            .indexOf(req.params.comment_id);
  
          // Splice comment out of array
          post.comments.splice(removeIndex, 1);
  
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
    }
  );

module.exports = router;