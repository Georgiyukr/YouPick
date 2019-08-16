const express = require("express");
const router = express.Router();
const { User } = require("../models");

module.exports = function(passport, hash) {
  router.post("/register", (req, res) => {
    console.log(req.body);
    const newUser = new User({
      username: req.body.username,
      password: hash(req.body.password)
    });
    newUser
      .save()
      .then(response => {
        res.json({ success: true, user: newUser });
      })
      .catch(error => {
        console.log("saveUser", error);
      });
  });

  router.post("/login", passport.authenticate("local"), function(req, res) {
    if (req.user) {
      console.log(`User: ${req.user.username} is logged in!`);
      res.json({ success: true, user: req.user });
    } else {
      res.json({ success: false });
    }
  });

  router.post("/logout", (req, res) => {
    req.logout();
    if (!req.user) {
      res.json({ success: true });
    } else res.json({ success: true });
  });

  return router;
};
