const express = require('express');
// const expressLayouts = require("express-ejs-layouts")
const routes = require('./routes');
// const static = require("./routes/static")
const mongodb = require('./database/connect')
// const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

// Session Setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

// Passport Setup
app.use(passport.initialize());
app.use(passport.session());

// Passport Serialization
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Passport Configuration
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback',
  },
  (accessToken, refreshToken, profile, done) => {
    // You could save the user to a DB here
    return done(null, profile);
  }
));

app.use('/', routes);

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Oh No! You found a missing page.'})
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.send({
    status: err.status || 500,
    message: message
})
})

const startServer = async () => {
  try {
    await mongodb.initDb();

    app.listen(process.env.PORT || port, () => {
      console.log('Connected to MongoDB listening at port ' + (process.env.PORT || port));
  })
} catch (error) {
    console.error('Error starting server:', error);
  }
}
 
app.listen(process.env.PORT || port, () => {
  console.log('Web Server is listening at http://localhost:' + (process.env.PORT || port));
});

startServer();