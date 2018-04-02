var Product = require('../models/product');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise
mongoose.connect('localhost:27017/shopping');

var products = [
  new Product({
    imagePath: "https://upload.wikimedia.org/wikipedia/en/9/93/Horizon_Zero_Dawn.jpg",
    title: "Horizon Zero Dawn",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    price: 12
  }),
  new Product({
    imagePath: "https://i5.walmartimages.com/asr/b9998253-88f5-45ef-89b0-10e06c383f02_1.9db557a08f9fbc9785b4ef73d9662f7c.jpeg?odnHeight=450&odnWidth=450&odnBg=FFFFFF",
    title: "SIMS",
    description: "The Sims is a life simulation game series that was developed by Maxis and The Sims Studio and published by Electronic Arts. The franchise has sold nearly 200 million copies worldwide, and it is one of the best-selling video games series of all time.",
    price: 10
  }),
  new Product({
    imagePath: "http://s2.glbimg.com/ghxJOX80DQHFfGZ2vrgS0A5osgU=/620x465/s.glbimg.com/jo/g1/f/original/2015/12/08/minecraft-nintendo-g1.jpg",
    title: "MineCraft",
    description: "Minecraft is a sandbox video game created and designed by Swedish game designer Markus \"Notch\" Persson, and later fully developed and published by Mojang.",
    price: 5
  }),
  new Product({
    imagePath: "https://upload.wikimedia.org/wikipedia/en/thumb/9/91/WoW_Box_Art1.jpg/220px-WoW_Box_Art1.jpg",
    title: "World of Warcraft",
    description: "Vanilla version is the best",
    price: 11
  })
];

var done = 0;
for (var i = 0; i < products.length; i++) {
  done++;
  products[i].save(function (err, result) {
    if (done === products.length) {
      exit();
    }
  }); // save to database
}

function exit() {
  mongoose.disconnect();
}
