var express       = require("express");
var router        = express.Router({mergeParams: true}); // to ensure we have access to the :id param from app.js
var Campground    = require("../models/campground");
var Comment       = require("../models/comment");

// ---------------
// COMMENTS ROUTES
// ---------------

// Shortened from /campgrounds/:id/comments

// Comments new
router.get("/new", isLoggedIn, function(req, res){
  // Find campground by id
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
    } else {
      res.render("comments/new", {campground: campground});
    }
  });
});

// Comments create
router.post("/", isLoggedIn, function(req, res){
  // Lookup campground using ID
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      // Create new comment
      Comment.create(req.body.comment, function(err, comment){
        if(err){
          console.log(err);
        } else {
          // add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          // save comment
          comment.save();
          // save campground
          campground.comments.push(comment);
          campground.save();
          // Redirect to campground show page
          res.redirect('/campgrounds/' + campground._id);
        }
      });
    }
  });
});

// Comments edit
router.get("/:comment_id/edit", function(req, res){
  Comment.findById(req.params.comment_id, function(err, foundComment){
    if(err){
      res.redirect("back");
    } else {
      // req.params.id: id here refers to the campground'd id (refer to app.js)
      res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
    }
  });
});

// Comments update
//campground/:id/comments/:comment_id PUT
router.put("/:comment_id", function(req, res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
    if(err){
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id); // remember that :id is always available via router shortener
    }
  })
});

// Middleware
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
};

module.exports = router;
