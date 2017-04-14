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

// Routes
var commentRoutes   = require("./routes/comments"),
campgroundRoutes    = require("./routes/campgrounds"),
indexRoutes         = require("./routes/index");

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

// Enable Routes
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(3000, function(){
  console.log("YelpCamp server has started...");
});
