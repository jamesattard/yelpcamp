var expressSanitizer  = require("express-sanitizer"),
methodOverride        = require("method-override"),
bodyParser            = require("body-parser"),
mongoose              = require("mongoose"),
express               = require("express"),
app                   = express();

// App Config
mongoose.connect("mongodb://localhost/yelp_camp");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());

// Mongoose Schema & Model Config
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// RESTful Routes
app.get("/", function(req, res){
  res.render("landing");
});

// INDEX Route
app.get("/campgrounds", function(req, res){
  Campground.find({}, function(err, allCampgrounds){
    if (err){
      console.log(err);
    } else {
      res.render("index",
        {campgrounds:allCampgrounds}
      );
    }
  });
});

// NEW Route
app.get("/campgrounds/new", function(req, res){
  res.render("new");
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
    if (err){
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
  });
});

// SHOW Route
app.get("/campgrounds/:id", function(req, res){
  Campground.findById(req.params.id, function(err, foundCampGround){
    if (err){
      console.log(err);
    } else {
      res.render("show", {campground: foundCampGround});
    }
  });
});

// EDIT Route

// UPDATE Route

// DESTROY Route

app.listen(3000, function(){
  console.log("YelpCamp server has started...");
});
