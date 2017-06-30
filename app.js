var express           = require("express"),
    app               = express(),
    bodyParser        = require("body-parser"),
    flash             = require("connect-flash"),
    mongoose          = require("mongoose"),
    Campground        = require("./models/campground"),
    Comment           = require("./models/comment"),
    User              = require("./models/user"),
    seedDB            = require("./seeds"),
    passport          = require("passport"),
    LocalStrategy     = require("passport-local"),
    methodOverride    = require("method-override");

var commentRoutes     = require("./routes/comments"),
    campgroundRoutes  = require("./routes/campgrounds"),
    indexRoutes       = require("./routes/index");

// Application configuration
//mongoose.connect("mongodb://localhost/yelp_camp_v13");
mongoose.connect("mongodb://james:password@ds143532.mlab.com:43532/yelpcamp_ja");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method")); // used for update routes
app.use(flash()); // flash needs to be before passport configuration

// Passport configuration
app.use(require("express-session")({
  secret: "This is no secret at all but I will try to make it look like one!",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Make currentUser variable available to each route
// {currentUser: req.user}
// Equivalent to: res.render("campgrounds/index", {currentUser: req.user})
// ...but for each route
// Note: req.user is a special variable provided by passport
// it contains the user information, or null if not logged/non-existant
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error"); // error message object will be available to all templates
  res.locals.success = req.flash("success");
  next();
});

// Seed database
// seedDB();

// Refactored routes and requiring them from here
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes); // this :id param is accessed thanks to mergeParams inside comments.js

app.listen(3000, function(){
  console.log("YelpCamp server has started...");
});
