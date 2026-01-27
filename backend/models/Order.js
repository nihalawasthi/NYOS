const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  items: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customerEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customerPhone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  shippingAddress: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  totalAmount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'pending',
    allowNull: false,
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
    defaultValue: 'pending',
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  trackingNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
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
  tableName: 'orders',
});

module.exports = Order;
