var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
  {
    name: "Silver Crest",
    image: "https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg",
    description: "bla bla bla"
  },
  {
    name: "Blue Rocks",
    image: "https://farm5.staticflickr.com/4137/4812576807_8ba9255f38.jpg",
    description: "bla bla bla"
  },
  {
    name: "Orange Sunset",
    image: "https://farm5.staticflickr.com/4153/4835814837_feef6f969b.jpg",
    description: "bla bla bla"
  }
];

var seedComment = {
  text: "This place is great but no WiFi!",
  author: "Homer"
};

function seedDB(){
  // Remove all campgrounds
  Campground.remove({}, function(err){
    if (err){
      console.log(err);
    } else { // Remove successful..Go ahead and create campgrounds
      console.log("Campgrounds reset!");
      // Add a few campgrounds
      data.forEach(function(seed){
        Campground.create(seed, function(err, campground){
          if (err){
            console.log(err);
          } else { // Seed successful
            console.log("Added a new campground!");
            // Add a new comment
            Comment.create(seedComment, function(err, comment){
              if (err){
                console.log(err);
              } else {
                campground.comments.push(comment);
                campground.save();
                console.log("Added new comment!");
              }
            });
          }
        });
      });
    }
  });
}

module.exports = seedDB;
