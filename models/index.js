// models/index.js
const Product = require('./Products');
const User = require('./Users');
const Order = require('./Orders');
const Cart = require('./Carts');

module.exports = {
    Product,
    User,
    Cart,
    Order,
};
