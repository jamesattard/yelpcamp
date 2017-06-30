var Campground = require("../models/campground");
var Comment = require("../models/comment");

// all the Middleware goes here
var middlewareObj = {};

// Middleware to check campground ownership
middlewareObj.checkCampgroundOwnership = function(req, res, next){
  // is user logged in
  if(req.isAuthenticated()){
    Campground.findById(req.params.id, function(err, foundCampground){
      if(err){
        req.flash("error", "Campground not found");
        res.redirect("back"); // take user back to where they came from
      } else {
        // does user own the campground?
        if(foundCampground.author.id.equals(req.user._id)) {
          // similar to "foundCampground.author.id === req.user._id" but formats
          // foundCampground.author.id to string since it is a Mongoose object
          next();
        } else {
          // user is trying to screw around
          req.flash("error", "You don't have permission to do that");
          res.redirect("back"); // take user back to where they came from
        }
      }
    });
  } else { // user is not logged in
    req.flash("error", "You need to be logged in to do that");
    res.redirect("back"); // take user back to where they came from
  }
};

// Middleware to check comment ownership
middlewareObj.checkCommentOwnership = function(req, res, next){
  // is user logged in
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
        res.redirect("back"); // take user back to where they came from
      } else {
        // does user own the comment?
        if(foundComment.author.id.equals(req.user._id)) {
          // similar to "foundComment.author.id === req.user._id" but formats
          // foundComment.author.id to string since it is a Mongoose object
          next();
        } else {
          // user is trying to screw around
          req.flash("error", "You need to be logged in to do that");
          res.redirect("back"); // take user back to where they came from
        }
      }
    });
  } else { // user is not logged in
    req.flash("error", "You need to be logged in to do that");
    res.redirect("back"); // take user back to where they came from
  }
};

// Middleware to check is user is logged in
middlewareObj.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  req.flash("error", "You need to be logged in to do that");
  res.redirect("/login");
};

module.exports = middlewareObj;
