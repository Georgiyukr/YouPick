const mongoose = require("mongoose");

const visitedRestaurantsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  userID: {
    type: String,
    required: true
  },
  cuisine: {
    type: String,
    required: true
  },
  rating: {
    type: Number
  }
});

const VisitedRestaurants = mongoose.model(
  "VisitedRestaurants",
  visitedRestaurantsSchema
);

module.exports = VisitedRestaurants;
