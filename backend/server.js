const express = require("express");
const app = express();
const mongoose = require("mongoose");
let bodyParser = require("body-parser");
const dbAuth = require("./routes/auth.js");
const dbIndex = require("./routes/index.js");
let path = require("path");
let logger = require("morgan");
let cookieParser = require("cookie-parser");
var crypto = require("crypto");
var session = require("express-session");
var MongoStore = require("connect-mongo")(session);
var passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy;
const { User } = require("./models");

if (!process.env.MONGODB_URI) {
  throw new Error(
    "MONGODB_URI is not in the environmental variables. Try running 'source env.sh'"
  );
}

mongoose.connection.on("connected", function() {
  console.log("Success: connected to MongoDb!");
});

mongoose.connection.on("error", function() {
  console.log("Error connecting to MongoDb. Check MONGODB_URI in env.sh");
  process.exit(1);
});
mongoose.connect(process.env.MONGODB_URI);

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(logger("dev"));
app.use(cookieParser());

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SECRET,
    store: new MongoStore({
      mongooseConnection: require("mongoose").connection
    })
  })
);

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

function hash(password) {
  var hash = crypto.createHash("sha256");
  hash.update(password);
  return hash.digest("hex");
}

passport.use(
  new LocalStrategy(function(username, password, done) {
    // Find the user with the given username
    User.findOne({ username: username }, function(err, user) {
      // if there's an error, finish trying to authenticate (auth failed)
      if (err) {
        console.log(err);
        return done(err);
      }
      // if no user present, auth failed
      if (!user) {
        console.log(user);
        return done(null, false);
      }
      // if passwords do not match, auth failed
      if (user.password !== hash(password)) {
        return done(null, false);
      }
      // auth has has succeeded
      return done(null, user);
    });
  })
);

// this might not work
app.use(passport.initialize());
app.use(passport.session());

app.use("/db", dbAuth(passport, hash));
app.use("/db", dbIndex());

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error("Not Found");
//   err.status = 404;
//   // next(err);
//   res.json({
//     success: false,
//     err: err
//   });
// });

app.listen(3000, () => {
  console.log("Server for YouPick listening on port 3000!");
});

module.exports = app;
