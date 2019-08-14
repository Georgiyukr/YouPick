const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  likedCuisines: {
    type: Array,
    required: false
  },
  priceRange: {
    type: Array,
    required: false
  },
  visitedRestraunts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VisitedRestaurants"
    }
  ]
});

const User = mongoose.model("User", userSchema);

module.exports = User;
