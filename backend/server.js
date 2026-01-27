const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const sequelize = require('./config/database');
const Product = require('./models/Product');
const Order = require('./models/Order');
const User = require('./models/User');
const Review = require('./models/Review');
const Wishlist = require('./models/Wishlist');
const seedDatabase = require('./seeders/seed');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// JWT middleware for protected routes
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, error: 'No token provided' });
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ success: false, error: 'Invalid token' });
    req.userId = decoded.id;
    next();
  });
};

// Routes

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Email already registered' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, name });
    
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.json({ success: true, data: { user: { id: user.id, email: user.email, name: user.name, isAdmin: user.isAdmin }, token } });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Missing email or password' });
    }
    
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }
    
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.json({ success: true, data: { user: { id: user.id, email: user.email, name: user.name, isAdmin: user.isAdmin }, token } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'NYOS Backend Server is running' });
});

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.findAll({
      order: [['id', 'ASC']],
    });
    res.json({
      success: true,
      data: products,
      count: products.length,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single product
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Search products
app.get('/api/products/search/:query', async (req, res) => {
  try {
    const { Op } = require('sequelize');
    const query = req.params.query;
    const results = await Product.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { description: { [Op.iLike]: `%${query}%` } },
        ],
      },
    });
    res.json({
      success: true,
      data: results,
      count: results.length,
    });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Filter products by category
app.get('/api/products/category/:category', async (req, res) => {
  try {
    const category = req.params.category;
    const filtered = await Product.findAll({
      where: { category },
    });
    res.json({
      success: true,
      data: filtered,
      count: filtered.length,
    });
  } catch (error) {
    console.error('Error filtering products:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create order
app.post('/api/orders', async (req, res) => {
  try {
    const { items, customer, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, error: 'No items in order' });
    }

    const order = await Order.create({
      items,
      customerName: customer?.name || 'Guest',
      customerEmail: customer?.email || '',
      customerPhone: customer?.phone || '',
      shippingAddress: customer?.address || {},
      totalAmount,
      status: 'pending',
      paymentStatus: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all orders
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.json({
      success: true,
      data: orders,
      count: orders.length,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get order by ID
app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update order status
app.patch('/api/orders/:id/status', async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    await order.save();

    res.json({
      success: true,
      message: 'Order updated successfully',
      data: order,
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update product stock
app.patch('/api/products/:id/stock', async (req, res) => {
  try {
    const { quantity } = req.body;
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    product.stock -= quantity;
    await product.save();

    res.json({
      success: true,
      message: 'Stock updated',
      data: product,
    });
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add new product (admin)
app.post('/api/products', async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      data: newProduct,
    });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update product (admin)
app.put('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    await product.update(req.body);
    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete product (admin)
app.delete('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    await product.destroy();
    res.json({
      success: true,
      message: 'Product deleted successfully',
      data: product,
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============ REVIEWS API ============

// Get reviews for a product
app.get('/api/reviews/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { productId: req.params.productId },
      include: [{ model: User, attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']],
    });
    res.json({ success: true, data: reviews, count: reviews.length });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create a review
app.post('/api/reviews', async (req, res) => {
  try {
    const { userId, productId, rating, comment } = req.body;
    if (!userId || !productId || !rating) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const review = await Review.create({ userId, productId, rating, comment });
    const populatedReview = await Review.findByPk(review.id, {
      include: [{ model: User, attributes: ['id', 'name'] }],
    });

    res.status(201).json({ success: true, data: populatedReview, message: 'Review created' });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete a review
app.delete('/api/reviews/:id', async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, error: 'Review not found' });
    }
    await review.destroy();
    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============ WISHLIST API ============

// Get user's wishlist
app.get('/api/wishlist/:userId', async (req, res) => {
  try {
    const wishlist = await Wishlist.findAll({
      where: { userId: req.params.userId },
      include: [{ model: Product }],
    });
    res.json({ success: true, data: wishlist, count: wishlist.length });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add to wishlist
app.post('/api/wishlist', async (req, res) => {
  try {
    const { userId, productId } = req.body;
    if (!userId || !productId) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const existing = await Wishlist.findOne({ where: { userId, productId } });
    if (existing) {
      return res.status(400).json({ success: false, error: 'Already in wishlist' });
    }

    const wishlistItem = await Wishlist.create({ userId, productId });
    res.status(201).json({ success: true, data: wishlistItem, message: 'Added to wishlist' });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Remove from wishlist
app.delete('/api/wishlist/:userId/:productId', async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const wishlistItem = await Wishlist.findOne({ where: { userId, productId } });
    if (!wishlistItem) {
      return res.status(404).json({ success: false, error: 'Not in wishlist' });
    }
    await wishlistItem.destroy();
    res.json({ success: true, message: 'Removed from wishlist' });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Database connection and server startup
async function startServer() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');

    // Sync models and seed data
    await seedDatabase();

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 NYOS Backend Server running on http://localhost:${PORT}`);
      console.log(`📊 Database: PostgreSQL (${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME})`);
      console.log(`📚 API Base URL: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
