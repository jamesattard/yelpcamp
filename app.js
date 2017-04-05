var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var campgrounds = [
  {name: "Salmon Creek", image: "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg"},
  {name: "Granite Hill", image: "https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg"},
  {name: "Mountain Goar", image: "https://farm5.staticflickr.com/4137/4812576807_8ba9255f38.jpg"},
  {name: "Salmon Creek", image: "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg"},
  {name: "Granite Hill", image: "https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg"},
  {name: "Mountain Goar", image: "https://farm5.staticflickr.com/4137/4812576807_8ba9255f38.jpg"},
  {name: "Salmon Creek", image: "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg"},
  {name: "Granite Hill", image: "https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg"},
  {name: "Mountain Goar", image: "https://farm5.staticflickr.com/4137/4812576807_8ba9255f38.jpg"}
];

app.get("/", function(req, res){
  res.render("landing");
});

app.get("/campgrounds", function(req, res){
  res.render("campgrounds", {
    campgrounds: campgrounds
  });
});

app.get("/campgrounds/new", function(req, res){
  res.render("new");
});

app.post("/campgrounds", function(req, res){
  //get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var newCampground = {
    name: name,
    image: image
  };
  campgrounds.push(newCampground);
  //redirect back to campgrounds page
  res.redirect("/campgrounds");
});

app.listen(3000, function(){
  console.log("YelpCamp server has started...");
});
