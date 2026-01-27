const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM('Essential', 'Premium', 'Limited', 'Seasonal'),
    allowNull: false,
  },
  colors: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fullDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  sizes: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: true,
    defaultValue: 0,
  },
  reviews: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  features: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: true,
  tableName: 'products',
});

module.exports = Product;
