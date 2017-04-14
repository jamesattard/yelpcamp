// Packages
var LocalStrategy   = require("passport-local"),
expressSanitizer    = require("express-sanitizer"),
methodOverride      = require("method-override"),
expressSession      = require("express-session"),
bodyParser          = require("body-parser"),
mongoose            = require("mongoose"),
passport            = require("passport"),
express             = require("express"),
app                 = express();

// Models
var Campground      = require("./models/campground"),
Comment             = require("./models/comment"),
User                = require("./models/user");

// App Config
mongoose.connect("mongodb://localhost/yelp_camp");
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());

// Seeding
var seedDB  = require("./seeds");
seedDB();

// Passport Config
app.use(expressSession({
  secret: "Rusty is the best and cutest dog in the world",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Add the currentUser prop to each single route
// rather than manually adding res.render(.., {.., currentUser: req.user}) to each rendered route...
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
});

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
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
  Campground.findById(req.params.id, function(err, campground){
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", {campground: campground});
    }
  })
});

// CREATE Route
app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
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

// ================
// Auth Routes
// ================

// Show Register Form
app.get("/register", function(req, res){
  res.render("register");
});

// Handle Sign Up Logic
app.post("/register", function(req, res){
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
    if (err) {
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function(){
      res.redirect("/campgrounds");
    });
  });
});

// Show Login Form
app.get("/login", function(req, res){
  res.render("login");
});

// Handle Login Logic
app.post("/login", passport.authenticate("local",
  {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }), function(req,res){
});

// Logout Route
app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
  if (req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
};

app.listen(3000, function(){
  console.log("YelpCamp server has started...");
});
