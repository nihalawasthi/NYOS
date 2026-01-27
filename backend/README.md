# NYOS Backend API Server

Express.js backend server for NYOS Online T-Shirt Store.

## 🚀 Getting Started

### Installation

```bash
cd backend
npm install
```

### Running the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will run on `http://localhost:5000` by default.

## 📚 API Endpoints

### Health Check
- **GET** `/api/health` - Check server status

### Products
- **GET** `/api/products` - Get all products
- **GET** `/api/products/:id` - Get single product by ID
- **GET** `/api/products/search/:query` - Search products by name/description
- **GET** `/api/products/category/:category` - Get products by category
- **POST** `/api/products` - Add new product (admin)
- **PUT** `/api/products/:id` - Update product (admin)
- **DELETE** `/api/products/:id` - Delete product (admin)
- **PATCH** `/api/products/:id/stock` - Update product stock

### Orders
- **POST** `/api/orders` - Create new order
- **GET** `/api/orders` - Get all orders
- **GET** `/api/orders/:id` - Get order by ID
- **PATCH** `/api/orders/:id/status` - Update order status

## 📋 Request/Response Examples

### Create Order
**Request:**
```json
POST /api/orders
{
  "items": [
    {
      "id": 1,
      "name": "Essential Minimalist",
      "price": 799,
      "color": "#1a1a1a",
      "size": "M",
      "quantity": 2
    }
  ],
  "customer": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91-9999999999",
    "address": {
      "street": "123 Main St",
      "city": "Mumbai",
      "state": "MH",
      "zip": "400001"
    }
  },
  "totalAmount": 1598
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "id": "uuid-here",
    "items": [...],
    "customer": {...},
    "totalAmount": 1598,
    "status": "pending",
    "createdAt": "2024-01-27T10:30:00Z",
    "updatedAt": "2024-01-27T10:30:00Z"
  }
}
```

## 🔧 Environment Variables

Create a `.env` file in the backend directory:

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/nyos
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
SENDGRID_API_KEY=your_sendgrid_api_key
```

## 📦 Dependencies

- **express** - Web framework
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management
- **uuid** - Generate unique IDs
- **mongoose** - MongoDB ODM (optional, for database)
- **nodemon** - Auto-reload during development

## 🗄️ Data Storage

Currently uses **in-memory storage**. For production:

### 1. MongoDB Setup
```bash
npm install mongoose
```

Then update `server.js` to connect to MongoDB:
```javascript
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));
```

### 2. PostgreSQL Setup
```bash
npm install pg sequelize
```

### 3. Firebase Firestore
```bash
npm install firebase-admin
```

## 🔐 Security Features to Add

1. **Authentication**
   - JWT token validation
   - User registration/login endpoints
   - Protected admin routes

2. **Validation**
   - Input validation with joi or express-validator
   - Rate limiting to prevent abuse
   - CORS configuration

3. **Encryption**
   - Hash passwords with bcrypt
   - Encrypt sensitive data

## 💳 Payment Integration

### Stripe Integration
```bash
npm install stripe
```

Add to `server.js`:
```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.post('/api/payment/create-intent', async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount * 100, // Amount in paise
      currency: 'inr',
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## 📧 Email Notifications

### SendGrid Integration
```bash
npm install @sendgrid/mail
```

```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendOrderConfirmation(order) {
  await sgMail.send({
    to: order.customer.email,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: `Order Confirmation - ${order.id}`,
    html: `<h1>Thank you for your order!</h1><p>Order ID: ${order.id}</p>`,
  });
}
```

## 📊 Database Schema (MongoDB Example)

### Product Schema
```javascript
{
  _id: ObjectId,
  id: Number,
  name: String,
  price: Number,
  category: String,
  colors: [String],
  description: String,
  fullDescription: String,
  sizes: [String],
  stock: Number,
  rating: Number,
  reviews: Number,
  features: [String],
  image: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Order Schema
```javascript
{
  _id: ObjectId,
  id: String (UUID),
  items: [{
    id: Number,
    name: String,
    price: Number,
    color: String,
    size: String,
    quantity: Number
  }],
  customer: {
    name: String,
    email: String,
    phone: String,
    address: {
      street: String,
      city: String,
      state: String,
      zip: String
    }
  },
  totalAmount: Number,
  status: String (pending, confirmed, shipped, delivered),
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Testing

```bash
# Using curl
curl http://localhost:5000/api/health

# Using Postman
Import the collection from `/backend/postman-collection.json`

# Using Thunder Client or Insomnia
See `.insomnia/` folder
```

## 📈 Performance Tips

1. Add database indexing on frequently searched fields
2. Implement caching with Redis
3. Use pagination for large datasets
4. Add request compression with gzip
5. Monitor with APM tools (New Relic, DataDog)

## 🐛 Troubleshooting

### Port already in use
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or change port in .env
PORT=5001
```

### CORS errors
Ensure CORS is properly configured in `server.js`:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

## 📝 Notes

- This is a starter template - customize based on your needs
- Always validate and sanitize user input
- Use environment variables for sensitive data
- Implement proper error handling
- Add logging for debugging
- Keep dependencies updated

## 🔗 Integration with Frontend

Update your Next.js frontend to call this API:

```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Get products
const products = await fetch(`${API_BASE}/products`).then(r => r.json());

// Create order
const order = await fetch(`${API_BASE}/orders`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ items, customer, totalAmount })
}).then(r => r.json());
```

---

**NYOS Backend** - Built with Express.js
