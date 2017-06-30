var mongoose = require("mongoose");

// Campground Schema Setup
var campgroundSchema = new mongoose.Schema({
  name: String,
  price: String,
  image: String,
  description: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String // added because of convenienve as we will be using it a lot
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

module.exports = mongoose.model("Campground", campgroundSchema);
