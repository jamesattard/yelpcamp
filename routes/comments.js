var express = require("express");
var router  = express.Router({mergeParams: true}); // make params readable inside the shortened route...
var Campground  = require("../models/campground");
var Comment = require("../models/comment");

// ===================
// Comments Routes
// ===================

// NEW Route
router.get("/new", isLoggedIn, function(req, res){
  Campground.findById(req.params.id, function(err, campground){
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", {campground: campground});
    }
  })
});

// CREATE Route
router.post("/", isLoggedIn, function(req, res){
  Campground.findById(req.params.id, function(err, campground){
    if (err) {
      console.log(err);
      redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, function(err, comment){
        if (err) {
          console.log(err);
        } else {
          // add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          // save comment
          comment.save();
          // add comment to campground
          campground.comments.push(comment);
          // save campground
          campground.save();
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});

// Middleware
function isLoggedIn(req, res, next){
  if (req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
};

module.exports = router;
