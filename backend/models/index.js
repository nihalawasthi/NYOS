const sequelize = require('../config/database');
const Product = require('./Product');
const Order = require('./Order');
const User = require('./User');
const Review = require('./Review');
const Wishlist = require('./Wishlist');

// Define associations if needed
Order.hasMany(Product, { through: 'OrderItems' });
Product.belongsToMany(Order, { through: 'OrderItems' });
Order.belongsTo(User);
User.hasMany(Order);
User.hasMany(Review);
Review.belongsTo(User);
Review.belongsTo(Product);
Product.hasMany(Review);
User.hasMany(Wishlist);
Wishlist.belongsTo(User);
Wishlist.belongsTo(Product);
Product.hasMany(Wishlist);

const models = {
  sequelize,
  Product,
  Order,
  User,
  Review,
  Wishlist,
};

module.exports = models;
