module.exports = function Cart(oldCart) { // passing old list of items from old cart
  this.items = oldCart.items || {};
  this.totalQty = oldCart.totalQty || 0;
  this.totalPrice = oldCart.totalPrice || 0;

  this.add = function(item, id) {
    var storedItem = this.items[id]; // if item is known in the cart, like the fifth apple(item)
    if (!storedItem) {  // if new item in cart
      storedItem = this.items[id] = {item: item, qty: 0, price: 0}; // store it in this.items
    }

    // update
    storedItem.qty++;
    storedItem.price = storedItem.item.price * storedItem.qty;
    this.totalQty++;
    this.totalPrice += storedItem.item.price;
  };

  // helper function to put items into an array
  this.generateArray = function() {
    var arr = [];
    for (var id in this.items) {
      arr.push(this.items[id]);
    }
    return arr;
  };
}
