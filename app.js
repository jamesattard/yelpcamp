// Packages
var expressSanitizer  = require("express-sanitizer"),
methodOverride        = require("method-override"),
bodyParser            = require("body-parser"),
mongoose              = require("mongoose"),
express               = require("express"),
app                   = express();

// Models
var Campground        = require("./models/campground"),
Comment               = require("./models/comment"),
User                  = require("./models/user");

// App Config
mongoose.connect("mongodb://localhost/yelp_camp");
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());

// Seeding
var seedDB  = require("./seeds");
seedDB();

// RESTful Routes
app.get("/", function(req, res){
  res.render("landing");
});

// ===================
// Campgrounds Routes
// ===================

// INDEX Route
app.get("/campgrounds", function(req, res){
  Campground.find({}, function(err, allCampgrounds){
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index",
        {campgrounds:allCampgrounds}
      );
    }
  });
});

// NEW Route
app.get("/campgrounds/new", function(req, res){
  res.render("campgrounds/new");
});

// CREATE Route
app.post("/campgrounds", function(req, res){
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var newCampground = {
    name: name,
    image: image,
    description: description
  };

  Campground.create(newCampground, function(err, newlyCreated){
    if (err) {
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
  });
});

// SHOW Route
app.get("/campgrounds/:id", function(req, res){
  Campground.findById(req.params.id).populate("comments").exec( function(err, foundCampground){
    if (err) {
      console.log(err);
    } else {
      console.log(foundCampground);
      res.render("campgrounds/show", {campground: foundCampground});
    }
  });
});

// EDIT Route

// UPDATE Route

// DESTROY Route

// ================
// Comments Routes
// ================

// NEW Route
app.get("/campgrounds/:id/comments/new", function(req, res){
  Campground.findById(req.params.id, function(err, campground){
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", {campground: campground});
    }
  })
});

// CREATE Route
app.post("/campgrounds/:id/comments", function(req, res){
  Campground.findById(req.params.id, function(err, campground){
    if (err) {
      console.log(err);
      redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, function(err, comment){
        if (err) {
          console.log(err);
        } else {
          campground.comments.push(comment);
          campground.save();
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});

app.listen(3000, function(){
  console.log("YelpCamp server has started...");
});
