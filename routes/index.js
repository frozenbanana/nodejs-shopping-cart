var express = require('express');
var router = express.Router();
var csurf = require('csurf');
var passport = require('passport');

var Product = require('../models/product');

var csurfProtection = csurf();
router.use(csurfProtection);

/* GET home page. */
router.get('/', function(req, res, next) {
  Product.find(function(err, result) {
    var productChunks = [];
    var chunkSize = 3;
    for (var i = 0; i < result.length; i+=chunkSize) {
      productChunks.push(result.slice(i, i+chunkSize));
    }
    res.render('shop/index', { title: 'Henrys Webshop', products: productChunks }); // render them
  });    // Get all products in db.shopping.products
});

router.get('/user/signup', function(req, res, next) {
    var messages = req.flash('error');
    res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0}); // render them
});

router.post('/user/signup', passport.authenticate('local.signup', {
  successRedirect: './profile',
  failureRedirect: './signup',
  failureFlash: true
}));

router.get('/user/profile', function(req, res, next) {
  res.render('user/profile');
});

router.get('/user/profile', function(req, res, next) {
  res.render('user/profile');
});

router.get('/user/login', function(req, res, next) {
  var messages = req.flash('error');
  res.render('user/login', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0}); // render them
});

router.post('/user/login', passport.authenticate('local.login', {
  successRedirect: './profile',
  failureRedirect: './signup',
  failureFlash: true
}));

module.exports = router;
