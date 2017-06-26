var mongoose = require("mongoose");

// Comment Schema Setup
var commentSchema = new mongoose.Schema({
  text: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String // added because of convenienve as we will be using it a lot 
  }
});

module.exports = mongoose.model("Comment", commentSchema);
