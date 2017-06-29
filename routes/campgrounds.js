var express       = require("express");
var router        = express.Router();
var Campground    = require("../models/campground");
var middleware    = require("../middleware");

// ------------------
// CAMPGROUNDS ROUTES
// ------------------

// Shortened from /campgrounds

// Index - show all campgrounds
router.get("/", function(req, res){
  // Get all campgrounds from database
  Campground.find({}, function(err, allCampgrounds){
    if(err){
      console.log(err);
    } else {
      res.render("campgrounds/index", {campgrounds:allCampgrounds});
    }
  });
});

// Create Route - create new campground
router.post("/", middleware.isLoggedIn, function(req, res){
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  // Get data from form and add to campgrounds array
  var newCampground = {
    name: req.body.name,
    image: req.body.image,
    description: req.body.description,
    author: author
  };
  // Create a new campground and save to database
  Campground.create(newCampground, function(err, newlyCreated){
    if(err){
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
  });
});

// New Route - display form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
  res.render("campgrounds/new");
});

// Show Route - show campground based on :id
router.get("/:id", function(req, res){
  // Find campground with provided ID and populate comments
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
    if(err){
      console.log(err);
    } else {
      // Render show template with that campround
      res.render("campgrounds/show", {campground:foundCampground});
    }
  });
});

// Edit Route - edit campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
  Campground.findById(req.params.id, function(err, foundCampground){
    res.render("campgrounds/edit", {campground: foundCampground})
  });
});

// Update Route - update campground
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
  // find and update the correct campground
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
    if(err){
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
  // redirect to show page
});

// Destroy Route - delete campground
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
  Campground.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  });
});

module.exports = router;
