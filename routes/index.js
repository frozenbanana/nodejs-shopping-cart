var express = require('express');
var router = express.Router();

var Product = require('../models/product');
var Cart = require('../models/cart');
var Order = require('../models/order');

/* GET home page. */
router.get('/', function(req, res, next) {
  var successMsg = req.flash('success')[0];
  Product.find(function(err, result) {
    var productChunks = [];
    var chunkSize = 3;
    for (var i = 0; i < result.length; i+=chunkSize) {
      productChunks.push(result.slice(i, i+chunkSize));
    }
    res.render('shop/index', { title: 'Henrys Webshop', products: productChunks, successMsg: successMsg, noMessage: !successMsg}); // render them
  });    // Get all products in db.shopping.products
});

router.get('/add-to-cart/:id', function(req, res, next) { // next is usually not neccessary if not used. but convension
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {}); // pass the old cart if it exists

  Product.findById(productId, function(err, product) {
    // if (err) {
    //   return res.redirect('/');
    // }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/');
  });
});

router.get('/shopping-cart', function(req, res, next) {
   if (!req.session.cart) {
       return res.render('shop/shopping-cart', {products: null});
   }
    var cart = new Cart(req.session.cart);
    res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

router.get('/checkout', isLoggedIn, function(req,res,next) {
  if (!req.session.cart) {
    return res.redirect('shop/checkout');
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];
  console.log(req.flash);
  console.log(errMsg);
  res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});

router.post('/checkout', isLoggedIn, function(req, res, next) {
  console.log(req.session.cart);
  if (!req.session.cart) { // check if we have a Cart object yet
    return res.render('/shopping-cart'); // if we do then render correct page with null products
  }
  console.log("HELLO");
  var cart = new Cart(req.session.cart); // if we have products in cart then store session-cart
  console.log(cart);
 
  var stripe = require("stripe")("sk_test_HrUggyRNY8m6rFRcb4owIiwC");
  stripe.charges.create({
    amount: cart.totalPrice * 100,
    currency: "usd",
    source: req.body.stripeToken, // obtained with Stripe.js
    description: "test charge"
  }, function(err, charge) {
    if (err) {
      req.flash('error', err.message);
      console.log("PRIBLEM");
      return res.redirect('/checkout');
    }

    var order = new Order({
      user: req.user, // Passport will add user from req(uest)
      cart: cart,
      address: req.body.address,
      name: req.body.name,
      paymentId: charge.id
    });
    order.save(function(err, result) {
      req.flash()
      req.flash('success', 'Successfully bought product!');
      req.session.cart = null;
      res.redirect('/');
    });
  });
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/login');
}
