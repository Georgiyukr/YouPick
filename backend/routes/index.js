const express = require("express");
const router = express.Router();
const { VisitedRestaurants, User } = require("../models");

router.post("/setProfile", (req, res) => {
  let username = req.body.username;
  let foodLiked = req.body.foodLiked;
  let priceRange = req.body.priceRange;

  User.findOne({ username: username }, function(err, user) {
    if (err) {
      console.log("ERROR IN SET PROFILE", err);
    } else {
      user.likedCuisines = foodLiked;
      user.priceRange = priceRange;
      user
        .save()
        .then(response => {
          res.json({ user: user, success: true });
        })
        .catch(error => {
          console.log("saveUserPref", error);
        });
    }
  });
});

router.get("/setProfile/:username", (req, res) => {
  let username = req.params.username;
  console.log("USERNAME", username);
  User.findOne({ username: username }, function(err, user) {
    if (err) {
      console.log("ERROR in GET ROUTE SETPROFILE", err);
    } else {
      res.json(user);
    }
  });
});

router.post("/visited", (req, res) => {
  const restaurant = new VisitedRestaurants({
    name: req.body.name,
    userID: req.user._id,
    cuisine: req.body.cuisine,
    rating: req.body.rating
  });

  restaurant
    .save()
    .then(response => {
      res.json({ success: true, restaurant: restaurant });
    })
    .catch(error => {
      console.log("saveRestaurant", error);
    });
});

module.exports = function() {
  return router;
};
