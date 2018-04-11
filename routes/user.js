var express = require('express');
var router = express.Router();
var csurf = require('csurf');
var passport = require('passport');

var Product = require('../models/product');

var csurfProtection = csurf();
router.use(csurfProtection);

// You can only access /profile and /logout when you are logged in
router.get('/profile', isLoggedIn, function(req, res, next) {
  res.render('user/profile');
});


router.get('/logout', isLoggedIn, function(req, res, next) {
  req.logout();
  res.redirect('/');
})

// router.use() is checking on all other subroutes to see if they are not logged in
// that means all the routes below we WANT to check if they are not logged in.
router.use('/', notLoggedIn, function(req, res, next) {
  next();
});

router.get('/signup', function(req, res, next) {
    var messages = req.flash('error');
    res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0}); // render them
});

router.post('/signup', passport.authenticate('local.signup', {
    failureRedirect: '/user/signup',
    failureFlash: true
}), function(req, res, next) {
  if (req.session.oldUrl) {
    var oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;  
    res.redirect(oldUrl);
  } else {
    res.redirect('/user/profile');
  }
});

router.get('/login', function(req, res, next) {
  var messages = req.flash('error');
  res.render('user/login', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0}); // render them
});

router.post('/login', passport.authenticate('local.login', {
  failureRedirect: './signup',
  failureFlash: true
}), function(req, res, next) {
  if (req.session.oldUrl) {
    var oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;  
    res.redirect(oldUrl);
  } else {
    res.redirect('/user/profile');
  }
});


module.exports = router;

// to check if user is logged in. Otherwise they should not be where they are
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();    // then continue as normal
  }
  res.redirect('/');  // otherwise go back to routes/index.js
}

function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();    // then continue as normal
  }
  res.redirect('/');  // otherwise go back to routes/index.js
}
